import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { Login } from "~/types/login";
import { redis } from "~/lib/redis";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody<Login>(event);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password || user.password === "") {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      throw createError({
        statusCode: 403,
        message: "Please verify your email before logging in.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        message: "Invalid email or password.",
      });
    }

    const pendingInviteToken = getCookie(event, "pending_invite");
    let activeWorkspaceId = user.activeWorkspaceId;

    if (pendingInviteToken) {
      const raw = await redis.get(`invite:${pendingInviteToken}`);
      if (raw) {
        const inviteData = JSON.parse(raw) as {
          workspaceId: string;
          role: "USER" | "ADMIN" | "CREATOR";
        };

        const alreadyMember = await prisma.membership.findFirst({
          where: {
            workspaceId: inviteData.workspaceId,
            userId: user.id,
          },
        });

        if (!alreadyMember) {
          const workspace = await prisma.workspace.findUnique({
            where: { id: inviteData.workspaceId },
          });

          if (workspace?.ownerId !== user.id) {
            await prisma.membership.create({
              data: {
                workspaceId: inviteData.workspaceId,
                userId: user.id,
                role: inviteData.role,
              },
            });

            await prisma.user.update({
              where: { id: user.id },
              data: {
                activeWorkspaceId: inviteData.workspaceId,
              },
            });

            activeWorkspaceId = inviteData.workspaceId;
          }
        }

        await redis.del(`invite:${pendingInviteToken}`);
        deleteCookie(event, "pending_invite");
      }
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      useRuntimeConfig().JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const session = await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        activeWorkspaceId: activeWorkspaceId ?? undefined,
      },
      tokens: {
        accessToken: token,
      },
      loggedInAt: new Date(),
    });

    return {
      success: true,
      redirectUrl: activeWorkspaceId
        ? `/dashboard/${activeWorkspaceId}/all-tasks`
        : `/dashboard/welcome`,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

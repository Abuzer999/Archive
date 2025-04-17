import { redis } from "~/lib/redis";
import { UserSession } from "#auth-utils";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const token = event.context.params?.token as string;
    const raw = await redis.get(`invite:${token}`);

    if (!raw) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid or expired token",
      });
    }

    const data = JSON.parse(raw) as {
      workspaceId: string;
      role: "USER" | "ADMIN" | "CREATOR";
    };

    const session: UserSession = await getUserSession(event);
    const userId = session?.user?.id;

    if (!userId) {
      setCookie(event, "pending_invite", token, {
        httpOnly: true,
        path: "/",
        maxAge: 86400, 
      });
      return sendRedirect(event, "/auth");
    }

    const existingMembership = await prisma.membership.findFirst({
      where: {
        workspaceId: data.workspaceId,
        userId: userId,
      },
    });

    if (existingMembership) {
      throw createError({
        statusCode: 400,
        statusMessage: "You are already a member of this workspace.",
      });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (workspace?.ownerId === userId) {
      throw createError({
        statusCode: 400,
        statusMessage: "You cannot join your own workspace using an invitation.",
      });
    }

    await prisma.membership.create({
      data: {
        workspaceId: data.workspaceId,
        userId,
        role: data.role,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { activeWorkspaceId: data.workspaceId },
    });

    await redis.del(`invite:${token}`);

    return sendRedirect(event, `/dashboard/${data.workspaceId}/all-tasks`);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

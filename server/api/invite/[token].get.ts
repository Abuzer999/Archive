import { redis } from "~/lib/redis";
import { UserSession } from "#auth-utils";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const token = event.context.params?.token as string;

  if (!token) {
    return {
      success: false,
      statusMessage: "Token is required",
      redirectTo: "/",
    };
  }

  const raw = await redis.get(`invite:${token}`);

  if (!raw) {
    return {
      success: false,
      statusMessage: "Invalid or expired token",
      redirectTo: "/",
    };
  }

  const data = raw as {
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

    return {
      success: false,
      statusMessage: "Authentication required",
      redirectTo: "/auth",
    };
  }

  const existingMembership = await prisma.membership.findFirst({
    where: { workspaceId: data.workspaceId, userId },
  });

  if (existingMembership) {
    return {
      success: false,
      statusMessage: "You are already a member of this workspace.",
      redirectTo: `/dashboard/${data.workspaceId}/analytics`,
    };
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: data.workspaceId },
  });

  if (workspace?.ownerId === userId) {
    return {
      success: false,
      statusMessage: "You cannot join your own workspace using an invitation.",
      redirectTo: `/dashboard/${data.workspaceId}/analytics`,
    };
  }

  await prisma.membership.create({
    data: { workspaceId: data.workspaceId, userId, role: data.role },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { activeWorkspaceId: data.workspaceId },
  });

  await redis.del(`invite:${token}`);

  if (session.user) {
    session.user.activeWorkspaceId = data.workspaceId;
    await setUserSession(event, session);
  }

  return {
    success: true,
    message: "Successfully joined the workspace!",
    redirectTo: `/dashboard/${data.workspaceId}/analytics`,
  };
});

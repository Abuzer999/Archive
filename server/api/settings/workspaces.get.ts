import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);
    const userId = session?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            memberships: true,
          },
        },
      },
    });

    const workspaces = memberships
      .map(({ workspace, role }) => ({
        id: workspace.id,
        name: workspace.name,
        avatar: workspace.avatar,
        role,
        people: workspace.memberships.length,
      }))
      .filter((workspace) => workspace.id !== user.activeWorkspaceId); // Filter out the active workspace

    const activeWorkspaceDetails = user.activeWorkspace && {
      id: user.activeWorkspace.id,
      name: user.activeWorkspace.name,
      avatar: user.activeWorkspace.avatar,
      role: memberships.find((m) => m.workspaceId === user.activeWorkspaceId)?.role,
      people: memberships.find((m) => m.workspaceId === user.activeWorkspaceId)?.workspace.memberships.length || 0,
    };

    return {
      activeWorkspace: activeWorkspaceDetails,
      workspaces,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});
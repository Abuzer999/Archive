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

    const activeWorkspaceId = user?.activeWorkspace?.id;

    if (!user || !activeWorkspaceId) {
      throw createError({
        statusCode: 404,
        message: "Active workspace not found",
      });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: activeWorkspaceId },
    });

    if (!workspace || workspace.ownerId !== userId) {
      throw createError({
        statusCode: 403,
        message: "You don't have permission to delete this workspace",
      });
    }

    await prisma.user.updateMany({
      where: { activeWorkspaceId },
      data: { activeWorkspaceId: null },
    });

    await prisma.task.deleteMany({
      where: {
        column: {
          project: {
            workspaceId: activeWorkspaceId,
          },
        },
      },
    });

    await prisma.column.deleteMany({
      where: {
        project: {
          workspaceId: activeWorkspaceId,
        },
      },
    });

    await prisma.favoriteProject.deleteMany({
      where: {
        project: {
          workspaceId: activeWorkspaceId,
        },
      },
    });

    await prisma.project.deleteMany({
      where: { workspaceId: activeWorkspaceId },
    });

    await prisma.membership.deleteMany({
      where: { workspaceId: activeWorkspaceId },
    });

    await prisma.workspace.delete({
      where: { id: activeWorkspaceId },
    });

    const remainingWorkspaces = await prisma.workspace.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 1,
    });

    const newActiveWorkspaceId = remainingWorkspaces[0]?.id ?? null;

    await prisma.user.update({
      where: { id: userId },
      data: {
        activeWorkspaceId: newActiveWorkspaceId,
      },
    });

    if (session.user) {
      session.user.activeWorkspaceId = newActiveWorkspaceId;
    }

    await replaceUserSession(event, session);

    return { newActiveWorkspaceId };
  } catch (error: any) {
    console.error("Workspace deletion error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

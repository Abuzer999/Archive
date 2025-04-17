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

    // Сброс activeWorkspaceId у всех пользователей
    await prisma.user.updateMany({
      where: { activeWorkspaceId },
      data: { activeWorkspaceId: null },
    });

    // Удалить все избранные проекты в этом workspace
    await prisma.favoriteProject.deleteMany({
      where: {
        project: {
          workspaceId: activeWorkspaceId,
        },
      },
    });

    // Удалить все проекты
    await prisma.project.deleteMany({
      where: { workspaceId: activeWorkspaceId },
    });

    // Удалить всех участников workspace
    await prisma.membership.deleteMany({
      where: { workspaceId: activeWorkspaceId },
    });

    // Удалить сам workspace
    await prisma.workspace.delete({
      where: { id: activeWorkspaceId },
    });

    // Назначить новый active workspace (если есть другие)
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

    return { newActiveWorkspaceId };
  } catch (error: any) {
    console.error("Workspace deletion error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

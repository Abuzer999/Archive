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

    await prisma.user.update({
      where: { id: userId },
      data: { activeWorkspaceId: null },
    });

    await prisma.project.deleteMany({
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

    if (newActiveWorkspaceId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          activeWorkspaceId: newActiveWorkspaceId,
        },
      });
    }

    return { newActiveWorkspaceId };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

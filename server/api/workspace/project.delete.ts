import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { pusher } from "~/lib/pusher";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);
    const userId = session?.user?.id;

    if (!userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const { projectId } = await readBody(event);

    if (!projectId) {
      throw createError({ statusCode: 400, message: "Project ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user || !user.activeWorkspace?.id) {
      throw createError({
        statusCode: 404,
        message: "User or workspace not found",
      });
    }

    const columns = await prisma.column.findMany({
      where: { projectId },
      select: { id: true },
    });

    const columnIds = columns.map((col) => col.id);

    await prisma.task.deleteMany({
      where: { columnId: { in: columnIds } },
    });

    await prisma.column.deleteMany({
      where: { projectId },
    });

    await prisma.favoriteProject.deleteMany({
      where: { projectId },
    });

    const delProject = await prisma.project.delete({
      where: { id: projectId },
    });

    pusher.trigger(`workspace-${user.activeWorkspace.id}`, 'delete-project', delProject)

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project and its data:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

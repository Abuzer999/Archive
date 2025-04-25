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

    const { taskId, toColumnId, newOrder, projectId } = await readBody(event);

    await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: toColumnId,
        order: newOrder,
      },
    });

    if (!taskId || !toColumnId || newOrder === undefined || !projectId) {
      throw createError({
        statusCode: 400,
        message:
          "Missing or invalid taskId, toColumnId, newOrder, or projectId",
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        columnId: toColumnId,
        projectId: projectId,
      },
      orderBy: {
        order: "asc",
      },
    });

    await Promise.all(
      tasks.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: { order: index },
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Ошибка при перемещении задачи:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка при перемещении задачи.",
    });
  }
});

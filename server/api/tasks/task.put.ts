import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { Task } from "~/types/tasks";

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

    const { tasks } = await readBody(event);

    if (!tasks || tasks.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No tasks found to update",
      });
    }

    const updatePromises = tasks.map((task: Task) =>
      prisma.task.update({
        where: { id: task.id },
        data: {
          order: task.order,
          columnId: task.columnId,
        },
      })
    );

    await Promise.all(updatePromises);

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});

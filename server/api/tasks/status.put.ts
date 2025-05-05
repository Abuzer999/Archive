import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { pusher } from "~/lib/pusher";

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

    const { status, taskId } = await readBody(event);

    if (typeof status !== "boolean" || !taskId) {
      throw createError({
        statusCode: 400,
        message: "Invalid request data",
      });
    }

    // Получаем задачу вместе с информацией о проекте
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          select: {
            projectId: true,
          },
        },
      },
    });

    if (!task) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        isCompleted: status,
      },
    });

    await pusher.trigger(`project-${task.column.projectId}`, "task-status", {
      taskId: taskId,
      isCompleted: updatedTask.isCompleted,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update task status",
    });
  }
});

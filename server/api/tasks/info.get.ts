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

    const { taskId } = getQuery(event);

    if (!taskId || typeof taskId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid taskId",
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: true,
        creator: true,
        column: true,
        project: true,
        subtasks: true,
        parent: true,
      },
    });

    if (!task) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    return task;
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update task status",
    });
  }
});

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

    const { taskId, priority } = await readBody(event);

    if (!taskId || !priority) {
      throw createError({
        statusCode: 400,
        message: "Invalid request data",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        priority: priority,
      },
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

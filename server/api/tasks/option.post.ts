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

    const { text, taskId }: {text: string, id: string} = await readBody(event);

    if (!text) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid text",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        text: text
      }
    });

    if (!task) {
      throw createError({
        statusCode: 404,
        message: "Task not found",
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to update task status",
    });
  }
});

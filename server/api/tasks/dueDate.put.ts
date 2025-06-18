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

    const body = (await readBody(event)) as { taskId: string; dueDate: string };
    const { taskId, dueDate } = body;

    if (!taskId || !dueDate || isNaN(Date.parse(dueDate))) {
      throw createError({
        statusCode: 400,
        message: "taskId и dueDate обязательны и должны быть валидными",
      });
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        dueDate: new Date(dueDate),
      },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});

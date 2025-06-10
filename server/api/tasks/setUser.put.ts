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

    const { taskId, idUser } = await readBody(event);

    if (!taskId || !idUser) {
      throw createError({
        statusCode: 400,
        message: "taskId и userId обязательны",
      });
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        assigneeId: userId,
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

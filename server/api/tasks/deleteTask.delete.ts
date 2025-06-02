import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { pusher } from "~/lib/pusher";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);

    if (!session) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const userId = session?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const { taskId }: { taskId: string } = await readBody(event);

    if (!taskId) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid taskId",
      });
    }

    const delTask = await prisma.task.delete({
      where: { id: taskId },
    });

    pusher.trigger(
      `project-${delTask.projectId}`,
      "delete-task",
      delTask
    );

    return {
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

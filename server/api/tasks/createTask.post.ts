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

    const { projectId, title, columnId }: { projectId: string; title: string; columnId: string } = await readBody(event);

    if (!title) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid title",
      });
    }

    if (!columnId) {
      throw createError({
        statusCode: 400,
        message: "Missing columnId or creatorId",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 403,
        message: "Access denied or project not found",
      });
    }

    const taskCount = await prisma.task.count({
      where: {
        columnId,
      },
    });

    await prisma.task.create({
      data: {
        title: title,
        creatorId: userId,
        columnId: columnId,
        projectId: projectId,
        order: taskCount,
        orderNum: taskCount,
      },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});

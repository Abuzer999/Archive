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

    const { projectId } = await readBody(event);

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid projectId",
      });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        columns: true,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 403,
        message: "Access denied or project not found",
      });
    }

    const order =
      project.columns.length > 0
        ? Math.max(...project.columns.map((col) => col.order)) + 1
        : 0;

    const newColumn = await prisma.column.create({
      data: {
        order: order,
        projectId: projectId,
      },
    });

    pusher.trigger(`project-${projectId}`, 'new-column', newColumn)

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

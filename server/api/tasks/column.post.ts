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

    const { projectId, columns } = await readBody(event);

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid projectId",
      });
    }

    if (!columns) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid columns",
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

    await prisma.$transaction(
      columns.map((column: { id: string; order: number }) =>
        prisma.column.update({
          where: { id: column.id },
          data: { order: column.order },
        })
      )
    );

    pusher.trigger(`project-${projectId}`, 'update-column', columns);

    return columns;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }
});

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

    const { projectId } = getQuery(event);

    if (!projectId || typeof projectId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid projectId",
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
      },
    });

    if (!project) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    const columns = await prisma.column.findMany({
      where: {
        projectId,
      },
      orderBy: {
        order: "asc",
      },
      include: {
        tasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return columns;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

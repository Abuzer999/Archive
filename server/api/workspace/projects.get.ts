import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { Project } from "~/types/project";

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

    const { workspaceId } = getQuery(event);

    if (!workspaceId || typeof workspaceId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid workspaceId",
      });
    }

    // Проверка, принадлежит ли workspace пользователю (по желанию)
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        ownerId: userId,
      },
    });

    if (!workspace) {
      throw createError({
        statusCode: 404,
        message: "Workspace not found or not accessible",
      });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId },
    });

    const formattedProjects: Project[] = projects.map((project) => ({
      id: project.id,
      name: project.name,
      src: project.avatar,
      alt: project.name,
    }));

    return formattedProjects;
  } catch (error: any) {
    console.error("Error getting projects:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

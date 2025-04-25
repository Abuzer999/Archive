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


    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw createError({
        statusCode: 404,
        message: "Workspace not found",
      });
    }

    const isMember = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!isMember) {
      throw createError({
        statusCode: 403,
        message: "You are not a member of this workspace",
      });
    }

    const projects = await prisma.project.findMany({
      where: { workspaceId },
      include: {
        favorites: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    const formattedProjects: Project[] = projects.map((project) => ({
      id: project.id,
      name: project.name,
      src: project.avatar,
      alt: project.name,
      isFavorite: project.favorites.length > 0,
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

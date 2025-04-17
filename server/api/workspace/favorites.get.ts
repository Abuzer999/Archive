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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user || !user.activeWorkspace?.id) {
      throw createError({
        statusCode: 404,
        message: "User or workspace not found",
      });
    }

    const { workspaceId } = getQuery(event);

    if (!workspaceId || typeof workspaceId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid workspaceId",
      });
    }

    const favorites = await prisma.favoriteProject.findMany({
      where: {
        userId,
        project: {
          workspaceId,
        },
      },
      include: {
        project: true,
      },
    });

    const filterFavorites: Project[] = favorites.map((favorite) => ({
      id: favorite.project.id,
      name: favorite.project.name,
      src: favorite.project.avatar,
      alt: favorite.project.name,
      isFavorite: true,
    }));

    return filterFavorites;
  } catch (error: any) {
    console.error("Error creating folder:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

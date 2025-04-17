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

    const { projectId } = await readBody(event);

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: "Folder name is required",
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

    const existing = await prisma.favoriteProject.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (existing) {
      await prisma.favoriteProject.delete({ where: { id: existing.id } });
      return { success: true, isFavorite: false };
    } else {
      await prisma.favoriteProject.create({
        data: {
          userId,
          projectId,
        },
      });
      return { success: true, isFavorite: true };
    }

  } catch (error: any) {
    console.error("Error creating folder:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

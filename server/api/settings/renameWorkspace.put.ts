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

    const { name } = await readBody(event);

    if (!name) {
      throw createError({
        statusCode: 400,
        message: "Name is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user || !user.activeWorkspace?.id) {
      throw createError({
        statusCode: 404,
        message: "Active workspace not found",
      });
    }

    const existingWorkspace = await prisma.workspace.findFirst({
      where: {
        name,
        ownerId: userId,
      },
    });

    if (existingWorkspace) {
      throw createError({
        statusCode: 403,
        message: "Workspace with this name already exists",
      });
    }

    await prisma.workspace.update({
      where: { id: user.activeWorkspace.id },
      data: { name },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

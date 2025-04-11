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

    const { workspaceId } = await readBody(event);

    if (!workspaceId) {
      throw createError({
        statusCode: 400,
        message: "Workspace ID is required",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        activeWorkspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

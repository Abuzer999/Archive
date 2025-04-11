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

    const { backgroundId } = await readBody(event);

    if (!backgroundId) {
      throw createError({
        statusCode: 400,
        message: "Background ID is required",
      });
    }

    await prisma.background.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    let updatedBackground = await prisma.background.findUnique({
      where: { id: backgroundId },
    });

    if (!updatedBackground) {
      updatedBackground = await prisma.background.findFirst({
        where: { userId },
        orderBy: { id: "asc" },
      });


      if (!updatedBackground) {
        throw createError({
          statusCode: 404,
          message: "No backgrounds found for this user",
        });
      }
    }

    await prisma.background.update({
      where: { id: updatedBackground.id },
      data: { isDefault: true },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

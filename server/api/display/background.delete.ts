import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { del } from "@vercel/blob";

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

    const background = await prisma.background.findUnique({
      where: { id: backgroundId },
    });

    if (!background) {
      throw createError({
        statusCode: 404,
        message: "Background not found",
      });
    }

    if (background.userId !== userId) {
      throw createError({
        statusCode: 403,
        message: "Forbidden",
      });
    }

    if (background.url) {
      await del(background.url);
    }

    if (background.isDefault) {
      await prisma.background.updateMany({
        where: { userId },
        data: { isDefault: false },
      });

      const backgrounds = await prisma.background.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
      })

      const firstBackground = backgrounds[0];

      await prisma.background.update({
        where: { id: firstBackground.id },
        data: { isDefault: true },
      });
    }

    await prisma.background.delete({
      where: { id: backgroundId },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

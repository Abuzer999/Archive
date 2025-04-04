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
        statusMessage: "Unauthorized",
      });
    }

    const { backgroundId } = await readBody(event);

    if (!backgroundId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Background ID is required",
      });
    }

    const background = await prisma.background.findUnique({
      where: { id: backgroundId },
    });

    if (!background) {
      throw createError({
        statusCode: 404,
        statusMessage: "Background not found",
      });
    }

    if (background.userId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    if (background.url) {
      await del(background.url);
    }

    await prisma.background.delete({
      where: { id: backgroundId },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

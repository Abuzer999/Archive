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

    if (!name || typeof name !== "string") {
      throw createError({
        statusCode: 400,
        message: "Valid name is required",
      });
    }

    await prisma.user.update({
      where: { id: userId },
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

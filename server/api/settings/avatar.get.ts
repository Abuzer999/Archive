import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";

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

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    const avatarUrl = user.avatar;


    return { avatarUrl };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

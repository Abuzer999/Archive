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

    const { columnId }: { columnId: string } = await readBody(event);

    if (!columnId) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid columnId",
      });
    }

    const column = await prisma.column.findUnique({
      where: { id: columnId },
    });

    if (!column) {
      throw createError({
        statusCode: 404,
        message: "Column not found",
      });
    }

    await prisma.column.delete({
      where: { id: columnId },
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

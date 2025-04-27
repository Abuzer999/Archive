import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { pusher } from "~/lib/pusher";

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

    const { columnId, newName } = await readBody(event);

    if (!columnId || !newName) {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid columnId or newName",
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

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { name: newName },
    });

    await pusher.trigger(
      `project-${column.projectId}`,
      "rename-column",
      updatedColumn
    );

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

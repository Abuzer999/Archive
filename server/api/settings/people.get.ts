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

    const { workspaceId } = getQuery(event);

    if (!workspaceId || typeof workspaceId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid workspaceId",
      });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw createError({
        statusCode: 404,
        message: "Workspace not found",
      });
    }

    const users = await prisma.user.findMany({
      where: {
        memberships: {
          some: {
            workspaceId: workspaceId,
          },
        },
      },
      include: {
        memberships: {
          where: {
            workspaceId: workspaceId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, "0")}.${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;
    };

    const result = users.map((user, index) => ({
      id: (index + 1).toString(),
      avatar: {
        src: user.avatar,
        alt: user.name,
      },
      name: user.name,
      email: user.email,
      role: user.memberships[0]?.role,
      createdAt: formatDate(user.createdAt),
    }));

    return result;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

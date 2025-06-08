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
        message: "Workspace name is required",
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

    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    await prisma.membership.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: "CREATOR",
      },
    });

    const membershipCount = await prisma.membership.count({
      where: { userId },
    });

    if (membershipCount === 1) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          activeWorkspace: {
            connect: {
              id: workspace.id,
            },
          },
        },
      });

      if (session.user) {
        session.user.activeWorkspaceId = workspace.id;
        await replaceUserSession(event, session);
      }
    }

    return { success: true, workspaceId: workspace.id };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

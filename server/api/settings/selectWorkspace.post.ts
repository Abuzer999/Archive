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

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw createError({
        statusCode: 404,
        message: "Workspace not found",
      });
    }

    const isMember = await prisma.membership.findUnique({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    if (!isMember) {
      throw createError({
        statusCode: 403,
        message: "You are not a member of this workspace",
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

    if (session.user) {
      session.user.activeWorkspaceId = workspaceId;
      await replaceUserSession(event, session);
    }

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

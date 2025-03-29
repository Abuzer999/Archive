import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  try {
    const { workspace }: { workspace: string } = await readBody(event);

    const session: UserSession = await getUserSession(event);

    const userId = session?.user?.id;

    if (!workspace) {
      throw createError({
        statusCode: 400,
        statusMessage: "Workspace is required",
      });
    }

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const createdWorkspace = await prisma.workspace.create({
      data: {
        name: workspace,
        ownerId: userId,
      },
    });

    const createdProject = await prisma.project.create({
      data: {
        name: "Проект",
        workspaceId: createdWorkspace.id,
      },
    });

    await prisma.task.create({
      data: {
        title: "Первая задача",
        status: "todo",
        folderId: null,
      },
    });


    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

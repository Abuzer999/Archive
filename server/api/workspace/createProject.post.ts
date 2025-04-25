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

    const { projectName } = await readBody(event);

    if (!projectName) {
      throw createError({
        statusCode: 400,
        message: "Folder name is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user || !user.activeWorkspace?.id) {
      throw createError({
        statusCode: 404,
        message: "User or workspace not found",
      });
    }

    const newProject = await prisma.project.create({
      data: {
        creatorId: userId,
        name: projectName,
        workspaceId: user.activeWorkspace.id,
      },
    });

    await prisma.column.createMany({
      data: [
        { name: "К работе", order: 0, projectId: newProject.id },
        { name: "В работе", order: 1, projectId: newProject.id },
        { name: "Готово", order: 2, projectId: newProject.id },
      ],
    });

    const projectWithAlt = {
      ...newProject,
      src: newProject.avatar,
      alt: newProject.name,
      isFavorite: false,
    };

    pusher.trigger(
      `workspace-${user.activeWorkspace.id}`,
      "new-project",
      projectWithAlt
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error creating folder:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

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

    const { projectName, projectId } = await readBody(event);

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

   const reProject =  await prisma.project.update({
      where: { id: projectId },
      data: { name: projectName },
    });

    pusher.trigger(`workspace-${user.activeWorkspace.id}`, 'rename-project', reProject);

    return { success: true };
  } catch (error: any) {
    console.error("Error creating folder:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});

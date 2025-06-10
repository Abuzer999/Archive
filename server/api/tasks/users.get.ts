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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeWorkspaceId: true },
    });

    if (!user?.activeWorkspaceId) {
      throw createError({
        statusCode: 400,
        message: "No active workspace set",
      });
    }

    const members = await prisma.membership.findMany({
      where: { workspaceId: user.activeWorkspaceId },
      include: { user: true },
    });

    const items = members.map((m) => {
      const u = m.user;
      return {
        label: u.name || u.email,
        value: u.id,
        avatar: {
          src: u.avatar || `https://github.com/${u.name || u.email}.png`,
          alt: u.name || u.email,
        },
      };
    });

    return items;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal server error",
    });
  }
});

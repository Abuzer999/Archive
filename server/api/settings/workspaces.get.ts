import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { Prisma } from "@prisma/client";

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

    const user = (await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activeWorkspace: true,
        ownedWorkspaces: {
          include: { memberships: true },
        },
      },
    })) as Prisma.UserGetPayload<{
      include: {
        activeWorkspace: true;
        ownedWorkspaces: {
          include: {
            memberships: true;
          };
        };
      };
    }>;

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const memberships = await prisma.membership.findMany({
      where: {
        userId,
        workspace: {
          ownerId: { not: userId },
        },
      },
      include: {
        workspace: {
          include: {
            memberships: true,
          },
        },
      },
    });

    const owned = user.ownedWorkspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      avatar: workspace.avatar,
      role: "CREATOR",
      people: workspace.memberships?.length ?? 0,
    }));

    const invited = memberships.map(({ workspace, role }) => ({
      id: workspace.id,
      name: workspace.name,
      avatar: workspace.avatar,
      role,
      people: workspace.memberships?.length ?? 0,
    }));

    const allWorkspaces = [...owned, ...invited].filter(
      (w) => w.id !== user.activeWorkspaceId
    );

    const activeWorkspaceDetails = user.activeWorkspace && {
      id: user.activeWorkspace.id,
      name: user.activeWorkspace.name,
      avatar: user.activeWorkspace.avatar,
      role:
        user.activeWorkspace.ownerId === userId
          ? "CREATOR"
          : memberships.find((m) => m.workspaceId === user.activeWorkspaceId)
              ?.role || "USER",
      people:
        user.activeWorkspace.ownerId === userId
          ? (user.ownedWorkspaces.find((w) => w.id === user.activeWorkspaceId)
              ?.memberships?.length ?? 0)
          : (memberships.find((m) => m.workspaceId === user.activeWorkspaceId)
              ?.workspace.memberships?.length ?? 0),
    };

    return {
      activeWorkspace: activeWorkspaceDetails,
      workspaces: allWorkspaces,
    };
  } catch (error: any) {
    console.error("Error fetching workspaces:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

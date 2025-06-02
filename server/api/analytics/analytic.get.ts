import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);
    const user = session?.user;

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const { workspaceId } = getQuery(event);

    if (workspaceId && typeof workspaceId !== "string") {
      throw createError({
        statusCode: 400,
        message: "Missing or invalid activeWorkspaceId",
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        activeWorkspaceId: true,
      },
    });

    if (!fullUser?.activeWorkspaceId) {
      throw createError({
        statusCode: 400,
        message: "No active workspace selected.",
      });
    }

    const activeWorkspaceId = fullUser.activeWorkspaceId;

    const projects = await prisma.project.findMany({
      where: {
        workspaceId: activeWorkspaceId,
      },
      select: { id: true },
    });

    const projectIds = projects.map((project) => project.id);

    if (projectIds.length === 0) {
      return {
        totalTasks: 0,
        prioritiesArray: [0, 0, 0, 0], // [LOW, MEDIUM, HIGH, NONE]
      };
    }

    const [totalTasks, priorityCounts] = await Promise.all([
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
        },
      }),
      prisma.task.groupBy({
        by: ["priority"],
        where: {
          projectId: { in: projectIds },
        },
        _count: {
          priority: true,
        },
      }),
    ]);

    const priorityMap: Record<string, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      NONE: 0,
    };

    for (const item of priorityCounts) {
      priorityMap[item.priority] = item._count.priority;
    }

    const prioritiesArray = [
      priorityMap.LOW,
      priorityMap.MEDIUM,
      priorityMap.HIGH,
      priorityMap.NONE,
    ];

    const projectsStats = await prisma.project.findMany({
      where: {
        workspaceId: activeWorkspaceId,
      },
      select: {
        name: true,
        tasks: {
          select: {
            isCompleted: true,
          },
        },
      },
    });

    const projectAnalytics: {
      name: string;
      total: number;
      completed: number;
    }[] = projectsStats.map((project) => {
      const total = project.tasks.length;
      const completed = project.tasks.filter((t) => t.isCompleted).length;
      return {
        name: project.name,
        total,
        completed,
      };
    });

    return {
      totalTasks,
      prioritiesArray,
      projectAnalytics,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

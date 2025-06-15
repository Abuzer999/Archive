// import prisma from "~/lib/prisma";
// import type { UserSession } from "#auth-utils";

// export default defineEventHandler(async (event) => {
//   try {
//     const session: UserSession = await getUserSession(event);
//     const userId = session?.user?.id;

//     if (!userId) {
//       throw createError({
//         statusCode: 401,
//         message: "Unauthorized",
//       });
//     }

//     // Получаем список workspace, которыми владеет пользователь
//     const ownedWorkspaces = await prisma.workspace.findMany({
//       where: { ownerId: userId },
//       select: { id: true },
//     });

//     const ownedWorkspaceIds = ownedWorkspaces.map((ws) => ws.id);

//     // Выполняем всё атомарно
//     await prisma.$transaction([
//       // Обнуляем activeWorkspaceId у всех пользователей, если он указывает на удаляемые воркспейсы
//       prisma.user.updateMany({
//         where: {
//           activeWorkspaceId: { in: ownedWorkspaceIds },
//         },
//         data: {
//           activeWorkspaceId: null,
//         },
//       }),

//       // Удаляем данные, связанные с пользователем
//       prisma.favoriteProject.deleteMany({ where: { userId } }),
//       prisma.membership.deleteMany({ where: { userId } }),
//       prisma.background.deleteMany({ where: { userId } }),
//       prisma.provider.deleteMany({ where: { userId } }),

//       // Удаляем задачи, проекты, колонки по workspace
//       prisma.task.deleteMany({ where: { creatorId: userId } }),
//       prisma.project.deleteMany({ where: { creatorId: userId } }),

//       // Удаляем все workspace, которыми владеет пользователь
//       prisma.workspace.deleteMany({
//         where: { id: { in: ownedWorkspaceIds } },
//       }),

//       // Удаляем пользователя
//       prisma.user.delete({ where: { id: userId } }),
//     ]);

//     // Завершаем сессию
//     await clearUserSession(event);

//     return { success: true };
//   } catch (error: any) {
//     console.error("[DELETE /api/settings/account] Ошибка:", error);
//     throw createError({
//       statusCode: error.statusCode || 500,
//       message: error.message || "Internal Server Error",
//     });
//   }
// });

import type { H3Event } from "h3";
import type { User } from "#auth-utils";
import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import { getCookie, deleteCookie } from "h3";

export const useOAuth = async (
  event: H3Event,
  user: User,
  provider: string,
  providerId: string,
  inviteToken?: string
) => {
  if (!inviteToken) {
    inviteToken = getCookie(event, "pending_invite") || undefined;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { providers: true, backgrounds: true, memberships: true },
  });

  let dbUser;

  if (existingUser) {
    const hasProvider = existingUser.providers.some(
      (p) => p.provider === provider && p.providerId === providerId
    );

    if (!hasProvider) {
      dbUser = await prisma.user.update({
        where: { email: user.email },
        data: {
          isVerified: true,
          providers: {
            create: {
              provider,
              providerId: String(providerId),
            },
          },
        },
      });
    } else {
      dbUser = existingUser;
    }

    if (inviteToken) {
      const raw = await redis.get(`invite:${inviteToken}`);
      if (raw) {
        const data = JSON.parse(raw) as {
          workspaceId: string;
          role: "USER" | "ADMIN" | "CREATOR";
        };

        const existingMembership = await prisma.membership.findFirst({
          where: {
            workspaceId: data.workspaceId,
            userId: dbUser.id,
          },
        });

        if (!existingMembership) {
          await prisma.membership.create({
            data: {
              workspaceId: data.workspaceId,
              userId: dbUser.id,
              role: data.role,
            },
          });

          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              activeWorkspaceId: data.workspaceId,
            },
          });

          await redis.del(`invite:${inviteToken}`);
        }

        deleteCookie(event, "pending_invite");
      }
    }
  } else {
    dbUser = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: "",
        isVerified: true,
        providers: {
          create: {
            provider,
            providerId: String(providerId),
          },
        },
        backgrounds: {
          create: [
            { name: "По умолчанию", url: "", isDefault: true },
            {
              name: "Градиент №1",
              url: "https://grqasdzxb2wnxxa9.public.blob.vercel-storage.com/Archive/gradient.jpg",
            },
            {
              name: "Градиент №2",
              url: "https://grqasdzxb2wnxxa9.public.blob.vercel-storage.com/Archive/gradient2.jpg",
            },
            {
              name: "Космос",
              url: "https://grqasdzxb2wnxxa9.public.blob.vercel-storage.com/Archive/Space.jpg",
            },
            {
              name: "Временные линии",
              url: "https://grqasdzxb2wnxxa9.public.blob.vercel-storage.com/Archive/timeLines.jpg",
            },
          ],
        },
      },
    });
  }

  return dbUser;
};

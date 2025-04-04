import type { User } from "#auth-utils";
import prisma from "~/lib/prisma";

export const useOAuth = async (
  user: User,
  provider: string,
  providerId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { providers: true, backgrounds: true },
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
      dbUser = await prisma.user.update({
        where: { email: user.email },
        data: {
          isVerified: true,
        },
      });
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

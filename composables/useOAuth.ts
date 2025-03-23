import type { User } from "#auth-utils";
import prisma from "~/lib/prisma";

export const useOAuth = async (
  user: User,
  provider: string,
  providerId: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { providers: true },
  });

  if (existingUser) {
    const hasProvider = existingUser.providers.some(
      (p) => p.provider === provider && p.providerId === providerId
    );

    if (!hasProvider) {
      await prisma.user.update({
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
      await prisma.user.update({
        where: { email: user.email },
        data: {
          isVerified: true,
        },
      });
    }
  } else {
    await prisma.user.create({
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
      },
    });
  }
};

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
    return prisma.user.update({
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
    return prisma.user.create({
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

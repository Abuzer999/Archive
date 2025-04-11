import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import bcrypt from "bcrypt";
import type { UserSession } from "#auth-utils";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);
    
    const {
      newPassword,
      email,
      code,
    }: { newPassword: string; email: string; code: string } =
      await readBody(event);

    if (!newPassword || !email || !code) {
      throw createError({
        statusCode: 400,
        message: "New password, email, and code are required",
      });
    }

    const storedEmail = await redis.get(`reset:${code}`);

    if (!newPassword) {
      throw createError({
        statusCode: 400,
        message: "New password is required",
      });
    }

    await redis.del(`reset:${code}`);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const password = bcrypt.hashSync(newPassword, 10);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

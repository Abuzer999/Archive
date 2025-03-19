import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const {
      newPassword,
      email,
      code,
    }: { newPassword: string; email: string; code: string } =
      await readBody(event);

    if (!newPassword || !email || !code) {
      throw createError({
        statusCode: 400,
        statusMessage: "New password, email, and code are required",
      });
    }

    const storedEmail = await redis.get(`reset:${code}`);

    if (!newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "New password is required",
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
        statusMessage: "User not found",
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
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";

export default defineEventHandler(async (event) => {
  try {
    const { token } = getQuery(event);

    if (!token) {
      throw createError({
        statusCode: 400,
        message: "Token is required",
      });
    }

    const userId = await redis.get(`verify:${token}`);

    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "Invalid or expired verification token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      throw createError({
        statusCode: 400,
        message: "User is already verified",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });


    await redis.del(`verify:${token}`);

    return sendRedirect(event, `/auth/verified/token=${userId}`)

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    })
  }
});

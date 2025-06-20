import { redis } from "~/lib/redis";

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event);

    if (!code) {
      throw createError({
        statusCode: 400,
        message: "Code is required",
      });
    }

    const email = await redis.get(`reset:${code}`);

    if (!email) {
      throw createError({
        statusCode: 401,
        message: "Invalid or expired code",
      });
    }

    await redis.del(`reset:${code}`);

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

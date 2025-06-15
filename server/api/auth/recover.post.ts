import { redis } from "~/lib/redis";
import prisma from "~/lib/prisma";
import { v4 as uuidv4 } from "uuid";

const { sendMail } = useNodeMailer();

export default defineEventHandler(async (event) => {
  try {
    const { email } = await readBody(event);

    if (!email) {
      throw createError({
        statusCode: 400,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const code = uuidv4().replace(/\D/g, "").slice(0, 6);

    await redis.set(`reset:${code}`, email, { ex: 300 });

    await sendMail({
      to: email,
      subject: "Код для сброса пароля",
      html: `
        <h1>Код для сброса пароля</h1>
        <p>Ваш код: ${code}</p>
      `,
    });

    return { success: true, message: "Код отправлен" };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

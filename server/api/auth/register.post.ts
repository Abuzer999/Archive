import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import { sendVerificationEmail } from "~/utils/mail";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { Register } from "~/types/register";

export default defineEventHandler(async (event) => {
  try {
    const { name, email, password } = await readBody<Register>(event);

    if (!name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, and password are required",
      });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      throw createError({
        statusCode: 401,
        statusMessage: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    const verificationToken = uuidv4();

    await redis.set(`verify:${verificationToken}`, user.id, "EX", 60 * 60 * 24);

    await sendVerificationEmail(email, verificationToken);

    return { message: "User send verification email" };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});

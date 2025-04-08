import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "~/lib/prisma";
import { Login } from "~/types/login";

export default defineEventHandler(async (event) => {
  try {
    const { email, password } = await readBody<Login>(event);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "Invalid email or password.",
      });
    }

    if (!user.password || user.password === "") {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      throw createError({
        statusCode: 403,
        statusMessage: "Please verify your email before logging in.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      useRuntimeConfig().JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    const session = await setUserSession(event, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isCompleted: user.isCompleted
      },
      tokens: {
        accessToken: token,
      },
      loggedInAt: new Date(),
    });

    return { succes: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

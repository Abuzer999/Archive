import prisma from "~/lib/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const { newPassword, email }: { newPassword: string; email: string } =
      await readBody(event);

    if (!newPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "New password is required",
      });
    }

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

    if (!user.password || user.password === "") {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid email or password.",
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

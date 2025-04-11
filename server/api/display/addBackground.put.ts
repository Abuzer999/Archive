import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { put } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);

    const userId = session?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    const formData = await readMultipartFormData(event);

    const file = formData?.find((file) => file.name === "file");

    if (!file) {
      throw createError({
        statusCode: 400,
        message: "File is required",
      });
    }

    const fileSize = Buffer.byteLength(file.data);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (fileSize > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        message: "File size exceeds 2 MB",
      });
    }

    const blob = await put(
      `Archive/backgrounds/${userId}/${file.filename}`,
      file.data,
      {
        access: "public",
      }
    );

    const newBackground = await prisma.background.create({
      data: {
        url: blob.url,
        userId: userId,
        name: "Свой вариант",
        isCustom: true,
      },
    });

    if (!blob.url) {
      throw createError({
        statusCode: 400,
        message: "Background image URL and name are required",
      });
    }

    return {
      success: true,
      newBackground,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});

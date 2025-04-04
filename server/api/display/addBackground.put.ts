import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { put } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);

    const userId = session?.user?.id;

    const formData = await readMultipartFormData(event);

    const file = formData?.find((file) => file.name === "file");

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "File is required",
      });
    }

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const fileSize = Buffer.byteLength(file.data);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (fileSize > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: "File size exceeds 2 MB",
      });
    }
    
    const blob = await put(`Archive/${file.filename}`, file.data, {
      access: "public",
    });

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
        statusMessage: "Background image URL and name are required",
      });
    }

    return {
      success: true,
      newBackground,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});

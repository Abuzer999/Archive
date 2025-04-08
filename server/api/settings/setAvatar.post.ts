import prisma from "~/lib/prisma";
import type { UserSession } from "#auth-utils";
import { put, del } from "@vercel/blob";

export default defineEventHandler(async (event) => {
  try {
    const session: UserSession = await getUserSession(event);

    const userId = session?.user?.id;

    if (!userId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const formData = await readMultipartFormData(event);

    const file = formData?.find((file) => file.name === "file");

    if (!file) {
      throw createError({
        statusCode: 400,
        statusMessage: "File is required",
      });
    }

    const fileSize = Buffer.byteLength(file.data);

    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (fileSize > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: "File size is too large",
      });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      throw createError({
        statusCode: 400,
        statusMessage: "File type is not supported",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.avatar) {
      try {
        await del(user.avatar); 
      } catch (deleteError) {
        console.error("Error deleting previous profile image:", deleteError);
      }
    }

    const blob = await put(
      `Archive/Avatar/${userId}/${file.filename}`,
      file.data,
      {
        access: "public",
      }
    );

    if (!blob.url) {
      throw createError({
        statusCode: 400,
        statusMessage: "Background image URL and name are required",
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: blob.url,
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

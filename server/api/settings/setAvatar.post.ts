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
        message: "Unauthorized",
      });
    }

    const formData = await readMultipartFormData(event);
    const file = formData?.find((file) => file.name === "file");
    const target = formData?.find((field) => field.name === "target")?.data.toString();

    if (!file) {
      throw createError({
        statusCode: 400,
        message: "File is required",
      });
    }

    if (!target || !['user', 'workspace'].includes(target)) {
      throw createError({
        statusCode: 400,
        message: "Target (user or workspace) is required",
      });
    }

    const fileSize = Buffer.byteLength(file.data);
    const MAX_FILE_SIZE = 2 * 1024 * 1024;

    if (fileSize > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        message: "File size is too large",
      });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      throw createError({
        statusCode: 400,
        message: "File type is not supported",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { activeWorkspace: true },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    let currentUrl = '';
    if (target === 'user') {
      currentUrl = user.avatar || '';
    } else if (target === 'workspace' && user.activeWorkspace) {
      currentUrl = user.activeWorkspace.avatar || '';
    }

    if (currentUrl) {
      try {
        await del(currentUrl);
      } catch (deleteError) {
        console.error("Error deleting previous image:", deleteError);
      }
    }

    const blob = await put(
      `Archive/${target === 'user' ? 'Avatar' : 'workspaceAvatar'}/${userId}/${file.filename}`,
      file.data,
      { access: "public" }
    );

    if (!blob.url) {
      throw createError({
        statusCode: 400,
        message: "Failed to upload image",
      });
    }

    if (target === 'user') {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: blob.url },
      });
    } else if (target === 'workspace' && user.activeWorkspace) {
      await prisma.workspace.update({
        where: { id: user.activeWorkspace.id },
        data: { avatar: blob.url },
      });
    }

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
});
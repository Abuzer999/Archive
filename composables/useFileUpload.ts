export const useFileUpload = () => {
  const file = ref<File | null>(null);
  const preview = ref<string | null>(null);
  const previewAvatar = useState<string | undefined>(
    "previewAvatar",
    () => undefined
  );
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      if (preview.value) URL.revokeObjectURL(preview.value);
      if (previewAvatar.value) URL.revokeObjectURL(previewAvatar.value);
      file.value = input.files[0];
      preview.value = URL.createObjectURL(file.value);
      if (input.id === "avatar") {
        previewAvatar.value = URL.createObjectURL(file.value);
      }
    }
  };

  const resetFile = () => {
    file.value = null;
    preview.value = null;
    previewAvatar.value = undefined;
  };

  return {
    file,
    preview,
    previewAvatar,
    handleFileInput,
    resetFile,
    MAX_FILE_SIZE,
  };
};

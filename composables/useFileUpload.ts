export const useFileUpload = () => {
  const file = ref<File | null>(null);
  const preview = ref<string | null>(null);
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      file.value = input.files[0];
      preview.value = URL.createObjectURL(file.value);
    }
  };

  const resetFile = () => {
    file.value = null;
    preview.value = null;
  };

  return {
    file,
    preview,
    handleFileInput,
    resetFile,
    MAX_FILE_SIZE,
  };
};

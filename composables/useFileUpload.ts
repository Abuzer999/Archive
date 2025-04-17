export const useFileUpload = (key: string) => {
  const file = ref<File | null>(null);
  const preview = useState<string | undefined>(
    `${key}-preview`,
    () => undefined
  );
  const name = useState<string>(`${key}-name`, () => "");
  const MAX_FILE_SIZE = 2 * 1024 * 1024;

  const handleFileInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input?.files?.length) return;

    if (
      file.value &&
      input.files[0].name === file.value.name &&
      input.files[0].size === file.value.size
    ) {
      input.value = ""; 
      return;
    }

    if (preview.value) URL.revokeObjectURL(preview.value);
    file.value = input.files[0];
    preview.value = URL.createObjectURL(file.value);
  };

  const resetFile = () => {
    file.value = null;
    preview.value = undefined;
  };

  return {
    file,
    preview,
    name,
    handleFileInput,
    resetFile,
    MAX_FILE_SIZE,
  };
};

export const useErrorMessage = () => {
  const errorMessage = useState<string | null>("errorMessage", () => null);
  const successMessage = useState<string | null>("successMessage", () => null);

  onUnmounted(() => {
    errorMessage.value = null;
    successMessage.value = null;
  });
  return { errorMessage, successMessage };
};

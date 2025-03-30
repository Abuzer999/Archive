export const useDropMenu = () => {
  const isOpen = useState<boolean>("isOpen", () => false);

  const toggleDropMenu = () => {
    isOpen.value = !isOpen.value;
  };

  return { isOpen, toggleDropMenu };
};

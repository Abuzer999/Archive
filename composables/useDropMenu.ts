export const useDropMenu = () => {
  const isOpen = useState<boolean>("isOpen", () => false);
  const leftLayout = useState<boolean>("leftLayout", () => false);

  const toggleDropMenu = () => {
    isOpen.value = !isOpen.value;
  };

  return { isOpen, toggleDropMenu, leftLayout };
};

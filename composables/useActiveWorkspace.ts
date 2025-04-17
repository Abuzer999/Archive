export const useActiveWorkspace = () => {
  const activeWorkspaceId = useState<string | null>("activeWorkspaceId", () => null);

  return { activeWorkspaceId };
};

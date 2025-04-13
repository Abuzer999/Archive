export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch: refreshSession, user } = useUserSession();

  await refreshSession();

  if (loggedIn.value) {
    const activeWorkspaceId = user.value?.activeWorkspaceId;

    if (activeWorkspaceId === undefined) {
      return navigateTo("/dashboard/welcome", { replace: true });
    }

    if (!to.fullPath.startsWith(`/dashboard/${activeWorkspaceId}`)) {
      return navigateTo("/dashboard/" + activeWorkspaceId + "/all-tasks", {
        replace: true,
      });
    }
  } else {
    // Если пользователь не авторизован, перенаправляем его на страницу входа
    if (to.fullPath !== "/auth" && to.fullPath !== "/reset-password") {
      return navigateTo("/auth", { replace: true });
    }
  }
});

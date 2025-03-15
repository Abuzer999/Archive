export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch: refreshSession } = useUserSession();

  await refreshSession();

  if (loggedIn.value) {
    if (to.fullPath === "/auth" || to.fullPath === "/reset-password") {
      return navigateTo("/", { replace: true });
    }
  } else {
    if (to.fullPath !== "/auth" && to.fullPath !== "/reset-password") {
      return navigateTo("/auth", { replace: true });
    }
  }
});

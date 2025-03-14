export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch: refreshSession } = useUserSession();

  await refreshSession();

  if (!loggedIn.value && to.fullPath !== "/auth") {
    return navigateTo("/auth", { replace: true });
  }

  if (loggedIn.value && to.fullPath === "/auth") {
    return navigateTo("/", { replace: true });
  }
});

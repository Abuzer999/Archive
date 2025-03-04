export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value && to.fullPath !== "/auth") {
    return navigateTo("/auth");
  }

  if (loggedIn.value && to.fullPath === "/auth") {
    return navigateTo("/");
  }
});

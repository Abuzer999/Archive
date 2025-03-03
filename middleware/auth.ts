export default defineNuxtRouteMiddleware(async (to, from) => {
  const { loggedIn, fetch } = useUserSession();

  //решить проблему с редиректом при входе через github
  // await fetch();
  
  if (!loggedIn.value && to.path !== "/auth") {
    return navigateTo("/auth");
  }

  if (loggedIn.value && to.path === "/auth") {
    return navigateTo("/");
  }
});

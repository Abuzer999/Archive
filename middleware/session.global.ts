export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetch } = useUserSession();
  await fetch();
});

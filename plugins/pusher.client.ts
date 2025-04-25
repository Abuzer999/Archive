import Pusher from "pusher-js";

export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig();
  const pusher = new Pusher(runtime.public.NUXT_PUBLIC_PUSHER_KEY, {
    cluster: runtime.public.NUXT_PUBLIC_PUSHER_CLUSTER,
  });

  return {
    provide: {
      pusher,
    },
  };
});

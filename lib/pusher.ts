import Pusher from "pusher";

const runtime = useRuntimeConfig()

export const pusher = new Pusher({
  appId: runtime.PUSHER_APP_ID,
  key: runtime.public.NUXT_PUBLIC_PUSHER_KEY,
  secret: runtime.PUSHER_SECRET,
  cluster: runtime.public.NUXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

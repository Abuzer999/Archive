import { User, Token } from "~/lib/auth";
import { useOAuth } from "~/composables/useOAuth";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event,
    { user, tokens }: { user: User; tokens: Token }
  ) {

    const dbUser = await useOAuth(user, "google", String(user.sub));

    await setUserSession(event, {
      user: {
        id: dbUser.id,
        name: user.name,
        email: user.email,
        isCompleted: dbUser.isCompleted
      },
      tokens: {
        accessToken: tokens,
      },
      loggedInAt: new Date(),
    });
    return sendRedirect(event, "/dashboard");
  },

  onError(event, error: unknown) {
    console.error(error);
    return sendRedirect(event, "/auth");
  },
});

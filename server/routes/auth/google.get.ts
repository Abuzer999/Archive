import { User, Token } from "~/lib/auth";
import { H3Event } from "h3";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event: H3Event,
    { user, tokens }: { user: User; tokens: Token }
  ) {
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
      },
      tokens,
      loggedInAt: new Date(),
    });
    return sendRedirect(event, "/");
  },

  onError(event: H3Event, error: unknown) {
    console.error(error);
    return sendRedirect(event, "/auth");
  },
});

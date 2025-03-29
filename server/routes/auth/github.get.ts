import { User, Token } from "~/lib/auth";
import { H3Event } from "h3";
import { useOAuth } from "~/composables/useOAuth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },

  async onSuccess(
    event: H3Event,
    { user, tokens }: { user: User; tokens: Token }
  ) {
    
    const dbUser = await useOAuth(user, "github", String(user.id));

    await setUserSession(event, {
      user: {
        id: dbUser.id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        accessToken: tokens,
      },
      loggedInAt: new Date(),
    });

    return sendRedirect(event, "/");
  },
  onError(event: H3Event, error: unknown) {
    console.error(error);
    return sendRedirect(event, "/auth");
  },
});

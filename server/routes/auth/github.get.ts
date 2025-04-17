import { User, Token } from "~/lib/auth";
import { useOAuth } from "~/composables/useOAuth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },

  async onSuccess(event, { user, tokens }: { user: User; tokens: Token }) {
    const dbUser = await useOAuth(event, user, "github", String(user.id));

    const session = await setUserSession(event, {
      user: {
        id: dbUser.id,
        name: user.name,
        email: user.email,
        isCompleted: dbUser.isCompleted,
        activeWorkspaceId: dbUser.activeWorkspaceId,
      },
      tokens: {
        accessToken: tokens,
      },
      loggedInAt: new Date(),
    });

    return sendRedirect(
      event,
      `/dashboard/${session?.user?.activeWorkspaceId}/all-tasks`
    );
  },
  onError(event, error: unknown) {
    console.error(error);
    return sendRedirect(event, "/auth");
  },
});

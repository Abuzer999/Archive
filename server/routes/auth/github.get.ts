export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },

    async onSuccess(event, {user, tokens}) {
        await setUserSession(event, {
            user: {
                id: user.id,
                email: user.email
            },
            tokens,
            loggedInAt: new Date()
        })
        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error(error)
        return sendRedirect(event, '/auth')
    }
})
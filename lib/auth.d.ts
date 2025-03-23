declare module "#auth-utils" {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Token {
    accessToken: string;
    refreshToken: string;
  }

  interface UserSession {
    user: User | null;
  }

  interface SecureSessionData {
    tokens: Token | null;
  }
}

export { UserSession, SecureSessionData, User, Token };

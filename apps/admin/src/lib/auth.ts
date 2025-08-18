import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  role: string;
  exp: number;
  iat: number;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'admin_access_token';
  private readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private readonly API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Get stored tokens
  getTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null;

    const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  // Store tokens
  setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  // Clear tokens
  clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Decode JWT token
  decodeToken(token: string): DecodedToken | null {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  }

  // Get current user from token
  getCurrentUser(): User | null {
    const tokens = this.getTokens();
    if (!tokens) return null;

    const decoded = this.decodeToken(tokens.accessToken);
    if (!decoded) return null;

    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role as 'admin' | 'moderator',
    };
  }

  // Login with credentials
  async login(
    email: string,
    password: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(
      `${this.API_BASE_URL}/api/v1/admin/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    const tokens: AuthTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };

    this.setTokens(tokens);
    const user = this.getCurrentUser()!;

    return { user, tokens };
  }

  // Refresh access token
  async refreshAccessToken(): Promise<string | null> {
    const tokens = this.getTokens();
    if (!tokens) return null;

    try {
      const response = await fetch(
        `${this.API_BASE_URL}/api/v1/admin/auth/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        }
      );

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        accessToken: data.accessToken,
        refreshToken: tokens.refreshToken,
      };

      this.setTokens(newTokens);
      return data.accessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    const tokens = this.getTokens();

    if (tokens) {
      try {
        await fetch(`${this.API_BASE_URL}/api/v1/admin/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.clearTokens();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return false;

    return !this.isTokenExpired(tokens.accessToken);
  }

  // Get authorization header
  getAuthHeader(): string | null {
    const tokens = this.getTokens();
    if (!tokens) return null;

    return `Bearer ${tokens.accessToken}`;
  }
}

export const authService = new AuthService();

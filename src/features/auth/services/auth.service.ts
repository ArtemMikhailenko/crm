import { AUTH_URLS } from "@/features/auth/constants";
import {
  type LoginSchemaType,
  type RegisterSchemaType,
} from "@/features/auth/schemas";
import { User } from "@/features/auth/types";

import { api } from "@/shared/api";

class AuthService {
  public async register(body: RegisterSchemaType) {
    const response = await api.post<User>(AUTH_URLS.register, body);
    return response;
  }

  public async login(body: LoginSchemaType) {
    console.log("📤 Sending login request:", {
      url: AUTH_URLS.login,
      body: {
        email: body.email,
        hasPassword: !!body.password,
        hasToken: !!body.token,
        hasRecaptcha: !!body.recaptcha,
      }
    });
    
    // The backend may return either a successful login payload or a 2FA prompt payload
    const response = await api.post<
      | { accessToken: string; user: User; token?: string }
      | { twoFactorRequired: true; message: string; ttlMinutes: number }
    >(AUTH_URLS.login, body);
    
    console.log("📥 Login response received:", response);
    return response;
  }

  public async resendTwoFactor(body: { email: string }) {
    const response = await api.post<{ message: string }>(
      AUTH_URLS.twoFactorResend,
      body
    );
    return response;
  }

  public async oauthByProvider(provider: "google") {
    const response = await api.get<{ url: string }>(
      `${AUTH_URLS.oauth}/${provider}`
    );

    return response;
  }

  public async logout() {
    const response = await api.post(AUTH_URLS.logout);

    return response;
  }
}

export const authService = new AuthService();

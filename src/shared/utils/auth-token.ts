/**
 * Утилиты для работы с токеном аутентификации
 */

const TOKEN_KEY = 'authToken';

export const authToken = {
  /**
   * Получить токен из localStorage
   */
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Сохранить токен в localStorage
   */
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    console.log('✅ Token saved to localStorage');
  },

  /**
   * Удалить токен из localStorage
   */
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    console.log('🗑️ Token removed from localStorage');
  },

  /**
   * Проверить наличие токена
   */
  exists: (): boolean => {
    return !!authToken.get();
  },
};

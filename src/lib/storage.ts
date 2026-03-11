const localStorageKeyBase = 'tawc';

const localStorageKeys = {
  url: `${localStorageKeyBase}:url`,
  slot: `${localStorageKeyBase}:slot`,
  password: `${localStorageKeyBase}:password`,
  settings: `${localStorageKeyBase}:user-settings`,
  theme: `${localStorageKeyBase}:theme`,
  accounts: `${localStorageKeyBase}:accounts`
};

export namespace AppStorage {
  export function get(key: keyof typeof localStorageKeys): string | null {
    const value = localStorage.getItem(localStorageKeys[key]);
    return value;
  }

  export function set(key: keyof typeof localStorageKeys, value: string): void {
    localStorage.setItem(localStorageKeys[key], value);
  }

  export function getJSON<T>(key: keyof typeof localStorageKeys): T | null {
    const value = localStorage.getItem(localStorageKeys[key]);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  export function setJSON<T>(key: keyof typeof localStorageKeys, value: T): void {
    localStorage.setItem(localStorageKeys[key], JSON.stringify(value));
  }
}
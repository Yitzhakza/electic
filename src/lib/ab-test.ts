function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function getVariant<T extends string>(testName: string, variants: T[]): T {
  const cookieKey = `ab_${testName}`;
  const existing = getCookie(cookieKey);
  if (existing && variants.includes(existing as T)) {
    return existing as T;
  }
  const chosen = variants[Math.floor(Math.random() * variants.length)];
  setCookie(cookieKey, chosen);
  return chosen;
}

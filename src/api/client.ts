const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  status: number;
  detail?: string;
  constructor(status: number, statusText: string, detail?: string) {
    super(detail ?? `Request failed: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function readErrorDetail(res: Response): Promise<string | undefined> {
  const text = await res.text().catch(() => '');
  if (!text) return undefined;
  try {
    const data = JSON.parse(text);
    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.detail === 'string') return data.detail;
    if (typeof data?.title === 'string') return data.title;
    if (data?.errors) {
      const messages = Object.values(data.errors).flat().filter(Boolean).map(String);
      if (messages.length) return messages.join(' ');
    }
    return text;
  } catch {
    return text;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new ApiError(res.status, res.statusText, detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
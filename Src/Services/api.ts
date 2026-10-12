export const API_URL = 'http://192.168.100.11:3000';

let token: string | null = null;
export const setToken = (t: string | null) => {
  token = t;
};

export async function api(path: string, options: RequestInit = {}) {
  const isForm = options.body instanceof FormData;

  const res = await fetch(API_URL + path, {
    ...options,
    headers: {
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw Object.assign(new Error(data.error || 'Erro na requisição.'), {
      status: res.status,
    });
  }
  return data;
}

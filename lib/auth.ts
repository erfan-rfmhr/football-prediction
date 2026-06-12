
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/jwt/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await res.json();
  // Store tokens
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  return data;
}

export async function signup(username: string, password: string, email?: string) {
  const payload: any = { username, password };
  if (email) payload.email = email;

  const res = await fetch(`${API_BASE_URL}/api/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.username?.[0] || errorData.password?.[0] || 'Signup failed');
  }

  return await res.json();
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch(`${API_BASE_URL}/api/jwt/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    logout();
    throw new Error('Refresh failed');
  }

  const data = await res.json();
  localStorage.setItem('accessToken', data.access);
  return data.access;
}

export async function getAuthHeaders() {
  const accessToken = getAccessToken();
  if (!accessToken) return {};
  return {
    'Authorization': `Bearer ${accessToken}`,
  };
}

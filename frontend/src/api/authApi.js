const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ── Helper ─────────────────────────────────────────────────────────────────
async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    // FastAPI validation errors come as { detail: [...] } or { detail: "string" }
    const msg = Array.isArray(data.detail)
      ? data.detail.map((e) => e.msg).join(", ")
      : data.detail || "Request failed";
    throw new Error(msg);
  }
  return data;
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Auth endpoints ─────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /auth/register
   * Body: JSON { username, email, password }
   */
  register: async (username, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(res);
  },

  /**
   * POST /auth/login
   * Body: x-www-form-urlencoded (OAuth2PasswordRequestForm)
   */
  login: async (username, password) => {
    const body = new URLSearchParams({ username, password });
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    return handleResponse(res); // returns { access_token, token_type }
  },

  /**
   * GET /users/me
   * Requires Bearer token
   */
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * GET /users/me/items
   * Requires Bearer token
   */
  getMyItems: async () => {
    const res = await fetch(`${BASE_URL}/users/me/items`, {
      headers: authHeaders(),
    });
    return handleResponse(res);
  },

  /**
   * Remove token from localStorage (client-side logout)
   */
  logout: () => {
    localStorage.removeItem("token");
  },

  /**
   * Returns true if a token exists in localStorage
   */
  isLoggedIn: () => !!localStorage.getItem("token"),
};

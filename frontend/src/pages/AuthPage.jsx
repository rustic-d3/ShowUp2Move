import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/AuthPage.scss";

export default function AuthPage() {
  const { login, register, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where the user was trying to go, or /dashboard by default
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // Already logged in → send straight to dashboard
  if (isLoggedIn) return <Navigate to={from} replace />;

  const isLogin = mode === "login";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
    setSuccess("");
    setForm({ username: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        await login(form.username, form.password);
        navigate(from, { replace: true });
      } else {
        await register(form.username, form.email, form.password);
        setSuccess("Account created! Switching to login…");
        setTimeout(() => {
          setMode("login");
          setForm({ username: form.username, email: "", password: "" });
          setSuccess("");
        }, 1200);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <span className="blob blob-1" />
        <span className="blob blob-2" />
        <span className="blob blob-3" />
      </div>

      <div className={`auth-card ${mode}`}>
        <div className="auth-brand">
          <span className="auth-logo">S2M</span>
          <p className="auth-tagline">ShowUp2Move</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            onClick={() => mode !== "login" && switchMode()}
            type="button"
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            onClick={() => mode !== "register" && switchMode()}
            type="button"
          >
            Register
          </button>
          <span className={`tab-indicator ${isLogin ? "left" : "right"}`} />
        </div>

        <form className="auth-form" onSubmit={handleSubmit} key={mode}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
              autoComplete="username"
              required
            />
          </div>

          {!isLogin && (
            <div className="field field-slide">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
          )}

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? (
              <span className="spinner" />
            ) : isLogin ? (
              "Sign In →"
            ) : (
              "Create Account →"
            )}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={switchMode}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

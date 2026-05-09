import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/authApi";
import "../styles/Dashboard.scss";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    authApi
      .getMyItems()
      .then(setItems)
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="dash-root">
      <div className="dash-bg">
        <span className="dash-blob dash-blob-1" />
        <span className="dash-blob dash-blob-2" />
      </div>

      <header className="dash-header">
        <span className="dash-brand">S2M</span>
        <button className="dash-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dash-main">
        <div className="dash-greeting">
          <p className="dash-label">Welcome back</p>
          <h1 className="dash-username">{user?.username}</h1>
          <p className="dash-email">{user?.email}</p>
        </div>

        <section className="dash-section">
          <h2 className="dash-section-title">My Items</h2>
          <div className="dash-items">
            {items.length === 0 ? (
              <p className="dash-empty">No items yet.</p>
            ) : (
              items.map((item) => (
                <div className="dash-item" key={item.item_id}>
                  <span className="dash-item-name">{item.name}</span>
                  <span className="dash-item-id">#{item.item_id}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

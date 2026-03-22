import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Info, Settings } from "lucide-react";

function Sidebar() {
  const location = useLocation();

  const links = [
    { to: "/",         icon: <Home size={20} />,           label: "Home"     },
    { to: "/feedback", icon: <MessageSquare size={20} />,  label: "Feedback" },
    { to: "/about",    icon: <Info size={20} />,           label: "About"    },
  ];

  return (
    <div
      className="fixed top-0 left-0 h-full w-16 flex flex-col items-center justify-between py-5"
      style={{ background: "var(--bg-card)", borderRight: "1px solid var(--border)", boxShadow: "2px 0 8px rgba(17,47,77,0.05)" }}
    >
      {/* Logo — place your logo at src/assets/logo.png */}
      <Link to="/" className="flex items-center justify-center">
        <img
          src="/src/assets/edubridge_logo.png"
          alt="EduBridge"
          style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px" }}
          onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
        />
        {/* Fallback if logo not found */}
        <div style={{ display: "none", width: "36px", height: "36px", background: "var(--brand)", borderRadius: "8px", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "16px" }}>E</div>
      </Link>

      <div className="flex flex-col gap-5">
        {links.map(({ to, icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} className="flex flex-col items-center gap-0.5 transition"
              style={{ color: active ? "var(--brand)" : "var(--text-muted)" }}>
              {icon}
              <span style={{ fontSize: "9px", fontWeight: 500 }}>{label}</span>
            </Link>
          );
        })}
      </div>

      <Link to="/settings" className="flex flex-col items-center gap-0.5 transition"
        style={{ color: location.pathname === "/settings" ? "var(--brand)" : "var(--text-muted)" }}>
        <Settings size={20} />
        <span style={{ fontSize: "9px", fontWeight: 500 }}>Settings</span>
      </Link>
    </div>
  );
}

export default Sidebar;
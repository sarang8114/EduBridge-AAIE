import { useTheme } from "../ThemeContext";
import { Sun, Moon } from "lucide-react";

const Settings = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen px-8 py-10 max-w-xl mx-auto" style={{ color: "var(--text-primary)" }}>
      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Settings</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>Customise your EduBridge experience.</p>

      <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{ background: "var(--tag-fact)" }}>
              {isDark ? <Moon size={18} style={{ color: "var(--brand)" }} /> : <Sun size={18} style={{ color: "var(--brand)" }} />}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Appearance</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {isDark ? "Dark mode is on — easy on the eyes." : "Light mode is on — clean and accessible."}
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={toggle}
            className="relative flex items-center transition-all duration-300"
            style={{
              width: "88px", height: "38px", borderRadius: "999px", border: "none", padding: "4px",
              background: isDark ? "var(--brand)" : "var(--border)",
              cursor: "pointer",
            }}
          >
            <span className="absolute left-3 text-xs font-semibold" style={{ color: isDark ? "white" : "var(--text-faint)", opacity: isDark ? 0 : 1, transition: "opacity 0.2s" }}>
              Light
            </span>
            <span className="absolute right-3 text-xs font-semibold" style={{ color: "white", opacity: isDark ? 1 : 0, transition: "opacity 0.2s" }}>
              Dark
            </span>
            <span
              className="flex items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: "30px", height: "30px",
                background: "white",
                transform: isDark ? "translateX(50px)" : "translateX(0px)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
              }}
            >
              {isDark ? <Moon size={14} style={{ color: "var(--brand)" }} /> : <Sun size={14} style={{ color: "#F1C40F" }} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
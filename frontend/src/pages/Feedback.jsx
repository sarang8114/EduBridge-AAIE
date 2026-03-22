import { useState } from "react";
import { Send, Loader, CheckCircle } from "lucide-react";
import apiClient from "../services/api";

const Feedback = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState(null);

  const categories = [
    { value: "general",    label: "General Feedback" },
    { value: "bug",        label: "Bug Report" },
    { value: "feature",    label: "Feature Request" },
    { value: "content",    label: "Content Quality" },
    { value: "suggestion", label: "Suggestion" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true); setError(null);
    try {
      await apiClient.post("/feedback", { name, email, category, message });
      setSent(true);
      setName(""); setEmail(""); setMessage(""); setCategory("general");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: "10px", fontSize: "14px",
    background: "var(--bg-primary)", color: "var(--text-primary)",
    border: "1.5px solid var(--border)", outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "5px", color: "var(--text-muted)" };

  return (
    <div className="min-h-screen px-8 py-10 max-w-xl mx-auto" style={{ color: "var(--text-primary)" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Share your feedback</h1>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Found a bug, have a suggestion, or just want to say something? We read every message and use it to make EduBridge better.
        </p>
      </div>

      {sent ? (
        <div className="rounded-2xl p-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <CheckCircle size={40} className="mx-auto mb-3" style={{ color: "var(--brand)" }} />
          <h3 className="font-bold text-base mb-2" style={{ color: "var(--text-primary)" }}>Thank you!</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Your feedback has been sent. We appreciate you taking the time.</p>
          <button onClick={() => setSent(false)} className="mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}>
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Name <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>(optional)</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--brand)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
              </div>
              <div>
                <label style={labelStyle}>Email <span style={{ color: "var(--text-faint)", fontWeight: 400 }}>(optional)</span></label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "var(--brand)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--brand)"} onBlur={e => e.target.style.borderColor = "var(--border)"}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Message <span style={{ color: "var(--brand)" }}>*</span></label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Write your feedback here..." required rows={5}
                style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                onFocus={e => e.target.style.borderColor = "var(--brand)"} onBlur={e => e.target.style.borderColor = "var(--border)"} />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-xs" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)", color: "var(--alert-text)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
              style={{ background: "var(--brand)", color: "white", border: "none", cursor: loading || !message.trim() ? "not-allowed" : "pointer" }}>
              {loading ? <><Loader size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Feedback</>}
            </button>
          </div>
        </form>
      )}

      <p className="text-xs text-center mt-6" style={{ color: "var(--text-faint)" }}>
        Feedback goes directly to <span style={{ color: "var(--brand)" }}>Team EduBridge</span>
      </p>
    </div>
  );
};

export default Feedback;
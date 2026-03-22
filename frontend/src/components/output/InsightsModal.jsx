import { X, Loader, Lightbulb, RefreshCw } from "lucide-react";

const TYPE_CONFIG = {
  definition:     { badge: { background: "var(--tag-fact)", color: "var(--tag-fact-text)" }, accent: "#4CAEE1" },
  process:        { badge: { background: "var(--tag-def)",  color: "var(--tag-def-text)"  }, accent: "#6c5ce7" },
  fact:           { badge: { background: "var(--tag-proc)", color: "var(--tag-proc-text)" }, accent: "#00b894" },
  "cause-effect": { badge: { background: "#fef9e7",         color: "#7d6608"               }, accent: "#f39c12" },
  example:        { badge: { background: "#fde8ef",         color: "#922b21"               }, accent: "#e84393" },
  formula:        { badge: { background: "#e8f8f5",         color: "#0e6655"               }, accent: "#1abc9c" },
};

const InsightsModal = ({ data, isLoading, error, topicName, onClose, onRetry }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,47,77,0.4)" }}>
    <div className="rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: "var(--tag-fact)" }}>
            <Lightbulb size={18} style={{ color: "var(--brand)" }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>Key Insights</h3>
            {topicName && <p className="text-xs" style={{ color: "var(--text-faint)" }}>{topicName}</p>}
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader size={36} className="animate-spin" style={{ color: "var(--brand)" }} />
            <p style={{ color: "var(--text-muted)" }}>Extracting key insights...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="rounded-xl p-5 max-w-md text-center" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
              <p className="text-sm mb-3" style={{ color: "var(--alert-text)" }}>{error}</p>
              <button onClick={onRetry} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}>
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        ) : data ? (
          <>
            {data.summary && (
              <div className="rounded-xl p-4" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-strong)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--brand)" }}>Overview</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{data.summary}</p>
              </div>
            )}
            {data.insights?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.insights.map((insight, idx) => {
                  const cfg = TYPE_CONFIG[insight.type] || TYPE_CONFIG["fact"];
                  return (
                    <div key={idx} className="rounded-xl p-4 transition-all duration-150 hover:-translate-y-0.5"
                      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderTop: `3px solid ${cfg.accent}`, boxShadow: "0 2px 8px rgba(17,47,77,0.05)" }}>
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-0.5 flex-shrink-0">{insight.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{insight.title}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={cfg.badge}>{insight.type}</span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  </div>
);

export default InsightsModal;
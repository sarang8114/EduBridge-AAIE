import { useState } from "react";
import { Loader, RotateCcw, Eye, CheckCircle, XCircle, ChevronRight } from "lucide-react";

const STATES = { IDLE: "idle", WRONG: "wrong", CORRECT: "correct", REVEALED: "revealed" };

const MCQ = ({ questions, isLoading, error, onRetry }) => {
  const [qStates, setQStates] = useState({});
  const getQ = (idx) => qStates[idx] || { state: STATES.IDLE, selectedIdx: null, attempts: 0 };

  const handleSelect = (qIdx, optIdx) => {
    const q = getQ(qIdx);
    if (q.state === STATES.CORRECT || q.state === STATES.REVEALED) return;
    const isCorrect = optIdx === questions[qIdx].correct_index;
    setQStates(prev => ({ ...prev, [qIdx]: { state: isCorrect ? STATES.CORRECT : STATES.WRONG, selectedIdx: optIdx, attempts: (q.attempts || 0) + 1 } }));
  };

  const handleTryAgain = (qIdx) => setQStates(prev => ({ ...prev, [qIdx]: { state: STATES.IDLE, selectedIdx: null, attempts: getQ(qIdx).attempts } }));
  const handleShowAnswer = (qIdx) => setQStates(prev => ({ ...prev, [qIdx]: { ...getQ(qIdx), state: STATES.REVEALED, selectedIdx: questions[qIdx].correct_index } }));

  if (isLoading) return (
    <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2.5 py-3" style={{ color: "var(--text-muted)" }}>
        <Loader size={16} className="animate-spin" style={{ color: "var(--brand)" }} />
        <span className="text-sm">Generating comprehension questions...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm"
        style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
        <p style={{ color: "var(--alert-text)" }}>Could not load questions.</p>
        <button onClick={onRetry} className="flex items-center gap-1.5 font-medium transition"
          style={{ background: "transparent", border: "none", color: "var(--brand)", padding: 0 }}>
          <RotateCcw size={13} /> Retry
        </button>
      </div>
    </div>
  );

  if (!questions?.length) return null;

  return (
    <div className="mt-8 pt-6 space-y-7" style={{ borderTop: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
          style={{ background: "var(--tag-fact)" }}>🧠</div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Quick Check</h3>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>Test your understanding of this topic</p>
        </div>
      </div>

      {questions.map((q, qIdx) => {
        const qs = getQ(qIdx);
        const isIdle = qs.state === STATES.IDLE;
        const isWrong = qs.state === STATES.WRONG;
        const isCorrect = qs.state === STATES.CORRECT;
        const isRevealed = qs.state === STATES.REVEALED;
        const isDone = isCorrect || isRevealed;

        return (
          <div key={qIdx} className="space-y-3">
            {/* Question */}
            <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2 text-white"
                style={{ background: "var(--brand)" }}>{qIdx + 1}</span>
              {q.question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, oIdx) => {
                const isSelected   = qs.selectedIdx === oIdx;
                const isCorrectOpt = oIdx === q.correct_index;

                let bg = "var(--bg-primary)", border = "var(--border)", color = "var(--text-primary)", cursor = "pointer";
                if (!isIdle) {
                  if (isCorrectOpt && isDone) { bg = "var(--success)"; border = "#5dade2"; color = "var(--success-text)"; cursor = "default"; }
                  else if (isSelected && isWrong) { bg = "#fef9e7"; border = "var(--alert-border)"; color = "var(--alert-text)"; cursor = "default"; }
                  else { bg = "var(--bg-primary)"; border = "var(--border)"; color = "var(--text-faint)"; cursor = "default"; }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, oIdx)}
                    disabled={!isIdle}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between gap-3 transition-all duration-150"
                    style={{ background: bg, border: `1px solid ${border}`, color, cursor, fontWeight: 400 }}
                    onMouseEnter={e => { if (isIdle) { e.currentTarget.style.borderColor = "var(--brand)"; e.currentTarget.style.background = "var(--tag-fact)"; }}}
                    onMouseLeave={e => { if (isIdle) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-primary)"; }}}
                  >
                    <span>{opt}</span>
                    {isCorrectOpt && isDone && <CheckCircle size={15} style={{ color: "var(--success-text)", flexShrink: 0 }} />}
                    {isSelected && isWrong    && <XCircle size={15} style={{ color: "var(--alert-text)", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>

            {/* Wrong feedback */}
            {isWrong && (
              <div className="rounded-xl px-4 py-3 space-y-2.5"
                style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">🤔</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--alert-text)" }}>Not quite! Please try again.</p>
                    {q.hint && <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>{q.hint}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <button onClick={() => handleTryAgain(qIdx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                    style={{ background: "var(--brand)", color: "white", border: "none" }}>
                    <RotateCcw size={11} /> Try Again
                  </button>
                  <button onClick={() => handleShowAnswer(qIdx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                    <Eye size={11} /> Show Answer
                  </button>
                </div>
              </div>
            )}

            {/* Correct feedback */}
            {isCorrect && (
              <div className="rounded-xl px-4 py-3" style={{ background: "#eafaf1", border: "1px solid #a3e4c7" }}>
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">🎉</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--success-text)" }}>Correct! Well done!</p>
                    {q.explanation && <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>{q.explanation}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Revealed */}
            {isRevealed && (
              <div className="rounded-xl px-4 py-3" style={{ background: "var(--tag-fact)", border: "1px solid var(--brand-soft)" }}>
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">💡</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--tag-fact-text)" }}>Here's the answer!</p>
                    {q.explanation && <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>{q.explanation}</p>}
                  </div>
                </div>
              </div>
            )}

            {isCorrect && qIdx < questions.length - 1 && (
              <p className="text-xs flex items-center gap-1 pl-1" style={{ color: "var(--success-text)" }}>
                <ChevronRight size={12} /> Keep going — next question below
              </p>
            )}
          </div>
        );
      })}

      {questions.length > 0 && questions.every((_, i) => { const s = getQ(i).state; return s === STATES.CORRECT || s === STATES.REVEALED; }) && (
        <div className="rounded-xl px-5 py-4 text-center" style={{ background: "var(--tag-fact)", border: "1px solid var(--border-strong)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {questions.every((_, i) => getQ(i).state === STATES.CORRECT) ? "🌟 Perfect! You understood this topic well!" : "📖 Review the highlighted answers and keep reading!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MCQ;
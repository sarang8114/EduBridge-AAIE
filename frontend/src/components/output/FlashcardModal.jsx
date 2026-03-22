// FlashcardModal.jsx
import { useState, useEffect } from "react";
import { X, RefreshCw, ChevronLeft, ChevronRight, Loader, RotateCcw } from "lucide-react";
import * as api from "../../services/api";

const CARD_COLORS = ["#4CAEE1","#5dade2","#1a9cd8","#2e86c1","#1f618d","#6c5ce7","#0984e3","#00b894"];

const FlashcardModal = ({ flashcards, isLoading, error, topicName, selectedLanguage, onClose, onRetry }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanationError, setExplanationError] = useState(null);

  useEffect(() => { setShowExplanation(false); setExplanation(null); setExplanationError(null); }, [currentIndex]);

  if (isLoading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(17,47,77,0.5)" }}>
      <div className="flex flex-col items-center gap-3">
        <Loader size={40} className="animate-spin" style={{ color: "var(--brand)" }} />
        <p style={{ color: "var(--text-primary)" }}>Generating flashcards...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,47,77,0.5)" }}>
      <div className="rounded-2xl p-6 max-w-md w-full" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Error</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={20} /></button>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--alert-text)" }}>Failed: {error}</p>
          <button onClick={onRetry} className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--brand)", color: "white", border: "none" }}>
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    </div>
  );

  if (!flashcards?.length) return null;

  const card = flashcards[currentIndex];
  const total = flashcards.length;
  const cardColor = CARD_COLORS[currentIndex % CARD_COLORS.length];
  const goNext = () => { if (currentIndex < total - 1) { setCurrentIndex(i => i + 1); setIsFlipped(false); } };
  const goPrev = () => { if (currentIndex > 0)         { setCurrentIndex(i => i - 1); setIsFlipped(false); } };

  const handleExplain = async (e) => {
    e.stopPropagation();
    if (showExplanation) { setShowExplanation(false); return; }
    setIsLoadingExplanation(true); setExplanationError(null);
    try {
      const response = await api.explainFlashcard(card.question, card.answer, selectedLanguage);
      setExplanation(response.data.data.explanation); setShowExplanation(true);
    } catch (err) { setExplanationError(err.response?.data?.message || err.message || "Failed to generate explanation"); }
    finally { setIsLoadingExplanation(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,47,77,0.5)" }}>
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{topicName} — Flashcards</h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ perspective: "1000px" }}>
          <div onClick={() => setIsFlipped(f => !f)} style={{ position: "relative", width: "100%", transition: "transform 0.6s", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "none", cursor: "pointer" }}>
            {/* Front */}
            <div className="rounded-3xl p-10 flex flex-col items-center justify-center min-h-[360px]"
              style={{ background: `linear-gradient(135deg, ${cardColor}ee, ${cardColor})`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "relative" }}>
              <p className="text-white text-xl leading-relaxed font-medium text-center drop-shadow">{card.question}</p>
              <p className="text-white/60 text-xs mt-4">Click to reveal answer</p>
            </div>
            {/* Back */}
            <div className="rounded-3xl p-10 flex flex-col items-center justify-center min-h-[360px]"
              style={{ background: `linear-gradient(135deg, ${cardColor}ee, ${cardColor})`, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", position: "absolute", top: 0, left: 0, width: "100%", transform: "rotateY(180deg)" }}>
              <p className="text-white text-xl leading-relaxed font-medium text-center drop-shadow mb-5">{card.answer}</p>
              <button onClick={handleExplain} disabled={isLoadingExplanation}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>
                {isLoadingExplanation ? <><Loader size={14} className="animate-spin" /> Loading...</> : <><RotateCcw size={14} /> {showExplanation ? "Hide" : "Explain"}</>}
              </button>
              {showExplanation && explanation && (
                <div className="mt-3 p-3 rounded-xl max-w-sm" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                  <p className="text-white text-sm leading-relaxed text-center">{explanation}</p>
                </div>
              )}
              {explanationError && <p className="mt-3 text-white/70 text-xs text-center">{explanationError}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-5 mt-6">
          <button onClick={goPrev} disabled={currentIndex === 0} className="p-3 rounded-full transition"
            style={{ background: currentIndex === 0 ? "var(--border)" : "var(--bg-card)", border: "1px solid var(--border)", color: currentIndex === 0 ? "var(--text-faint)" : "var(--text-primary)", cursor: currentIndex === 0 ? "not-allowed" : "pointer" }}>
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{currentIndex + 1} / {total}</span>
          <button onClick={goNext} disabled={currentIndex === total - 1} className="p-3 rounded-full transition"
            style={{ background: currentIndex === total - 1 ? "var(--border)" : "var(--brand)", border: "none", color: "white", cursor: currentIndex === total - 1 ? "not-allowed" : "pointer" }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;
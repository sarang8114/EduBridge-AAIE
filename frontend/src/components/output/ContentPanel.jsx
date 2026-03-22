import { useEffect, useRef, useState } from "react";
import { RefreshCw, Volume2, Loader, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import * as api from "../../services/api";
import MCQ from "./MCQ";

const escapeHtml = (s) =>
  (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const renderStylometry = (text) => {
  const safe = escapeHtml(text || "");
  let html = safe.replace(/\*\*(.+?)\*\*/g, "<strong style='color:var(--text-primary);font-weight:600;'>$1</strong>");
  const lines = html.split("\n");
  let out = []; let inUl = false;
  for (let ln of lines) {
    const raw = ln.trim();
    if (raw.startsWith("- ")) {
      if (!inUl) { out.push("<ul style='margin:10px 0;padding-left:20px;'>"); inUl = true; }
      out.push(`<li style='margin-bottom:5px;color:var(--text-primary);line-height:1.7;'>${raw.slice(2)}</li>`);
    } else {
      if (inUl) { out.push("</ul>"); inUl = false; }
      if (raw === "") out.push("<div style='height:8px'></div>");
      else out.push(`<p style='margin:0 0 9px 0;line-height:1.75;color:var(--text-primary);'>${ln}</p>`);
    }
  }
  if (inUl) out.push("</ul>");
  return out.join("");
};

const ContentPanel = ({ selectedTopic, simplifiedTopics, selectedLanguage, isSimplifying, isTranslating, simplificationProgress, translationProgress, onRetrySimplification }) => {
  const audioRef = useRef(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError]               = useState(null);
  const [isPlaying, setIsPlaying]                 = useState(false);
  const [currentTime, setCurrentTime]             = useState(0);
  const [duration, setDuration]                   = useState(0);
  const [audioLoaded, setAudioLoaded]             = useState(false);
  const [mcqQuestions, setMcqQuestions]           = useState(null);
  const [mcqLoading, setMcqLoading]               = useState(false);
  const [mcqError, setMcqError]                   = useState(null);

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDur  = () => setDuration(audio.duration);
    const onEnded    = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDur);
    audio.addEventListener("ended", onEnded);
    return () => { audio.removeEventListener("timeupdate", updateTime); audio.removeEventListener("loadedmetadata", updateDur); audio.removeEventListener("ended", onEnded); };
  }, [audioLoaded]);

  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); setIsPlaying(false); setAudioLoaded(false); setCurrentTime(0); setDuration(0); setAudioError(null); }
    setMcqQuestions(null); setMcqError(null);
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedTopic?.topic && selectedTopic?.content && !selectedTopic?.error && !isSimplifying && !isTranslating) {
      const content = selectedLanguage === "hindi" && selectedTopic.content_hindi ? selectedTopic.content_hindi : selectedTopic.content;
      fetchMCQ(selectedTopic.topic, content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic?.topic, isSimplifying, isTranslating]);

  const fetchMCQ = async (topic, content) => {
    if (!topic || !content) return;
    setMcqLoading(true); setMcqError(null); setMcqQuestions(null);
    try {
      const res = await api.generateMCQ(topic, content);
      setMcqQuestions(res.data.data.questions);
    } catch (err) { setMcqError(err.response?.data?.message || err.message || "Failed to load questions"); }
    finally { setMcqLoading(false); }
  };

  const handleGenerateAudio = async () => {
    if (!selectedTopic) return;
    setIsGeneratingAudio(true); setAudioError(null); setAudioLoaded(false);
    try {
      const text = selectedLanguage === "hindi" && selectedTopic.content_hindi ? selectedTopic.content_hindi : selectedTopic.content;
      const response = await api.generateAudio(text, selectedLanguage);
      const audioUrl = URL.createObjectURL(new Blob([response.data], { type: "audio/mpeg" }));
      if (audioRef.current) { audioRef.current.src = audioUrl; audioRef.current.load(); setAudioLoaded(true); audioRef.current.play(); setIsPlaying(true); }
    } catch (err) { setAudioError(err.response?.data?.message || err.message || "Failed to generate audio"); }
    finally { setIsGeneratingAudio(false); }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } else { audioRef.current.play(); setIsPlaying(true); }
  };

  const handleSeek = (e) => { const t = parseFloat(e.target.value); if (audioRef.current) { audioRef.current.currentTime = t; setCurrentTime(t); } };
  const formatTime = (t) => { if (isNaN(t)) return "0:00"; return `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`; };

  return (
    <section
      className="flex-1 rounded-2xl p-6 max-h-[calc(100vh-140px)] overflow-y-auto"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(17,47,77,0.06)" }}
    >
      <audio ref={audioRef} />

      {isSimplifying || isTranslating ? (
        <div className="flex flex-col items-center justify-center h-full space-y-5">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {isSimplifying ? "Simplifying topics..." : "Translating to Hindi..."}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--brand)" }}>
                {isSimplifying ? simplificationProgress : translationProgress}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${isSimplifying ? simplificationProgress : translationProgress}%`, background: "var(--brand)" }}
              />
            </div>
          </div>
        </div>

      ) : selectedTopic ? (
        <div>
          {/* Topic header */}
          <div className="mb-5 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{selectedTopic.topic}</h2>
            {selectedLanguage === "hindi" && selectedTopic.topic_hindi && (
              <h3 className="text-lg font-semibold mt-1" style={{ color: "var(--text-muted)" }}>{selectedTopic.topic_hindi}</h3>
            )}
          </div>

          {selectedTopic.error ? (
            <div className="rounded-xl p-4 mb-4" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
              <p className="text-sm mb-3" style={{ color: "var(--alert-text)" }}>Error simplifying this topic: {selectedTopic.error}</p>
              <button
                onClick={() => { const idx = simplifiedTopics.findIndex(t => t.topic === selectedTopic.topic); if (idx !== -1) onRetrySimplification(idx); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition"
                style={{ background: "var(--alert-border)", color: "white", border: "none" }}
              >
                <RefreshCw size={14} /> Retry Simplification
              </button>
            </div>
          ) : (
            <>
              {/* Content */}
              <div
                className="text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderStylometry(selectedLanguage === "hindi" && selectedTopic.content_hindi ? selectedTopic.content_hindi : selectedTopic.content),
                }}
              />

              {/* Audio */}
              <div className="mt-8 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="rounded-2xl p-5" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-strong)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
                      <Volume2 size={18} style={{ color: "var(--brand)" }} /> Audio Playback
                    </h3>
                    {audioLoaded && (
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    )}
                  </div>

                  {audioError && (
                    <div className="mb-3 p-3 rounded-lg text-sm" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)", color: "var(--alert-text)" }}>
                      {audioError}
                    </div>
                  )}

                  {!audioLoaded ? (
                    <button
                      onClick={handleGenerateAudio}
                      disabled={isGeneratingAudio}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                      style={{ background: "var(--brand)", color: "white", border: "none" }}
                      onMouseEnter={e => !isGeneratingAudio && (e.currentTarget.style.background = "var(--brand-hover)")}
                      onMouseLeave={e => !isGeneratingAudio && (e.currentTarget.style.background = "var(--brand)")}
                    >
                      {isGeneratingAudio
                        ? <><Loader size={18} className="animate-spin" /> Generating Audio...</>
                        : <><Volume2 size={18} /> Generate Audio</>}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="range" min="0" max={duration || 0} value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: "var(--brand)", background: "var(--border)" }}
                      />
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, currentTime - 10); }}
                          className="p-2.5 rounded-full transition" style={{ background: "var(--border)", border: "none", color: "var(--text-primary)" }}>
                          <SkipBack size={18} />
                        </button>
                        <button onClick={togglePlayPause}
                          className="p-3.5 rounded-full transition" style={{ background: "var(--brand)", border: "none", color: "white" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--brand-hover)"}
                          onMouseLeave={e => e.currentTarget.style.background = "var(--brand)"}>
                          {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} className="ml-0.5" fill="white" />}
                        </button>
                        <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(duration, currentTime + 10); }}
                          className="p-2.5 rounded-full transition" style={{ background: "var(--border)", border: "none", color: "var(--text-primary)" }}>
                          <SkipForward size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MCQ */}
              <MCQ
                key={selectedTopic?.topic}
                questions={mcqQuestions}
                isLoading={mcqLoading}
                error={mcqError}
                onRetry={() => {
                  const content = selectedLanguage === "hindi" && selectedTopic?.content_hindi ? selectedTopic.content_hindi : selectedTopic?.content;
                  fetchMCQ(selectedTopic?.topic, content);
                }}
              />
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>Select a topic to view content</p>
        </div>
      )}
    </section>
  );
};

export default ContentPanel;
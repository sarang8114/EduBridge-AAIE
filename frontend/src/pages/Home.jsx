import React, { useState, useRef } from "react";
import { ArrowRight, Upload, Loader, Globe } from "lucide-react";
import * as api from "../services/api";
import Output from "./Output";

function Home() {
  const [file, setFile]                   = useState(null);
  const [text, setText]                   = useState("");
  const [loading, setLoading]             = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [originalData, setOriginalData]   = useState(null);
  const [showOutput, setShowOutput]       = useState(false);
  const [error, setError]                 = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const fileRef = useRef(null);

  const handleProcessText = async () => {
    if (!text.trim()) return;
    setLoading(true); setError(null);
    try {
      const response = await api.extractText(text);
      const topics = response.data.data;
      setOriginalData(topics); setExtractedData(topics); setShowOutput(true);
    } catch (err) {
      setError("Error processing text: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleUploadPDF = async () => {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const response = await api.uploadPDF(file);
      const topics = response.data.data;
      setOriginalData(topics); setExtractedData(topics); setShowOutput(true);
    } catch (err) {
      setError("Error uploading PDF: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };

  const handleBack = () => {
    setShowOutput(false); setExtractedData(null); setOriginalData(null);
    setFile(null); setText(""); setError(null); setSelectedLanguage("english");
  };

  if (showOutput && extractedData) {
    return <Output extractedData={extractedData} originalData={originalData} onBack={handleBack} selectedLanguage={selectedLanguage} />;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full px-6"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Heading */}
      <h1
        className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        What'd you like to learn today?
      </h1>
      <p className="text-center mb-10 max-w-2xl" style={{ color: "var(--text-muted)" }}>
        Upload a PDF or paste your notes. We'll help you extract, simplify, and understand the content better.
      </p>

      {/* Error */}
      {error && (
        <div
          className="w-full max-w-3xl mb-6 p-4 rounded-xl text-sm"
          style={{ background: "var(--alert)", border: "1px solid var(--alert-border)", color: "var(--alert-text)" }}
        >
          {error}
        </div>
      )}

      {/* Language selector */}
      <div className="w-full max-w-3xl mb-4">
        <div
          className="flex items-center gap-3 rounded-xl p-4"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <Globe size={22} style={{ color: "var(--brand)" }} />
          <label className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none"
            style={{
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
          </select>
        </div>
      </div>

      {/* Text input */}
      <div className="relative w-full max-w-3xl mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text or notes here..."
          className="w-full h-28 p-4 pr-14 rounded-xl resize-none focus:outline-none transition-all duration-200 text-sm"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1.5px solid var(--border)",
            boxShadow: "0 2px 8px rgba(17,47,77,0.06)",
          }}
          onFocus={e => e.target.style.borderColor = "var(--brand)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <button
          onClick={handleProcessText}
          disabled={!text.trim() || loading}
          className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition"
          style={{
            background: text.trim() ? "var(--brand)" : "var(--bg-primary)",
            color: text.trim() ? "white" : "var(--brand)",
            border: `1.5px solid ${text.trim() ? "var(--brand)" : "var(--border-strong)"}`,
          }}
        >
          {loading ? <Loader size={18} className="animate-spin" /> : <ArrowRight size={18} />}
        </button>
      </div>

      {/* PDF drop zone */}
      <div
        className="w-full max-w-3xl rounded-xl p-8 cursor-pointer text-center flex flex-col items-center gap-3 transition-all duration-200"
        style={{
          border: "2px dashed var(--border-strong)",
          background: "var(--bg-card)",
        }}
        onClick={() => fileRef.current?.click()}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--brand)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-strong)"}
      >
        <Upload size={28} style={{ color: "var(--brand)" }} />
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {file ? (
            <><span style={{ color: "var(--brand)" }}>✓ {file.name}</span> ready to upload</>
          ) : (
            "Drag and drop your PDF here or click to upload"
          )}
        </p>
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>PDF files only, up to 50MB</p>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      </div>

      {file && (
        <button
          onClick={handleUploadPDF}
          disabled={loading}
          className="mt-5 px-8 py-3 rounded-xl font-semibold text-white text-sm transition disabled:opacity-50"
          style={{ background: loading ? "var(--brand-soft)" : "var(--brand)" }}
          onMouseEnter={e => !loading && (e.target.style.background = "var(--brand-hover)")}
          onMouseLeave={e => !loading && (e.target.style.background = "var(--brand)")}
        >
          {loading ? "Processing..." : "Process PDF"}
        </button>
      )}
    </div>
  );
}

export default Home;
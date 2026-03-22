import { useState } from "react";
import { X, Loader, ZoomIn } from "lucide-react";

const ImagesModal = ({ selectedTopic, imagesData, isLoading, error, onClose, onRetry }) => {
  const [expandedImg, setExpandedImg] = useState(null);

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,47,77,0.4)" }}>
        <div className="rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span>🖼️</span> Concept Visuals: {selectedTopic?.topic}
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg" style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-5">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <Loader size={36} className="animate-spin" style={{ color: "var(--brand)" }} />
                <p style={{ color: "var(--text-muted)" }}>Generating concept visuals...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="rounded-xl p-5 max-w-md text-center" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
                  <p className="text-sm mb-3" style={{ color: "var(--alert-text)" }}>{error}</p>
                  <button onClick={onRetry} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}>Retry</button>
                </div>
              </div>
            ) : imagesData?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {imagesData.map((img, idx) => {
                  const src = img.image_b64 ? `data:image/png;base64,${img.image_b64}` : img.image_url;
                  return (
                    <div key={idx}
                      className="rounded-2xl overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      style={{ border: "1px solid var(--border)", cursor: img.error ? "default" : "pointer" }}
                      onClick={() => !img.error && setExpandedImg({ src, title: img.title, caption: img.caption })}
                    >
                      {img.error ? (
                        <div className="h-44 flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
                          <p className="text-xs text-center px-4" style={{ color: "var(--text-faint)" }}>Could not generate this image</p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <img src={src} alt={img.title} className="w-full h-44 object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            style={{ background: "rgba(17,47,77,0.35)" }}>
                            <div className="p-2 rounded-full" style={{ background: "white" }}>
                              <ZoomIn size={18} style={{ color: "var(--brand)" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4" style={{ background: "var(--bg-card)" }}>
                        <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{img.title}</h4>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{img.caption}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {expandedImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(17,47,77,0.55)" }}
          onClick={() => setExpandedImg(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setExpandedImg(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full"
              style={{ background: "rgba(17,47,77,0.6)", border: "none", color: "white", cursor: "pointer" }}>
              <X size={18} />
            </button>
            <img src={expandedImg.src} alt={expandedImg.title} className="w-full object-contain max-h-[70vh]" />
            <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
              <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{expandedImg.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{expandedImg.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesModal;
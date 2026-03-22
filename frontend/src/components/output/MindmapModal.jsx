import { useState, useEffect } from "react";
import { X, Download, Loader, Volume2, Pause, Play, Maximize2 } from "lucide-react";

const ConceptCardsView = ({ nodes }) => {
  if (!nodes?.length) return <div className="flex items-center justify-center h-full"><p style={{ color: "var(--text-faint)" }}>No concept cards available</p></div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      {nodes.map((node, idx) => (
        <div key={idx} className="rounded-2xl p-5 shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: `linear-gradient(135deg, ${node.color || "#4CAEE1"}dd, ${node.color || "#4CAEE1"})`, color: "white" }}>
          <div className="text-3xl mb-2">{node.emoji || "📌"}</div>
          <h3 className="text-base font-bold mb-1.5">{node.text || "N/A"}</h3>
          <p className="text-sm opacity-90 leading-relaxed">{node.description || "No description available"}</p>
        </div>
      ))}
    </div>
  );
};

const MindmapRenderer = ({ data, onExpand }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!data || !window.go) return;
    const $ = window.go.GraphObject.make;
    const diagram = $(window.go.Diagram, "mindmap-canvas", {
      layout: $(window.go.TreeLayout, { angle: 0, layerSpacing: 80, nodeSpacing: 40, arrangement: window.go.TreeLayout.ArrangementHorizontal }),
      initialAutoScale: window.go.Diagram.Uniform, contentAlignment: window.go.Spot.Center, padding: 30,
    });
    diagram.nodeTemplate = $(window.go.Node, "Auto",
      { mouseEnter: (e, node) => { const nd = node.data; if (nd?.description) { const vp = e.diagram.transformDocToView(e.diagram.lastInput.documentPoint); setTooltipPos({ x: vp.x + 20, y: vp.y - 10 }); setHoveredNode(nd); } }, mouseLeave: () => setHoveredNode(null) },
      $(window.go.Shape, "RoundedRectangle", { strokeWidth: 2, stroke: "#A8D4EE", fill: "#4CAEE1", cursor: "pointer" }, new window.go.Binding("fill", "color")),
      $(window.go.Panel, "Horizontal", { margin: 12 },
        $(window.go.TextBlock, { font: "bold 18px Inter, sans-serif", margin: new window.go.Margin(0, 8, 0, 0), stroke: "white" }, new window.go.Binding("text", "emoji")),
        $(window.go.TextBlock, { font: "bold 13px Inter, sans-serif", stroke: "white", maxSize: new window.go.Size(200, NaN), wrap: window.go.TextBlock.WrapFit, textAlign: "center" }, new window.go.Binding("text", "text"))
      )
    );
    diagram.linkTemplate = $(window.go.Link, { routing: window.go.Link.Orthogonal, corner: 12, curve: window.go.Link.JumpOver }, $(window.go.Shape, { strokeWidth: 2.5, stroke: "#87CEFA" }));
    diagram.model = new window.go.GraphLinksModel(data.nodes || [], data.links || []);
    return () => { diagram.div = null; };
  }, [data]);

  return (
    <div className="relative w-full h-full">
      <div id="mindmap-canvas" className="w-full h-full min-h-[550px]" />
      {/* Expand button */}
      <button
        onClick={onExpand}
        className="absolute top-3 right-3 p-2 rounded-lg transition"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", zIndex: 10 }}
        title="View fullscreen"
      >
        <Maximize2 size={16} />
      </button>
      {hoveredNode?.description && (
        <div className="absolute z-50 pointer-events-none" style={{ left: tooltipPos.x, top: tooltipPos.y, transform: "translate(0, -100%)" }}>
          <div className="rounded-xl p-3 max-w-xs shadow-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-strong)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>{hoveredNode.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MindmapModal = ({
  selectedTopic, mindmapData, isGenerating, error, onClose, onRetry,
  onDownloadPDF, isDownloadingPDF,
  onExplainMindmap, isExplainingMindmap, explainAudioLoaded, explainError,
  isExplainPlaying, explainCurrentTime, explainDuration,
  onToggleExplainPlayPause, onExplainSeek, formatTime,
}) => {
  const [showConceptCards, setShowConceptCards] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const tabBtn = (active) => ({
    padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer",
    fontSize: "13px", fontWeight: 500,
    background: active ? "var(--bg-primary)" : "transparent",
    color: active ? "var(--brand)" : "var(--text-muted)",
    borderBottom: active ? "2px solid var(--brand)" : "none",
    transition: "all 0.15s",
  });

  return (
    <>
      {/* Main mindmap modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(17,47,77,0.4)" }}>
        <div className="rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>

          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <span>🗺️</span> Mind Map: {selectedTopic?.topic}
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg transition"
              style={{ background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          {!isGenerating && !error && mindmapData && (
            <div style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1 px-4 pt-3 flex-wrap items-center">
                <button style={tabBtn(!showConceptCards)} onClick={() => setShowConceptCards(false)}>Mind Map View</button>
                <button style={tabBtn(showConceptCards)} onClick={() => setShowConceptCards(true)}>📚 Concept Cards</button>
                <button onClick={onDownloadPDF} disabled={isDownloadingPDF}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ml-1 transition disabled:opacity-50"
                  style={{ background: "var(--tag-def)", color: "var(--tag-def-text)", border: "1px solid #d7b9e8", cursor: "pointer" }}>
                  {isDownloadingPDF ? <Loader size={13} className="animate-spin" /> : <Download size={13} />} Download PDF
                </button>
                <button onClick={onExplainMindmap} disabled={isExplainingMindmap}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ml-auto transition disabled:opacity-50"
                  style={{ background: "var(--tag-fact)", color: "var(--tag-fact-text)", border: "1px solid var(--brand-soft)", cursor: "pointer" }}>
                  {isExplainingMindmap ? <><Loader size={13} className="animate-spin" /> Generating...</> : <><Volume2 size={13} /> 🎙️ Explain</>}
                </button>
              </div>

              {(explainAudioLoaded || explainError) && (
                <div className="mx-4 mb-3 mt-2 px-4 py-3 rounded-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-strong)" }}>
                  {explainError ? (
                    <p className="text-xs" style={{ color: "var(--alert-text)" }}>{explainError}</p>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: "var(--brand)" }}>🎙️ AI Explanation</span>
                      <input type="range" min="0" max={explainDuration || 0} value={explainCurrentTime} onChange={onExplainSeek}
                        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer" style={{ accentColor: "var(--brand)" }} />
                      <span className="text-xs whitespace-nowrap" style={{ color: "var(--text-faint)" }}>{formatTime(explainCurrentTime)} / {formatTime(explainDuration)}</span>
                      <button onClick={onToggleExplainPlayPause} className="p-2 rounded-full flex-shrink-0"
                        style={{ background: "var(--brand)", border: "none", color: "white", cursor: "pointer" }}>
                        {isExplainPlaying ? <Pause size={13} fill="white" /> : <Play size={13} className="ml-0.5" fill="white" />}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 overflow-auto p-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader size={40} className="animate-spin" style={{ color: "var(--brand)" }} />
                <p style={{ color: "var(--text-muted)" }}>Generating your mind map...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="rounded-xl p-5 max-w-md text-center" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)" }}>
                  <p className="text-sm mb-4" style={{ color: "var(--alert-text)" }}>{error}</p>
                  <button onClick={onRetry} className="px-4 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: "var(--brand)", color: "white", border: "none", cursor: "pointer" }}>Retry</button>
                </div>
              </div>
            ) : mindmapData ? (
              showConceptCards
                ? <ConceptCardsView nodes={mindmapData.nodes || []} />
                : <div className="rounded-xl p-3 h-full min-h-[600px]" style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                    <MindmapRenderer data={mindmapData} onExpand={() => setIsExpanded(true)} />
                  </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Fullscreen blur overlay for mindmap */}
      {isExpanded && mindmapData && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: "rgba(17,47,77,0.6)" }}
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", maxHeight: "90vh", height: "85vh" }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full"
              style={{ background: "rgba(17,47,77,0.6)", border: "none", color: "white", cursor: "pointer" }}>
              <X size={18} />
            </button>
            <div className="w-full h-full p-4" style={{ background: "var(--bg-primary)" }}>
              <MindmapRenderer data={mindmapData} onExpand={() => {}} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MindmapModal;
const TopicsSidebar = ({ topics, simplifiedTopics, selectedTopic, selectedLanguage, onTopicClick }) => {
  return (
    <aside
      className="w-full lg:w-1/4 rounded-2xl p-4 max-h-[calc(100vh-140px)] overflow-y-auto"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 2px 12px rgba(17,47,77,0.06)" }}
    >
      <h2 className="text-sm font-semibold mb-4 pb-2" style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--border)" }}>
        Topics ({topics.length})
      </h2>
      <nav className="space-y-1.5">
        {topics.map((topic, index) => {
          const simplifiedTopic = simplifiedTopics[index];
          const displayTopic    = simplifiedTopic || topic;
          const active          = selectedTopic && selectedTopic.topic === topic.topic;

          return (
            <button
              key={index}
              onClick={() => onTopicClick(topic)}
              className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150"
              style={{
                background:  active ? "var(--brand)"   : "var(--bg-primary)",
                color:       active ? "#ffffff"         : "var(--text-primary)",
                border:      active ? "1px solid var(--brand)" : "1px solid transparent",
                fontWeight:  active ? 600 : 400,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "var(--bg-primary)"; e.currentTarget.style.borderColor = "var(--border)"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "var(--bg-primary)"; e.currentTarget.style.borderColor = "transparent"; }}}
            >
              <span className="text-sm leading-tight block">{topic.topic || `Topic ${index + 1}`}</span>
              {selectedLanguage === "hindi" && displayTopic.topic_hindi && (
                <span className="text-xs mt-0.5 block opacity-75">{displayTopic.topic_hindi}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default TopicsSidebar;
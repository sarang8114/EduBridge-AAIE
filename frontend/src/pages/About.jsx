const About = () => {
  const features = [
    { emoji: "📝", title: "Simplified Notes", desc: "Dense NCERT chapters broken down into clear, readable topic-wise summaries." },
    { emoji: "🗺️", title: "Mind Maps",        desc: "Visual concept maps that show how ideas connect, making revision faster." },
    { emoji: "🗂️", title: "Flashcards",       desc: "Auto-generated question-answer cards for active recall practice." },
    { emoji: "🎮", title: "Quiz Mode",         desc: "Topic-based quizzes to test understanding in an engaging format." },
    { emoji: "🧠", title: "Quick Check MCQ",   desc: "Conversational MCQs after each topic with hints and explanations." },
    { emoji: "🔊", title: "Audio Playback",    desc: "Listen to simplified content — supports both English and Hindi." },
    { emoji: "💡", title: "Key Insights",      desc: "Structured extraction of definitions, facts, processes and examples." },
    { emoji: "🖼️", title: "Concept Images",    desc: "AI-generated visuals that represent abstract ideas clearly." },
  ];

  const stack = ["Gemini / OpenAI LLMs", "Flask (Python)", "React + Tailwind CSS", "NCERT Class 9–10 Content", "WeasyPrint (PDF)", "GoJS (Mind Maps)"];

  return (
    <div className="min-h-screen px-8 py-10 max-w-3xl mx-auto" style={{ color: "var(--text-primary)" }}>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: "36px" }}>📚</span>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>EduBridge</h1>
            <p className="text-sm font-medium" style={{ color: "var(--brand)" }}>Agentic AI Framework for Inclusive Education</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Indian classrooms have always had students who learn differently. EduBridge is built around the idea that the
          content itself is not the problem — the way it is delivered is. The platform takes NCERT and State Board material
          and transforms it into simplified notes, mind maps, audio, and interactive tools designed for every kind of learner.
        </p>
      </div>

      {/* Problem */}
      <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Why EduBridge?</h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          India's school curriculum follows a fixed structure — same textbooks, same language, same pace for every student.
          For those with Special Educational Needs, this creates a genuine barrier. Complex sentence structures, abstract
          concepts, and dense paragraphs with no visual or auditory support make it difficult to keep up. Regional-medium
          students face an added difficulty when content is heavily English-dependent.
        </p>
        <p className="text-sm leading-relaxed mt-3" style={{ color: "var(--text-muted)" }}>
          The gap is not about intelligence — it is about delivery. EduBridge addresses this by converting academic content
          into formats that different kinds of learners can actually use, aligning with NEP 2020's vision of inclusive education.
        </p>
      </div>

      {/* Features grid */}
      <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>What it does</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {features.map(({ emoji, title, desc }) => (
          <div key={title} className="rounded-xl p-4 flex gap-3"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <span style={{ fontSize: "22px", flexShrink: 0 }}>{emoji}</span>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{title}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SDGs */}
      <div className="rounded-2xl p-5 mb-8" style={{ background: "var(--tag-fact)", border: "1px solid var(--border-strong)" }}>
        <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text-primary)" }}>Sustainable Development Goals</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--tag-fact-text)" }}>SDG 4 — Quality Education</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Making inclusive, equitable learning accessible to every student regardless of ability.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚖️</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--tag-fact-text)" }}>SDG 10 — Reduced Inequalities</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>Bridging the gap between students with access to coaching and those studying alone.</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-center pb-6" style={{ color: "var(--text-faint)" }}>
        EduBridge — Department of Computer Engineering &nbsp;·&nbsp; AI & ML Project
      </p>
    </div>
  );
};

export default About;
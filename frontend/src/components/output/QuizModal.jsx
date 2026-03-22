// QuizModal.jsx
import { Loader } from "lucide-react";
import { QUIZ_TEMPLATE_HTML } from "../quiz_game";

const generateQuizHTML = (quizJson) => {
  if (!quizJson?.questions?.length) return QUIZ_TEMPLATE_HTML;
  const formattedData = quizJson.questions.map((q) => ({
    question: q.question, options: q.options, correct: q.correct_index,
  }));
  const assignment = `const QUIZ_DATA = ${JSON.stringify(formattedData)};`;
  const start = "// <<<QUIZ_DATA_PLACEHOLDER_START>>>";
  const end   = "// <<<QUIZ_DATA_PLACEHOLDER_END>>>";
  const si = QUIZ_TEMPLATE_HTML.indexOf(start);
  const ei = QUIZ_TEMPLATE_HTML.indexOf(end);
  if (si === -1 || ei === -1) return QUIZ_TEMPLATE_HTML;
  return QUIZ_TEMPLATE_HTML.substring(0, si + start.length) + "\n" + assignment + "\n" + QUIZ_TEMPLATE_HTML.substring(ei);
};

const QuizModal = ({ quizData, isLoading, error, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(17,47,77,0.5)" }}>
    <div className="w-full h-full relative" style={{ background: "var(--bg-primary)" }}>
      <button
        onClick={onClose}
        className="absolute top-4 right-5 z-50 w-9 h-9 flex items-center justify-center rounded-full text-lg font-bold transition"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", cursor: "pointer" }}
      >
        ✕
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center h-full gap-3">
          <Loader size={40} className="animate-spin" style={{ color: "var(--brand)" }} />
          <p className="font-medium" style={{ color: "var(--text-muted)" }}>Generating quiz...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full">
          <div className="rounded-xl px-6 py-4 text-sm" style={{ background: "var(--alert)", border: "1px solid var(--alert-border)", color: "var(--alert-text)" }}>
            {error}
          </div>
        </div>
      ) : quizData ? (
        <iframe title="Quiz Game" className="w-full h-full" srcDoc={generateQuizHTML(quizData)} />
      ) : null}
    </div>
  </div>
);

export default QuizModal;

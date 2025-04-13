import { useEffect, useState, useContext } from "react";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingIconsBackground from "@/components/FloatingIconsBackground";

const QuizPage = () => {
  const { fileText } = useContext(ChemicalContext);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:5000/api/quiz", {
          text: fileText,
        });
        console.log("📥 Quiz API response:", res.data);
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("❌ Quiz fetch failed:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [fileText]);

  const handleSelect = (qIndex, choice) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: choice }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return questions.reduce((score, q, i) => {
      return score + (answers[i] === q.correct ? 1 : 0);
    }, 0);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingIconsBackground />

      <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">⁉️ Pre-Lab Quiz</h1>

      {loading ? (
        <p className="text-center text-gray-500">Generating quiz...</p>
      ) : questions.length === 0 ? (
        <p className="text-center text-red-500">⚠️ No quiz questions available.</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-6">
            {questions.map((q, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow">
                <h2 className="font-semibold mb-2">{i + 1}. {q.question}</h2>
                {q.choices.map((choice, j) => (
                  <label key={j} className="block mb-1">
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={choice}
                      checked={answers[i] === choice}
                      onChange={() => handleSelect(i, choice)}
                      disabled={submitted}
                      className="mr-2"
                    />
                    {choice}
                  </label>
                ))}
                {submitted && (
                  <p className={`mt-1 text-sm ${answers[i] === q.correct ? "text-green-600" : "text-red-600"}`}>
                    {answers[i] === q.correct ? "✅ Correct" : `❌ Correct answer: ${q.correct}`}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!submitted ? (
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400"
              >
                Submit Quiz
              </button>
            </div>
          ) : (
            <div className="mt-6 text-center text-xl font-semibold text-green-700">
              🎉 Your Score: {getScore()} / {questions.length}
            </div>
          )}
        </form>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/workspace")}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300"
        >
          ← Back to Workspace
        </button>
      </div>
    </div>
    </div>
  );
};

export default QuizPage;

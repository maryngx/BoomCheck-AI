import { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AnalyzePanel = () => {
  const { analyzeList, setAnalyzeList, setAnalyzeResult } =
    useContext(ChemicalContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "chemical",
    drop: (item) => {
      if (!analyzeList.includes(item.name)) {
        setAnalyzeList((prev) => [...prev, item.name]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleAnalyze = async () => {
    if (analyzeList.length === 0) return;

    try {
      // const res = await axios.post("http://localhost:5000/api/info", {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/info`, {
          chemicalNames: analyzeList,
        });
      setAnalyzeResult(res.data); // Expecting MSDS summaries array
      navigate("/analyze");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch MSDS info. Please try again.");
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-[#F5EFFF] border border-gray-400 items-center rounded-xl shadow p-4 relative min-h-[200px] transition-all 
        ${isOver ? "bg-green-100 border-green-400 border" : "border border-gray-400"}`}
    >
      <h2 className="text-xl font-semibold mb-2">🔬 Analyzing</h2>

      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        {analyzeList.length === 0 ? (
          <p className="text-gray-500 text-center">
            Drag 1 or more chemicals here to analyze
          </p>
        ) : (
          <ul className="flex items-center justify-center flex-wrap gap-2 mb-3 text-sm">
            {analyzeList.map((chem, i) => (
              <li
                key={i}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center shadow"
              >
                🧪 {chem}
                <button
                  onClick={() =>
                    setAnalyzeList((prev) => prev.filter((c) => c !== chem))
                  }
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  title="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          disabled={analyzeList.length === 0}
          onClick={handleAnalyze}
          className={`px-4 py-2 rounded-lg text-white
          ${analyzeList.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-400"}`}
        >
          Analyze Chemicals →
        </button>
      </div>
    </div>
  );
};

export default AnalyzePanel;

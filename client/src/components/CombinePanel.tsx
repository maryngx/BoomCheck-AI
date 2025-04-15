import { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CombinePanel = () => {
  const {
    combineList,
    setCombineList,
    setCombineResult,
    getCachedCombination,
    setCachedCombination,
  } = useContext(ChemicalContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "chemical",
    drop: (item) => {
      if (!combineList.includes(item.name)) {
        setCombineList((prev) => [...prev, item.name]);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleCombine = async () => {
    if (combineList.length < 2) return;

    const cached = getCachedCombination(combineList);
    if (cached) {
      console.log("✅ Using cached result for:", combineList);
      setCombineResult(cached);
      navigate("/combine");
      return;
    }

    try {
      // const res = await axios.post("http://localhost:5000/api/combine", {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/combine`,
        {
          chemicals: combineList,
        },
      );
      console.log("🧪 Combine result from backend:", res.data);
      setCombineResult(res.data);
      setCachedCombination(combineList, res.data); // ✅ store to cache
      navigate("/combine");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to combine chemicals. Please try again.");
      }
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-[#F5EFFF] border border-gray-400 rounded-xl shadow p-4 relative min-h-[200px] transition-all 
        ${isOver ? "bg-yellow-100 border-yellow-400 border" : "border border-gray-400"}`}
    >
      <h2 className="text-xl font-semibold mb-2">⚗️ Combining → Analyzing</h2>

      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        {combineList.length === 0 ? (
          <p className="text-gray-500 text-center">
            Drag 2 or more chemicals here to combine
          </p>
        ) : (
          <ul className="flex items-center justify-center flex-wrap gap-2 mb-3 text-sm">
            {combineList.map((chem, i) => (
              <li
                key={i}
                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full flex items-center shadow"
              >
                🧪 {chem}
                <button
                  onClick={() =>
                    setCombineList((prev) => prev.filter((c) => c !== chem))
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
          disabled={combineList.length < 2}
          onClick={handleCombine}
          className={`px-4 py-2 rounded-lg text-white 
          ${combineList.length < 2 ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"}`}
        >
          Combine Chemicals →
        </button>
      </div>
    </div>
  );
};

export default CombinePanel;

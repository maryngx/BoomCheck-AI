import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ChemicalContext } from "../contexts/ChemicalContext";
import ChemicalBox from "../components/ChemicalBox";
import AnalyzePanel from "../components/AnalyzePanel";
import CombinePanel from "../components/CombinePanel";
import FloatingIconsBackground from "@/components/FloatingIconsBackground";

const Workspace = () => {
  const { chemicalList } = useContext(ChemicalContext);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingIconsBackground />

      <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📝 Data Collection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analyze Panel */}
        <AnalyzePanel />

        {/* Chemical List */}
        <div className="bg-[#F7F9F2] border border-gray-400 rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Necessary Substances</h2>
          <div className="flex flex-wrap gap-10">
            {chemicalList.map((name, i) => (
              <ChemicalBox key={i} name={name}/>
            ))}
          </div>
        </div>

        {/* Combine Panel */}
        <CombinePanel />
      </div>

      <div className="mt-6 flex gap-4 justify-center">
        <button
          onClick={() => navigate("/")}
          className="bg-violet-300 hover:bg-gray-200 px-4 py-2 rounded-lg"
        >
          🏠 Back to Home
        </button>
        <button
          onClick={() => navigate("/quiz")}
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg"
        >
          ⁉️ Generate Quiz
        </button>
        <button
          onClick={() => navigate("/procedure")}
          className="bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 rounded-lg"
        >
          📋 Generate Lab Procedures
        </button>
      </div>
    </div>
    </div>
  );
};

export default Workspace;

import { useState, useContext } from "react";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingIconsBackground from "@/components/FloatingIconsBackground.tsx";

const AnalyzeResult = () => {
  const { analyzeResult } = useContext(ChemicalContext);
  const [expanded, setExpanded] = useState({});
  const [loadingMore, setLoadingMore] = useState({});
  const navigate = useNavigate();

  const handleViewMore = async (name) => {
    if (expanded[name] || loadingMore[name]) return;
    setLoadingMore((prev) => ({ ...prev, [name]: true }));

    console.log("🧪 Received analyzeResult:", analyzeResult);

    try {
      // const res = await axios.post("http://localhost:5000/api/msds", { name });
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/msds`, { name });
      setExpanded((prev) => ({ ...prev, [name]: res.data }));
    } catch (err) {
      console.error("Failed to load full MSDS", err);
    } finally {
      setLoadingMore((prev) => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingIconsBackground />

      <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🔬 Analysis Results
      </h1>

      <div className="grid gap-6">
        {analyzeResult.map((chem, i) => {
          console.log("🔍 Chemical:", chem);
          return (
            <div
              key={i}
              className="mt-6 bg-yellow-100 border border-yellow-300 rounded-xl p-4"
            >
              <h2 className="text-xl font-semibold mb-2">
                {chem.icon || "🧪"} {chem.name}
              </h2>

              <ul className="list-disc list-inside text-sm text-gray-700">
                <li>CAS Number: {chem.cas_number}</li>
                <li>Formula: {chem.formula}</li>
                <li>Molar Mass: {chem.molar_mass}</li>
                <li>Melting Point: {chem.melting_point}</li>
                <li>Boiling Point: {chem.boiling_point}</li>
                <li>pH: {chem.ph}</li>
                <li>
                  {chem.icon === "✅"
                    ? "✅ "
                    : chem.icon === "🔥" || chem.icon === "⚠️"
                      ? "❌ "
                      : chem.icon}
                  Hazard Status: {chem.hazard_status}
                </li>
                <li>💧 Solubility: {chem.solubility}</li>
                <li>🔥 Flammability: {chem.flammability}</li>
                <li>
                  📊 HMIS/NFPA: Health: {chem.hmnfpa?.health} | Fire:{" "}
                  {chem.hmnfpa?.fire} | Reactivity: {chem.hmnfpa?.reactivity}
                </li>
                <li>🗑️ Disposal Instructions: {chem.disposal}</li>

                {/* Expanded fields inline */}
                {expanded[chem.name] && (
                  <>
                    <li>Density: {expanded[chem.name].density}</li>
                    <li>⚕️ PPE: {expanded[chem.name].ppe?.join(", ")}</li>
                    <li>🧤 Handling: {expanded[chem.name].handling}</li>
                    <li>
                      🚿 First Aid:
                      {typeof expanded[chem.name].first_aid === "string" ? (
                        <span className="ml-1 text-gray-600">
                          {" "}
                          {expanded[chem.name].first_aid}
                        </span>
                      ) : (
                        <ul className="list-disc ml-6">
                          {expanded[chem.name].first_aid &&
                            Object.entries(expanded[chem.name].first_aid).map(
                              ([key, val], idx) => (
                                <li key={idx} className="text-gray-600">
                                  <strong>{key}</strong>:{" "}
                                  {Array.isArray(val)
                                    ? val.join(", ")
                                    : String(val)}
                                </li>
                              ),
                            )}
                        </ul>
                      )}
                    </li>
                    <li>
                      Incompatabilities: {expanded[chem.name].incompatibilities}
                    </li>
                    <li>Storage: {expanded[chem.name].storage}</li>
                    <li>
                      Spill Procedures: {expanded[chem.name].spill_procedures}
                    </li>
                    <li>
                      Regulatory:
                      <ul className="list-disc ml-6">
                        {expanded[chem.name].regulatory &&
                          Object.entries(expanded[chem.name].regulatory).map(
                            ([key, val], idx) => (
                              <li key={idx} className="text-gray-600">
                                <strong>{key}</strong>:{" "}
                                {Array.isArray(val)
                                  ? val.join(", ")
                                  : String(val)}
                              </li>
                            ),
                          )}
                      </ul>
                    </li>
                    <li>
                      Environmental Hazard:{" "}
                      {expanded[chem.name].environmental_hazard}
                    </li>
                  </>
                )}
              </ul>

              {/* Toggle Button */}
              <button
                onClick={() =>
                  expanded[chem.name]
                    ? setExpanded((prev) => {
                        const updated = { ...prev };
                        delete updated[chem.name];
                        return updated;
                      })
                    : handleViewMore(chem.name)
                }
                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
              >
                {expanded[chem.name]
                  ? "View Less ←"
                  : loadingMore[chem.name]
                    ? "Loading..."
                    : "View More →"}
              </button>
            </div>
          );
        })}
      </div>

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

export default AnalyzeResult;

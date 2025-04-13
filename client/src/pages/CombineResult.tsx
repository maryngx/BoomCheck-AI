import { useState, useContext } from "react";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingIconsBackground from "@/components/FloatingIconsBackground.tsx";

const hazardColors = {
  HIGH: "bg-red-200 border-red-500",
  MODERATE: "bg-yellow-100 border-orange-300",
  LOW: "bg-green-300 border-green-800",
  UNKNOWN: "bg-gray-300",
};

const CombineResult = () => {
  const { combineList, combineResult } = useContext(ChemicalContext);
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState({});
  const [loadingMore, setLoadingMore] = useState({});
  const handleViewMore = async (name) => {
    if (expanded[name] || loadingMore[name]) return;
    setLoadingMore((prev) => ({ ...prev, [name]: true }));

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

      <div className="min-h-screenp-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ⚗️ Results of Combination
      </h1>

      {!combineResult ? (
        <p className="text-center text-gray-500">Analyzing combination...</p>
      ) : (
        <div className="rounded-xl shadow space-y-3 p-6 max-w-4xl mx-auto">
          <div className="bg-gray-100 border border-gray-400 rounded-xl p-4">
            <p className="text-lg break-words whitespace-normal">
              🧪 <strong>Reaction Prediction:</strong>{" "}
              {combineResult?.balancedEquation || "Unknown"}
            </p>
          </div>

          {combineResult.reactionDescription && (
            <div className="bg-pink-100 border border-pink-300 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">
                🧬 Reaction Description
              </h3>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {combineResult.reactionDescription}
              </p>
            </div>
          )}

          <div
            className={`p-4 rounded-xl text-black-100 border ${
              hazardColors[
                combineResult.hazardLevel?.toUpperCase() || "UNKNOWN"
              ]
            }`}
          >
            ⚠️ <strong>Reaction Hazard Level:</strong>{" "}
            {combineResult.hazardLevel
              ? combineResult.hazardLevel.toUpperCase()
              : "UNKNOWN"}
          </div>

          {Array.isArray(combineResult.msds) &&
            combineResult.msds.map((msdsChem, i) => (
              <div
                key={i}
                className="bg-[#F1EFEC] border border-[#D4C9BE] rounded-xl p-4"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {msdsChem.icon || "🧪"} {msdsChem.name}
                </h2>

                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li>CAS Number: {msdsChem.cas_number}</li>
                  <li>Formula: {msdsChem.formula}</li>
                  <li>Molar Mass: {msdsChem.molar_mass}</li>
                  <li>Melting Point: {msdsChem.melting_point}</li>
                  <li>Boiling Point: {msdsChem.boiling_point}</li>
                  <li>pH: {msdsChem.ph}</li>
                  <li>
                    {msdsChem.icon === "✅"
                      ? "✅ "
                      : msdsChem.icon === "🔥" || msdsChem.icon === "⚠️"
                        ? "❌ "
                        : msdsChem.icon}
                    Hazard Status: {msdsChem.hazard_status}
                  </li>
                  <li>💧 Solubility: {msdsChem.solubility}</li>
                  <li>🔥 Flammability: {msdsChem.flammability}</li>
                  <li>
                    📊 HMIS/NFPA: Health: {msdsChem.hmnfpa?.health} | Fire:{" "}
                    {msdsChem.hmnfpa?.fire} | Reactivity:{" "}
                    {msdsChem.hmnfpa?.reactivity}
                  </li>
                  <li>🗑️ Disposal Instructions: {msdsChem.disposal}</li>

                  {/* View More Section */}
                  {expanded[msdsChem.name] && (
                    <>
                      <li>Density: {expanded[msdsChem.name]?.density}</li>
                      <li>
                        ⚕️ PPE: {expanded[msdsChem.name]?.ppe?.join(", ")}
                      </li>
                      <li>🧤 Handling: {expanded[msdsChem.name]?.handling}</li>
                      <li>
                        🚿 First Aid:
                        {typeof expanded[msdsChem.name]?.first_aid ===
                        "string" ? (
                          <span className="ml-1 text-gray-600">
                            {" "}
                            {expanded[msdsChem.name]?.first_aid}
                          </span>
                        ) : (
                          <ul className="list-disc ml-6">
                            {Object.entries(
                              expanded[msdsChem.name]?.first_aid || {},
                            ).map(([key, val], idx) => (
                              <li key={idx} className="text-gray-600">
                                <strong>{key}</strong>:{" "}
                                {Array.isArray(val)
                                  ? val.join(", ")
                                  : String(val)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                      <li>
                        Incompatibilities:{" "}
                        {expanded[msdsChem.name]?.incompatibilities}
                      </li>
                      <li>Storage: {expanded[msdsChem.name]?.storage}</li>
                      <li>
                        Spill Procedures:{" "}
                        {expanded[msdsChem.name]?.spill_procedures}
                      </li>
                      <li>
                        Regulatory:
                        <ul className="list-disc ml-6">
                          {Object.entries(
                            expanded[msdsChem.name]?.regulatory || {},
                          ).map(([key, val], idx) => (
                            <li key={idx} className="text-gray-600">
                              <strong>{key}</strong>:{" "}
                              {Array.isArray(val)
                                ? val.join(", ")
                                : String(val)}
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        Environmental Hazard:{" "}
                        {expanded[msdsChem.name]?.environmental_hazard}
                      </li>
                    </>
                  )}
                </ul>

                {/* View More / Less Toggle */}
                <button
                  onClick={() =>
                    expanded[msdsChem.name]
                      ? setExpanded((prev) => {
                          const updated = { ...prev };
                          delete updated[msdsChem.name];
                          return updated;
                        })
                      : handleViewMore(msdsChem.name)
                  }
                  className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                >
                  {expanded[msdsChem.name]
                    ? "View Less ←"
                    : loadingMore[msdsChem.name]
                      ? "Loading..."
                      : "View More →"}
                </button>
              </div>
            ))}

          {combineResult.safetyAdvisor && (
            <div className="bg-blue-50 border border-blue-300 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">🛡️ Safety Advisor</h3>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {Object.entries(combineResult.safetyAdvisor).map(
                  ([key, val], i) => (
                    <li key={i}>
                      <strong>{key}:</strong> {val}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {combineResult.saferAlternatives && (
            <div className="bg-green-50 border border-green-400 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">
                🌿 Safer Alternatives
              </h3>
              <ul className="list-disc list-inside text-sm text-black">
                {Object.entries(combineResult.saferAlternatives).map(
                  ([key, val], i) => (
                    <li key={i}>
                      <strong>{key}:</strong> {val}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </div>
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

export default CombineResult;

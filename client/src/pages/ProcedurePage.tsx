import { useEffect, useState, useContext } from "react";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingIconsBackground from "@/components/FloatingIconsBackground";

const ProcedurePage = () => {
  const { fileText } = useContext(ChemicalContext);
  const [procedure, setProcedure] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProcedure = async () => {
      setLoading(true);
      try {
        console.log("📤 Sending to /generate-procedure:", fileText);
        const res = await axios.post(
          "http://localhost:5000/api/generate-procedure",
          {
            text: fileText,
          }
        );
        setProcedure(JSON.parse(res.data.procedure || "{}"));
      } catch (err) {
        console.error(err);
        setProcedure("⚠️ Failed to generate lab procedure.");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedure();
  }, [fileText]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingIconsBackground />

      <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📋 Lab Procedures</h1>

      {loading ? (
        <p className="text-center text-gray-500">
          Generating lab procedures...
        </p>
      ) : (
        <div className="space-y-8 max-w-3xl mx-auto text-gray-700 text-sm leading-relaxed">
          <div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-2">🧪 Lab Procedure</h2>
  {procedure.lab_procedure && procedure.lab_procedure.length > 0 ? (
    <ul className="list-decimal ml-6">
      {procedure.lab_procedure.map((step: string, idx: number) => (
        <li key={idx}>{step}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">
      ⚠️ Cannot create a lab procedure from your given text.
    </p>
  )}
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-2">📝 Post-Lab Questions</h2>
  {procedure.post_lab_questions && procedure.post_lab_questions.length > 0 ? (
    <ul className="list-disc ml-6">
      {procedure.post_lab_questions.map((q: string, idx: number) => (
        <li key={idx}>{q}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">
      ⚠️ Cannot generate post-lab questions from your given text.
    </p>
  )}
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-2">🔧 Equipment</h2>
  {procedure.equipment && procedure.equipment.length > 0 ? (
    <ul className="list-decimal ml-6">
      {procedure.equipment.map((e: string, idx: number) => (
        <li key={idx}>{e}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 italic">
      ⚠️ Cannot extract equipment list from your given text.
    </p>
  )}
</div>

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

export default ProcedurePage;

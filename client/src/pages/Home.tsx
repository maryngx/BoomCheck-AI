import { useContext } from "react";
import UploadZone from "../components/UploadZone";
import { ChemicalContext } from "../contexts/ChemicalContext";
import { useNavigate } from "react-router-dom";
import FloatingIconsBackground from "../components/FloatingIconsBackground";

const Home = () => {
  const { uploadedFile, setUploadedFile, resetChemicals } =
    useContext(ChemicalContext);
  const navigate = useNavigate();

  const handleReupload = () => {
    setUploadedFile(null);
    resetChemicals();
  };

  const handleProceed = () => {
    navigate("/workspace");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingIconsBackground />

      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-3">
        ⚗️ HeyAssistant – BoomCheck AI 🤖
      </h1>
      <p className="text-xl text-gray-700 mb-1">
        Hi chemists ^_^ welcome to the world of chemistry.
      </p>

      <div className="w-full max-w-lg">
        <UploadZone />
      </div>

      {uploadedFile && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleReupload}
            className="px-5 py-2 bg-yellow-400 rounded-xl shadow hover:bg-yellow-300 transition"
          >
            🔁 Upload Another File
          </button>
          <button
            onClick={handleProceed}
            className="px-5 py-2 bg-green-500 text-white rounded-xl shadow hover:bg-green-400 transition"
          >
            🚀 Proceed to Workspace
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Home;

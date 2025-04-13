import { useContext, useState } from "react";
import { ChemicalContext } from "../contexts/ChemicalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadZone = () => {
  const { setUploadedFile, setChemicalList, setFileText } =
    useContext(ChemicalContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (
      !file ||
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setError("Only .pdf or .docx files are supported.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setUploadedFile(file.name);
      setChemicalList(res.data.chemicals || []);
      setFileText(res.data.text || "");
      setSuccess(true);
      setTimeout(() => {
        navigate("/workspace");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.error || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-custom-gradient to-blue-50 p-8 rounded-2xl shadow-xl w-full text-center">
      <label
        htmlFor="file-upload"
        className="block cursor-pointer border-2 border-dashed border-blue-400 py-8 px-4 rounded-xl hover:bg-blue-50 transition"
      >
        <p className="text-blue-700 font-semibold text-lg mb-2">
          📄 Drag and drop a file here, or click to upload
        </p>
        <p className="text-sm text-gray-500">.docx or .pdf only</p>
      </label>

      <input
        id="file-upload"
        type="file"
        accept=".pdf,.docx"
        onChange={handleUpload}
        className="hidden"
      />

      {loading && (
        <p className="mt-4 text-blue-600 animate-pulse">
          🔍 Uploading and analyzing your file...
        </p>
      )}
      {success && (
        <p className="mt-4 text-green-600">✅ File uploaded! Redirecting...</p>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default UploadZone;

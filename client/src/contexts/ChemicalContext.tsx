import { createContext, useState } from "react";

export const ChemicalContext = createContext();

export const ChemicalProvider = ({ children }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chemicalList, setChemicalList] = useState([]);
  const [fileText, setFileText] = useState("");

  const [analyzeList, setAnalyzeList] = useState([]);
  const [combineList, setCombineList] = useState([]);
  const [combineResult, setCombineResult] = useState(null);
  const [analyzeResult, setAnalyzeResult] = useState([]);

  // ✅ NEW: combine cache
  const [combineCache, setCombineCache] = useState(new Map());

  const getCachedCombination = (names) => {
    const key = [...names].sort().join("::");
    return combineCache.get(key);
  };

  const setCachedCombination = (names, result) => {
    const key = [...names].sort().join("::");
    setCombineCache((prev) => new Map(prev).set(key, result));
  };

  const resetChemicals = () => {
    setChemicalList([]);
    setAnalyzeList([]);
    setCombineList([]);
  };

  return (
    <ChemicalContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        chemicalList,
        setChemicalList,
        fileText,
        setFileText,
        analyzeList,
        setAnalyzeList,
        combineList,
        setCombineList,
        combineResult,
        setCombineResult,
        analyzeResult,
        setAnalyzeResult,
        resetChemicals,
        getCachedCombination,     // ✅ expose cache handlers
        setCachedCombination,
      }}
    >
      {children}
    </ChemicalContext.Provider>
  );
};

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
      }}
    >
      {children}
    </ChemicalContext.Provider>
  );
};

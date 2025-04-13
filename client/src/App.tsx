import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Workspace from "./pages/Workspace";
import AnalyzeResult from "./pages/AnalyzeResult";
import CombineResult from "./pages/CombineResult";
import QuizPage from "./pages/QuizPage";
import ProcedurePage from "./pages/ProcedurePage";

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/analyze" element={<AnalyzeResult />} />
        <Route path="/combine" element={<CombineResult />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/procedure" element={<ProcedurePage />} />
      </Routes>
  );
};

export default App;

// import FloatingIconsBackground from "./components/FloatingIconsBackground";

// function App() {
//   return (
//     <div className="min-h-screen bg-[#f4fdfc] text-center text-[#006747]">
//       <FloatingIconsBackground />
//       <h1 className="text-4xl mt-32 font-bold">🧪 LabSafe AI</h1>
//       <p className="text-xl mt-4">Cinematic chemistry vibes!</p>
//     </div>
//   );
// }

// export default App;

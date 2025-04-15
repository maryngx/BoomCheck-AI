import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { ChemicalProvider } from "./contexts/ChemicalContext.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Failed to find the root element.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChemicalProvider>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </ChemicalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

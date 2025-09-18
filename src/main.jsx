import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import TanstackProvider from "./lib/tanstack-provider.jsx";
import { Toaster } from "./components/ui/sonner.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <TanstackProvider>
        <App />
        <Toaster position="top-center" />
      </TanstackProvider>
    </BrowserRouter>
  </StrictMode>
);

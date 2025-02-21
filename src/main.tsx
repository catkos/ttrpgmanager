import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Test from "./views/Test.tsx";
import MainHub from "./views/MainHub.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainHub />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  </BrowserRouter>
);

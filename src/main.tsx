import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Test from "./views/Test.tsx";
import MainHub from "./views/MainHub.tsx";
import Audio from "./views/Audio.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainHub />} />
      <Route path="/test" element={<Test />} />
      <Route path="/audio" element={<Audio />} />
    </Routes>
  </BrowserRouter>
);

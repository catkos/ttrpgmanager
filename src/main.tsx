import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Test from "./views/Test.tsx";
import MainHub from "./views/MainHub.tsx";
import Audio from "./views/Audio.tsx";
import Home from "./views/Home.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<MainHub />} />
      <Route path="/test" element={<Test />} />
      <Route path="/audio" element={<Audio />} />
    </Routes>
  </BrowserRouter>
);

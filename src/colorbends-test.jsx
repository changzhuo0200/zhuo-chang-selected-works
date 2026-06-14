import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import ColorBends from "./components/ColorBends.jsx";
import "./colorbends-test.css";

const deepPreset = {
  colors: ["#12324a", "#2f6f95", "#74aed5", "#b8e7f4"],
  rotation: 88,
  speed: 0.12,
  scale: 1.15,
  frequency: 0.75,
  warpStrength: 0.65,
  mouseInfluence: 0.45,
  noise: 0.04,
  parallax: 0.22,
  iterations: 2,
  intensity: 0.95,
  bandWidth: 5.5,
  transparent: true,
  autoRotate: -2,
  color: "#0b2435"
};

const clearPreset = {
  colors: ["#1c4f6f", "#4b93bd", "#8fd3ee", "#d7f6ff"],
  rotation: 92,
  speed: 0.1,
  scale: 1.05,
  frequency: 0.7,
  warpStrength: 0.55,
  mouseInfluence: 0.35,
  noise: 0.03,
  parallax: 0.18,
  iterations: 2,
  intensity: 0.85,
  bandWidth: 6,
  transparent: true,
  autoRotate: -1.5,
  color: "#102f45"
};

function App() {
  const [preset, setPreset] = useState("deep");
  const props = preset === "deep" ? deepPreset : clearPreset;

  return (
    <main className="test-page">
      <ColorBends {...props} />
      <div className="test-overlay" />
      <section className="test-copy">
        <p>ColorBends · Three.js Shader Test</p>
        <h1>在研究与实践之间，寻找人与内容的真实连接。</h1>
        <nav>
          <button type="button" className={preset === "deep" ? "is-active" : ""} onClick={() => setPreset("deep")}>
            Deep Editorial
          </button>
          <button type="button" className={preset === "clear" ? "is-active" : ""} onClick={() => setPreset("clear")}>
            Clear Mist
          </button>
        </nav>
      </section>
    </main>
  );
}

createRoot(document.querySelector("#root")).render(<App />);

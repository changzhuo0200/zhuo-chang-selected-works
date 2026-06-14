import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ColorBends from "./components/ColorBends.jsx";

const heroBackground = {
  colors: ["#315b70", "#525c62", "#5f95ad", "#a8d8e8"],
  rotation: 88,
  speed: 0.12,
  scale: 1.15,
  frequency: 0.75,
  warpStrength: 0.65,
  mouseInfluence: 0.45,
  noise: 0.03,
  parallax: 0.22,
  iterations: 2,
  intensity: 0.9,
  bandWidth: 5.5,
  transparent: true,
  autoRotate: -2,
  color: "#12354a"
};

const pageBackground = {
  colors: ["#12324a", "#2f6f95", "#74aed5", "#b8e7f4"],
  rotation: 91,
  speed: 0.055,
  scale: 1.1,
  frequency: 0.68,
  warpStrength: 0.36,
  mouseInfluence: 0.14,
  noise: 0.024,
  parallax: 0.08,
  iterations: 2,
  intensity: 0.42,
  bandWidth: 7.4,
  transparent: true,
  autoRotate: -0.65,
  color: "#102f45"
};

function PortfolioBackground() {
  const [isProject, setIsProject] = useState(document.body.classList.contains("project-open"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsProject(document.body.classList.contains("project-open"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <ColorBends key={isProject ? "page" : "hero"} {...(isProject ? pageBackground : heroBackground)} className={isProject ? "is-muted" : ""} />;
}

const mount = document.querySelector("#colorbendsBackground");
if (mount) {
  createRoot(mount).render(<PortfolioBackground />);
}

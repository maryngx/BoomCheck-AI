import { useEffect } from "react";
import "./FloatingIconsBackground.css";

const ICONS = [
  "/assets/beaker-svgrepo-com.svg",
  "/assets/flask-svgrepo-com.svg",
  "/assets/sparkles-svgrepo-com.svg",
  "/assets/star-svgrepo-com (1).svg",
  "/assets/star-svgrepo-com.svg",
  "/assets/potion-svgrepo-com (1).svg",
  "/assets/potion-svgrepo-com.svg",
  "/assets/potion-heart-svgrepo-com.svg",
  // "/assets/dna-svgrepo-com (2)/svg",
  // "/assets/dna-svgrepo-com (1)/svg",
  // "/assets/dna-svgrepo-com/svg",
  // "/assets/heart-love-marriage-36-svgrepo-com/svg"
];

const generateGridIcons = (rows: number, cols: number) => {
    const elements = [];
    const total = rows * cols;
  
    for (let i = 0; i < total; i++) {
      const src = ICONS[i % ICONS.length];
  
      const row = Math.floor(i / cols);
      const col = i % cols;
  
      const top = `${row * (100 / rows) + Math.random() * 3 - 1.5}%`;
      const left = `${col * (100 / cols) + Math.random() * 3 - 1.5}%`;
  
      const delay = `${Math.random() * 10}s`;
      const duration = 25 + Math.random() * 20; // 25s–45s
  
      const size = 20 + Math.random() * 20;
  
      elements.push(
        <img
          key={i}
          src={src}
          alt="icon"
          className="floating-icon meteor"
          style={{
            top,
            left,
            width: `${size}px`,
            animationDelay: delay,
            animationDuration: `${duration}s`,
            filter: `drop-shadow(0 0 5px rgba(255,255,255,0.3))`,
          }}
        />
      );
    }
  
    return elements;
  };  
  
  const FloatingIconsBackground = () => {
    // Add just above return in FloatingIconsBackground component
    useEffect(() => {
        ICONS.forEach((src) => {
        const img = new Image();
        img.src = src;
        });
    }, []);
  
    return (
      <div className="floating-icons-wrapper">
        <div className="chemistry-gradient-bg" />
        <div className="floating-icons-container">
          {generateGridIcons(5, 6)}
        </div>
      </div>
    );
  };
  
  export default FloatingIconsBackground;

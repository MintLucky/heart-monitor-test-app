import React, { useEffect, useRef } from "react";
import "./HeartAnimation.css";

interface HeartAnimationProps {
  heartRate: number;
  color: string;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({
  heartRate,
  color,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Calculate animation duration based on heart rate
      // 60 / heartRate gives seconds per beat
      const beatDuration = 60 / heartRate;

      // Update animation
      const heart = svgRef.current;
      heart.style.setProperty("--beat-duration", `${beatDuration}s`);
      heart.style.fill = color;
    }
  }, [heartRate, color]);

  return (
    <div className="heart-animation">
      <svg
        ref={svgRef}
        viewBox="0 0 24 24"
        className="heart-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};

export default HeartAnimation;

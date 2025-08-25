import { useEffect, useState } from "react";

export default function AnimatedHand({
  fromIndex,
  toIndex,
  N,
  handRadius,
  centerX,
  centerY,
  color = "#f00",
  delay = 0,
}) {
  const [angle, setAngle] = useState(null);

  const calculateAngle = (pos) => (pos / N) * 2 * Math.PI - Math.PI / 2;

  useEffect(() => {
    // 🔑 When reset is pressed (null indices), clear the hand
    if (fromIndex === null || toIndex === null) {
      setAngle(null);
      return;
    }

    const fromAngle = calculateAngle(fromIndex);
    const toAngle = calculateAngle(toIndex);

    let start = null;
    const duration = 1000;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // ease in/out
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      const currentAngle = fromAngle + (toAngle - fromAngle) * eased;
      setAngle(currentAngle);

      if (progress < 1) requestAnimationFrame(step);
    };

    const timer = setTimeout(() => requestAnimationFrame(step), delay);
    return () => clearTimeout(timer);
  }, [fromIndex, toIndex, N, delay]);

  // 🔑 Don’t render anything if reset or no angle yet
  if (fromIndex === null || toIndex === null || angle === null) {
    return null;
  }

  const x = centerX + handRadius * Math.cos(angle);
  const y = centerY + handRadius * Math.sin(angle);

  return (
    <line
      x1={centerX}
      y1={centerY}
      x2={x}
      y2={y}
      stroke={color}
      strokeWidth={3}
    />
  );
}

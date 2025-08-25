import { useEffect, useState } from "react";

export default function AnimatedHand({
  fromIndex,
  toIndex,
  N,
  radius,
  centerX,
  centerY,
  color = "#f00",
}) {
  const [angle, setAngle] = useState(null);

  const calculateAngle = (pos) => (pos / N) * 2 * Math.PI - Math.PI / 2;

  useEffect(() => {
    if (fromIndex === null || toIndex === null) return;

    const fromAngle = calculateAngle(fromIndex);
    const toAngle = calculateAngle(toIndex);

    let start = null;
    const duration = 300; // ms

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);

      // optional easing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      const currentAngle = fromAngle + (toAngle - fromAngle) * eased;
      setAngle(currentAngle);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [fromIndex, toIndex, N]);

  if (angle === null) return null;

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  return <line x1={centerX} y1={centerY} x2={x} y2={y} stroke={color} strokeWidth={2} />;
}

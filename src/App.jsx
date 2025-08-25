import { useState } from "react";

export default function App() {
  const numbers = [2, 3, 2, 2, 2, 2]; // fixed puzzle
  const N = numbers.length;
  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  const [visited, setVisited] = useState([]);
  const [hands, setHands] = useState([null, null]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");

  const handleClick = (index) => {
    if ((sequence.length === 0 || hands.includes(index)) && !visited.includes(index)) {
      const k = numbers[index];
      const clockwise = (index + k) % N;
      const counterClockwise = (index - k + N) % N;

      const newHands = [clockwise, counterClockwise];
      const newVisited = [...visited, index];
      const newSequence = [...sequence, index];

      setHands(newHands);
      setVisited(newVisited);
      setSequence(newSequence);

      // Check for solved
      if (newVisited.length === N) {
        setMessage("🎉 Solved!");
        return;
      }

      // Check for game over: no valid moves left
      const remainingPositions = numbers
        .map((_, i) => i)
        .filter((i) => !newVisited.includes(i));
      const validNext = newHands.filter((h) => !newVisited.includes(h));
      if (validNext.length === 0 && remainingPositions.length > 0) {
        setMessage("❌ Game Over! Try Again.");
      } else {
        setMessage(""); // clear message if game is still playable
      }
    }
  };

  // valid positions for next move
  const validPositions =
    sequence.length === 0
      ? numbers.map((_, i) => i).filter((i) => !visited.includes(i))
      : hands.filter((i) => !visited.includes(i));

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Dual-Hand Circle Puzzle (Fixed Example)</h2>

      <svg width={400} height={400}>
        {numbers.map((num, i) => {
          const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          const isVisited = visited.includes(i);
          const isHand = hands.includes(i);
          const isValid = validPositions.includes(i);

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={20}
                fill={isVisited ? "#aaa" : isHand ? "#f00" : isValid ? "#0af" : "#666"}
                stroke="#000"
                strokeWidth={2}
                onClick={() => isValid && handleClick(i)}
                style={{ cursor: isValid ? "pointer" : "not-allowed" }}
              />
              <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="14">
                {num}
              </text>
            </g>
          );
        })}

        {hands.map((h, i) => {
          if (h === null) return null;
          const angle = (h / N) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return <line key={i} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#f00" strokeWidth={2} />;
        })}
      </svg>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            setVisited([]);
            setSequence([]);
            setHands([null, null]);
            setMessage("");
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>{message}</div>

      <div style={{ marginTop: "10px" }}>
        <strong>Sequence:</strong> {sequence.map((i) => i + 1).join(" → ")}
      </div>
    </div>
  );
}

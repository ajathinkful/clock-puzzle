import { useState, useEffect, useRef } from "react";
import AnimatedHand from "./AnimatedHand";

function generateSolvablePuzzle(N = 6) {
  let sequence = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - 0.5);
  const numbers = Array(N).fill(0);

  for (let i = 0; i < N; i++) {
    const current = sequence[i];
    const next = sequence[(i + 1) % N];
    const distRight = (next - current + N) % N;
    const distLeft = (current - next + N) % N;
    numbers[current] = Math.random() < 0.5 ? distRight : distLeft;
  }

  return { numbers, sequence, N };
}

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [N, setN] = useState(6);
  const [visited, setVisited] = useState([]);
  const [hands, setHands] = useState([null, null]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");
  const [solution, setSolution] = useState([]);

  const prevHands = useRef([null, null]);
  const radius = 150;
  const handRadius = 110;
  const centerX = 200;
  const centerY = 200;

  const newPuzzle = (size = 6) => {
    const puzzle = generateSolvablePuzzle(size);
    setNumbers(puzzle.numbers);
    setN(puzzle.N);
    setVisited([]);
    setSequence([]);
    setHands([null, null]);
    prevHands.current = [null, null];
    setMessage("");
    setSolution(puzzle.sequence);
  };

  useEffect(() => {
    newPuzzle(6);
  }, []);

  const handleClick = async (index) => {
    if (!visited.includes(index) && (sequence.length === 0 || hands.includes(index))) {
      const k = numbers[index];
      const clockwise = (index + k) % N;
      const counterClockwise = (index - k + N) % N;

      const prevRed = prevHands.current[0] !== null ? prevHands.current[0] : index;
      const prevBlue = prevHands.current[1] !== null ? prevHands.current[1] : index;

      // Step 1: snap the opposite hand to clicked position
      if (hands[0] !== index && hands[1] !== index) {
        // Determine which hand was not used (pick the closer? simplest: blue)
        setHands([index, index]);
        await new Promise((resolve) => setTimeout(resolve, 500)); // wait for snap animation
      }

      prevHands.current = [index, index]; // update prevHands after snap

      // Step 2: move both hands outward from clicked position
      setHands([clockwise, counterClockwise]);

      const newVisited = [...visited, index];
      const newSequence = [...sequence, index];
      setVisited(newVisited);
      setSequence(newSequence);

      // Check solved
      if (newVisited.length === N) {
        setMessage("🎉 Solved!");
        return;
      }

      // Check game over
      const remainingPositions = numbers.map((_, i) => i).filter((i) => !newVisited.includes(i));
      const validNext = [clockwise, counterClockwise].filter((h) => !newVisited.includes(h));
      if (validNext.length === 0 && remainingPositions.length > 0) {
        setMessage("❌ Game Over! Try Again.");
      } else {
        setMessage("");
      }
    }
  };

  const validPositions =
    sequence.length === 0
      ? numbers.map((_, i) => i).filter((i) => !visited.includes(i))
      : hands.filter((i) => !visited.includes(i));

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Dual-Hand Circle Puzzle</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => newPuzzle(6)} style={{ marginRight: "5px" }}>Easy</button>
        <button onClick={() => newPuzzle(9)} style={{ marginRight: "5px" }}>Medium</button>
        <button onClick={() => newPuzzle(12)}>Hard</button>
      </div>

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

        <AnimatedHand
          fromIndex={prevHands.current[0]}
          toIndex={hands[0]}
          N={N}
          handRadius={handRadius}
          centerX={centerX}
          centerY={centerY}
          color="#f00"
          direction="clockwise"
        />
        <AnimatedHand
          fromIndex={prevHands.current[1]}
          toIndex={hands[1]}
          N={N}
          handRadius={handRadius}
          centerX={centerX}
          centerY={centerY}
          color="#00f"
          direction="anticlockwise"
        />
      </svg>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            setVisited([]);
            setSequence([]);
            setHands([null, null]);
            prevHands.current = [null, null];
            setMessage("");
          }}
          style={{ marginRight: "10px" }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            setMessage("💡 Solution: " + solution.map((i) => i + 1).join(" → "));
          }}
        >
          Solve
        </button>
      </div>

      <div style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>{message}</div>

      <div style={{ marginTop: "10px" }}>
        <strong>Sequence:</strong> {sequence.map((i) => i + 1).join(" → ")}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

// Solvable puzzle generator
function generatePuzzle(difficulty = "easy") {
  let N, minNum, maxNum;
  if (difficulty === "easy") {
    N = 6;
    minNum = 1;
    maxNum = 3;
  } else if (difficulty === "medium") {
    N = Math.floor(Math.random() * 3) + 8; // 8–10
    minNum = 1;
    maxNum = 5;
  } else if (difficulty === "hard") {
    N = 12;
    minNum = 1;
    maxNum = 6;
  }

  // Step 1: random solution sequence
  let sequence = Array.from({ length: N }, (_, i) => i).sort(() => Math.random() - 0.5);

  // Step 2: assign numbers to match the sequence
  const numbers = Array(N).fill(0);
  for (let i = 0; i < N; i++) {
    const current = sequence[i];
    const next = sequence[(i + 1) % N];
    let k = (next - current + N) % N;
    if (k < minNum || k > maxNum) {
      k = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }
    numbers[current] = k;
  }

  return { numbers, N };
}

export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [N, setN] = useState(6);
  const [visited, setVisited] = useState([]);
  const [hands, setHands] = useState([null, null]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");

  const radius = 150;
  const centerX = 200;
  const centerY = 200;

  // Generate new puzzle
  const newPuzzle = (difficulty = "easy") => {
    const puzzle = generatePuzzle(difficulty);
    setNumbers(puzzle.numbers);
    setN(puzzle.N);
    setVisited([]);
    setSequence([]);
    setHands([null, null]);
    setMessage("");
  };

  useEffect(() => {
    newPuzzle("easy"); // initialize first puzzle
  }, []);

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
      const remainingPositions = numbers.map((_, i) => i).filter((i) => !newVisited.includes(i));
      const validNext = newHands.filter((h) => !newVisited.includes(h));
      if (validNext.length === 0 && remainingPositions.length > 0) {
        setMessage("❌ Game Over! Try Again.");
      } else {
        setMessage("");
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
      <h2>Dual-Hand Circle Puzzle</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => newPuzzle("easy")} style={{ marginRight: "5px" }}>Easy</button>
        <button onClick={() => newPuzzle("medium")} style={{ marginRight: "5px" }}>Medium</button>
        <button onClick={() => newPuzzle("hard")}>Hard</button>
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

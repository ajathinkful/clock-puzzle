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

export default function TimeTrialPlusStrict() {
  const puzzleSizes = [6, 6, 9, 9, 12, 12];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [N, setN] = useState(6);
  const [visited, setVisited] = useState([]);
  const [hands, setHands] = useState([null, null]);
  const [sequence, setSequence] = useState([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerRunning, setTimerRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const prevHands = useRef([null, null]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const radius = 150;
  const handRadius = 110;
  const centerX = 200;
  const centerY = 200;

  const getTimeForSize = (size) => {
    if (size <= 6) return 10;
    if (size <= 9) return 20;
    return 30;
  };

  const initPuzzle = (index = currentIndex) => {
    const size = puzzleSizes[index];
    const puzzle = generateSolvablePuzzle(size);
    setNumbers(puzzle.numbers);
    setN(puzzle.N);
    setVisited([]);
    setSequence([]);
    setHands([null, null]);
    prevHands.current = [null, null];
    setMessage("");
    setTimeLeft(getTimeForSize(size));
    setTimerRunning(false);
    setGameOver(false);
    startTimeRef.current = null;
    cancelAnimationFrame(timerRef.current);
  };

  const initGame = () => {
    setCurrentIndex(0);
    initPuzzle(0);
  };

  useEffect(() => {
    initPuzzle();
  }, [currentIndex]);

  useEffect(() => {
    if (!timerRunning || gameOver) return;

    const totalTime = getTimeForSize(puzzleSizes[currentIndex]);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const remaining = Math.max(totalTime - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        setMessage("❌ Game Over! Time's up. Press Reset to restart from Level 1.");
        setGameOver(true);
        setTimerRunning(false);
        return;
      }

      if (!message.includes("Solved")) {
        timerRef.current = requestAnimationFrame(animate);
      }
    };

    timerRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(timerRef.current);
  }, [timerRunning, currentIndex, message, gameOver]);

  const handleClick = async (index) => {
    if (!timerRunning) setTimerRunning(true);
    if (timeLeft <= 0 || message.includes("Solved") || gameOver) return;

    if (!visited.includes(index) && (sequence.length === 0 || hands.includes(index))) {
      const k = numbers[index];
      const clockwise = (index + k) % N;
      const counterClockwise = (index - k + N) % N;

      if (hands[0] !== index && hands[1] !== index) {
        setHands([index, index]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      prevHands.current = [index, index];
      setHands([clockwise, counterClockwise]);

      const newVisited = [...visited, index];
      const newSequence = [...sequence, index];
      setVisited(newVisited);
      setSequence(newSequence);

      if (newVisited.length === N) {
        setMessage("🎉 Solved!");
        setTimerRunning(false);
        return;
      }

      const remainingPositions = numbers.map((_, i) => i).filter((i) => !newVisited.includes(i));
      const validNext = [clockwise, counterClockwise].filter((h) => !newVisited.includes(h));

      if (validNext.length === 0 && remainingPositions.length > 0) {
        setMessage("❌ Game Over! No valid moves. Press Reset to restart from Level 1.");
        setGameOver(true);
        setTimerRunning(false);
      } else {
        setMessage("");
      }
    }
  };

  const validPositions =
    sequence.length === 0
      ? numbers.map((_, i) => i).filter((i) => !visited.includes(i))
      : hands.filter((i) => !visited.includes(i));

  let handColorRed = "#f00";
  let handColorBlue = "#00f";
  if (message.includes("Solved")) {
    handColorRed = handColorBlue = "green";
  } else if (gameOver || timeLeft <= 0) {
    handColorRed = handColorBlue = "grey";
  }

  const nextPuzzle = () => {
    if (currentIndex < puzzleSizes.length - 1) setCurrentIndex(currentIndex + 1);
    else setMessage("🏁 All puzzles completed!");
  };

  const totalTime = getTimeForSize(puzzleSizes[currentIndex]);
  const progressAngle = (timeLeft / totalTime) * 360;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Time Trial ++ Hard Mode ({currentIndex + 1} / {puzzleSizes.length})</h2>

      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `conic-gradient(green 0deg ${progressAngle}deg, #ccc ${progressAngle}deg 360deg)`,
          margin: "20px auto",
        }}
      />

      <svg width={400} height={400}  style={{
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    touchAction: "manipulation",
  }}>
        {numbers.map((num, i) => {
          const angle = (i / N) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isVisited = visited.includes(i);
          const isHand = hands.includes(i);
          const isValid = validPositions.includes(i) && timeLeft > 0 && !gameOver;

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
              <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="14" pointerEvents="none">{num}</text>
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
          color={handColorRed}
          direction="clockwise"
        />
        <AnimatedHand
          fromIndex={prevHands.current[1]}
          toIndex={hands[1]}
          N={N}
          handRadius={handRadius}
          centerX={centerX}
          centerY={centerY}
          color={handColorBlue}
          direction="anticlockwise"
        />
      </svg>

      <div style={{ marginTop: "20px" }}>
        {gameOver && (
          <button onClick={initGame} style={{ marginRight: "10px" }}>
            Reset Game (Level 1)
          </button>
        )}
        {message.includes("Solved") && !gameOver && (
          <button onClick={nextPuzzle}>Next Puzzle</button>
        )}
      </div>

      <div style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>{message}</div>
      <div style={{ marginTop: "10px" }}>
        <strong>Sequence:</strong> {sequence.map((i) => i + 1).join(" → ")}
      </div>
    </div>
  );
}

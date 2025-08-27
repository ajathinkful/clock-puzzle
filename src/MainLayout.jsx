// MainLayout.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App"; // main puzzle component
import TimeTrial from "./TimeTrial";

export default function MainLayout() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/">Main Puzzle</Link> | <Link to="/timetrial">Time Trial</Link>
      </div>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/timetrial" element={<TimeTrial />} />
      </Routes>
    </Router>
  );
}

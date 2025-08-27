import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import TimeTrial from "./TimeTrial";
import TimeTrialPlus from "./TimeTrialPlus";
import TimeTrialPlusStrict from "./TimeTrialPlusStrict";

export default function MainLayout() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/">Main Puzzle</Link> | <Link to="/timetrial">Time Trial</Link> | <Link to="/timetrialplus">Time Trial+</Link> | <Link to="/timetrialplusplus">Time Trial++</Link>
      </div>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/timetrial" element={<TimeTrial />} />
        <Route path="/timetrialplus" element={<TimeTrialPlus />} />
        <Route path="/timetrialplusplus" element={<TimeTrialPlusStrict />} />
      </Routes>
    </Router>
  );
}

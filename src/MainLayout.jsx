import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from "./App";
import TimeTrial from "./TimeTrial";
import TimeTrialPlus from "./TimeTrialPlus";
import TimeTrialPlusStrict from "./TimeTrialPlusStrict";
import Instructions from "./Instructions";



export default function MainLayout() {
  return (

    

    <Router>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1>Dual-Hand Circle Puzzle</h1>

        <details style={{ maxWidth: "600px", margin: "0 auto 20px" }}>
  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
    🧠 How to Play
  </summary>
  <Instructions />
</details>

        

        <p style={{ fontSize: "14px", color: "#7580e6ff", maxWidth: "600px", marginTop: "8px" }}>
          If you had fun (or if this brought back some painful memories from one of
          your favorite video games 😅) please consider supporting me. Thank you! 😊
        </p>

        <a
          href="https://buymeacoffee.com/ajathinkful"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "8px",
            padding: "8px 14px",
            background: "#ffdd00",
            color: "#000",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ☕ Buy Me a Coffee
        </a>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px", fontSize: "14px", color: "#e72b7aff" }}>
  Reach out to me here if you want to connect:{" "}
   <a
    href="mailto:jimmyappleturkey@gmail.com"
    className="email-link"
  >
    jimmyappleturkey@gmail.com
  </a>
  <style>
    {`
      .email-link {
        color: #7580e6;
        text-decoration: none;
        transition: color 0.3s;
      }
      .email-link:hover {
        color: #0df020ff; /* Change to whatever hover color you like */
      }
    `}
  </style>
</div>


      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Link to="/">Main Puzzle</Link> |
         <Link to="/timetrial"> Time Trial</Link> |
          <Link to="/timetrialplus"> Time Trial+</Link> |
           <Link to="/timetrialplusplus"> Time Trial++</Link>
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

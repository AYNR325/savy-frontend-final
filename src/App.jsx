import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CameraPage from "./CameraPage";
import Page1 from "./Page1";
// import AboutPage from "./AboutPage";
import "./App.css"; // Ensure this file exists
import ObjectFinder from "./ObjectFinder";
import AIHealthAssistant from "./AIHealthAssistant";
// import InjuryDetection from "./InjuryDetection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/page1" element={<Page1 />} />
        {/* <Route path="/aboutpage" element={<AboutPage />} /> */}
        <Route path="/ObjectFinder" element={<ObjectFinder />} />
        <Route path="/AIHealthAssistant" element={<AIHealthAssistant />} />
        {/* <Route path="/injurydetection" element={<InjuryDetection />} /> */}
      </Routes>
    </Router>
  );
}

export default App;


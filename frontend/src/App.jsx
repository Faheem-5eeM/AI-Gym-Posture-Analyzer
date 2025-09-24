import "./App.css";
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Analyze from "./pages/Analyze";
import HowItWorks from "./components/ui/HowItWorks";
import SplashCursor from './SplashCursor'; // 1. Import the component

function App() {
  return (
    <main className="min-h-screen text-center flex flex-col gap-10 items-center">
      <SplashCursor /> {/* 2. Add the component here */}
      
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </main>
  );
}

export default App;
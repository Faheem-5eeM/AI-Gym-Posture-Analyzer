import { ListCheck, Camera, TrendingUp } from "lucide-react";
import { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function HowItWorks() {
  // 1. Particle initialization logic
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // 2. Particle configuration options
  const particleOptions = {
    fullScreen: { enable: false },
    particles: {
      number: {
        value: 15,
        density: { enable: true, area: 800 },
      },
      color: "#cfb498",
      shape: {
        type: "image",
        image: [
          {
            src: "/dumbbell.svg", // Ensure dumbbell.svg is in your public folder
            width: 26,
            height: 26,
          },
        ],
      },
      opacity: { value: 0.8 },
      size: {
        value: 8,
        random: { enable: true, minimumValue: 23 },
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: { default: "bounce" },
      },
    },
    detectRetina: true,
  };

  return (
    // 3. Set main container to 'relative'
    <div id="how-it-works" className="relative w-full py-8">
      <Particles
        id="tsparticles-howitworks" // Unique ID for this instance
        init={particlesInit}
        options={particleOptions}
        className="absolute top-0 left-0 w-full h-full z-[0]" // Positioned in the background
      />
      
      {/* 4. Wrapped content with a higher z-index */}
      <div className="relative z-10">
        <h2 className="text-[#cfb498] text-3xl m-4 p-4 text-center">How It Works</h2>
        <div className="md:flex md:flex-row md:justify-center md:items-center">
          {/* Added bg-white to cards and darkened text for readability */}
          <div className="bg-white border-2 shadow-md hover:shadow-lg hover:shadow-gray-500/50 border-white rounded-lg p-3 m-7 mt-1 md:m-4 text-[#cfb498]">
            <span className="flex flex-row items-center justify-center">
              <div className="bg-[#cfb498] rounded-lg p-1">
                <ListCheck size={35} color="white" />
              </div>
              <p className="p-3 m-3 text-xl"> Choose Your Workout</p>
            </span>
            <p className="text-left text-gray-600 italic">
              Select an exercise to analyze.
            </p>
          </div>
          <div className="bg-white border-2 shadow-md hover:shadow-lg hover:shadow-gray-500/50 border-white rounded-lg p-3 m-7 md:m-4 text-[#cfb498]">
            <span className="flex flex-row items-center justify-center ml-1">
              <div className="bg-[#cfb498] rounded-lg p-1 ">
                <Camera size={35} color="white" />
              </div>
              <p className="p-3 m-3 text-xl"> Start Your Webcam</p>
            </span>
            <p className="text-left text-gray-600 italic">
              Enable your camera to begin tracking.
            </p>
          </div>
          <div className="bg-white border-2 shadow-md hover:shadow-lg hover:shadow-gray-500/50 border-white rounded-lg p-3 m-7 md:m-4 text-[#cfb498]">
            <span className="flex flex-row items-center justify-center">
              <div className="bg-[#cfb498] rounded-lg p-1">
                <TrendingUp size={35} color="white" />
              </div>
              <p className="p-3 m-3 text-xl"> Get Instant Feedback</p>
            </span>
            <p className="text-left text-gray-600 italic">
              See live tips and accuracy for each rep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
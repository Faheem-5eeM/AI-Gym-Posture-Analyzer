import { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function ExerciseList() {
  // 1. Copied particle initialization logic from your Hero component
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // 2. Copied particle configuration from your Hero component
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
    // 3. Set the main container to 'relative' to contain the particles
    <div className="relative py-8">
      <Particles
        id="tsparticles-exerciselist" // Gave it a unique ID
        init={particlesInit}
        options={particleOptions}
        className="absolute top-0 left-0 w-full h-full z-[0]" // Positioned particles in the background
      />

      {/* 4. Wrapped your content and gave it a higher z-index to appear on top */}
      <div className="relative z-10">
        <h2 className="text-[#cfb498] text-3xl m-4 p-4 text-center">
          Analyze A Wide Range Of Exercises
        </h2>
        <div className="md:flex md:flex-row md:justify-center md:items-center">
          <div className="flex items-center justify-center">
            {/* Added bg-white to cards and changed text to black for better readability */}
            <div className="bg-white border-2 border-white rounded-lg p-3 m-7 mt-1 md:m-4 mb-2 hover:cursor-pointer shadow-md hover:shadow-lg hover:shadow-gray-500/50 h-65 w-75">
              <div className="h-40 w-full bg-[url('/pushup-exercise.jpg')] bg-cover bg-center" />
              <p className="text-xl text-left text-black">Push Ups</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white border-2 border-white rounded-lg p-3 m-7 mt-10 md:m-4 mb-2 hover:cursor-pointer shadow-md hover:shadow-lg hover:shadow-gray-500/50 h-65 w-75">
              <div className="h-40 bg-[url('/squat-exercise.jpg')] bg-cover bg-center" />
              <p className="text-xl text-left text-black">Squats</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white border-2 border-white rounded-lg p-3 m-4 mt-10 md:m-4 mb-2 hover:cursor-pointer shadow-md hover:shadow-lg hover:shadow-gray-500/50 h-65 w-75">
              <div className="h-40 w-full bg-[url('/bicepCurls-exercise.png')] bg-cover bg-center" />
              <p className="text-xl text-left text-black">Bicep Curls</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white border-2 border-white rounded-lg p-3 m-7 mt-10 md:m-4 mb-2 hover:cursor-pointer shadow-md hover:shadow-lg hover:shadow-gray-500/50 h-65 w-75">
              <div className="h-40 w-full bg-[url('/shoulderPress-exercise.jpg')] bg-cover bg-center" />
              <p className="text-xl text-left text-black">Shoulder Press</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExerciseList;
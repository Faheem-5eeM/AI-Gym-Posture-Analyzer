import { ListCheck, Camera, TrendingUp } from "lucide-react";

function HowItWorks() {
  return (
    <div>
      <h2 className="text-white text-3xl m-4 p-4 ">How It Works</h2>
      <div className="md:flex md:flex-row md:justify-center md:items-center">
        <div className="border-2  border-white rounded-lg p-3 m-7 mt-1 md:m-4 text-white ">
          <span className="flex flex-row items-center justify-center">
            <div className="bg-[#cfb498] rounded-lg p-1">
              <ListCheck className=" " size={35} color="white" />
            </div>
            <p className="p-3 m-3 text-xl"> Choose Your Workout</p>
          </span>
          <p className="text-left text-gray-300 italic">
            Select an exercise to analyze.
          </p>
        </div>
        <div className="border-2  border-white rounded-lg p-3 m-7 md:m-4 text-white ">
          <span className="flex flex-row items-center justify-center ml-1">
            <div className="bg-[#cfb498] rounded-lg p-1 ">
              <Camera className=" " size={35} color="white" />
            </div>
            <p className="p-3 m-3 text-xl"> Start Your Webcam</p>
          </span>
          <p className="text-left text-gray-300 italic">
            Enable your camera to begin tracking.
          </p>
        </div>
        <div className="border-2  border-white rounded-lg p-3 m-7 md:m-4 text-white ">
          <span className="flex flex-row items-center justify-center">
            <div className="bg-[#cfb498] rounded-lg p-1">
              <TrendingUp className=" " size={35} color="white" />
            </div>
            <p className="p-3 m-3 text-xl"> Get Instant Feedback</p>
          </span>
          <p className="text-left text-gray-300 italic">
            See live tips and accuracy for each rep.
          </p>
        </div>
      </div>
    </div>
  );
}
export default HowItWorks;

import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="">
      // Header Section
      <div className=" ">
        <h1 className="text-white text-5xl">WELCOME TO FORM AI</h1>
      </div>
      // Demo Video
      <div className="md:flex md:flex-row md:justify-center md:items-center  ">
        <div className="border-3 border-white rounded-lg p-3 m-4 md:ml-19 mt-10 mb-2 hover:cursor-pointer hover:bg-orange-500 hover:text-white text-black h-70 md:w-250">
          <video src=""></video>
        </div>
        // Description Section
        <div>
          <p className="text-white text-xl m-3 md:text-left">
            Can't afford a personal trainer? No worries, we've got you covered!
            Our AI-powered personal trainer is here to help you achieve your
            fitness goals with personalized workout plans, real-time feedback on
            your form, and progress tracking.
          </p>
          <Link to="/analyze">
            <button className="text-white border-2 hover:cursor-pointer bg-[#cfb498] p-3 rounded-3xl mt-4 md:flex">
              Try Now!
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Hero;

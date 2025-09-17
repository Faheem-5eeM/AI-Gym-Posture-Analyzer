import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="h-screen">
      // Header Section
      <div className=" ">
        <h1 className="text-white text-3xl md:text-6xl md:mt-20 md:mb-20">WELCOME TO FORM AI</h1>
      </div>
      // Demo Video
      <div className="flex flex-col items-center justify-center md:flex-row md:justify-center md:items-center  ">
        <div className="md:flex md:flex-col items-center justify-center">
          <div className="border-2 border-white rounded-lg p-3 m-4 md:ml-19 mt-10 mb-2   hover:text-white text-black h-70 md:h-90 md:w-150">
            <video src="/demo-video.mp4" loop muted autoPlay className="fit-cover"></video>
          </div>
          <p className="text-gray-300 text-md italic md:text-2xl text-center md:ml-14">Demo Video</p>
        </div>
        // Description Section
        <div className="mb-30">
          <p className="text-white text-xl m-3 md:text-left">
            Can't afford a personal trainer? No worries, we've got you covered!
            Our AI-powered personal trainer is here to help you achieve your
            fitness goals with personalized workout plans, real-time feedback on
            your form, and progress tracking.
          </p>
          <p className="hidden md:block text-white text-xl m-3 md:text-left">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut explicabo rem dignissimos atque molestias perspiciatis nisi saepe assumenda, minima in, quos distinctio, maiores inventore dolor facere dolorum quia corrupti nesciunt!
          </p>
          <div className="flex justify-center items-center md:justify-start focus:none">
            <Link
              to="/analyze"
              className="text-white focus:none border-2 hover:cursor-pointer bg-[#cfb498] p-3 rounded-3xl mt-9 md:flex w-fit"
            >
              Try Now!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Hero;

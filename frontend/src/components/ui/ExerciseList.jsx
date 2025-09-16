function ExerciseList() {
  return (
    <div className="">
      <h2 className="text-white text-3xl m-4 p-4 ">
        Analyze a wide range exercises
      </h2>
      <div className="md:flex md:flex-row md:justify-center md:items-center">
        <div>
          <div className="border-2 border-white rounded-lg p-3 m-7 mt-1 md:m-4 mb-2 hover:cursor-pointer hover:bg-orange-500 hover:text-white text-white h-70 ">
            <img src="" alt="person doing push ups" />
            <p className="text-xl text-left">Push Ups</p>
          </div>
        </div>
        <div>
          <div className="border-2 border-white rounded-lg p-3 m-7 mt-10 md:m-4 mb-2 hover:cursor-pointer hover:bg-orange-500 hover:text-white text-white h-70 ">
            <img src="" alt="person doing squats" />
            <p className="text-xl text-left">Squats</p>
          </div>
        </div>
        <div>
          <div className="border-2 border-white rounded-lg p-3 m-7 mt-10 md:m-4 mb-2 hover:cursor-pointer hover:bg-orange-500 hover:text-white text-white h-70 ">
            <img src="" alt="person doing bicep curls" />
            <p className="text-xl text-left">Bicep Curls</p>
          </div>
        </div>
        <div>
          <div className="border-2 border-white rounded-lg p-3 m-7 mt-10 md:m-4 mb-2 hover:cursor-pointer hover:bg-orange-500 hover:text-white text-white h-70 ">
            <img src="" alt="person doing shoulder press" />
            <p className="text-xl text-left">Shoulder Press</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExerciseList;

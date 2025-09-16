import Hero from "../components/Hero";
import Navbar from "../components/ui/Navbar";
import ExerciseList from "../components/ui/ExerciseList";
import HowItWorks from "../components/ui/HowItWorks";

function Landing() {
  return (
    <div className="w-full">
      <Navbar />
      <div className="m-18" />
      <Hero />
      <ExerciseList />
      <HowItWorks />
    </div>
  );
}
export default Landing;

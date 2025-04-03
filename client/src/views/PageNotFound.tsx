import FuzzyText from "@/components/FuzzyText"
import { useNavigate } from "react-router-dom"

export const PageNotFound = () => {
  const navigate = useNavigate();

  const handleLoginNavigate = () => {
    navigate("/login");
  };

  return(
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white text-3xl font-bold mb-4">Skill Garage</h1>
      <FuzzyText
        fontSize={100}
        fontWeight={700}
        fontFamily="Arial"
        color="white"
        baseIntensity={0.1}
        hoverIntensity={0.3}
        enableHover={true}
        children="404"
      />
      <button 
        onClick={handleLoginNavigate}
        className="mt-8 px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </button>
    </div>
    </>
  )
}
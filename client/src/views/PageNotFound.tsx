import FuzzyText from "@/components/FuzzyText"

export const PageNotFound = () => {

  return(
    <>
    <div className="flex flex-col items-center justify-center h-screen bg-black">
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
    </div>
    </>
  )
}
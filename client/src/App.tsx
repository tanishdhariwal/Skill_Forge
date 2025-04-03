import "./App.css";
import FuzzyText from "./views/PageNotFound";
function App() {
  return (
    <>
      <FuzzyText
        fontSize={100}
        fontWeight={700}
        fontFamily="Arial"
        color="black"
        baseIntensity={0.5}
        hoverIntensity={1}
        enableHover={true}
        children="404"
      />
    </>
  );
}

export default App;

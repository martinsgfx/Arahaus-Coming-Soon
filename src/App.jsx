import { NavBar } from "./Components/NavBar";
import mobileBg from "./assets/mobile-bg-1.png";
import webBg from "./assets/web-bg-1.png";
import TextAnimator from "./Components/TextAnimator";

function App() {
  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; }
        @media (max-width: 1023px) {
          .app-bg { background-image: url(${mobileBg}); }
        }
        @media (min-width: 1024px) {
          .app-bg { background-image: url(${webBg}); }
        }
      `}</style>
      <div className="app-bg relative bg-fixed bg-no-repeat overflow-hidden bg-cover min-h-screen px-6 py-18 lg:px-24">
        <div className="relative z-50">
          <NavBar />
        </div>
        <TextAnimator />
      </div>
    </>
  );
}

export default App;

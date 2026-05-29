import { useState } from "react";
import { NavBar } from "./Components/NavBar";
import mobileBg from "./assets/mobile-bg-1.png";
import webBg from "./assets/web-bg-1.png";
import waitMobileBg from "./assets/wait-mobile-bg.png";
import waitBg from "./assets/wait-bg.png";
import TextAnimator from "./Components/TextAnimator";
import { Wait } from "./Components/Wait";
import {Helmet} from "react-helmet-async";
import ComingSoon from "./Components/ComingSoon";

function App() {
  const [showWait, setShowWait] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <>
      <Helmet>
        <title>Arahaus</title>
        <meta property="og:title" content="Arahaus" />
        <meta property="og:description" content="Your site description here" />
        <meta property="og:image" content="https://arahaus.com/og-image.jpg" />
        <meta property="og:url" content="https://arahaus.com" />
      </Helmet>
      <style>{`
        html, body { margin: 0; padding: 0; overflow: hidden; }
        @media (max-width: 1023px) {
          .base-bg { background-image: url(${mobileBg}); }
          .wait-bg { background-image: url(${waitMobileBg}); }
        }
        @media (min-width: 1024px) {
          .base-bg { background-image: url(${webBg}); }
          .wait-bg { background-image: url(${waitBg}); }
        }
      `}</style>
      <div
        className={`relative mx-0 overflow-hidden min-h-screen ${showComingSoon ? "bg-white" : ""}`}
      >
        <div
          className="base-bg absolute inset-0 bg-fixed bg-no-repeat bg-cover transition-opacity duration-700"
          style={{ opacity: showWait ? 0 : 1 }}
        />
        <div
          className="wait-bg absolute inset-0 bg-fixed bg-no-repeat bg-cover transition-opacity duration-700"
          style={{ opacity: showWait && !showComingSoon ? 1 : 0 }}
        />

        <div className="relative z-50 px-6 py-9 lg:py-18 lg:px-24">
          <NavBar />
        </div>
        {!showWait && <TextAnimator onComplete={() => setShowWait(true)} />}
        {showWait && !showComingSoon && (
          <Wait onComplete={() => setShowComingSoon(true)} />
        )}
        {showComingSoon && <ComingSoon />}
      </div>
    </>
  );
}

export default App;

import { useState, useEffect } from "react";
import artplate from "../assets/artplate.png";
import pen from "../assets/pen.png";
import brush from "../assets/brush.png";
import palette from "../assets/palette.png";
import ruler from "../assets/ruler.png";
import pencil from "../assets/pencil.png";
import ink from "../assets/ink.png";
import pencilsCup from "../assets/pencils-cup.png";
import arrowCursor from "../assets/arrow-cursor.png";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

// SVG path that draws the organic blob shape
const BLOB_PATH =
  "M71.6046 42.3019C68.1659 45.5496 65.4276 48.4152 63.3899 50.8987C61.3521 53.3822 60.97 58.0945 62.2436 65.0357C63.5172 71.9768 61.6068 75.4155 56.5124 75.3518C51.418 75.2882 46.833 74.3011 42.7575 72.3907C38.682 70.4803 35.2114 68.5699 32.3458 66.6595C29.4802 64.7491 25.0226 65.5451 18.973 69.0475C12.9234 72.5499 8.02002 72.741 4.26289 69.6206C0.505767 66.5003 -0.767835 62.2019 0.442087 56.7254C1.65201 51.2489 3.84897 46.664 7.03298 42.9705C10.217 39.2771 10.8856 35.7747 9.0389 32.4633C7.19218 29.1519 6.4917 25.6495 6.93746 21.9561C7.38322 18.2626 9.45282 15.7791 13.1463 14.5055C16.8397 13.2319 19.4824 9.95239 21.0744 4.66694C22.6664 -0.61851 25.6594 -1.41451 30.0533 2.27893C34.4473 5.97238 37.9815 8.67878 40.6561 10.3981C43.3306 12.1175 46.833 12.2449 51.1633 10.7802C55.4935 9.31559 58.9641 9.88871 61.575 12.4996C64.1859 15.1105 66.7331 17.9442 69.2166 21.0009C71.7001 24.0575 73.5787 27.5599 74.8523 31.5081C76.1259 35.4563 75.0433 39.0542 71.6046 42.3019Z";

// The three phrases typed out in order
const PHRASE1 = "Can you make it pop?";
const PHRASE2 = "Maybe a softer color?";
const PHRASE3 = "That's starting to look good!";
const INITIAL_SLIDER_HUE = 300;
const FINAL_SLIDER_HUE = 61;
const SLIDER_SATURATION = 70;
const SLIDER_LIGHTNESS = 75;
const FADE_OUT_DELAY_MS = 1500;
const FADE_OUT_DURATION_MS = 2000;

// How fast each character is typed (in milliseconds)
const TYPE_SPEED = 75;

// ─────────────────────────────────────────────
// ANIMATION STAGES (in order)
// ─────────────────────────────────────────────
// "typing1"   → types PHRASE1 into the search bar
// "showBlobs" → 3 color blobs appear below the bar
// "blobGrow"  → pink blob expands to fill the screen
// "typing2"   → types PHRASE2 into the search bar
// "slider"    → color slider auto-animates, blob color changes
// "typing3"   → types PHRASE3 into the search bar
// "done"      → animation complete, everything stays still

// ─────────────────────────────────────────────
// HELPER: converts HSL color values to a hex color string
// used to update the blob color as the slider moves
// h = hue (0-360), s = saturation (0-100), l = lightness (0-100)
// ─────────────────────────────────────────────
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function TextAnimator({ onComplete }) {
  // Tracks which stage of the animation we're in
  const [stage, setStage] = useState("typing1");

  // The text currently shown inside the search bar (builds up letter by letter)
  const [displayed, setDisplayed] = useState("");

  // Whether the 3 small blobs are visible below the search bar
  const [blobsVisible, setBlobsVisible] = useState(false);

  // The current fill color of the main blob (starts pink, changes with slider)
  const [blobColor, setBlobColor] = useState(
    hslToHex(INITIAL_SLIDER_HUE, SLIDER_SATURATION, SLIDER_LIGHTNESS)
  );

  // Whether the blob has expanded to fill most of the screen
  const [blobFullscreen, setBlobFullscreen] = useState(false);

  // Whether the color slider is visible below the search bar
  const [sliderVisible, setSliderVisible] = useState(false);

  // The current hue value of the slider (300 = pink/purple, ~61 = yellow-green)
  const [sliderHue, setSliderHue] = useState(INITIAL_SLIDER_HUE);

  // Animation trigger for palette during typing2 stage
  const [animatePalette, setAnimatePalette] = useState(false);

  // Controls final full-scene fade out after all animation stages finish
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Keeps fullscreen blob proportionate on larger displays.
  const [fullscreenBlobScale, setFullscreenBlobScale] = useState(() => {
    const viewportWidth = window.innerWidth;
    const widthFactor = Math.min(Math.max(viewportWidth / 1920, 1), 1.45);
    return 23 * widthFactor;
  });

  // Which phrase to show based on the current stage
  const currentPhrase =
    stage === "typing1"
      ? PHRASE1
      : stage === "typing2"
        ? PHRASE2
        : stage === "typing3"
          ? PHRASE3
          : "";

  // ─────────────────────────────────────────────
  // EFFECT: Typewriter — adds one character at a time
  // Runs whenever `displayed`, `stage`, or `currentPhrase` changes
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!["typing1", "typing2", "typing3"].includes(stage)) return;

    if (displayed.length < currentPhrase.length) {
      // Still typing — add the next character after TYPE_SPEED ms
      const t = setTimeout(() => {
        setDisplayed(currentPhrase.slice(0, displayed.length + 1));
      }, TYPE_SPEED);
      return () => clearTimeout(t);
    } else {
      // Finished typing this phrase — move to next stage after a short pause
      if (stage === "typing1") {
        const t = setTimeout(() => {
          setBlobsVisible(true); // show the 3 blobs
          setStage("showBlobs");
        }, 900);
        return () => clearTimeout(t);
      }
      if (stage === "typing2") {
        const t = setTimeout(() => {
          setSliderVisible(true); // show the color slider
          setStage("slider");
        }, 900);
        return () => clearTimeout(t);
      }
      if (stage === "typing3") {
        setStage("done"); // animation is finished
      }
    }
  }, [displayed, stage, currentPhrase]);

  // ─────────────────────────────────────────────
  // EFFECT: Auto-expand the pink blob after it appears
  // Waits 1.5s then triggers the blob to grow
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "showBlobs") return;
    const t = setTimeout(() => {
      setBlobFullscreen(true); // triggers the CSS scale transform
      setStage("blobGrow");
    }, 1500);
    return () => clearTimeout(t);
  }, [stage]);

  // ─────────────────────────────────────────────
  // EFFECT: After blob finishes growing, start typing phrase 2
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "blobGrow") return;
    const t = setTimeout(() => {
      setDisplayed(""); // clear the search bar text
      setStage("typing2");
    }, 900);
    return () => clearTimeout(t);
  }, [stage]);

  // ─────────────────────────────────────────────
  // EFFECT: Trigger palette animation after typing2 ends (when slider starts)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stage === "slider" && !animatePalette) {
      setAnimatePalette(true);
    }
    if (stage !== "slider") {
      setAnimatePalette(false); // reset after slider is done
    }
  }, [stage]);

  // ─────────────────────────────────────────────
  // EFFECT: Auto-animate the color slider
  // Moves the hue from the initial value down to the final value
  // Updates the blob color in real time as it moves
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stage !== "slider") return;
    let hue = INITIAL_SLIDER_HUE;
    const interval = setInterval(() => {
      hue -= 3; // move slider left by 3 hue degrees each tick
      if (hue < FINAL_SLIDER_HUE) {
        hue = FINAL_SLIDER_HUE; // stop at target hue
        clearInterval(interval);
        setBlobColor(hslToHex(hue, SLIDER_SATURATION, SLIDER_LIGHTNESS));
        setSliderHue(hue);
        // Hide slider and start typing phrase 3
        setTimeout(() => {
          setSliderVisible(false);
          setDisplayed("");
          setStage("typing3");
        }, 700);
        return;
      }
      // Update blob color and slider position each tick
      setBlobColor(hslToHex(hue, SLIDER_SATURATION, SLIDER_LIGHTNESS));
      setSliderHue(hue);
    }, 30); // runs every 30ms
    return () => clearInterval(interval);
  }, [stage]);

  // Fade out the whole scene after the final stage completes
  useEffect(() => {
    if (stage !== "done") {
      setIsFadingOut(false);
      return;
    }
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, FADE_OUT_DELAY_MS);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, FADE_OUT_DELAY_MS + FADE_OUT_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [stage, onComplete]);

  useEffect(() => {
    const updateBlobScale = () => {
      const viewportWidth = window.innerWidth;
      const widthFactor = Math.min(Math.max(viewportWidth / 1920, 1), 1.45);
      setFullscreenBlobScale(23 * widthFactor);
    };

    window.addEventListener("resize", updateBlobScale);
    return () => {
      window.removeEventListener("resize", updateBlobScale);
    };
  }, []);

  // Hide the search bar only during the blob grow transition
  const showSearchBar = stage !== "blobGrow";
  const sceneFadeOpacity = isFadingOut ? 0 : 1;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* ── MAIN PINK BLOB ──
          Starts small below the search bar.
          When blobFullscreen = true, scales up to fill most of the screen.
          Its color changes as the slider moves (controlled by blobColor state) */}
      <div
        className="absolute mix-blend-color-burn "
        style={{
          left: "53vw",
          top: "75vh",
          width: 80,
          height: 80,
          opacity: (blobsVisible || blobFullscreen ? 1 : 0) * sceneFadeOpacity,
          transform: blobFullscreen
            ? `translate(-50%, -50%) scale(${fullscreenBlobScale})` // big — fills most of screen
            : "translate(calc(-50% - 3vw - 5.625rem), calc(-23vh + 40px)) scale(1)", // small — starts from the original small position and animates to big start point
          transition:
            `transform 0.9s cubic-bezier(0.4,0,0.2,1), opacity ${isFadingOut ? FADE_OUT_DURATION_MS : 400}ms ease`,
          zIndex: 1,
        }}
      >
        <svg viewBox="0 0 100 100" width="90" height="90">
          <path d={BLOB_PATH} fill={blobColor} />
        </svg>
      </div>

      <div
        style={{
          opacity: sceneFadeOpacity,
          transition: `opacity ${FADE_OUT_DURATION_MS}ms ease`,
        }}
      >

      {/* Arrow points to the first small blob while all 3 options are visible */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "calc(50vw - 5rem)",
          top: "54vh",
          width: 38,
          height: 38,
          opacity: blobsVisible && !blobFullscreen ? 1 : 0,
          transform:
            blobsVisible && !blobFullscreen
              ? "translate(-24px, 66px) scale(1)"
              : "translate(-24px, 66px) scale(0)",
          transition: "transform 0.5s ease 0.12s, opacity 0.5s ease 0.12s",
          zIndex: 8,
        }}
      >
        <img
          src={arrowCursor}
          alt=""
          className="w-full h-full object-contain"
          aria-hidden="true"
        />
      </div>

      {/* ── RED BLOB ──
          One of the 3 color options shown in scene 2.
          Pops in after phrase 1 is typed, disappears when pink blob expands */}
      <div
        className="absolute"
        style={{
          left: "calc(50vw - 3.4375rem)",
          top: "52vh",
          width: 80,
          height: 80,
          opacity: blobsVisible && !blobFullscreen ? 1 : 0,
          transform:
            blobsVisible && !blobFullscreen
              ? "translate(30px, 50px) scale(1)"
              : "translate(30px, 50px) scale(0)",
          transition: "transform 0.6s ease 0.12s, opacity 0.6s ease 0.12s",
          zIndex: 5,
        }}
      >
        <svg viewBox="0 0 100 100" width="80" height="80">
          <path d={BLOB_PATH} fill="#792808" />
        </svg>
      </div>

      {/* ── YELLOW-GREEN BLOB ──
          Third color option shown in scene 2.
          Slightly delayed pop-in after the red blob */}
      <div
        className="absolute"
        style={{
          left: "calc(50vw + 3.4375rem)",
          top: "52vh",
          width: 80,
          height: 80,
          opacity: blobsVisible && !blobFullscreen ? 1 : 0,
          transform:
            blobsVisible && !blobFullscreen
              ? "translate(30px, 50px) scale(1)"
              : "translate(30px, 50px) scale(0)",
          transition: "transform 0.6s ease 0.24s, opacity 0.6s ease 0.24s",
          zIndex: 1,
        }}
      >
        <svg viewBox="0 0 100 100" width="80" height="80">
          <path d={BLOB_PATH} fill="#C3FB0B" />
        </svg>
      </div>

      {/* ── SEARCH BAR + SLIDER WRAPPER ──
          Centered on the page. Hidden briefly during blob grow transition */}
      <div
        className="absolute left-1/2 top-1/2 w-80vw] max-w-105w-[80vw] sm:max-w-115 lg:w-130 transition-opacity duration-300"
        style={{
          transform: "translate(-50%, -50%)",
          opacity: showSearchBar ? 1 : 0,
          zIndex: 1,
        }}  
      >
        {/* ── PILL SEARCH BAR ──
            Frosted glass pill shape. Shows the typewriter text inside */}
        <div
          className="flex items-center justify-center w-100 rounded-full font-bold font-sans px-4 py-2 sm:px-6 sm:py-3 backdrop-blur-sm"
          style={{
            background: "rgba(255,255,255,0.82)",
            boxShadow: "0px 20px 16px rgba(0,0,0,0.20)",
            border: "3px solid white",
          }}
        >
          <span
            className="text-lg sm:text-xl lg:text-2xl"
            style={{
              color: "#b83010",
              letterSpacing: " ",
            }}
          >
            {/* The typed text builds up here */}
            {displayed}
            {/* Blinking cursor — animated via the blink keyframe below */}
            <span
              className="inline-block w-1 ml-1  align-middle"
              style={{
                height: "1.2em",
                background: "#b83010",
                animation: "blink 1s step-start infinite",
              }}
            />
          </span>
        </div>

        {/* ── COLOR SLIDER ──
            Rainbow gradient range input that auto-animates from pink to yellow-green.
            pointerEvents: none means the user cannot interact with it */}
        <div
          className="mt-4 sm:mt-6 w-100 transition-all duration-500"
          style={{
            opacity: sliderVisible ? 1 : 0,
            transform: sliderVisible ? "translateY(0)" : "translateY(8px)",
            pointerEvents: "none",
          }}
        >
          <input
            type="range"
            min="0"
            max="360"
            value={sliderHue}
            readOnly
            className="w-full h-2.5 rounded-full outline-none cursor-pointer appearance-none"
            style={{
              background:
                "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
            }}
          />
        </div>
      </div>

      {/* ── ART TOOLS TRAY ──
          Slides up from the bottom once the blob fills the screen.
          Oval/ellipse shaped tray with emoji art tools inside.
          Each tool pops in with a staggered delay (transitionDelay) */}
      <div
        className="absolute bottom-2 sm:bottom-5 left-1/2 flex items-end justify-center gap-1 px-5 sm:px-12 pt-3 sm:pt-5 pb-2 sm:pb-3"
        style={{
          transform: blobFullscreen
            ? `translateX(-50%) translateY(${animatePalette ? 40 : 0}px)` // slides up into view, moves down during palette animation
            : "translateX(-50%) translateY(60px)", // hidden below the screen
          opacity: blobFullscreen ? 1 : 0,
          transition: "transform 0.6s ease-out",
          backgroundImage: `url(${artplate})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center",
          borderRadius: "50% 50% 0 0 / 25% 25% 0 0", // oval top edge
          width: "min(92vw, 700px)",
          zIndex: 20,
        }}
      >
        {[
          { src: pen, size: 120, marginLeft: 0, marginRight: "-40px" },
          { src: ink, size: 80, marginLeft: "10px", marginRight: "-40px" },
          { src: pencilsCup, size: 150, marginLeft: "10px", marginRight: "-30px" },
          { src: palette, size: 80, marginLeft: "10px", marginRight: "-30px" },
          { src: brush, size: 110, marginLeft: "10px", marginRight: "-30px" },
          { src: ruler, size: 150, marginLeft: "-40px", marginRight: "-30px" },
          { src: pencil, size: 120, marginLeft: "-50px", marginRight: "-10px" },
        ].map(({ src, size, marginLeft, marginRight }, i) => (
          <div
            key={i}
            className="inline-flex justify-center overflow-hidden"
            style={{
              width: size,
              height: size,
              marginLeft,
              marginRight,
              position: "relative",
              top: "-4.375rem",
              transitionDelay: `${0.4 + i * 0.06}s`,
              transform: animatePalette
                ? i === 3
                  ? "translateY(-80px) scale(1.4)"  // palette moves up and grows
                  : "translateY(10px) scale(1)"     // others move down
                : blobFullscreen
                  ? "translateY(0) scale(1)"
                  : "translateY(20px) scale(0.4)",
              transition: "transform 0.6s ease-out",
              opacity: blobFullscreen ? 1 : 0,
            }}
          >
            <img
              src={src}
              alt="art tool"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* ── GLOBAL STYLES ──
          blink: makes the cursor in the search bar flash on and off.
          slider thumb: styles the draggable circle handle on the range input */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #f0d0f0, #c090c0);
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 2px 10px rgba(0,0,0,0.25);
          cursor: pointer;
        }
      `}</style>
      </div>
    </>
  );
}

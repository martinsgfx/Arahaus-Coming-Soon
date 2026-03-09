import { useEffect, useState } from "react";
import yellowPuzzleIcon from "../assets/puzzle-yellow.png";
import redPuzzleIcon from "../assets/puzzle-red.png";
import bluePuzzleIcon from "../assets/puzzle-blue.png";

const MOBILE_BREAKPOINT = 768;
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const YELLOW_ICON_ANIMATION = "puzzleSpinPulse 3.4s ease-in-out infinite 0.12s";
const RED_ICON_ANIMATION = "puzzleSpinPulse 3.4s ease-in-out infinite";
const BLUE_ICON_ANIMATION = "puzzleSpinPulse 3.4s ease-in-out infinite 0.25s";
const RED_STROKE_TO_SOLID_ANIMATION = "strokeToSolidRed 1.1s ease-in-out infinite alternate";
const YELLOW_STROKE_TO_SOLID_ANIMATION = "strokeToSolidYellow 1.1s ease-in-out infinite alternate";
const GREEN_STROKE_TO_SOLID_ANIMATION = "strokeToSolidGreen 1.1s ease-in-out infinite alternate";

export default function ComingSoon() {
  const [isMobile, setIsMobile] = useState(
    (window.visualViewport?.width ?? window.innerWidth) < MOBILE_BREAKPOINT,
  );
  const [desktopScale, setDesktopScale] = useState(1);
  const [growDesktopLine, setGrowDesktopLine] = useState(false);
  const [growMobileLine, setGrowMobileLine] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const viewportW = window.visualViewport?.width ?? window.innerWidth;
      const viewportH = window.visualViewport?.height ?? window.innerHeight;
      setIsMobile(viewportW < MOBILE_BREAKPOINT);

      const scaleX = viewportW / DESIGN_WIDTH;
      const scaleY = viewportH / DESIGN_HEIGHT;
      setDesktopScale(Math.min(scaleX, scaleY));
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;

    setGrowDesktopLine(false);
    const frame = requestAnimationFrame(() => setGrowDesktopLine(true));
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;

    setGrowMobileLine(false);
    const frame = requestAnimationFrame(() => setGrowMobileLine(true));
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="absolute inset-0 px-6 pb-12  font-medium">
        <style>{`
        @keyframes puzzleSpinPulse {
          0% { transform: rotate(0deg) scale(0.86); }
          50% { transform: rotate(360deg) scale(1.96); }
          100% { transform: rotate(0deg) scale(0.86); }
        }

          @keyframes strokeToSolidRed {
            0% {
              color: transparent;
              -webkit-text-stroke: 2px #ef4444;
            }
            100% {
              color: #ef4444;
              -webkit-text-stroke: 2px #ef4444;
            }
          }

          @keyframes strokeToSolidYellow {
            0% {
              color: transparent;
              -webkit-text-stroke: 2px #988E18;
            }
            100% {
              color: #5E5917;
              -webkit-text-stroke: 2px #988E18;
            }
          }

          @keyframes strokeToSolidGreen {
            0% {
              color: transparent;
              -webkit-text-stroke: 2px #2F9818;
            }
            100% {
              color: #1E5E17;
              -webkit-text-stroke: 2px #2F9818;
            }
          }
      `}</style>
        <div className="relative mx-auto flex h-full w-full max-w-107.5 flex-col justify-center">
          <div
            className={`absolute h-105.5 w-2 left-49.75 top-0 bg-black origin-top transition-transform duration-700 ease-out ${growMobileLine ? "scale-y-100" : "scale-y-0"}`}
          />

          <img
            src={yellowPuzzleIcon}
            alt="Yellow Puzzle Icon"
            className="absolute left-20.5  top-95 w-6"
            style={{
              animation: YELLOW_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />
          <h1 className="text-[80px] leading-[0.84] text-left">
            C
            <span
              className="text-transparent [-webkit-text-stroke:2px_#ef4444]"
              style={{ animation: RED_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            MING
          </h1>
          <p className="absolute top-105 left-2 font-albert-sans text-[12.5px] italic text-left py-4">
            - A new design experience is on its way
          </p>

          <div
            className={`absolute my-6 h-118 w-2 right-0.5 top-111.75 origin-bottom bg-[#9C2521] transition-transform duration-700 ease-out ${growMobileLine ? "scale-y-100" : "scale-y-0"}`}
          />

          {/* //Puzzle Icons for Soon */}
          <img
            src={redPuzzleIcon}
            alt="Red Puzzle Icon"
            className="absolute left-54  top-121.5 w-6"
            style={{
              animation: RED_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />
          <img
            src={bluePuzzleIcon}
            alt="Blue Puzzle Icon"
            className="absolute left-70 top-121.5 w-6 "
            style={{
              animation: BLUE_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />

          <h1 className="mt-10 text-[80px] leading-[0.84] text-right">
            S
            <span
              className="text-transparent [-webkit-text-stroke:2px_#988E18]"
              style={{ animation: YELLOW_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            <span
              className="text-transparent [-webkit-text-stroke:2px_#2F9818]"
              style={{ animation: GREEN_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            N
          </h1>

          <p className=" absolute mt-4 font-albert-sans top-130 left-36 text-[12.5px] italic text-left">
            Click to solve our creative puzzle and <br /> piece together what is
            coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes puzzleSpinPulse {
          0% { transform: rotate(0deg) scale(0.86); }
          50% { transform: rotate(360deg) scale(2.86); }
          100% { transform: rotate(0deg) scale(0.86); }
        }

        @keyframes strokeToSolidRed {
          0% {
            color: transparent;
            -webkit-text-stroke: 5px #981838;
          }
          100% {
            color: #5E1729;
            -webkit-text-stroke: 5px #981838;
          }
        }

        @keyframes strokeToSolidYellow {
          0% {
            color: transparent;
            -webkit-text-stroke: 5px #988E18;
          }
          100% {
            color: #5E5917;
            -webkit-text-stroke: 5px #988E18;
          }
        }

        @keyframes strokeToSolidGreen {
          0% {
            color: transparent;
            -webkit-text-stroke: 5px #2F9818;
          }
          100% {
            color: #1E5E17;
            -webkit-text-stroke: 5px #2F9818;
          }
        }

      `}</style>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: `translate(-50%, -50%) scale(${desktopScale})`,
          transformOrigin: "center center",
        }}
      >
        <div className="relative h-full w-full font-medium flex flex-col gap-0 items-center justify-center">
          <div
            className={`absolute left-[45.14%] top-[0%] h-147 w-5 -translate-x-1/2 origin-top bg-black transition-transform duration-700 ease-out ${growDesktopLine ? "scale-y-100" : "scale-y-0"}`}
          />
          {/* // Puzzle Icon for coming */}
          <img
            src={yellowPuzzleIcon}
            alt="Yellow Puzzle Icon"
            className="absolute left-144 top-116"
            style={{
              animation: YELLOW_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />

          <h1 className="text-[180px] leading-31 w-[60%] text-left">
            C
            <span
              className="text-transparent [-webkit-text-stroke:5px_#ef4444]"
              style={{ animation: RED_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            MING
          </h1>

          <div
            className={`absolute left-[75%] top-[40.7%] h-160 w-5 -translate-x-1/2 origin-bottom bg-[#9C2521] transition-transform duration-700 ease-out ${growDesktopLine ? "scale-y-100" : "scale-y-0"}`}
          />

          {/* //Puzzle Icons for Soon */}
          <img
            src={redPuzzleIcon}
            alt="Red Puzzle Icon"
            className="absolute left-271 top-148"
            style={{
              animation: RED_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />
          <img
            src={bluePuzzleIcon}
            alt="Blue Puzzle Icon"
            className="absolute left-307 top-148"
            style={{
              animation: BLUE_ICON_ANIMATION,
              transformOrigin: "center center",
            }}
          />

          <h1 className="text-[180px] leading-31 w-[62%] text-right -ml-52">
            S
            <span
              className="text-transparent [-webkit-text-stroke:5px_#988E18]"
              style={{ animation: YELLOW_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            <span
              className="text-transparent [-webkit-text-stroke:5px_#2F9818]"
              style={{ animation: GREEN_STROKE_TO_SOLID_ANIMATION }}
            >
              O
            </span>
            N
          </h1>
          <p className="text-2xl absolute left-101 top-140 font-albert-sans italic">
            - A new design experience is on its way
          </p>
          <p className="text-2xl absolute right-132 top-173 font-albert-sans italic">
            Click to solve our creative puzzle and piece <br /> together what is
            coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

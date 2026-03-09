import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

export default function ComingSoon() {
  const [isMobile, setIsMobile] = useState(
    (window.visualViewport?.width ?? window.innerWidth) < MOBILE_BREAKPOINT,
  );
  const [desktopScale, setDesktopScale] = useState(1);

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

  if (isMobile) {
    return (
      <div className="absolute inset-0 px-6 pb-12  font-medium">
        <div className="relative mx-auto flex h-full w-full max-w-107.5 flex-col justify-center">
          <div className="absolute  h-105.5 w-2 left-49.75 top-0 left bg-black" />
          <h1 className="text-[80px] leading-[0.84] text-left">
            C<span className="text-red-500">O</span>MING
          </h1>
          <p className="absolute top-105 left-2 font-albert-sans text-[12.5px] italic text-left py-4">
            - A new design experience is on its way
          </p>

          <div className="absolute my-6 h-118 w-2 right-0.5 top-111.75 bg-[#9C2521]" />
          <h1 className="mt-10 text-[80px] leading-[0.84] text-right">
            S<span className="text-red-500">O</span>
            <span className="text-red-500">O</span>N
          </h1>

          <p className=" absolute mt-4 font-albert-sans top-130 left-36 text-[12.5px] italic text-left">
            Click to solve our creative puzzle and <br /> piece  together what is
            coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
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
          <div className="absolute left-[45.14%] top-[0%] h-147 w-5 -translate-x-1/2 bg-black" />

          <h1 className="text-[180px] leading-31 w-[60%] text-left">
            C<span className="text-red-500">O</span>MING
          </h1>

          <div className="absolute left-[75%] top-[50.9%] h-147 w-5 -translate-x-1/2 bg-[#9C2521]" />
          <h1 className="text-[180px] leading-31 w-[62%] text-right -ml-52">
            S<span className="text-red-500">O</span>
            <span className="text-red-500">O</span>N
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

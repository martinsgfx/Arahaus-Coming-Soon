import { useEffect, useState } from "react";
import lookUpIcon from "../assets/look-up.png";
import lookDownIcon from "../assets/look-down.png";
import lookDownAgainIcon from "../assets/look-down-again.png";

const ICON_FRAMES = [lookDownIcon, lookUpIcon, lookDownAgainIcon];
const FRAME_DURATION_MS = 450;
const WAIT_FADE_IN_MS = 500;
const ICON_SEQUENCE = [1, 2, 0, 1, 2];

export const Wait = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timers = ICON_SEQUENCE.map((nextFrame, i) =>
      setTimeout(() => setFrameIndex(nextFrame), FRAME_DURATION_MS * (i + 1))
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${WAIT_FADE_IN_MS}ms ease`,
      }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 sm:px-6 text-center">
        <div className="mx-auto my-0 h-28 w-36 sm:h-40 sm:w-52 lg:h-48 lg:w-60 flex items-center justify-center">
          <img
            src={ICON_FRAMES[frameIndex]}
            alt="Look animation"
            className="block max-h-full w-full object-contain"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold py-2 sm:py-3">Waitttttt!</h1>
        <p className="mx-auto max-w-[26ch] text-base sm:text-xl lg:text-2xl leading-snug font-normal">
          Are we ready to show the world yet
        </p>
      </div>
    </div>
  );
};

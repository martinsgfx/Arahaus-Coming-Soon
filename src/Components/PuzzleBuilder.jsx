import { useState, useCallback, useEffect, useRef } from "react";
import puzzleImage from "../assets/araaus-puzzle.png";

// ─── Config ────────────────────────────────────────────────────────────────
const COLS = 3;
const ROWS = 3;
const TOTAL = COLS * ROWS;

// ─── Swap this with your final full puzzle image ────────────────────────────
const PUZZLE_IMAGE = puzzleImage;

// IMAGE aspect ratio per row (width / height of a single piece cell)
// e.g. if each row image is 420x90, aspect = (420/3) / 90 = 1.56
const IMAGE_ASPECT = 420 / 3 / 90;

// ─── Build interlocking edges ───────────────────────────────────────────────
function buildEdges() {
  const hEdges = Array.from({ length: ROWS + 1 }, (_, r) =>
    Array.from({ length: COLS }, () =>
      r === 0 || r === ROWS ? 0 : Math.random() > 0.5 ? 1 : -1,
    ),
  );
  const vEdges = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS + 1 }, (_, c) =>
      c === 0 || c === COLS ? 0 : Math.random() > 0.5 ? 1 : -1,
    ),
  );

  return Array.from({ length: TOTAL }, (_, i) => {
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    return {
      id: i,
      row: r,
      col: c,
      top: hEdges[r][c],
      bottom: -hEdges[r + 1][c],
      left: vEdges[r][c],
      right: -vEdges[r][c + 1],
    };
  });
}

// ─── SVG path for a rectangular puzzle piece ────────────────────────────────
function piecePath(top, right, bottom, left, W, H) {
  const minS = Math.min(W, H);
  const T = minS * 0.28;
  const R = minS * 0.14;
  const mH = W * 0.5;
  const mV = H * 0.5;
  let d = `M 0,0 `;

  if (top === 0) {
    d += `L ${W},0 `;
  } else {
    const D = T * -top;
    d += `L ${mH - R * 1.4},0 C ${mH - R},${D * 0.3} ${mH - R},${D} ${mH},${D} C ${mH + R},${D} ${mH + R},${D * 0.3} ${mH + R * 1.4},0 L ${W},0 `;
  }
  if (right === 0) {
    d += `L ${W},${H} `;
  } else {
    const D = T * right;
    d += `L ${W},${mV - R * 1.4} C ${W + D * 0.3},${mV - R} ${W + D},${mV - R} ${W + D},${mV} C ${W + D},${mV + R} ${W + D * 0.3},${mV + R} ${W},${mV + R * 1.4} L ${W},${H} `;
  }
  if (bottom === 0) {
    d += `L 0,${H} `;
  } else {
    const D = T * bottom;
    d += `L ${mH + R * 1.4},${H} C ${mH + R},${H + D * 0.3} ${mH + R},${H + D} ${mH},${H + D} C ${mH - R},${H + D} ${mH - R},${H + D * 0.3} ${mH - R * 1.4},${H} L 0,${H} `;
  }
  if (left === 0) {
    d += `L 0,0 `;
  } else {
    const D = T * -left;
    d += `L 0,${mV + R * 1.4} C ${D * 0.3},${mV + R} ${D},${mV + R} ${D},${mV} C ${D},${mV - R} ${D * 0.3},${mV - R} 0,${mV - R * 1.4} L 0,0 `;
  }
  return d + "Z";
}

// ─── Empty Slot SVG — shows slot image clipped to puzzle shape ───────────────
function EmptySlot({ piece, cellW, cellH, highlighted }) {
  const pad = Math.min(cellW, cellH) * 0.32;
  const W = cellW;
  const H = cellH;
  const path = piecePath(
    piece.top,
    piece.right,
    piece.bottom,
    piece.left,
    W,
    H,
  );

  return (
    <svg
      width={W + pad * 2}
      height={H + pad * 2}
      style={{ overflow: "visible", display: "block", pointerEvents: "none" }}
    >
      {/* Drop shadow */}
      <path
        d={path}
        transform={`translate(${pad + 1},${pad + 2})`}
        fill="rgba(0,0,0,0.1)"
      />

      {/* Neutral slot fill */}
      <path
        d={path}
        transform={`translate(${pad},${pad})`}
        fill={highlighted ? "rgba(241,245,249,1)" : "rgba(248,250,252,1)"}
      />

      {/* Highlight overlay when a piece is selected */}
      {highlighted && (
        <path
          d={path}
          transform={`translate(${pad},${pad})`}
          fill="rgba(250,204,21,0.18)"
        />
      )}

      {/* Border */}
      <path
        d={path}
        transform={`translate(${pad},${pad})`}
        fill="none"
        stroke={highlighted ? "#facc15" : "rgba(0,0,0,0.3)"}
        strokeWidth={highlighted ? 2 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Single Piece SVG ────────────────────────────────────────────────────────
function PuzzlePiece({ piece, cellW, cellH, isSelected, isTray }) {
  const pad = Math.min(cellW, cellH) * 0.32;
  const W = cellW;
  const H = cellH;
  const uid = `cp-${piece.id}-${Math.round(W)}-${Math.round(H)}-${isTray ? "t" : "b"}`;
  const path = piecePath(
    piece.top,
    piece.right,
    piece.bottom,
    piece.left,
    W,
    H,
  );

  return (
    <svg
      width={W + pad * 2}
      height={H + pad * 2}
      style={{ overflow: "visible", display: "block", pointerEvents: "none" }}
    >
      <defs>
        <clipPath id={uid}>
          <path d={path} transform={`translate(${pad},${pad})`} />
        </clipPath>
      </defs>
      {/* Shadow */}
      <path
        d={path}
        transform={`translate(${pad + 2},${pad + 3})`}
        fill={isSelected ? "rgba(250,204,21,0.4)" : "rgba(0,0,0,0.25)"}
      />
      {/* Image */}
      <image
        href={PUZZLE_IMAGE}
        x={pad - piece.col * W}
        y={pad - piece.row * H}
        width={COLS * W}
        height={ROWS * H}
        clipPath={`url(#${uid})`}
        preserveAspectRatio="xMidYMid slice"
      />
      {/* Outline */}
      <path
        d={path}
        transform={`translate(${pad},${pad})`}
        fill="none"
        stroke={isSelected ? "#facc15" : "rgba(0,0,0,0.4)"}
        strokeWidth={isSelected ? 2.5 : 1.5}
      />
    </svg>
  );
}

// ─── Shuffle ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PuzzleBuilder({ onClose = () => {} }) {
  const [pieces] = useState(() => buildEdges());
  const [board, setBoard] = useState(() => Array(TOTAL).fill(null));
  const [tray, setTray] = useState(() =>
    shuffle(Array.from({ length: TOTAL }, (_, i) => i)),
  );
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showWin, setShowWin] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // ── Responsive sizing ──────────────────────────────────────────────────────
  const containerRef = useRef(null);
  const [cellW, setCellW] = useState(120);
  const cellH = cellW / IMAGE_ASPECT;

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const available = containerRef.current.offsetWidth - 64;
      const w = Math.floor(available / COLS);
      setCellW(Math.max(w, 60));
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const trayCellW = cellW * 0.58;
  const trayCellH = trayCellW / IMAGE_ASPECT;

  // ── Placement logic ────────────────────────────────────────────────────────
  const checkComplete = useCallback(
    (newBoard) => {
      if (newBoard.every((id, slot) => id !== null && pieces[id].id === slot)) {
        setCompleted(true);
        setTimeout(() => setShowWin(true), 400);
      }
    },
    [pieces],
  );

  function handleTrayClick(pieceId) {
    setSelected((prev) => (prev === pieceId ? null : pieceId));
  }

  function handleSlotClick(slotIndex) {
    if (selected !== null) {
      const newBoard = [...board];
      const newTray = tray.filter((id) => id !== selected);
      if (newBoard[slotIndex] !== null) newTray.push(newBoard[slotIndex]);
      newBoard[slotIndex] = selected;
      setBoard(newBoard);
      setTray(newTray);
      setSelected(null);
      checkComplete(newBoard);
    } else if (board[slotIndex] !== null) {
      const pid = board[slotIndex];
      const newBoard = [...board];
      newBoard[slotIndex] = null;
      setBoard(newBoard);
      setTray((t) => [...t, pid]);
      setSelected(pid);
    }
  }

  function handleReset() {
    setBoard(Array(TOTAL).fill(null));
    setTray(shuffle(Array.from({ length: TOTAL }, (_, i) => i)));
    setSelected(null);
    setCompleted(false);
    setShowWin(false);
  }

  const boardW = cellW * COLS;
  const boardH = cellH * ROWS;
  const placedCount = board.filter((x) => x !== null).length;
  const tabOverflow = cellH * 0.28;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Card */}
      <div
        ref={containerRef}
        className="w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxWidth: 520 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
              Puzzle Builder
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-1.5 rounded-full bg-slate-100 overflow-hidden"
                style={{ width: 72 }}
              >
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${(placedCount / TOTAL) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400">
                {placedCount} / {TOTAL}
              </span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowGuide(true)}
              className="text-xs bg-amber-50 active:bg-amber-100 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              <span>👁</span> Guide
            </button>
            <button
              onClick={handleReset}
              className="text-xs bg-slate-100 active:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full font-medium"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Reset
            </button>
            <button
              onClick={onClose}
              aria-label="Close puzzle"
              className="w-9 h-9 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 text-xl leading-none"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Board */}
        <div
          className="flex items-center justify-center   relative"
          style={{
            paddingTop: tabOverflow + 16,
            paddingBottom: tabOverflow + 16,
            paddingLeft: tabOverflow + 16,
            paddingRight: tabOverflow + 16,
          }}
        >
          <div className="absolute left-2 top-2 w-20 h-20 rounded-full bg-amber-100 opacity-40 blur-2xl pointer-events-none" />
          <div className="absolute right-2 bottom-2 w-20 h-20 rounded-full bg-sky-100 opacity-40 blur-2xl pointer-events-none" />

          <div className="relative" style={{ width: boardW, height: boardH }}>
            {Array.from({ length: TOTAL }, (_, slot) => {
              const row = Math.floor(slot / COLS);
              const col = slot % COLS;
              const placedId = board[slot];
              const piece = placedId !== null ? pieces[placedId] : null;
              const isCorrect = piece && piece.id === slot;

              return (
                <div
                  key={slot}
                  onClick={() => handleSlotClick(slot)}
                  style={{
                    position: "absolute",
                    left: col * cellW,
                    top: row * cellH,
                    width: cellW,
                    height: cellH,
                    cursor: selected !== null || piece ? "pointer" : "default",
                    zIndex: piece ? 2 : 1,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  {/* Empty slot — puzzle-shaped grey hole */}
                  {!piece && (
                    <div
                      className="absolute"
                      style={{
                        left: -(cellW * 0.25),
                        top: -(cellH * 0.32),
                        pointerEvents: "none",
                      }}
                    >
                      <EmptySlot
                        piece={pieces[slot]}
                        cellW={cellW}
                        cellH={cellH}
                        highlighted={selected !== null}
                      />
                    </div>
                  )}

                  {/* Placed piece */}
                  {piece && (
                    <div
                      className="absolute"
                      style={{
                        left: -(cellW * 0.25),
                        top: -(cellH * 0.32),
                        filter: isCorrect
                          ? "drop-shadow(0 0 7px rgba(34,197,94,0.55))"
                          : "none",
                        transition: "filter 0.3s",
                      }}
                    >
                      <PuzzlePiece
                        piece={piece}
                        cellW={cellW}
                        cellH={cellH}
                        isSelected={false}
                        isTray={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint bar */}
        <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center leading-tight">
            {selected !== null
              ? "✦ Tap a slot on the board to place the piece"
              : "Tap any piece below to select it"}
          </p>
        </div>

        {/* Tray */}
        <div
          className="bg-[#180000] flex gap-2 items-center px-3"
          style={{
            minHeight: trayCellH + 48,
            overflowX: "auto",
            overflowY: "visible",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          {tray.length === 0 ? (
            <p className="text-white text-sm text-center w-full py-2">
              {completed ? "All pieces placed!" : "No pieces in tray"}
            </p>
          ) : (
            tray.map((pieceId) => {
              const piece = pieces[pieceId];
              const isSel = selected === pieceId;
              return (
                <button
                  key={pieceId}
                  onClick={() => handleTrayClick(pieceId)}
                  className="shrink-0 focus:outline-none"
                  style={{
                    padding: 4,
                    margin: -4,
                    background: "transparent",
                    border: "none",
                    transform: isSel
                      ? "translateY(-12px) scale(1.12)"
                      : "translateY(0) scale(1)",
                    filter: isSel
                      ? "drop-shadow(0 8px 18px rgba(250,204,21,0.75))"
                      : "drop-shadow(1px 3px 5px rgba(0,0,0,0.6))",
                    transition:
                      "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), filter 0.2s ease",
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  <PuzzlePiece
                    piece={piece}
                    cellW={trayCellW}
                    cellH={trayCellH}
                    isSelected={isSel}
                    isTray={true}
                  />
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Guide modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="bg-white w-full sm:w-auto rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* Title */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Puzzle Guide
                </h2>
                <p className="text-xs text-slate-400">
                  Use this as a reference while solving
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg leading-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                ×
              </button>
            </div>

            {/* Full reference image */}
            <div
              className="mx-4 my-4 rounded-2xl overflow-hidden border border-slate-100 shadow-inner"
              style={{ background: "#f8fafc" }}
            >
              <img
                src={PUZZLE_IMAGE}
                alt="Puzzle reference"
                style={{
                  width: "100%",
                  display: "block",
                }}
                draggable={false}
              />
            </div>

            <p className="text-xs text-slate-400 text-center pb-5 px-4">
              Tap anywhere outside to close
            </p>
          </div>
        </div>
      )}

      {/* Win modal */}
      {showWin && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowWin(false)}
        >
          <div
            className="bg-white w-full sm:w-auto rounded-t-3xl sm:rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center gap-4 text-center"
            style={{ maxWidth: 400 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={puzzleImage} alt="Puzzle" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              Nice Work!
            </h2>
            <p className="text-slate-400 text-sm">
              You’ve unlocked what’s coming soon. We’re crafting something bold
              for you.
            </p>
            <button
              onClick={handleReset}
              className="mt-1 w-full sm:w-auto bg-slate-900 active:bg-slate-700 text-white px-8 py-3 rounded-full text-sm font-medium transition-colors"
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

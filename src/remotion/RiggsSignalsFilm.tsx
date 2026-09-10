import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const NAVY = "#0A2342";
const WHITE = "#FFFFFF";
const PALE = "#E8EEF5";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const progress = (frame: number, start: number, end: number) =>
  clamp((frame - start) / (end - start));

const eased = (p: number) => Easing.bezier(0.16, 1, 0.3, 1)(p);

const enterFromLeft = (
  frame: number,
  start: number,
  end: number,
  fromX = -1050,
  toX = 0,
) => interpolate(eased(progress(frame, start, end)), [0, 1], [fromX, toX]);

const exitRight = (
  frame: number,
  start: number,
  end: number,
  fromX = 0,
  toX = 2200,
) => interpolate(eased(progress(frame, start, end)), [0, 1], [fromX, toX]);

const fadeWindow = (
  frame: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number,
) => {
  const fadeIn = interpolate(frame, [inStart, inEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [outStart, outEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(fadeIn, fadeOut);
};

const SignalDot: React.FC<{ x: number; y: number; opacity?: number; scale?: number }> = ({
  x,
  y,
  opacity = 1,
  scale = 1,
}) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x - 12,
        top: y - 12,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: NAVY,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: "0 0 0 8px rgba(10,35,66,0.045)",
      }}
    />
  </>
);

export const RiggsSignalsFilm: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: fast signal path and CLEAR SIGNALS.
  const clearEnter = enterFromLeft(frame, 14, 42, -1000, 0);
  const clearExit = exitRight(frame, 118, 146, 0, 2100);
  const clearX = frame < 118 ? clearEnter : clearExit;
  const clearOpacity = fadeWindow(frame, 8, 22, 128, 146);

  const path1P = eased(progress(frame, 0, 105));
  const path1Dash = 2600 * (1 - path1P);
  const dot1X = interpolate(eased(progress(frame, 0, 96)), [0, 1], [-80, 1940]);
  const dot1T = clamp((dot1X + 80) / 2020);
  const dot1Y = 615 - Math.sin(dot1T * Math.PI) * 95 + Math.sin(dot1T * Math.PI * 2) * 24;
  const dot1Opacity = fadeWindow(frame, 0, 4, 126, 144);

  // Scene 2: line blooms into complexity then collapses.
  const branchOpacity = fadeWindow(frame, 142, 166, 264, 304);
  const branchDraw = eased(progress(frame, 150, 225));
  const branchDash = 1900 * (1 - branchDraw);
  const simplify = eased(progress(frame, 246, 304));

  const lessEnter = enterFromLeft(frame, 180, 212, -900, 0);
  const lessExit = exitRight(frame, 292, 322, 0, 2100);
  const lessX = frame < 292 ? lessEnter : lessExit;
  const lessOpacity = fadeWindow(frame, 170, 188, 302, 322);

  const dot2X = interpolate(eased(progress(frame, 154, 284)), [0, 1], [-40, 1830]);
  const dot2T = clamp((dot2X + 40) / 1870);
  const dot2Y = 580 + Math.sin(dot2T * Math.PI * 3.1) * (110 * (1 - simplify));
  const dot2Opacity = fadeWindow(frame, 146, 158, 292, 310);

  // Scene 3: one clean route accelerates into the payoff.
  const path3P = eased(progress(frame, 318, 425));
  const path3Dash = 2700 * (1 - path3P);
  const dot3X = interpolate(eased(progress(frame, 320, 420)), [0, 1], [-80, 1950]);
  const dot3T = clamp((dot3X + 80) / 2030);
  const dot3Y = 695 - Math.sin(dot3T * Math.PI) * 155;
  const dot3Opacity = fadeWindow(frame, 315, 324, 442, 462);

  const betterEnter = enterFromLeft(frame, 352, 380, -850, 0);
  const oppEnter = enterFromLeft(frame, 366, 402, -1500, 0);
  const payoffOpacity = fadeWindow(frame, 342, 356, 560, 596);
  const settleScale = interpolate(eased(progress(frame, 402, 442)), [0, 1], [1.035, 1]);

  const pulse = interpolate(frame, [258, 266, 276], [1, 1.45, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalPulse = interpolate(frame, [382, 390, 402], [1, 1.55, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WHITE,
        color: NAVY,
        overflow: "hidden",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      {/* AUDIO — deliberate, sparse, tied to physical motion */}
      <Sequence from={10}>
        <Audio src={staticFile("audio/whoosh-fast.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={34}>
        <Audio src={staticFile("audio/tick-soft.wav")} volume={0.28} />
      </Sequence>
      <Sequence from={154}>
        <Audio src={staticFile("audio/sweep-clear.wav")} volume={0.46} />
      </Sequence>
      <Sequence from={202}>
        <Audio src={staticFile("audio/tick-soft.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={258}>
        <Audio src={staticFile("audio/pulse-body.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={326}>
        <Audio src={staticFile("audio/whoosh-fast.wav")} volume={0.62} />
      </Sequence>
      <Sequence from={382}>
        <Audio src={staticFile("audio/tick-soft.wav")} volume={0.3} />
      </Sequence>
      <Sequence from={389}>
        <Audio src={staticFile("audio/impact-body.wav")} volume={0.58} />
      </Sequence>

      {/* Continuous motion field */}
      <svg
        viewBox="0 0 1920 1080"
        width="1920"
        height="1080"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Opening signal path */}
        <path
          d="M -120 615 C 260 590 510 700 790 585 C 1080 465 1350 480 2040 575"
          fill="none"
          stroke={NAVY}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="2600"
          strokeDashoffset={path1Dash}
          opacity={dot1Opacity}
        />

        {/* Complexity blooms */}
        <g opacity={branchOpacity}>
          <path
            d="M -80 580 C 300 580 520 360 820 520 C 1080 665 1280 310 1540 505 C 1690 615 1800 520 2010 420"
            fill="none"
            stroke={NAVY}
            strokeWidth={5 - simplify * 2}
            strokeLinecap="round"
            strokeDasharray="1900"
            strokeDashoffset={branchDash}
          />
          <path
            d="M -80 580 C 330 575 530 760 835 610 C 1120 470 1265 760 1530 600 C 1700 495 1830 655 2010 720"
            fill="none"
            stroke={NAVY}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1900"
            strokeDashoffset={branchDash + 180}
            opacity={0.48 * (1 - simplify)}
          />
          <path
            d="M -80 580 C 280 580 520 445 815 675 C 1080 880 1245 430 1510 720 C 1650 870 1840 760 2020 600"
            fill="none"
            stroke={NAVY}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1900"
            strokeDashoffset={branchDash + 340}
            opacity={0.25 * (1 - simplify)}
          />
        </g>

        {/* Clean final route */}
        <path
          d="M -120 695 C 260 720 510 760 820 610 C 1120 465 1420 475 2040 570"
          fill="none"
          stroke={NAVY}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="2700"
          strokeDashoffset={path3Dash}
          opacity={dot3Opacity}
        />
      </svg>

      {/* Signal nodes */}
      <SignalDot x={dot1X} y={dot1Y} opacity={dot1Opacity} />
      <SignalDot x={dot2X} y={dot2Y} opacity={dot2Opacity} scale={pulse} />
      <SignalDot x={dot3X} y={dot3Y} opacity={dot3Opacity} scale={finalPulse} />

      {/* CLEAR SIGNALS */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 280,
          transform: `translateX(${clearX}px)`,
          opacity: clearOpacity,
          fontSize: 172,
          lineHeight: 0.9,
          fontWeight: 800,
          letterSpacing: -9,
          whiteSpace: "nowrap",
        }}
      >
        CLEAR SIGNALS.
      </div>

      {/* LESS DOUBT */}
      <div
        style={{
          position: "absolute",
          left: 155,
          top: 365,
          transform: `translateX(${lessX}px)`,
          opacity: lessOpacity,
          fontSize: 186,
          lineHeight: 0.9,
          fontWeight: 800,
          letterSpacing: -10,
          whiteSpace: "nowrap",
        }}
      >
        LESS DOUBT.
      </div>

      {/* Final payoff — staggered words, not a title-card zoom */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 205,
          opacity: payoffOpacity,
          transform: `scale(${settleScale})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            transform: `translateX(${betterEnter}px)`,
            fontSize: 126,
            fontWeight: 750,
            letterSpacing: -6,
            lineHeight: 0.9,
          }}
        >
          BETTER
        </div>
        <div
          style={{
            transform: `translateX(${oppEnter}px)`,
            marginTop: 26,
            fontSize: 188,
            fontWeight: 850,
            letterSpacing: -11,
            lineHeight: 0.88,
            whiteSpace: "nowrap",
          }}
        >
          OPPORTUNITIES.
        </div>
      </div>

      {/* Final quiet resolve line */}
      <div
        style={{
          position: "absolute",
          left: 150,
          bottom: 150,
          width: interpolate(eased(progress(frame, 420, 500)), [0, 1], [0, 470]),
          height: 5,
          background: NAVY,
          opacity: interpolate(frame, [418, 438, 560, 596], [0, 0.9, 0.9, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* barely-there signal texture; keeps white field crisp, not beige */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle at 75% 20%, ${PALE} 0, transparent 1px)`,
          backgroundSize: "52px 52px",
          opacity: 0.18,
        }}
      />
    </AbsoluteFill>
  );
};

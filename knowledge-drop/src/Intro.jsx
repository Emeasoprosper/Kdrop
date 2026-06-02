import { useState, useEffect } from "react";

/*
  INTRO SEQUENCE
  - The animated logo flies to EXACT coordinates of the real header logo
  - logoTarget = { top, left, width, height } measured from the real DOM element
  - This eliminates any position mismatch — they are literally the same spot
*/

export default function Intro({ onDone, logoTarget }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timings = [
      600,   // 0→1  circle + lime form
      900,   // 1→2  start typing wordmark
      1800,  // 2→3  fly to corner
      800,   // 3→4  overlay fades
      600,   // 4→5  done
    ];
    let t = 0;
    const timeouts = timings.map((delay, i) => {
      t += delay;
      return setTimeout(() => setPhase(i + 1), t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === 5) onDone();
  }, [phase, onDone]);

  const circleVisible = phase >= 1;
  const limeVisible   = phase >= 1;
  const textTyping    = phase >= 2;
  const atCorner      = phase >= 3;
  const overlayFading = phase === 4;

  // ── When flying to corner, use exact measured position of real logo ─────────
  // logoTarget is { top, left } of the real header logo element
  // We use those exact coords so the animated logo lands perfectly on top of it
  const cornerTop  = logoTarget ? logoTarget.top  : 20;
  const cornerLeft = logoTarget ? logoTarget.left : 24;

  const logoStyle = {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 9999,
    transition: atCorner
      ? "top 0.75s cubic-bezier(0.77,0,0.18,1), left 0.75s cubic-bezier(0.77,0,0.18,1), transform 0.75s cubic-bezier(0.77,0,0.18,1)"
      : "none",
    ...(atCorner
      ? { top: cornerTop, left: cornerLeft, transform: "translate(0, 0)" }
      : { top: "50%",     left: "50%",      transform: "translate(-50%, -50%)" }),
  };

  return (
    <>
      {/* Overlay — dark → white simultaneously with logo flying to corner */}
      {phase < 5 && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: atCorner ? "#ffffff" : "#0e0e1a",
          opacity: overlayFading ? 0 : 1,
          transition: atCorner
            ? "background 0.75s ease, opacity 0.65s ease"
            : "none",
          pointerEvents: phase < 4 ? "all" : "none",
        }} />
      )}

      {/* Animated logo — hidden once overlay is fully gone */}
      {phase >= 1 && phase < 5 && (
        <div style={logoStyle}>

          {/* Logo mark */}
          <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
            {/* Navy circle */}
            <div style={{
              position: "absolute", inset: 0,
              background: "#1A1A3F",
              borderRadius: "50%",
              opacity: circleVisible ? 1 : 0,
              transform: circleVisible ? "scale(1)" : "scale(0.2)",
              transition: "opacity 0.5s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)",
            }} />
            {/* Lime half */}
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: 16, height: 16,
              background: "#D4FF33",
              borderRadius: "8px 0 0 8px",
              transform: limeVisible ? "translate(-50%, -50%)" : "translate(36px, -50%)",
              opacity: limeVisible ? 1 : 0,
              transition: "transform 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.15s, opacity 0.4s ease 0.15s",
              zIndex: 2,
            }} />
          </div>

          {/* Wordmark */}
          <TypeWriter
            text="Knowledge Drop"
            active={textTyping}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "-0.01em",
              color: phase < 3 ? "#ffffff" : "#1A1A3F",
              whiteSpace: "nowrap",
              transition: "color 0.4s ease",
            }}
          />
        </div>
      )}
    </>
  );
}

function TypeWriter({ text, active, style }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) return;
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, [active, text]);

  return (
    <span style={style}>
      {displayed}
      {displayed.length < text.length && active && (
        <span style={{ animation: "blink 0.7s step-end infinite" }}>|</span>
      )}
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
}
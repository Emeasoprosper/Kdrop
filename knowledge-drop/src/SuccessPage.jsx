import { useEffect, useRef } from "react";

const IconCheck = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUpload2 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconHistory = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IconSparkles = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4FF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6z"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4FF33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

function Confetti({ canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const colors = ["#D4FF33", "#ffffff", "#4f46e5", "#1A1A3F"];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize); resize();

    class P {
      constructor(burst) {
        this.x = burst ? window.innerWidth / 2 : Math.random() * canvas.width;
        this.y = burst ? window.innerHeight * 0.35 : -20;
        const angle = Math.random() * Math.PI * 2;
        const v = burst ? Math.random() * 10 + 4 : 0;
        this.vx = burst ? Math.cos(angle) * v : Math.random() * 2 - 1;
        this.vy = burst ? Math.sin(angle) * v : Math.random() * 3 + 1.5;
        this.size = Math.random() * 7 + 3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = 1;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.15 - 0.075;
        this.isBurst = burst;
      }
      update() {
        this.vy += 0.06; this.x += this.vx; this.y += this.vy; this.angle += this.spin;
        this.opacity -= this.isBurst ? 0.007 : (this.y > canvas.height ? 0.03 : 0);
      }
      draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, this.opacity); ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        ctx.restore();
      }
    }

    let raf;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.opacity > 0);
      particles.forEach(p => { p.update(); p.draw(); });
      raf = requestAnimationFrame(animate);
    };

    setTimeout(() => {
      for (let i = 0; i < 60; i++) particles.push(new P(true));
      const rain = setInterval(() => { if (particles.length < 120) particles.push(new P(false)); }, 120);
      setTimeout(() => clearInterval(rain), 4000);
    }, 300);

    animate();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [canvasRef]);
  return null;
}

export default function SuccessPage({ onUploadAnother, onViewDashboard }) {
  const canvasRef = useRef(null);

  return (
    <div style={{ background: "#1A1A3F", minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", position: "relative", overflow: "hidden" }}>
      {/* Confetti canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }} />
      <Confetti canvasRef={canvasRef} />

      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "20%", left: "25%", width: 300, height: 300, background: "rgba(212,255,51,0.06)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "25%", width: 400, height: 400, background: "rgba(79,70,229,0.06)", filter: "blur(100px)", borderRadius: "50%", pointerEvents: "none" }} />

      <div style={{ maxWidth: 560, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, position: "relative", zIndex: 20 }}>

        {/* Main card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 40, padding: "48px 40px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

          {/* Check icon */}
          <div style={{ position: "relative", marginBottom: 8 }}>
            <div style={{ width: 96, height: 96, background: "#D4FF33", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", animation: "checkBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              <style>{`@keyframes checkBounce { from{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} to{transform:scale(1);opacity:1} }`}</style>
              <IconCheck />
            </div>
            <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#D4FF33", borderRadius: "50%", animation: "bounce 1s infinite" }} />
            <div style={{ position: "absolute", bottom: -4, left: -8, width: 12, height: 12, background: "rgba(255,255,255,0.2)", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
          </div>

          <div>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16 }}>
              Thank you for<br />contributing.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, fontWeight: 500, lineHeight: 1.6, maxWidth: 400 }}>
              Your resource has been successfully received and is being processed by our frictionless intelligence system.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <button onClick={onUploadAnother} style={{ background: "#D4FF33", color: "#1A1A3F", padding: "16px 24px", borderRadius: 16, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              <IconUpload2 /> Upload Another File
            </button>
            <button onClick={onViewDashboard} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "16px 24px", borderRadius: 16, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer", border: "1px solid rgba(255,255,255,0.15)", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
              <IconHistory /> View My Contributions
            </button>
          </div>
        </div>

        {/* Bento info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%" }}>
          {[
            { icon: <IconSparkles />, label: "Processing", text: "Our AI is currently indexing your content for better discoverability." },
            { icon: <IconGlobe />, label: "Global Reach", text: "Your resource will soon be available to thousands of educators worldwide." },
          ].map(card => (
            <div key={card.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28, transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,255,51,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                {card.icon}
                <span style={{ fontSize: 10, fontWeight: 800, color: "#D4FF33", textTransform: "uppercase", letterSpacing: "0.12em" }}>{card.label}</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500, fontSize: 14, lineHeight: 1.6 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
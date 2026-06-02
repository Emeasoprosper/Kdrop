import { useState, useEffect, useRef } from "react";
import Intro from "./Intro";
import UploadPage from "./UploadPage";
import SuccessPage from "./SuccessPage";
import DashboardPage from "./DashboardPage";

const API = process.env.REACT_APP_API_URL || "http://localhost:3001";

// ── Icons ─────────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconSparkle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1A1A3F">
    <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6L12 17.2l-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCloudUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconVideo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="15" height="14" rx="2" /><polyline points="17 10 22 7 22 17 17 14" />
  </svg>
);
const IconGroups = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconPeople = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M19 9l1.5 1.5L23 8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconFiles = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconVerified = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4FF33" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    <polyline points="9 12 11 14 15 10" stroke="#D4FF33" strokeWidth="2" />
  </svg>
);
const IconHistory = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconHub = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><circle cx="12" cy="3" r="1.5" /><circle cx="21" cy="12" r="1.5" />
    <circle cx="3" cy="12" r="1.5" /><circle cx="12" cy="21" r="1.5" />
    <line x1="12" y1="6" x2="12" y2="9" /><line x1="15" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="9" y2="12" /><line x1="12" y1="15" x2="12" y2="18" />
  </svg>
);
const IconLogin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A3F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);
const IconShare = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// ── Logo Mark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 32 }) {
  return (
    <div style={{ width: size, height: size, background: "#1A1A3F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: size * 0.5, height: size * 0.5, background: "#D4FF33", borderRadius: `${size * 0.25}px 0 0 ${size * 0.25}px` }} />
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, delay, highlight }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ background: highlight ? "#1A1A3F" : "#fff", borderRadius: 24, boxShadow: highlight ? "0 20px 40px rgba(26,26,63,0.18)" : "0 20px 40px rgba(0,0,0,0.06)", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", position: "relative", overflow: "hidden" }}>
      {highlight && <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,background:"rgba(212,255,51,0.08)",borderRadius:"50%" }}/>}
      <div style={{ marginBottom: 24 }}>{icon}</div>
      <div style={{ fontSize: 48, fontWeight: 800, color: highlight ? "#D4FF33" : "#1A1A3F", lineHeight: 1, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: highlight ? "rgba(255,255,255,0.6)" : "#4F4F6F", textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</div>
    </div>
  );
}

// ── Google Sign In Modal ──────────────────────────────────────────────────────
function GoogleSignInModal({ onClose }) {
  const handleSignIn = () => {
    window.location.href = `${API}/auth/google`;
  };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26,26,63,0.5)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 28, padding: "48px 40px", width: "100%", maxWidth: 400, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center", gap: 24, animation: "modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.88) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
        <LogoMark size={48} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A3F", marginBottom: 8 }}>Sign in to Knowledge Drop</div>
          <div style={{ fontSize: 14, color: "#4F4F6F", lineHeight: 1.6 }}>You will be redirected to Google to authorize access. Files you upload go directly into the shared Knowledge Drop Drive folder.</div>
        </div>
        <button
          onClick={handleSignIn}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "14px 24px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#1A1A3F", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <GoogleLogo />
          Continue with Google
        </button>
        <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", lineHeight: 1.6 }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ logoRef, menuOpen, setMenuOpen, user, onSignInClick, page, setPage, onLogout }) {
  return (
    <header style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div ref={logoRef} onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <LogoMark size={32} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em" }}>Knowledge Drop</span>
        </div>
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="nav-desktop">
          <a href="#" onClick={(e) => { e.preventDefault(); setPage("home"); }} style={{ fontWeight: 600, fontSize: 14, color: page === "home" ? "#1A1A3F" : "#4F4F6F" }}>Home</a>
          <a href="#" style={{ fontWeight: 600, fontSize: 14, color: "#4F4F6F" }}>Explore</a>
          <a href="#" style={{ fontWeight: 600, fontSize: 14, color: "#4F4F6F" }}>Community</a>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px 6px 6px", borderRadius: 999, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer" }} onClick={() => setPage("dashboard")}>
                <UserAvatar user={user} size={28} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "#1A1A3F" }}>{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={onLogout} style={{ background: "none", border: "1px solid #e5e7eb", color: "#6b7280", padding: "8px 16px", borderRadius: 999, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Sign out</button>
            </div>
          ) : (
            <button onClick={onSignInClick} style={{ background: "#1A1A3F", color: "#fff", padding: "8px 24px", borderRadius: 999, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>Sign in</button>
          )}
        </nav>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(v => !v)} style={{ background: "none", border: "none", color: "#1A1A3F", display: "none", alignItems: "center", cursor: "pointer" }}>
          <IconMenu />
        </button>
      </div>
      {menuOpen && (
        <div style={{ padding: "16px 24px 24px", borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 16 }}>
          <a href="#" style={{ fontWeight: 600, fontSize: 15 }}>Home</a>
          <a href="#" style={{ fontWeight: 600, fontSize: 15, color: "#4F4F6F" }}>Explore</a>
          <a href="#" style={{ fontWeight: 600, fontSize: 15, color: "#4F4F6F" }}>Community</a>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <UserAvatar user={user} size={32} />
              <span style={{ fontWeight: 600 }}>{user.name}</span>
            </div>
          ) : (
            <button onClick={onSignInClick} style={{ background: "#1A1A3F", color: "#fff", padding: "12px", borderRadius: 999, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>Sign in</button>
          )}
        </div>
      )}
    </header>
  );
}

// ── User Avatar ───────────────────────────────────────────────────────────────
function UserAvatar({ user, size = 32 }) {
  if (user.avatar) return <img src={user.avatar} alt={user.name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />;
  const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#1A1A3F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color: "#D4FF33", fontWeight: 800, fontSize: size * 0.38 }}>{initials}</span>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [introDone, setIntroDone]     = useState(false);
  const [logoTarget, setLogoTarget]   = useState(null);
  const [showSignIn, setShowSignIn]   = useState(false);
  const [user, setUser]               = useState(null);
  const [page, setPage]               = useState("home");
  const [authChecked, setAuthChecked] = useState(false);
  const logoRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get("auth");
    if (authStatus) window.history.replaceState({}, "", window.location.pathname);

    fetch(`${API}/auth/me`, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          if (authStatus === "success") setPage("upload");
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    const measure = () => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        setLogoTarget({ top: rect.top, left: rect.left });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleLogout = async () => {
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    setPage("home");
  };

  return (
    <div className={introDone ? "page-ready" : ""} style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#1A1A3F", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; font-family: inherit; }
        a { text-decoration: none; color: inherit; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .float { animation: float 6s ease-in-out infinite; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        .reveal-1 { opacity:0; } .reveal-2 { opacity:0; } .reveal-3 { opacity:0; } .reveal-4 { opacity:0; }
        .page-ready .reveal-1 { animation: fadeUp 0.7s ease forwards; animation-delay: 0.05s; }
        .page-ready .reveal-2 { animation: fadeUp 0.7s ease forwards; animation-delay: 0.25s; }
        .page-ready .reveal-3 { animation: fadeUp 0.7s ease forwards; animation-delay: 0.5s; }
        .page-ready .reveal-4 { animation: fadeUp 0.7s ease forwards; animation-delay: 0.75s; }
        .stat-card:hover { transform: translateY(-5px) !important; }
        .bento-hover:hover { background: #fff !important; box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
        .cta-btn:hover { transform: scale(1.05); }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
        .ghost-btn:hover { background: rgba(255,255,255,0.5) !important; }
        .footer-social:hover { background: #1A1A3F !important; color: #fff !important; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .bento-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .bento-span2 { grid-column: span 1 !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-links { grid-template-columns: 1fr 1fr !important; }
          .hero-heading { font-size: 38px !important; line-height: 1.08 !important; }
          .hide-mobile { display: none !important; }
          .hero-section { padding: 12px !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .cta-section { padding: 16px !important; }
          .cta-inner { padding: 48px 24px !important; border-radius: 32px !important; }
          .cta-heading { font-size: 36px !important; }
          .hero-inner-grid { padding: 32px 24px !important; }
          .hero-body-text { font-size: 16px !important; }
          .hero-buttons { flex-direction: column !important; }
          .hero-btn-full { width: 100% !important; justify-content: center !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-btn { display: none !important; }
          .bento-span2 { grid-column: span 2; }
          .bento-grid { grid-template-columns: repeat(4,1fr) !important; }
        }
      `}</style>

      {!introDone && <Intro onDone={() => setIntroDone(true)} logoTarget={logoTarget} />}
      {showSignIn && <GoogleSignInModal onClose={() => setShowSignIn(false)} />}

      <Nav
        logoRef={logoRef}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        onSignInClick={() => setShowSignIn(true)}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />

      {page === "upload"    && <UploadPage user={user} onSuccess={() => setPage("success")} apiBase={API} />}
      {page === "success"   && <SuccessPage onUploadAnother={() => setPage("upload")} onViewDashboard={() => setPage("dashboard")} />}
      {page === "dashboard" && <DashboardPage user={user} onUpload={() => setPage("upload")} />}
      {page === "home"      && <LandingPage onSignInClick={() => setShowSignIn(true)} user={user} setPage={setPage} />}
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function LandingPage({ onSignInClick, user, setPage }) {

  const AvatarRow = () => {
    const colors = ["#4f46e5","#10b981","#f59e0b","#ef4444","#8b5cf6"];
    const initials = ["AO","BK","CE","DE","EF"];
    return (
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ display:"flex" }}>
          {colors.map((c,i) => (
            <div key={i} style={{ width:32, height:32, borderRadius:"50%", background:c, border:"2px solid #D4FF33", marginLeft: i>0 ? -10 : 0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:5-i }}>
              <span style={{ color:"#fff", fontSize:10, fontWeight:800 }}>{initials[i]}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight:800, fontSize:13, color:"#1A1A3F" }}>20k+ signed in</div>
          <div style={{ fontSize:11, color:"rgba(26,26,63,0.5)", fontWeight:500 }}>Join the community</div>
        </div>
      </div>
    );
  };

  return (
    <main>
      {/* Hero */}
      <section className="hero-section" style={{ padding: "16px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", background: "#D4FF33", borderRadius: 40, overflow: "hidden", position: "relative", minHeight: 600, display: "flex", alignItems: "center" }}>
          <div className="hide-mobile" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "25%", background: "#1A1A3F" }} />
          <div className="hero-grid hero-inner-grid" style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 40, width: "100%", padding: "64px", position: "relative", zIndex: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div className="reveal-1" style={{ display: "inline-flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
                <AvatarRow />
              </div>
              <h1 className="hero-heading reveal-2" style={{ fontSize: 64, fontWeight: 800, color: "#1A1A3F", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                Don't Let Valuable Knowledge<br />
                <span style={{ color: "rgba(26,26,63,0.35)" }}>Get Lost</span>
              </h1>
              <p className="hero-body-text reveal-3" style={{ color: "rgba(26,26,63,0.7)", fontWeight: 500, fontSize: 18, maxWidth: 480, lineHeight: 1.6 }}>
                Upload your course materials, notes, videos, projects, presentations, and past questions so they can be preserved for future learning initiatives.
              </p>
              <div className="reveal-4" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
                <div className="hero-buttons" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  {user ? (
                    <button className="primary-btn hero-btn-full" onClick={() => setPage("upload")} style={{ background: "#1A1A3F", color: "#D4FF33", padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", border:"none", cursor:"pointer" }}>
                      Start Uploading <IconArrowRight />
                    </button>
                  ) : (
                    <button className="primary-btn hero-btn-full" onClick={onSignInClick} style={{ background: "#1A1A3F", color: "#fff", padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", border:"none", cursor:"pointer" }}>
                      <GoogleLogo />
                      Sign in with Google
                    </button>
                  )}
                  <button className="ghost-btn hero-btn-full" style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(8px)", color: "#1A1A3F", padding: "16px 32px", borderRadius: 999, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", border:"none", cursor:"pointer" }}>
                    Learn how it works <IconArrowRight />
                  </button>
                </div>
              </div>
            </div>
            <div className="hide-mobile" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="float" style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 32px 64px rgba(0,0,0,0.18)", width: "100%", maxWidth: 320, position: "relative", zIndex: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, background: "#eef2ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><IconCloudUpload /></div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1A1A3F", fontSize: 14 }}>Uploading...</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>4 files selected</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ padding: 12, background: "#f9fafb", borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                      <span>Lecture_Notes.pdf</span><span>75%</span>
                    </div>
                    <div style={{ height: 6, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: "75%", height: "100%", background: "#4f46e5", borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ padding: 12, background: "#f9fafb", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                    <IconVideo />
                    <div style={{ height: 6, background: "#e5e7eb", borderRadius: 999, flex: 1 }} />
                  </div>
                </div>
                <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                  <button style={{ flex: 1, background: "rgba(79,70,229,0.08)", color: "#4f46e5", padding: "12px", borderRadius: 999, fontWeight: 700, fontSize: 12, border:"none", cursor:"pointer" }}>Save as draft</button>
                  <button style={{ flex: 1, background: "#4f46e5", color: "#fff", padding: "12px", borderRadius: 999, fontWeight: 700, fontSize: 12, border:"none", cursor:"pointer" }}>Upload now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div className="stats-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          <StatCard delay={0}   highlight icon={<div style={{ width:56,height:56,background:"rgba(212,255,51,0.15)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center" }}><IconPeople /></div>} value="20k+" label="Signed In" />
          <StatCard delay={80}  icon={<div style={{ width:56,height:56,background:"#D4FF33",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center" }}><IconGroups /></div>} value="8,420+" label="Total Contributors" />
          <StatCard delay={160} icon={<div style={{ width:56,height:56,background:"#eef2ff",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center" }}><IconUpload /></div>} value="24.5k" label="Total Uploads" />
          <StatCard delay={240} icon={<div style={{ width:56,height:56,background:"#fff7ed",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center" }}><IconFiles /></div>} value="150k+" label="Files Collected" />
        </div>
      </section>

      {/* Bento */}
      <section style={{ padding: "80px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <h2 style={{ fontSize: 44, fontWeight: 800, textAlign: "center", marginBottom: 64, color: "#1A1A3F", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          Smart Organization for<br />Deep Learning
        </h2>
        <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, height: 600 }}>
          <div className="bento-span2" style={{ gridRow:"span 2", background:"#1A1A3F", borderRadius:32, padding:48, display:"flex", flexDirection:"column", justifyContent:"flex-end", position:"relative", overflow:"hidden" }}>
            <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.18 }} viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              {Array.from({length:10}).map((_,row)=>Array.from({length:8}).map((_,col)=><circle key={`${row}-${col}`} cx={col*52+26} cy={row*52+26} r="2" fill="#D4FF33"/>))}
              <circle cx="320" cy="80" r="90" fill="none" stroke="#D4FF33" strokeWidth="1.5"/>
              <circle cx="320" cy="80" r="60" fill="none" stroke="#D4FF33" strokeWidth="1"/>
              <circle cx="320" cy="80" r="30" fill="rgba(212,255,51,0.15)"/>
              <circle cx="60" cy="420" r="110" fill="none" stroke="#4f46e5" strokeWidth="1.5"/>
              <line x1="0" y1="200" x2="400" y2="350" stroke="#D4FF33" strokeWidth="0.8"/>
            </svg>
            <div style={{ position:"relative",zIndex:2 }}>
              <div style={{ fontSize:28,fontWeight:800,color:"#fff",marginBottom:16 }}>Universal Access</div>
              <p style={{ color:"rgba(255,255,255,0.6)",fontWeight:500,fontSize:17,lineHeight:1.6 }}>Your contribution ensures that knowledge remains free and accessible to students across the globe, regardless of their institutional affiliation.</p>
            </div>
          </div>
          <div className="bento-span2" style={{ background:"#D4FF33",borderRadius:32,padding:40,display:"flex",flexDirection:"column",justifyContent:"center",gap:16 }}>
            <div style={{ width:48,height:48,background:"#1A1A3F",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center" }}><IconVerified /></div>
            <div style={{ fontSize:22,fontWeight:800,color:"#1A1A3F" }}>Peer Verified</div>
            <p style={{ color:"rgba(26,26,63,0.7)",fontWeight:600,lineHeight:1.5,fontSize:15 }}>Every resource is tagged and categorized by community experts to ensure high-quality educational content.</p>
          </div>
          {[{icon:<IconHistory/>,label:"Legacy Preservation"},{icon:<IconHub/>,label:"Global Network"}].map(item=>(
            <div key={item.label} className="bento-hover" style={{ background:"#f3f4f6",borderRadius:32,padding:32,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",gap:16,transition:"all 0.3s" }}>
              <div style={{ width:64,height:64,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>{item.icon}</div>
              <div style={{ fontWeight:800,color:"#1A1A3F",fontSize:15 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding:"80px 24px" }}>
        <div style={{ maxWidth:1280,margin:"0 auto" }}>
          <div className="cta-inner" style={{ background:"#1A1A3F",borderRadius:48,padding:"96px",textAlign:"center",color:"#fff",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,right:0,width:256,height:256,background:"rgba(212,255,51,0.08)",filter:"blur(80px)",borderRadius:"50%" }}/>
            <div style={{ position:"absolute",bottom:0,left:0,width:256,height:256,background:"rgba(99,102,241,0.08)",filter:"blur(80px)",borderRadius:"50%" }}/>
            <div style={{ position:"relative",zIndex:10,maxWidth:600,margin:"0 auto",display:"flex",flexDirection:"column",gap:32,alignItems:"center" }}>
              <h2 className="cta-heading" style={{ fontSize:56,fontWeight:800,lineHeight:1.1,letterSpacing:"-0.02em" }}>Ready to pass<br/>the torch?</h2>
              <p style={{ fontSize:20,color:"rgba(255,255,255,0.6)",fontWeight:500 }}>Join 20,000+ students and professors building the world's most resilient educational archive.</p>
              <button className="cta-btn" onClick={onSignInClick} style={{ background:"#D4FF33",color:"#1A1A3F",padding:"20px 40px",borderRadius:999,fontWeight:800,fontSize:18,display:"flex",alignItems:"center",gap:12,boxShadow:"0 20px 40px rgba(212,255,51,0.2)",transition:"transform 0.2s",border:"none",cursor:"pointer" }}>
                <IconLogin />
                Start Dropping Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:"#fff",borderTop:"1px solid #f0f0f0",padding:"80px 24px" }}>
        <div className="footer-grid" style={{ maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"5fr 7fr",gap:48 }}>
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <LogoMark size={26} />
              <span style={{ fontWeight:700,fontSize:18 }}>Knowledge Drop</span>
            </div>
            <p style={{ color:"#4F4F6F",fontWeight:500,lineHeight:1.7,maxWidth:320,fontSize:14 }}>© 2026 Knowledge Drop. Frictionless intelligence for educators. Preserving the world's academic assets one drop at a time.</p>
          </div>
          <div className="footer-links" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32 }}>
            {[{heading:"Platform",links:["About Us","Community"]},{heading:"Legal",links:["Privacy Policy","Terms"]}].map(col=>(
              <div key={col.heading} style={{ display:"flex",flexDirection:"column",gap:16 }}>
                <span style={{ fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em" }}>{col.heading}</span>
                {col.links.map(l=><a key={l} href="#" style={{ color:"#4F4F6F",fontWeight:500,fontSize:14 }}>{l}</a>)}
              </div>
            ))}
            <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
              <span style={{ fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:"0.1em" }}>Social</span>
              <div style={{ display:"flex",gap:12 }}>
                <button className="footer-social" style={{ width:40,height:40,borderRadius:"50%",border:"1px solid #e5e7eb",background:"#fff",color:"#1A1A3F",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",cursor:"pointer" }}><IconShare /></button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
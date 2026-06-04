import { useState } from "react";

const IconEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconPlus = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#D4FF33" stroke="#D4FF33" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const IconFile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
);

// Simple bar chart using SVG
function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.v));
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG"];
  return (
    <svg viewBox="0 0 320 120" style={{ width: "100%", height: 120 }}>
      {data.map((d, i) => {
        const h = (d.v / max) * 80;
        const x = i * 40 + 10;
        const y = 90 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={24} height={h} rx="4"
              fill={d.highlight ? "#D4FF33" : "#e5e7eb"} />
            <text x={x + 12} y={110} textAnchor="middle" fontSize="8" fill="#9ca3af" fontFamily="Inter" fontWeight="600">{months[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

const mockUploads = [
  { id:1, title:"Quantum Computing Lecture Notes", type:"PDF", subject:"PHY405", date:"Oct 12", views:428, rating:4.9, status:"live", thumb:null },
  { id:2, title:"Database Normalization Guide", type:"PDF", subject:"CSC302", date:"Oct 28", views:201, rating:4.8, status:"live", thumb:null },
  { id:3, title:"Ethics in AI — Essay", type:"PDF", subject:"GST201", date:"Nov 5", views:104, rating:null, status:"live", thumb:null },
];

export default function DashboardPage({ user, onUpload }) {
  const [tab, setTab] = useState("6M");
  const chartData = [
    {v:20},{v:35},{v:28},{v:55},{v:90,highlight:true},{v:65},{v:40},{v:30}
  ];

  return (
    <div style={{ background: "#1A1A3F", minHeight: "calc(100vh - 64px)", padding: "28px 16px", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .dash-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; }
        .upload-row:hover { background: rgba(255,255,255,0.06) !important; }
        @media(min-width:640px){ .stat-grid { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>

      <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Welcome */}
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
            Your contributions reached <span style={{ color: "#D4FF33", fontWeight: 800 }}>1,240 students</span> this week
          </p>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Welcome back,<br />{user?.name?.split(" ")[0] || "Prof. Miller"}
          </h1>
        </div>

        {/* Profile summary card */}
        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, background: "rgba(212,255,51,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4FF33" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>Profile Summary</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>Updated 2 days ago</div>
            </div>
          </div>
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            {[
              { label: "Total Uploads", value: "84" },
              { label: "Avg. Rating", value: "4.9/5" },
              { label: "Visibility Score", value: "92%" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "8px 14px", background: "rgba(212,255,51,0.08)", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#D4FF33", display: "inline-block" }}>
            Active in Dept. of Computer Science
          </div>
          <button style={{ marginTop: 16, width: "100%", background: "#D4FF33", color: "#1A1A3F", padding: "12px", borderRadius: 999, fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "none" }}>
            <IconEdit /> Edit Profile
          </button>
        </div>

        {/* Performance card */}
        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, color: "#fff", fontSize: 16 }}>Performance</div>
            <div style={{ display: "flex", gap: 2 }}>
              {["6M","1Y"].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{ padding: "4px 12px", borderRadius: 999, fontSize: 11, fontWeight: 800, border: "none", cursor: "pointer", background: tab === t ? "#D4FF33" : "transparent", color: tab === t ? "#1A1A3F" : "rgba(255,255,255,0.4)" }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {[{ label: "Peer Reviews", v: 79 }, { label: "Storage", v: 42, sub: "4.2 / 10 GB" }].map(bar => (
              <div key={bar.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6 }}>
                  <span>{bar.label}</span><span style={{ color: "#D4FF33" }}>{bar.sub || bar.v + "%"}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
                  <div style={{ width: bar.v + "%", height: "100%", background: "#D4FF33", borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", background: "rgba(212,255,51,0.06)", borderRadius: 12, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
            3 more uploads for the Elite Scholar badge
          </div>
        </div>

        {/* Recent uploads */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontWeight: 800, color: "#fff", fontSize: 20 }}>Recent Uploads</h2>
            <button style={{ fontSize: 12, fontWeight: 700, color: "#D4FF33", background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 16 }}>Manage and track your latest contributions.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mockUploads.map(u => (
              <div key={u.id} className="dash-card upload-row" style={{ padding: "18px 20px", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, background: "rgba(79,70,229,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconFile />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{u.title}</div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(212,255,51,0.12)", color: "#D4FF33", padding: "2px 8px", borderRadius: 999 }}>{u.subject}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", padding: "2px 8px", borderRadius: 999 }}>{u.type}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(16,185,129,0.15)", color: "#10b981", padding: "4px 10px", borderRadius: 999 }}>LIVE</span>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                  <span>{u.date}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconEye /> {u.views}</span>
                  {u.rating && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><IconStar /> {u.rating}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="dash-card" style={{ padding: 28 }}>
          <div style={{ fontWeight: 800, color: "#fff", fontSize: 16, marginBottom: 4 }}>Analytics</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginBottom: 20 }}>Monthly breakdown of student engagement</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["6 MONTHS","YEARLY"].map(t => (
              <button key={t} style={{ padding: "6px 14px", borderRadius: 999, fontSize: 10, fontWeight: 800, border: "none", cursor: "pointer", background: t === "6 MONTHS" ? "#D4FF33" : "rgba(255,255,255,0.06)", color: t === "6 MONTHS" ? "#1A1A3F" : "rgba(255,255,255,0.4)" }}>{t}</button>
            ))}
          </div>
          <BarChart data={chartData} />
        </div>

      </div>

      {/* FAB */}
      <button onClick={onUpload} style={{ position: "fixed", bottom: 28, right: 24, width: 56, height: 56, background: "#D4FF33", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(212,255,51,0.4)", cursor: "pointer", border: "none", color: "#1A1A3F", zIndex: 40, transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
        <IconPlus />
      </button>
    </div>
  );
}
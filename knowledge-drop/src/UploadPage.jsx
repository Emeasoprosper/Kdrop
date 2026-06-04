import { useState, useRef } from "react";

// ── Icons (pure SVG, no emoji, no data-dependent) ─────────────────────────────
const IconUploadCloud = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconDraft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IconImage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

// ── Thumbnail Capturer ────────────────────────────────────────────────────────
function captureThumbnail(file) {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
      return;
    }
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 320; canvas.height = 180;
        canvas.getContext("2d").drawImage(video, 0, 0, 320, 180);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => resolve(null);
      return;
    }
    // PDF / doc — return null, we'll show a placeholder icon
    resolve(null);
  });
}

function fileTypeLabel(file) {
  if (file.type === "application/pdf") return "PDF";
  if (file.type.startsWith("video/")) return "VIDEO";
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.name.match(/\.(ppt|pptx)$/i)) return "SLIDES";
  if (file.name.match(/\.(doc|docx)$/i)) return "DOC";
  return "FILE";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// ── Main UploadPage ────────────────────────────────────────────────────────────
export default function UploadPage({ user, onSuccess }) {
  const [files, setFiles] = useState([]);         // [{file, thumb, id}]
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({ title: "", courseCode: "", department: "", level: "", type: "", description: "" });
  const [publishing, setPublishing] = useState(false);
  const inputRef = useRef();

  const addFiles = async (incoming) => {
    const list = Array.from(incoming).slice(0, 10);
    const enriched = await Promise.all(list.map(async (f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      thumb: await captureThumbnail(f),
      label: fileTypeLabel(f),
    })));
    setFiles(prev => [...prev, ...enriched]);
  };

  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handlePublish = () => {
    if (!files.length) return;
    setPublishing(true);
    // Simulate upload — replace with real Google Drive API call
    setTimeout(() => { setPublishing(false); onSuccess(); }, 2000);
  };

  return (
    <div style={{ background: "#f7f8fa", minHeight: "calc(100vh - 64px)", padding: "32px 16px" }}>
      <style>{`
        .upload-drop:hover { border-color: #1A1A3F !important; background: #f0f0ff !important; }
        .file-card:hover .remove-btn { opacity: 1 !important; }
        .field-input:focus { outline: none; border-bottom: 2px solid #1A1A3F !important; }
        select.field-input { appearance: none; -webkit-appearance: none; cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Header */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>New Submission</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A1A3F", letterSpacing: "-0.02em", marginBottom: 8 }}>Upload New Resource</h1>
          <p style={{ color: "#6b7280", fontWeight: 500, lineHeight: 1.6 }}>Share your knowledge with the academic community. High-quality resources improve learning outcomes for everyone.</p>
        </div>

        {/* Upload card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 1px 3px rgba(60,64,67,0.12)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Upload Files</div>

          {/* Drop zone */}
          <div
            className="upload-drop"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{
              border: `2px dashed ${dragging ? "#1A1A3F" : "#c1c6d6"}`,
              borderRadius: 16,
              padding: "40px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragging ? "#f0f0ff" : "#f7f8fa",
              transition: "all 0.2s",
              marginBottom: 16,
            }}
          >
            <input ref={inputRef} type="file" multiple accept="*/*" style={{ display: "none" }} onChange={(e) => addFiles(e.target.files)} />
            <div style={{ width: 56, height: 56, background: "#1A1A3F", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#D4FF33" }}>
              <IconUploadCloud />
            </div>
            <div style={{ fontWeight: 700, color: "#1A1A3F", fontSize: 16, marginBottom: 4 }}>
              Drop your files <span style={{ color: "#4f46e5", textDecoration: "underline" }}>here</span>
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Max. File Size: 50MB</div>
          </div>

          {/* File list with thumbnails */}
          {files.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {files.map((f) => (
                <div key={f.id} className="file-card" style={{ display: "flex", alignItems: "center", gap: 12, background: "#f7f8fa", borderRadius: 12, padding: "10px 14px", position: "relative" }}>
                  {/* Thumbnail */}
                  <div style={{ width: 48, height: 48, borderRadius: 8, overflow: "hidden", background: "#e5e7eb", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {f.thumb ? (
                      <img src={f.thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <IconImage />
                        <span style={{ fontSize: 9, fontWeight: 800, color: "#6b7280", letterSpacing: "0.05em" }}>{f.label}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1A1A3F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.file.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{formatSize(f.file.size)} · {f.label}</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                  <button className="remove-btn" onClick={() => removeFile(f.id)} style={{ opacity: 0, position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "#fee2e2", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#ef4444", transition: "opacity 0.2s" }}>
                    <IconX />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: "#f7f8fa", borderRadius: 12, padding: "28px 16px", textAlign: "center", marginBottom: 24 }}>
              <IconImage />
              <div style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, marginTop: 8 }}>Files will appear here after selection</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            <button style={{ background: "#f3f4f6", color: "#1A1A3F", padding: "14px", borderRadius: 999, fontWeight: 800, fontSize: 14, border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
              <IconDraft /> Save as Draft
            </button>
            <button
              onClick={handlePublish}
              disabled={!files.length || publishing}
              style={{ background: files.length ? "#1A1A3F" : "#e5e7eb", color: files.length ? "#D4FF33" : "#9ca3af", padding: "14px", borderRadius: 999, fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: files.length ? "pointer" : "default", transition: "all 0.2s" }}
            >
              {publishing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
                  <path d="M12 2a10 10 0 0 1 10 10"/>
                </svg>
              ) : <IconSend />}
              {publishing ? "Publishing..." : "Publish Now"}
            </button>
          </div>
        </div>

        {/* Resource details card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 1px 3px rgba(60,64,67,0.12)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1A1A3F", marginBottom: 24 }}>Resource Details</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { key: "title", label: "Resource Title", placeholder: "e.g. Advanced Calculus Lecture Notes" },
              { key: "courseCode", label: "Course Code", placeholder: "MATH402" },
              { key: "department", label: "Department", placeholder: "Mathematics" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{label}</label>
                <input
                  className="field-input"
                  value={form[key]}
                  onChange={(e) => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", background: "#f7f8fa", border: "none", borderBottom: "2px solid #e5e7eb", borderRadius: "8px 8px 0 0", padding: "12px 14px", fontSize: 14, fontWeight: 500, color: "#1A1A3F", fontFamily: "Inter, sans-serif", transition: "border-color 0.2s" }}
                />
              </div>
            ))}
            {/* Level select */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Level</label>
              <div style={{ position: "relative" }}>
                <select className="field-input" value={form.level} onChange={(e) => setForm(p => ({ ...p, level: e.target.value }))}
                  style={{ width: "100%", background: "#f7f8fa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", fontSize: 14, fontWeight: 500, color: form.level ? "#1A1A3F" : "#9ca3af", fontFamily: "Inter, sans-serif" }}>
                  <option value="">Select Level</option>
                  {["100 Level","200 Level","300 Level","400 Level","500 Level","Postgraduate"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            {/* Type select */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Resource Type</label>
              <select className="field-input" value={form.type} onChange={(e) => setForm(p => ({ ...p, type: e.target.value }))}
                style={{ width: "100%", background: "#f7f8fa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", fontSize: 14, fontWeight: 500, color: form.type ? "#1A1A3F" : "#9ca3af", fontFamily: "Inter, sans-serif" }}>
                <option value="">Select Type</option>
                {["Lecture Notes","Past Questions","Textbook","Project","Slides","Video","Other"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {/* Description */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Description</label>
              <textarea
                className="field-input"
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Briefly describe the key learning objectives..."
                rows={4}
                style={{ width: "100%", background: "#f7f8fa", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", fontSize: 14, fontWeight: 500, color: "#1A1A3F", fontFamily: "Inter, sans-serif", resize: "vertical", transition: "border-color 0.2s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
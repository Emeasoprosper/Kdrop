require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
// support multiple allowed client origins via comma-separated env `CLIENT_URLS`
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:3000").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb) {
    // allow non-browser requests like curl (no origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
    cb(new Error('CORS not allowed for origin ' + origin));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// If Vercel routes requests to this file under an `/api` prefix, strip it
app.use((req, res, next) => {
  if (req.url === '/api') req.url = '/';
  else if (req.url.startsWith('/api/')) req.url = req.url.replace(/^\/api/, '');
  next();
});

// when behind a proxy (e.g., Vercel), trust the first proxy so secure cookies work
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || "kb-drop-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    // only use 'none' in production where HTTPS is available
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use("/auth", authRoutes);

// Serve frontend static files if the build folder exists (for Vercel deployment)
const frontBuildPath = path.join(__dirname, '..', 'knowledge-drop', 'build');
if (fs.existsSync(frontBuildPath)) {
  app.use(express.static(frontBuildPath));

  // any non-auth route should serve index.html (single-page app)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/auth') || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontBuildPath, 'index.html'));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ status: "Knowledge Drop server is running" });
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  // when deployed as a serverless function (Vercel), export the app
  module.exports = app;
}

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");

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

app.get("/", (req, res) => {
  res.json({ status: "Knowledge Drop server is running" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} else {
  // when deployed as a serverless function (Vercel), export the app
  module.exports = app;
}

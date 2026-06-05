const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

function parseUrl(value) {
  try {
    return new URL(value.replace(/\/$/, ""));
  } catch {
    return null;
  }
}

function buildUrlFromRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || req.protocol;
  return `${proto}://${req.get("host")}`.replace(/\/$/, "");
}

function getServerUrl(req) {
  const requestUrl = buildUrlFromRequest(req);
  if (process.env.SERVER_URL) {
    const envUrl = parseUrl(process.env.SERVER_URL);
    if (envUrl && (process.env.NODE_ENV === "production" || envUrl.host === req.get("host"))) {
      return envUrl.href.replace(/\/$/, "");
    }
  }
  return requestUrl;
}

function getClientUrl(req) {
  const requestOrigin = req.headers.origin ? req.headers.origin.replace(/\/$/, "") : buildUrlFromRequest(req);
  if (process.env.CLIENT_URL) {
    const envUrl = parseUrl(process.env.CLIENT_URL);
    if (envUrl && (process.env.NODE_ENV === "production" || envUrl.host === req.get("host") || envUrl.href === requestOrigin)) {
      return envUrl.href.replace(/\/$/, "");
    }
  }
  return requestOrigin;
}

function getOAuth2Client(redirectUri) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

router.get("/google", (req, res) => {
  // build redirect URI from request so dev and prod callbacks are supported
  const redirectUri = `${getServerUrl(req)}/auth/callback`;
  const oauth2Client = getOAuth2Client(redirectUri);
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/drive.file",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const clientUrl = getClientUrl(req);
  if (!code) return res.redirect(`${clientUrl}?auth=error`);

  try {
    const redirectUri = `${getServerUrl(req)}/auth/callback`;
    const oauth2Client = getOAuth2Client(redirectUri);
    const { tokens } = await oauth2Client.getToken({ code, redirect_uri: redirectUri });
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    req.session.tokens = tokens;
    req.session.user = {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      avatar: userInfo.picture,
    };

    res.redirect(`${clientUrl}?auth=success`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${clientUrl}?auth=error`);
  }
});

router.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Not authenticated" });
  res.json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

router.post("/upload", upload.array("files", 10), async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: "Not authenticated" });

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(req.session.tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const FOLDER_ID = process.env.DRIVE_FOLDER_ID;
  const { title, courseCode, department, level, type, description } = req.body;

  try {
    const uploaded = [];

    for (const file of req.files) {
      const { Readable } = require("stream");
      const stream = Readable.from(file.buffer);

      const fileMetadata = {
        name: file.originalname,
        parents: [FOLDER_ID],
        description: [
          title && `Title: ${title}`,
          courseCode && `Course: ${courseCode}`,
          department && `Dept: ${department}`,
          level && `Level: ${level}`,
          type && `Type: ${type}`,
          description && `Desc: ${description}`,
        ]
          .filter(Boolean)
          .join(" | "),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: { mimeType: file.mimetype, body: stream },
        fields: "id, name, webViewLink",
      });

      uploaded.push(response.data);
    }

    res.json({ ok: true, files: uploaded });
  } catch (err) {
    console.error("Drive upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

module.exports = router;
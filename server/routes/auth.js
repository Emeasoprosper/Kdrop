const express = require("express");
const { google } = require("googleapis");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.SERVER_URL || "http://localhost:3001"}/auth/callback`
  );
}

router.get("/google", (req, res) => {
  const oauth2Client = getOAuth2Client();
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
  if (!code) return res.redirect(`${process.env.CLIENT_URL}?auth=error`);

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
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

    res.redirect(`${process.env.CLIENT_URL}?auth=success`);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.redirect(`${process.env.CLIENT_URL}?auth=error`);
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
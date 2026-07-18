import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// api handlers (Vercel-style, but compatible with Express req/res)
import contactHandler from "./api/contact.js";
import exhibitorHandler from "./api/exhibitor.js";
import visitorHandler from "./api/visitor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// body parsers — forms ke liye zaroori
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static site (html, css, js, img) root se serve hoga
app.use(express.static(__dirname));

// API routes
app.post("/api/contact", contactHandler);
app.post("/api/exhibitor", exhibitorHandler);
app.post("/api/visitor", visitorHandler);

// agar koi HTML file direct extension ke bina open ho (optional, SEO friendly URLs)
app.get("/:page", (req, res, next) => {
  const filePath = path.join(__dirname, `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "404.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// ── MongoDB ───────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartlearn";
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected:", MONGO_URI))
  .catch(err => console.error("MongoDB connection error:", err));

// ── Express ───────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

const PORT = Number(process.env.API_PORT || 5171);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const allowedOrigins = new Set([
  FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
]);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

// ── Request logger middleware ─────────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;
  // Log request in
  const body = req.body && Object.keys(req.body).length > 0
    ? ` | body: {${Object.keys(req.body).join(", ")}}`
    : "";
  process.stdout.write(`\x1b[36m→ ${method} ${url}${body}\x1b[0m\n`);
  // Log response out
  const origEnd = res.end.bind(res);
  res.end = function (...args) {
    const ms = Date.now() - start;
    const code = res.statusCode;
    const color = code >= 500 ? "\x1b[31m" : code >= 400 ? "\x1b[33m" : "\x1b[32m";
    process.stdout.write(`${color}← ${method} ${url} ${code} (${ms}ms)\x1b[0m\n`);
    return origEnd(...args);
  };
  next();
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/debug/routes", (_req, res) => {
  try {
    const stack = app?._router?.stack || [];
    const routes = stack
      .filter(layer => layer?.route?.path)
      .map(layer => ({ path: layer.route.path, methods: Object.keys(layer.route.methods || {}).filter(m => layer.route.methods[m]) }));
    return res.json({ ok: true, routes });
  } catch (err) { return res.status(500).json({ error: err?.message || "Failed" }); }
});

// ── Mount routes ──────────────────────────────────────────────────────────────
import authRoutes from "./routes/auth.js";
import dataRoutes from "./routes/data.js";
import aiRoutes, { loadLearningVideosStore } from "./routes/ai.js";
import qsvmRoutes from "./routes/qsvm.js";

app.use(authRoutes);
app.use(dataRoutes);
app.use(aiRoutes);
app.use(qsvmRoutes);

// ── Init stores & start ───────────────────────────────────────────────────────
loadLearningVideosStore()
  .catch(err => process.stderr.write(`Video store: ${err?.message}\n`))
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      process.stdout.write(`API listening on http://127.0.0.1:${PORT}\n`);
      // Startup env check
      const check = (label, key) => {
        const v = process.env[key];
        return `  ${v ? "\x1b[32m✓" : "\x1b[31m✗"} ${label}\x1b[0m${v ? ` (${v.slice(0, 12)}...)` : " — NOT SET"}`;
      };
      process.stdout.write([
        "\x1b[36m── Environment ──\x1b[0m",
        check("OPENROUTER_API_KEY", "OPENROUTER_API_KEY"),
        check("OPENROUTER_MODEL", "OPENROUTER_MODEL"),
        check("YOUTUBE_API_KEY", "YOUTUBE_API_KEY"),
        check("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_ID"),
        check("OTP_EMAIL_USER", "OTP_EMAIL_USER"),
        check("OTP_EMAIL_APP_PASSWORD", "OTP_EMAIL_APP_PASSWORD"),
        check("OTP_SECRET", "OTP_SECRET"),
        ""
      ].join("\n") + "\n");
    });
  });

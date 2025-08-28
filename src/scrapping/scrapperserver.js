// server.js
// Run: npm i express cors
// Start: node server.js  (listens on http://localhost:5001)

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());

// ---- CONFIG ----
// Prefer env var; else fall back to your Python path
const PY = process.env.PYTHON_EXE || "C:\\Python313\\python.exe";
// Full absolute path to your Python script:
const SCRIPT = path.resolve(__dirname, "newscrapper.py"); // adjust if script is elsewhere

// Quick health checks
app.get("/api/health", (req, res) => res.json({ ok: true, py: PY, script: SCRIPT }));
app.get("/api/py-check", (req, res) => {
  let replied = false;
  const reply = (status, body) => { if (!replied) { replied = true; res.status(status).json(body); } };
  const child = spawn(PY, args, {
  cwd: path.dirname(SCRIPT),
  windowsHide: true,
  env: { ...process.env, PYTHONIOENCODING: "utf-8" }   // <- key line
});
  let out = "", err = "";

  child.stdout.on("data", d => out += d.toString());
  child.stderr.on("data", d => err += d.toString());
  child.on("error", e => reply(500, { ok: false, error: "Failed to start Python", detail: e.message, py: PY }));
  child.on("close", code => reply(200, { ok: code === 0, code, out: out.trim(), err: err.trim() }));
});

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.status(400).json({ ok: false, error: "Missing q" });

  // args for your SerpAPI-only scraper (no debug noise in stdout)
  const args = [SCRIPT, "--query", q, "--max-products", "8", "--debug", "false"];

  let replied = false;
  const reply = (status, body) => { if (!replied) { replied = true; res.status(status).json(body); } };

  // Ensure we run in the script’s folder (safe with spaces in path)
  const child = spawn(PY, args, { cwd: path.dirname(SCRIPT), windowsHide: true });

  let out = "", err = "";

  child.stdout.on("data", d => { out += d.toString(); });
  child.stderr.on("data", d => { err += d.toString(); });

  child.on("error", (e) => {
    // Happens if Python path is wrong or lacks permission
    reply(500, { ok: false, error: "Failed to start Python", detail: e.message, py: PY, script: SCRIPT });
  });

  // Safety timeout (kill runaway process)
  const killTimer = setTimeout(() => {
    if (!replied) {
      try { child.kill('SIGKILL'); } catch {}
      reply(504, { ok: false, error: "Python timed out", stdout: out, stderr: err });
    }
  }, 60000); // 60s

  child.on("close", (code) => {
    clearTimeout(killTimer);
    if (replied) return;

    if (code !== 0) {
      return reply(500, { ok: false, error: `Python exited with code ${code}`, stderr: err, stdout: out });
    }

    // Our Python prints JSON array last; extract [ ... ] safely
    const start = out.indexOf("[");
    const end = out.lastIndexOf("]");
    if (start === -1 || end === -1 || end <= start) {
      return reply(500, { ok: false, error: "Could not parse Python output", stdout: out, stderr: err });
    }

    let data;
    try {
      data = JSON.parse(out.slice(start, end + 1));
    } catch (e) {
      return reply(500, { ok: false, error: "JSON parse failed", detail: e.message, stdout: out, stderr: err });
    }

    reply(200, { ok: true, data });
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));

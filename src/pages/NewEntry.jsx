import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const MOODS = [
  { id: "Buzzing",    sub: "Full of life",   color: "#F9A8D4", bg: "#FDF2F8", dot: "#EC4899" },
  { id: "Good vibes", sub: "Feeling bright", color: "#FCD34D", bg: "#FFFBEB", dot: "#F59E0B" },
  { id: "Steady",     sub: "Calm & okay",    color: "#86EFAC", bg: "#F0FDF4", dot: "#22C55E" },
  { id: "Meh",        sub: "Just coasting",  color: "#93C5FD", bg: "#EFF6FF", dot: "#3B82F6" },
  { id: "Low",        sub: "Running slow",   color: "#C4B5FD", bg: "#F5F3FF", dot: "#8B5CF6" },
  { id: "Drained",    sub: "Need rest",      color: "#CBD5E1", bg: "#F8FAFC", dot: "#94A3B8" },
];

export default function NewEntry() {
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function saveEntry() {
    if (!text.trim()) return;
    await addDoc(collection(db, "users", auth.currentUser.uid, "entries"), {
      text,
      mood,
      date: serverTimestamp(),
    });
    setDone(true);
    setTimeout(() => navigate("/"), 1200);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #ffffff 0%, #fff0f6 60%, #fce7f3 100%)",
      fontFamily: "'DM Sans', sans-serif", color: "#1C1917",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; }
        textarea:focus { outline: none; border-color: #C4B5FD !important; }
        a { text-decoration: none; }
      `}</style>

      <nav style={{
        background: "rgba(255,240,246,0.9)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid #fce7f3", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "58px", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🌸</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px" }}>moodlap</span>
        </div>
        <Link to="/">
          <button style={{ background: "transparent", border: "1px solid #fce7f3", color: "#78716C", fontSize: "13px", padding: "7px 16px", borderRadius: "99px" }}>← Back</button>
        </Link>
      </nav>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "52px 24px 60px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "38px", color: "#1C1917", marginBottom: "6px", lineHeight: 1.1 }}>
          How are you<br /><em>feeling today?</em>
        </h2>
        <p style={{ fontSize: "14px", color: "#A8A29E", marginBottom: "32px" }}>Pick a mood, then write a little.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          {MOODS.map(m => (
            <button key={m.id} onClick={() => setMood(m.id)} style={{
              background: mood === m.id ? m.bg : "#fff",
              border: `1.5px solid ${mood === m.id ? m.color : "#fce7f3"}`,
              borderRadius: "14px", padding: "14px 18px", textAlign: "left",
              display: "flex", alignItems: "center", gap: "14px", transition: "all 0.15s",
              boxShadow: mood === m.id ? `0 4px 16px ${m.color}66` : "none",
            }}>
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "15px", color: mood === m.id ? m.dot : "#1C1917" }}>{m.id}</div>
                <div style={{ fontSize: "12px", color: "#A8A29E" }}>{m.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Today feels..." rows={4}
          style={{
            width: "100%", background: "#fff", border: "1.5px solid #fce7f3",
            borderRadius: "14px", padding: "14px 16px", fontSize: "14px",
            color: "#44403C", resize: "vertical", lineHeight: 1.65, marginBottom: "16px",
          }} />

        <button onClick={saveEntry} disabled={!text.trim() || done} style={{
          width: "100%",
          background: done ? "#F0FDF4" : (text.trim() ? "#7C3AED" : "#F0EBF8"),
          color: done ? "#16A34A" : (text.trim() ? "#fff" : "#C4B5FD"),
          border: "none", fontWeight: 600, fontSize: "15px",
          padding: "15px", borderRadius: "14px", transition: "all 0.2s",
          cursor: text.trim() ? "pointer" : "not-allowed",
          boxShadow: text.trim() && !done ? "0 4px 16px rgba(124,58,237,0.2)" : "none",
        }}>
          {done ? "✓ Saved! Taking you home…" : "Save entry"}
        </button>
      </div>
    </div>
  );
}
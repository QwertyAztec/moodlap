import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const MOODS = [
  { id: "Buzzing",    color: "#F9A8D4", bg: "#FDF2F8", dot: "#EC4899" },
  { id: "Good vibes", color: "#FCD34D", bg: "#FFFBEB", dot: "#F59E0B" },
  { id: "Steady",     color: "#86EFAC", bg: "#F0FDF4", dot: "#22C55E" },
  { id: "Meh",        color: "#93C5FD", bg: "#EFF6FF", dot: "#3B82F6" },
  { id: "Low",        color: "#C4B5FD", bg: "#F5F3FF", dot: "#8B5CF6" },
  { id: "Drained",    color: "#CBD5E1", bg: "#F8FAFC", dot: "#94A3B8" },
];

function Pill({ label }) {
  const m = MOODS.find(x => x.id === label);
  if (!m) return null;
  return (
    <span style={{
      background: m.bg, color: m.dot,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "11px",
      padding: "3px 10px", borderRadius: "99px", border: `1px solid ${m.color}`,
      display: "inline-flex", alignItems: "center", gap: "5px",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: m.dot, display: "inline-block" }} />
      {label}
    </span>
  );
}

export default function AllEntries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "users", auth.currentUser.uid, "entries"),
      orderBy("date", "desc")
    );
    return onSnapshot(q, snap => {
      setEntries(snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        date: d.data().date?.toDate?.()?.toLocaleString() || "",
      })));
    });
  }, []);

  const deleteEntry = async (entry) => {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "entries", entry.id));
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #ffffff 0%, #fff0f6 60%, #fce7f3 100%)",
      fontFamily: "'DM Sans', sans-serif", color: "#1C1917",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { transition: box-shadow 0.2s, transform 0.2s; }
        .card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.06); transform: translateY(-2px); }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .card:hover .del-btn { opacity: 1; }
        button { font-family: inherit; cursor: pointer; }
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
        <div style={{ display: "flex", gap: "8px" }}>
          <Link to="/">
            <button style={{ background: "transparent", border: "none", color: "#78716C", fontSize: "13px", padding: "7px 14px", borderRadius: "99px" }}>← Home</button>
          </Link>
          <Link to="/new-entry">
            <button style={{
              background: "#7C3AED", color: "#fff", border: "none", fontWeight: 600,
              fontSize: "13px", padding: "8px 18px", borderRadius: "99px",
              boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
            }}>+ Log today</button>
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "44px 24px 60px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "36px", marginBottom: "6px" }}>All entries</h2>
        <p style={{ fontSize: "14px", color: "#A8A29E", marginBottom: "28px" }}>{entries.length} {entries.length === 1 ? "entry" : "entries"} logged</p>

        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌸</div>
            <p style={{ color: "#A8A29E", fontSize: "15px", marginBottom: "20px" }}>No entries yet — start logging your moods!</p>
            <Link to="/new-entry">
              <button style={{
                background: "#7C3AED", color: "#fff", border: "none", fontWeight: 600,
                fontSize: "14px", padding: "12px 26px", borderRadius: "99px",
                boxShadow: "0 4px 14px rgba(124,58,237,0.25)",
              }}>+ Log your first entry</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {entries.map((entry) => (
              <div key={entry.id} className="card" style={{
                background: "#fff", border: "1px solid #fce7f3",
                borderRadius: "16px", padding: "20px 24px", position: "relative",
              }}>
                <button className="del-btn" onClick={() => deleteEntry(entry)} title="Delete entry" style={{
                  position: "absolute", top: "14px", right: "14px",
                  background: "#FFF0F6", border: "1px solid #fce7f3",
                  borderRadius: "99px", width: "28px", height: "28px",
                  color: "#EC4899", fontSize: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", paddingRight: "36px" }}>
                  {entry.mood ? <Pill label={entry.mood} /> : <span />}
                  <span style={{ fontSize: "12px", color: "#C4B5A8" }}>{entry.date}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#44403C", lineHeight: 1.65 }}>{entry.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ borderTop: "1px solid #fce7f3", padding: "20px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "14px", color: "#D6D3D1" }}>moodlap</span>
        <div style={{ display: "flex", gap: "5px" }}>
          {MOODS.map(m => <div key={m.id} style={{ width: "16px", height: "4px", background: m.color, borderRadius: "99px" }} />)}
        </div>
      </div>
    </div>
  );
}
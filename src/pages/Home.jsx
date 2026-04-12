import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MOODS = [
  { id: "Buzzing",    sub: "Full of life",   color: "#F9A8D4", bg: "#FDF2F8", dot: "#EC4899" },
  { id: "Good vibes", sub: "Feeling bright", color: "#FCD34D", bg: "#FFFBEB", dot: "#F59E0B" },
  { id: "Steady",     sub: "Calm & okay",    color: "#86EFAC", bg: "#F0FDF4", dot: "#22C55E" },
  { id: "Meh",        sub: "Just coasting",  color: "#93C5FD", bg: "#EFF6FF", dot: "#3B82F6" },
  { id: "Low",        sub: "Running slow",   color: "#C4B5FD", bg: "#F5F3FF", dot: "#8B5CF6" },
  { id: "Drained",    sub: "Need rest",      color: "#CBD5E1", bg: "#F8FAFC", dot: "#94A3B8" },
];

function getMood(label) { return MOODS.find(m => m.id === label) || null; }

function Pill({ label, tiny }) {
  const m = getMood(label);
  if (!m) return null;
  return (
    <span style={{
      background: m.bg, color: m.dot,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
      fontSize: tiny ? "10px" : "11px",
      padding: tiny ? "2px 8px" : "3px 10px",
      borderRadius: "99px", border: `1px solid ${m.color}`,
      display: "inline-flex", alignItems: "center", gap: "5px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: m.dot, display: "inline-block", flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ── Calendar helpers ──────────────────────────────────────────────
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

function CalendarView({ entries }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const monthName = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });

  // Map date string "D/M/YYYY" → entries
  const byDay = {};
  entries.forEach(e => {
    const d = new Date(e.date);
    if (isNaN(d)) return;
    const key = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(e);
  });

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); setSelected(null); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); setSelected(null); };

  const selectedKey = selected ? `${selected}-${viewMonth}-${viewYear}` : null;
  const selectedEntries = selectedKey ? (byDay[selectedKey] || []) : [];

  return (
    <div style={{ background: "#fff", border: "1px solid #fce7f3", borderRadius: "20px", padding: "24px", marginBottom: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={prevMonth} style={{ background: "none", border: "1px solid #fce7f3", borderRadius: "99px", width: "32px", height: "32px", color: "#78716C", fontSize: "14px" }}>‹</button>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#1C1917" }}>{monthName}</span>
        <button onClick={nextMonth} style={{ background: "none", border: "1px solid #fce7f3", borderRadius: "99px", width: "32px", height: "32px", color: "#78716C", fontSize: "14px" }}>›</button>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "6px" }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", color: "#C4B5A8", fontWeight: 600, letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = `${day}-${viewMonth}-${viewYear}`;
          const dayEntries = byDay[key] || [];
          const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
          const isSelected = selected === day;
          const topMood = dayEntries[0] ? getMood(dayEntries[0].mood) : null;

          return (
            <button key={day} onClick={() => setSelected(isSelected ? null : day)} style={{
              aspectRatio: "1",
              border: isSelected ? "2px solid #7C3AED" : "2px solid transparent",
              borderRadius: "10px",
              background: isSelected ? "#F0EBF8" : (topMood ? topMood.bg : "transparent"),
              cursor: dayEntries.length ? "pointer" : "default",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px",
              position: "relative", padding: "4px",
            }}>
              <span style={{
                fontSize: "12px", fontWeight: isToday ? 700 : 400,
                color: isSelected ? "#7C3AED" : (isToday ? "#7C3AED" : "#44403C"),
              }}>{day}</span>
              {topMood && (
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: topMood.dot }} />
              )}
              {dayEntries.length > 1 && (
                <span style={{ fontSize: "8px", color: topMood?.dot, fontWeight: 700 }}>+{dayEntries.length - 1}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day entries */}
      {selected && (
        <div style={{ marginTop: "20px", borderTop: "1px solid #fce7f3", paddingTop: "16px" }}>
          <p style={{ fontSize: "12px", color: "#A8A29E", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {new Date(viewYear, viewMonth, selected).toLocaleDateString("default", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {selectedEntries.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#C4B5A8" }}>No entries on this day.</p>
          ) : selectedEntries.map((e, i) => (
            <div key={i} style={{ background: "#FAFAF9", borderRadius: "10px", padding: "12px 14px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                {e.mood && <Pill label={e.mood} tiny />}
                <span style={{ fontSize: "11px", color: "#C4B5A8" }}>{new Date(e.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#44403C", lineHeight: 1.55 }}>{e.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────
export default function Home() {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState(null);
  const [view, setView] = useState("feed"); // "feed" | "calendar"

  const load = () => {
    const saved = JSON.parse(localStorage.getItem("entries")) || [];
    setEntries([...saved].reverse());
  };

  useEffect(() => { load(); }, []);

  const deleteEntry = (indexInReversed) => {
    const saved = JSON.parse(localStorage.getItem("entries")) || [];
    // reversed index → original index
    const originalIndex = saved.length - 1 - indexInReversed;
    saved.splice(originalIndex, 1);
    localStorage.setItem("entries", JSON.stringify(saved));
    load();
  };

  const filtered = filter ? entries.filter(e => e.mood === filter) : entries;
  const latest = entries[0];

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
        .card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-2px); }
        .row-card { transition: background 0.15s; }
        .row-card:hover { background: #fdf0f6 !important; }
        .del-btn { opacity: 0; transition: opacity 0.15s; }
        .card:hover .del-btn, .row-card:hover .del-btn { opacity: 1; }
        button { font-family: inherit; cursor: pointer; }
        a { text-decoration: none; }
      `}</style>

      {/* Nav */}
      <nav style={{
        background: "rgba(255,240,246,0.9)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid #fce7f3", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "58px", position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🌸</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "20px", color: "#1C1917" }}>moodlap</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/all-entries">
            <button style={{ background: "transparent", border: "none", color: "#78716C", fontSize: "13px", padding: "7px 14px", borderRadius: "99px" }}>All Entries</button>
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

      {/* Page content — max width container */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #FDF4FF 0%, #EEF2FF 50%, #F0FDF4 100%)",
          borderRadius: "0 0 24px 24px", padding: "44px 32px 36px", marginBottom: "0",
        }}>
          {latest ? (
            <>
              <p style={{ fontSize: "11px", color: "#A8A29E", letterSpacing: "0.08em", marginBottom: "10px", textTransform: "uppercase" }}>
                Latest · {latest.date}
              </p>
              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.1,
                color: "#1C1917", maxWidth: "520px", marginBottom: "14px",
              }}>{latest.text}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                {latest.mood && <Pill label={latest.mood} />}
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,46px)", color: "#1C1917", marginBottom: "12px" }}>How are you feeling?</h1>
              <p style={{ fontSize: "14px", color: "#78716C", marginBottom: "20px" }}>No entries yet — log your first mood.</p>
              <Link to="/new-entry">
                <button style={{ background: "#7C3AED", color: "#fff", border: "none", fontWeight: 600, fontSize: "13px", padding: "10px 22px", borderRadius: "99px", boxShadow: "0 4px 14px rgba(124,58,237,0.25)" }}>+ Log today</button>
              </Link>
            </>
          )}
        </div>

        {/* View toggle + Filter strip */}
        <div style={{ padding: "18px 0 0", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Feed / Calendar toggle */}
          <div style={{ display: "flex", background: "#fff", border: "1px solid #fce7f3", borderRadius: "99px", padding: "3px", marginRight: "8px" }}>
            {["feed", "calendar"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? "#7C3AED" : "transparent",
                color: view === v ? "#fff" : "#78716C",
                border: "none", fontWeight: 500, fontSize: "12px",
                padding: "5px 14px", borderRadius: "99px", transition: "all 0.15s",
              }}>{v === "feed" ? "📋 Feed" : "📅 Calendar"}</button>
            ))}
          </div>

          {view === "feed" && (
            <>
              <span style={{ fontSize: "11px", color: "#C4B5A8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Filter</span>
              <button onClick={() => setFilter(null)} style={{
                background: !filter ? "#7C3AED" : "#F5F5F4", color: !filter ? "#fff" : "#78716C",
                border: "none", fontSize: "12px", fontWeight: 500, padding: "5px 14px", borderRadius: "99px",
              }}>All</button>
              {MOODS.map(m => (
                <button key={m.id} onClick={() => setFilter(filter === m.id ? null : m.id)} style={{
                  background: filter === m.id ? m.bg : "#F5F5F4",
                  color: filter === m.id ? m.dot : "#78716C",
                  border: filter === m.id ? `1px solid ${m.color}` : "1px solid transparent",
                  fontSize: "12px", fontWeight: 500, padding: "5px 14px", borderRadius: "99px", transition: "all 0.15s",
                }}>{m.id}</button>
              ))}
            </>
          )}
        </div>

        {/* Calendar view */}
        {view === "calendar" && (
          <div style={{ marginTop: "20px" }}>
            <CalendarView entries={entries} />
          </div>
        )}

        {/* Feed view */}
        {view === "feed" && (
          <div style={{ paddingTop: "16px", paddingBottom: "56px" }}>
            {filtered.length === 0 ? (
              <p style={{ color: "#A8A29E", fontSize: "14px", textAlign: "center", marginTop: "40px" }}>No entries yet 🌸</p>
            ) : (
              <>
                {/* Top 2 featured cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" }}>
                  {filtered.slice(0, 2).map((entry, i) => (
                    <div key={i} className="card" style={{
                      background: "#fff", border: "1px solid #fce7f3",
                      borderRadius: "16px", padding: "20px", position: "relative",
                    }}>
                      <button className="del-btn" onClick={() => deleteEntry(i)} title="Delete" style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "#FFF0F6", border: "1px solid #fce7f3",
                        borderRadius: "99px", width: "26px", height: "26px",
                        color: "#EC4899", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", paddingRight: "28px" }}>
                        {entry.mood && <Pill label={entry.mood} />}
                      </div>
                      <p style={{ fontSize: "13px", color: "#44403C", lineHeight: 1.65, marginBottom: "10px" }}>{entry.text}</p>
                      <span style={{ fontSize: "11px", color: "#C4B5A8" }}>{entry.date}</span>
                    </div>
                  ))}
                </div>

                {/* Rest as rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {filtered.slice(2).map((entry, i) => (
                    <div key={i} className="row-card" style={{
                      background: "rgba(255,255,255,0.75)", border: "1px solid #fce7f3",
                      borderRadius: "12px", padding: "13px 18px",
                      display: "flex", alignItems: "center", gap: "14px", position: "relative",
                    }}>
                      {entry.mood && <Pill label={entry.mood} tiny />}
                      <div style={{ flex: 1, fontSize: "13px", color: "#44403C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.text}</div>
                      <div style={{ fontSize: "11px", color: "#C4B5A8", whiteSpace: "nowrap" }}>{entry.date}</div>
                      <button className="del-btn" onClick={() => deleteEntry(i + 2)} title="Delete" style={{
                        background: "#FFF0F6", border: "1px solid #fce7f3",
                        borderRadius: "99px", width: "24px", height: "24px",
                        color: "#EC4899", fontSize: "11px", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #fce7f3", padding: "20px 24px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "14px", color: "#D6D3D1" }}>moodlap</span>
        <div style={{ display: "flex", gap: "5px" }}>
          {MOODS.map(m => <div key={m.id} style={{ width: "16px", height: "4px", background: m.color, borderRadius: "99px" }} />)}
        </div>
      </div>
    </div>
  );
}

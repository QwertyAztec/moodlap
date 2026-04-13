import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const MOODS = [
  { color: "#F9A8D4" }, { color: "#FCD34D" }, { color: "#86EFAC" },
  { color: "#93C5FD" }, { color: "#C4B5FD" }, { color: "#CBD5E1" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmail() {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      setError(e.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    }
    setLoading(false);
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setError(e.message.replace("Firebase: ", "").replace(/\(.*\)/, "").trim());
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg, #ffffff 0%, #fff0f6 60%, #fce7f3 100%)",
      fontFamily: "'DM Sans', sans-serif", padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { font-family: inherit; cursor: pointer; }
        input:focus { outline: none; border-color: #C4B5FD !important; }
        input { font-family: inherit; }
      `}</style>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌸</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", color: "#1C1917", marginBottom: "6px" }}>moodlap</h1>
          <p style={{ fontSize: "14px", color: "#A8A29E" }}>Your private mood journal</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #fce7f3", borderRadius: "20px", padding: "32px" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "22px", marginBottom: "24px", color: "#1C1917" }}>
            {isSignUp ? "Create account" : "Welcome back"}
          </h2>

          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            background: "#fff", border: "1.5px solid #fce7f3", borderRadius: "12px",
            padding: "13px", fontSize: "14px", fontWeight: 600, color: "#1C1917",
            marginBottom: "20px", transition: "border-color 0.15s",
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.1C33.5 33.2 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.8 6.5 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.8 6.5 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-4.9l-6-5.2C29.2 35.5 26.7 36 24 36c-5.1 0-9.5-2.9-11.7-7.1l-6.5 5C9.6 39.7 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.1c-1 2.7-2.8 4.9-5.1 6.4l6 5.2C39.6 36.2 44 30.6 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "#fce7f3" }} />
            <span style={{ fontSize: "12px", color: "#C4B5A8" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#fce7f3" }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "12px" }}>
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
              style={{
                width: "100%", border: "1.5px solid #fce7f3", borderRadius: "12px",
                padding: "13px 14px", fontSize: "14px", color: "#1C1917",
                background: "#FAFAF9", transition: "border-color 0.15s",
              }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="password" placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleEmail()}
              style={{
                width: "100%", border: "1.5px solid #fce7f3", borderRadius: "12px",
                padding: "13px 14px", fontSize: "14px", color: "#1C1917",
                background: "#FAFAF9", transition: "border-color 0.15s",
              }}
            />
          </div>

          {error && (
            <div style={{ background: "#FFF0F6", border: "1px solid #fce7f3", borderRadius: "10px", padding: "10px 14px", fontSize: "13px", color: "#EC4899", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button onClick={handleEmail} disabled={loading || !email || !password} style={{
            width: "100%", background: email && password ? "#7C3AED" : "#F0EBF8",
            color: email && password ? "#fff" : "#C4B5FD",
            border: "none", fontWeight: 600, fontSize: "15px",
            padding: "14px", borderRadius: "12px", transition: "all 0.2s",
            boxShadow: email && password ? "0 4px 16px rgba(124,58,237,0.2)" : "none",
          }}>
            {loading ? "..." : isSignUp ? "Create account" : "Sign in"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#A8A29E", marginTop: "20px" }}>
            {isSignUp ? "Already have an account? " : "New here? "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} style={{
              background: "none", border: "none", color: "#7C3AED", fontWeight: 600, fontSize: "13px", padding: 0,
            }}>
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </p>
        </div>

        {/* Mood bar */}
        <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginTop: "24px" }}>
          {MOODS.map((m, i) => <div key={i} style={{ width: "28px", height: "4px", background: m.color, borderRadius: "99px" }} />)}
        </div>
      </div>
    </div>
  );
}
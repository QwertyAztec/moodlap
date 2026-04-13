import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import NewEntry from "./pages/NewEntry";
import AllEntries from "./pages/AllEntries";
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    return onAuthStateChanged(auth, u => setUser(u));
  }, []);

  if (user === undefined) {
    // Loading state — show nothing or a spinner
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff0f6", fontFamily: "sans-serif", color: "#A8A29E" }}>
        🌸
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/new-entry" element={user ? <NewEntry /> : <Navigate to="/login" />} />
        <Route path="/all-entries" element={user ? <AllEntries /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
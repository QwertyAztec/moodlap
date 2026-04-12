import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewEntry from "./pages/NewEntry";
import AllEntries from "./pages/AllEntries";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-entry" element={<NewEntry />} />
        <Route path="/all-entries" element={<AllEntries />} />
      </Routes>
    </BrowserRouter>
  );
}


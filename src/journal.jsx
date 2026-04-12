import { useState, useEffect } from "react";

function Journal() {
  const [entry, setEntry] = useState("");

  // load saved entry when page opens
  useEffect(() => {
    const savedEntry = localStorage.getItem("journalEntry");
    if (savedEntry) {
      setEntry(savedEntry);
    }
  }, []);

  // save whenever text changes
  useEffect(() => {
    localStorage.setItem("journalEntry", entry);
  }, [entry]);

  return (
    <div>
      <h2>My Journal 🎄</h2>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your thoughts..."
      />
    </div>
  );
}

export default Journal;

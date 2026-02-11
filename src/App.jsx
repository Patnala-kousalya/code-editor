import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import "./index.css";
import Editor from "./components/Editor";
import Tabs from "./components/Tabs";
import CommandPalette from "./components/CommandPalette";
import StatusBar from "./components/StatusBar";

const TABS = ["index.js", "style.css", "README.md"];

const INITIAL_FILES = {
  "index.js": "// Start typing...\n",
  "style.css": "/* Styles */\n",
  "README.md": "# Code Editor\n",
};

const DEFAULT_THEME = import.meta.env.VITE_DEFAULT_THEME === "light" ? "light" : "dark";
const SHOW_AI_FAB = import.meta.env.VITE_ENABLE_AI_FAB !== "false";

function formatSavedTime(date) {
  return `Saved ${date.toLocaleTimeString()}`;
}

export default function App() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [status, setStatus] = useState("Ready");
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [events, setEvents] = useState([]);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const typingTimeoutRef = useRef(null);

  const commandItems = useMemo(
    () => [
      { id: "save", label: "Save File" },
      { id: "clear", label: "Clear Editor" },
      { id: "toggle-theme", label: "Toggle Dark Mode" },
    ],
    []
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onWindowKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsPaletteOpen(true);
      }

      if (event.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onWindowKeyDown);

    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
    };
  }, []);

  const markTyping = useCallback(() => {
    setStatus("Typing…");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setStatus("Ready");
    }, 900);
  }, []);

  const handleSave = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setStatus(formatSavedTime(new Date()));
  }, []);

  const handleFileChange = useCallback(
    (nextValue) => {
      setFiles((prev) => ({
        ...prev,
        [activeTab]: nextValue,
      }));

      markTyping();
    },
    [activeTab, markTyping]
  );

  const handleEditorKeyUp = useCallback((payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 11)]);
  }, []);

  const handleExecuteCommand = useCallback(
    (commandId) => {
      if (commandId === "save") {
        handleSave();
      }

      if (commandId === "clear") {
        setFiles((prev) => ({ ...prev, [activeTab]: "" }));
        setStatus("Ready");
      }

      if (commandId === "toggle-theme") {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }

      setPaletteQuery("");
      setIsPaletteOpen(false);
    },
    [activeTab, handleSave]
  );

  return (
    <>
      <div className="app" data-theme={theme}>
        <header className="nav">
          <h1>{import.meta.env.VITE_APP_NAME || "Code Editor"}</h1>
          <Tabs tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <div className="workspace">
          <Editor
            activeTab={activeTab}
            files={files}
            onChange={handleFileChange}
            onSave={handleSave}
            onOpenPalette={() => setIsPaletteOpen(true)}
            onClosePalette={() => setIsPaletteOpen(false)}
            onKeyUp={handleEditorKeyUp}
          />

          <aside className="debug-panel" aria-label="Keyboard events">
            <h3>Event Debugger</h3>
            {events.length === 0 && <p style={{ opacity: 0.6 }}>Press any key...</p>}
            {events.map((eventItem, index) => (
              <div className="debug-item" key={`${eventItem.key}-${index}`}>
                keyup | key: {eventItem.key} | ctrl: {eventItem.ctrl ? "yes" : "no"} |
                shift: {eventItem.shift ? "yes" : "no"}
              </div>
            ))}
          </aside>
        </div>

        <CommandPalette
          open={isPaletteOpen}
          value={paletteQuery}
          onValueChange={setPaletteQuery}
          onClose={() => setIsPaletteOpen(false)}
          onExecute={handleExecuteCommand}
          commands={commandItems}
        />

        {SHOW_AI_FAB && (
          <button className="ai-fab" type="button" aria-label="Open AI assistant">
            AI
          </button>
        )}
      </div>

      <StatusBar status={status} />
    </>
  );
}


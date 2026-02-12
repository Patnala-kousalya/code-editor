import {
  Component,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./index.css";
import Editor from "./components/Editor";
import Tabs from "./components/Tabs";
import CommandPalette from "./components/CommandPalette";
import StatusBar from "./components/StatusBar";
import Toolbar from "./components/Toolbar";
import OutputPanel from "./components/OutputPanel";
import useUndoRedo from "./hooks/useUndoRedo";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import {
  loadEditorState,
  saveActiveTab,
  saveFiles,
  saveTheme,
} from "./state/editorStore";

const TABS = ["index.js", "style.css", "README.md"];

const DEFAULT_FILES = {
  "index.js": "// Start typing...\n",
  "style.css": "/* Styles */\n",
  "README.md": "# Code Editor\n",
};

const DEFAULT_THEME = import.meta.env.VITE_DEFAULT_THEME === "light" ? "light" : "dark";
const SHOW_AI_FAB = import.meta.env.VITE_ENABLE_AI_FAB !== "false";

class EditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    if (this.state.hasError) {
      return (
        <div className="editor-container" role="alert" aria-live="assertive">
          Editor crashed. Please reload.
        </div>
      );
    }

    return this.props.children;
  }
}

const EventDebugger = memo(function EventDebugger({ events }) {
  return (
    <aside className="debug-panel" aria-label="Keyboard events">
      <h3>Event Debugger</h3>
      {events.length === 0 && <p style={{ opacity: 0.6 }}>Press any key...</p>}
      {events.map((eventItem, index) => (
        <div className="debug-item" key={`${eventItem.key}-${eventItem.timestamp}-${index}`}>
          keyup | key: {eventItem.key} | ctrl/meta: {eventItem.ctrlMeta ? "yes" : "no"} |
          shift: {eventItem.shift ? "yes" : "no"} | {eventItem.timestamp}
        </div>
      ))}
    </aside>
  );
});

function formatSavedTime(date) {
  return `Saved ${date.toLocaleTimeString()}`;
}

function formatCode(source, tab) {
  const value = source.replace(/\t/g, "  ").replace(/[ \t]+$/gm, "").trimEnd();

  if (tab === "README.md") {
    return `${value.replace(/\n{3,}/g, "\n\n")}\n`;
  }

  const lines = value.split("\n");
  let indentLevel = 0;

  const formatted = lines.map((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith("}") || line.startsWith("]") || line.startsWith(")")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const prefix = "  ".repeat(indentLevel);
    const nextLine = `${prefix}${line}`;

    if (line.endsWith("{") || line.endsWith("[") || line.endsWith("(")) {
      indentLevel += 1;
    }

    return nextLine;
  });

  return `${formatted.join("\n").replace(/\n{3,}/g, "\n\n")}\n`;
}

function createRunMessage(tab, source) {
  if (!source.trim()) {
    return `${tab}: no content to run.`;
  }

  if (tab === "index.js") {
    const logs = Array.from(source.matchAll(/console\.log\((.*?)\)/g)).map((match) =>
      match[1].replace(/^['"`]|['"`]$/g, "")
    );

    if (logs.length === 0) {
      return "JavaScript executed (simulated). No console output.";
    }

    return `JavaScript console output:\n${logs.join("\n")}`;
  }

  if (tab === "style.css") {
    const rules = source.split("{").length - 1;
    return `CSS parsed (simulated). Rules detected: ${Math.max(rules, 0)}.`;
  }

  const headings = (source.match(/^#{1,6}\s+/gm) || []).length;
  return `Markdown preview refreshed (simulated). Headings: ${headings}.`;
}

export default function App() {
  const initialState = useMemo(
    () =>
      loadEditorState({
        defaultTheme: DEFAULT_THEME,
        defaultFiles: DEFAULT_FILES,
        defaultTab: TABS[0],
        tabs: TABS,
      }),
    []
  );

  const [files, setFiles] = useState(initialState.files);
  const [activeTab, setActiveTab] = useState(initialState.activeTab);
  const [status, setStatus] = useState("Ready");
  const [theme, setTheme] = useState(initialState.theme);
  const [events, setEvents] = useState([]);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [outputItems, setOutputItems] = useState([]);
  const [showOutput, setShowOutput] = useState(false);

  const filesRef = useRef(files);
  const typingDebounceRef = useRef(null);
  const autosaveTimerRef = useRef(null);
  const manualSaveLockRef = useRef(0);

  const { reset, setCurrent, commit, undo, redo, canUndo, canRedo } = useUndoRedo({
    maxHistory: 50,
  });

  useEffect(() => {
    reset(initialState.files);
  }, [initialState.files, reset]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveActiveTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  const currentValue = files[activeTab] ?? "";
  const lineCount = currentValue.length === 0 ? 1 : currentValue.split("\n").length;
  const charCount = currentValue.length;

  const triggerAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      if (Date.now() < manualSaveLockRef.current) {
        return;
      }

      saveFiles(filesRef.current);
      setStatus("Autosaved");
    }, 2000);
  }, []);

  const handleSave = useCallback(() => {
    manualSaveLockRef.current = Date.now() + 500;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    saveFiles(filesRef.current);
    setStatus(formatSavedTime(new Date()));
  }, []);

  const handleFileChange = useCallback(
    (nextValue) => {
      setFiles((prev) => {
        const nextFiles = {
          ...prev,
          [activeTab]: nextValue,
        };

        filesRef.current = nextFiles;
        return nextFiles;
      });

      setCurrent(activeTab, nextValue);
      setStatus("Typing…");

      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      typingDebounceRef.current = setTimeout(() => {
        commit(activeTab, nextValue);
      }, 600);

      triggerAutosave();
    },
    [activeTab, commit, setCurrent, triggerAutosave]
  );

  const applyHistoryValue = useCallback((nextValue) => {
    setFiles((prev) => {
      const nextFiles = { ...prev, [activeTab]: nextValue };
      filesRef.current = nextFiles;
      return nextFiles;
    });
    setStatus("Ready");
  }, [activeTab]);

  const handleUndo = useCallback(() => {
    const nextValue = undo(activeTab);
    applyHistoryValue(nextValue);
  }, [activeTab, applyHistoryValue, undo]);

  const handleRedo = useCallback(() => {
    const nextValue = redo(activeTab);
    applyHistoryValue(nextValue);
  }, [activeTab, applyHistoryValue, redo]);

  const handleFormat = useCallback(() => {
    const formatted = formatCode(filesRef.current[activeTab] ?? "", activeTab);
    commit(activeTab, formatted);
    applyHistoryValue(formatted);
    triggerAutosave();
  }, [activeTab, applyHistoryValue, commit, triggerAutosave]);

  const handleRun = useCallback(() => {
    const source = filesRef.current[activeTab] ?? "";
    const message = createRunMessage(activeTab, source);

    setOutputItems((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        message,
      },
      ...prev,
    ]);
    setShowOutput(true);
    setStatus("Ready");
  }, [activeTab]);

  const handleClearOutput = useCallback(() => {
    setOutputItems([]);
  }, []);

  const handleEditorKeyUp = useCallback((payload) => {
    setEvents((prev) => [payload, ...prev.slice(0, 11)]);
  }, []);

  const handleExecuteCommand = useCallback(
    (commandId) => {
      if (commandId === "save") {
        handleSave();
      }
      if (commandId === "clear") {
        commit(activeTab, "");
        applyHistoryValue("");
        triggerAutosave();
      }
      if (commandId === "toggle-theme") {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      }
      if (commandId === "run") {
        handleRun();
      }
      if (commandId === "format") {
        handleFormat();
      }

      setPaletteQuery("");
      setIsPaletteOpen(false);
    },
    [activeTab, applyHistoryValue, commit, handleFormat, handleRun, handleSave, triggerAutosave]
  );

  const commandItems = useMemo(
    () => [
      { id: "save", label: "Save File" },
      { id: "clear", label: "Clear Editor" },
      { id: "toggle-theme", label: "Toggle Theme" },
      { id: "run", label: "Run File" },
      { id: "format", label: "Format Code" },
    ],
    []
  );

  const shortcutHandlers = useMemo(
    () => ({
      "Ctrl+S": handleSave,
      "Ctrl+K": () => {
        setPaletteQuery("");
        setIsPaletteOpen(true);
      },
      "Ctrl+Shift+P": () => {
        setPaletteQuery("");
        setIsPaletteOpen(true);
      },
      "Ctrl+Z": handleUndo,
      "Ctrl+Y": handleRedo,
      Escape: () => setIsPaletteOpen(false),
    }),
    [handleRedo, handleSave, handleUndo]
  );

  useKeyboardShortcuts({
    handlers: shortcutHandlers,
    enabled: true,
    allowInTextInput: false,
  });

  const onThemeToggle = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const onAiClick = useCallback(() => {
    setStatus("AI assistant placeholder");
  }, []);

  return (
    <>
      <div className={`app ${theme === "light" ? "light" : ""}`} data-theme={theme}>
        <header className="nav">
          <h1>{import.meta.env.VITE_APP_NAME || "Code Editor"}</h1>
          <Tabs tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />
          <button
            className="theme-toggle"
            type="button"
            onClick={onThemeToggle}
            aria-label="Toggle theme mode"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </header>

        <div className="workspace">
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Toolbar
              onRun={handleRun}
              onSave={handleSave}
              onFormat={handleFormat}
              onToggleTheme={onThemeToggle}
              theme={theme}
              canUndo={canUndo(activeTab)}
              canRedo={canRedo(activeTab)}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />

            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              <EditorErrorBoundary>
                <Editor
                  activeTab={activeTab}
                  files={files}
                  theme={theme}
                  onChange={handleFileChange}
                  onKeyUp={handleEditorKeyUp}
                  onCursorChange={setCursor}
                />
              </EditorErrorBoundary>

              <OutputPanel
                visible={showOutput}
                outputItems={outputItems}
                onClear={handleClearOutput}
              />
            </div>
          </div>

          <EventDebugger events={events} />
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
          <button
            className="ai-fab"
            type="button"
            aria-label="Open AI assistant"
            onClick={onAiClick}
          >
            AI
          </button>
        )}
      </div>

      <StatusBar
        status={status}
        lineCount={lineCount}
        charCount={charCount}
        cursor={cursor}
      />
    </>
  );
}

import { memo, useEffect, useRef } from "react";
import MonacoEditor from "@monaco-editor/react";

const LANGUAGE_BY_TAB = {
  "index.js": "javascript",
  "style.css": "css",
  "README.md": "markdown",
};

const Editor = memo(function Editor({
  activeTab,
  files,
  theme,
  onChange,
  onKeyUp,
  onCursorChange,
}) {
  const disposablesRef = useRef([]);
  const handlersRef = useRef({ onKeyUp, onCursorChange });

  useEffect(() => {
    handlersRef.current = { onKeyUp, onCursorChange };
  }, [onKeyUp, onCursorChange]);

  useEffect(() => {
    return () => {
      disposablesRef.current.forEach((item) => item?.dispose?.());
      disposablesRef.current = [];
    };
  }, []);

  const handleMount = (editor) => {
    editor.focus();

    disposablesRef.current.forEach((item) => item?.dispose?.());
    disposablesRef.current = [];

    const keyUpDisposable = editor.onKeyUp((event) => {
      handlersRef.current.onKeyUp({
        key: event.browserEvent.key,
        ctrlMeta: event.browserEvent.ctrlKey || event.browserEvent.metaKey,
        shift: event.browserEvent.shiftKey,
        timestamp: new Date().toLocaleTimeString(),
      });
    });

    const cursorDisposable = editor.onDidChangeCursorPosition((event) => {
      handlersRef.current.onCursorChange({
        line: event.position.lineNumber,
        column: event.position.column,
      });
    });

    disposablesRef.current.push(keyUpDisposable, cursorDisposable);
  };

  const language = LANGUAGE_BY_TAB[activeTab] ?? "plaintext";

  return (
    <div
      className="editor-container"
      id={`panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      aria-label="Code editor panel"
    >
      <MonacoEditor
        height="100%"
        path={activeTab}
        language={language}
        value={files[activeTab]}
        theme={theme === "light" ? "vs" : "vs-dark"}
        loading={
          <div
            aria-label="Editor loading"
            style={{
              height: "100%",
              borderRadius: "14px",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.85,
              transition: "opacity 0.2s ease",
            }}
          >
            Loading editor...
          </div>
        }
        options={{
          minimap: { enabled: false },
          fontSize: 15,
          fontFamily: "JetBrains Mono, monospace",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          smoothScrolling: true,
        }}
        onChange={(value) => onChange(value ?? "")}
        onMount={handleMount}
      />
    </div>
  );
});

export default Editor;

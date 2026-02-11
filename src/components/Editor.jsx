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
  onChange,
  onSave,
  onOpenPalette,
  onClosePalette,
  onKeyUp,
}) {
  const disposablesRef = useRef([]);
  const handlersRef = useRef({ onSave, onOpenPalette, onClosePalette, onKeyUp });

  useEffect(() => {
    handlersRef.current = { onSave, onOpenPalette, onClosePalette, onKeyUp };
  }, [onSave, onOpenPalette, onClosePalette, onKeyUp]);

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

    const keyDownDisposable = editor.onKeyDown((event) => {
      const browserEvent = event.browserEvent;
      const key = browserEvent.key.toLowerCase();
      const isModifier = browserEvent.ctrlKey || browserEvent.metaKey;

      if (isModifier && key === "s") {
        browserEvent.preventDefault();
        handlersRef.current.onSave();
        return;
      }

      if (isModifier && key === "k") {
        browserEvent.preventDefault();
        handlersRef.current.onOpenPalette();
        return;
      }

      if (key === "escape") {
        handlersRef.current.onClosePalette();
      }
    });

    const keyUpDisposable = editor.onKeyUp((event) => {
      handlersRef.current.onKeyUp({
        key: event.browserEvent.key,
        ctrl: event.browserEvent.ctrlKey || event.browserEvent.metaKey,
        shift: event.browserEvent.shiftKey,
      });
    });

    disposablesRef.current.push(keyDownDisposable, keyUpDisposable);
  };

  const language = LANGUAGE_BY_TAB[activeTab] ?? "plaintext";

  return (
    <div
      className="editor-container"
      id={`panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
    >
      <MonacoEditor
        height="100%"
        path={activeTab}
        language={language}
        value={files[activeTab]}
        theme="vs-dark"
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

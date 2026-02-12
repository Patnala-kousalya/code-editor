import { memo } from "react";

const StatusBar = memo(function StatusBar({ status, lineCount, charCount, cursor }) {
  return (
    <footer className="status-bar" role="status" aria-live="polite" aria-atomic="true">
      <span>{status}</span>
      <span style={{ marginLeft: "16px" }}>
        Lines: {lineCount} | Chars: {charCount}
      </span>
      <span style={{ marginLeft: "16px" }}>
        Ln {cursor.line}, Col {cursor.column}
      </span>
    </footer>
  );
});

export default StatusBar;

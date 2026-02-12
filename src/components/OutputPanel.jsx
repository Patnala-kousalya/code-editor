import { memo } from "react";

const OutputPanel = memo(function OutputPanel({ visible, outputItems, onClear }) {
  return (
    <div
      aria-live="polite"
      aria-label="Run output panel"
      style={{
        marginTop: "10px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(2,6,23,0.65)",
        color: "#cbd5e1",
        fontSize: "13px",
        maxHeight: visible ? "220px" : "0px",
        opacity: visible ? 1 : 0,
        overflow: "hidden",
        transform: visible ? "translateY(0)" : "translateY(-4px)",
        transition: "max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span>Output</span>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear output"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0",
            padding: "4px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div style={{ padding: "10px 12px", overflowY: "auto", maxHeight: "160px" }}>
        {outputItems.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No output yet.</div>
        ) : (
          outputItems.map((entry) => (
            <div key={entry.id} style={{ marginBottom: "10px" }}>
              <div style={{ opacity: 0.75, fontSize: "12px" }}>{entry.timestamp}</div>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{entry.message}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default OutputPanel;

import { memo } from "react";

const OutputPanel = memo(function OutputPanel({ visible, output }) {
  return (
    <div
      aria-live="polite"
      style={{
        marginTop: "10px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(2,6,23,0.65)",
        padding: "10px 12px",
        color: "#cbd5e1",
        fontSize: "13px",
        minHeight: "44px",
        maxHeight: visible ? "180px" : "0px",
        opacity: visible ? 1 : 0,
        overflow: "hidden",
        transform: visible ? "translateY(0)" : "translateY(-4px)",
        transition: "max-height 0.25s ease, opacity 0.2s ease, transform 0.2s ease",
      }}
    >
      {visible ? <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{output}</pre> : null}
    </div>
  );
});

export default OutputPanel;

import { memo } from "react";

const buttonBaseStyle = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#e2e8f0",
  padding: "6px 12px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const disabledStyle = {
  opacity: 0.5,
  cursor: "not-allowed",
};

const Toolbar = memo(function Toolbar({
  onRun,
  onSave,
  onFormat,
  onToggleTheme,
  theme,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) {
  const onHover = (event) => {
    if (event.currentTarget.disabled) {
      return;
    }
    event.currentTarget.style.transform = "translateY(-1px)";
    event.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.25)";
  };

  const onLeave = (event) => {
    event.currentTarget.style.transform = "translateY(0)";
    event.currentTarget.style.boxShadow = "none";
  };

  const sharedProps = {
    type: "button",
    style: buttonBaseStyle,
    onMouseEnter: onHover,
    onMouseLeave: onLeave,
  };

  return (
    <div
      aria-label="Editor toolbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button {...sharedProps} onClick={onRun} aria-label="Run code">
        Run
      </button>
      <button {...sharedProps} onClick={onSave} aria-label="Save file">
        Save
      </button>
      <button {...sharedProps} onClick={onFormat} aria-label="Format code">
        Format
      </button>
      <button
        {...sharedProps}
        onClick={onUndo}
        aria-label="Undo"
        disabled={!canUndo}
        style={!canUndo ? { ...buttonBaseStyle, ...disabledStyle } : buttonBaseStyle}
      >
        Undo
      </button>
      <button
        {...sharedProps}
        onClick={onRedo}
        aria-label="Redo"
        disabled={!canRedo}
        style={!canRedo ? { ...buttonBaseStyle, ...disabledStyle } : buttonBaseStyle}
      >
        Redo
      </button>
      <button {...sharedProps} onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? "Light" : "Dark"}
      </button>
    </div>
  );
});

export default Toolbar;

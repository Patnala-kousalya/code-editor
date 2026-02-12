import { memo, useEffect, useMemo, useRef, useState } from "react";

const CommandPalette = memo(function CommandPalette({
  open,
  value,
  onValueChange,
  onClose,
  onExecute,
  commands,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) {
      return commands;
    }

    return commands.filter((command) => command.label.toLowerCase().includes(query));
  }, [commands, value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedIndex(0);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => clearTimeout(timer);
  }, [open]);

  if (!open) {
    return null;
  }

  const executeCurrent = () => {
    const command = filtered[selectedIndex];
    if (!command) {
      return;
    }
    onExecute(command.id);
  };

  const onInputKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1)
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      executeCurrent();
    }
  };

  const handleFocusTrap = (event) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusable = dialogRef.current?.querySelectorAll(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable || focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="palette-box"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleFocusTrap}
      >
        <input
          ref={inputRef}
          autoFocus
          placeholder="Type a command..."
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={onInputKeyDown}
          aria-label="Command input"
        />

        <div className="palette-items" role="listbox" aria-label="Commands">
          {filtered.map((command, index) => (
            <div
              key={command.id}
              role="option"
              tabIndex={0}
              aria-selected={selectedIndex === index}
              className={selectedIndex === index ? "palette-item active" : "palette-item"}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => onExecute(command.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onExecute(command.id);
                }
              }}
            >
              {command.label}
            </div>
          ))}

          {filtered.length === 0 && <div className="palette-item">No command found</div>}
        </div>
      </div>
    </div>
  );
});

export default CommandPalette;

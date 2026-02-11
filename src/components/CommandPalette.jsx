import { memo, useEffect, useMemo, useState } from "react";

const DEFAULT_COMMANDS = [
  { id: "save", label: "Save File" },
  { id: "clear", label: "Clear Editor" },
  { id: "toggle-theme", label: "Toggle Dark Mode" },
];

const CommandPalette = memo(function CommandPalette({
  open,
  value,
  onValueChange,
  onClose,
  onExecute,
  commands = DEFAULT_COMMANDS,
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return commands;
    }

    return commands.filter((command) =>
      command.label.toLowerCase().includes(query)
    );
  }, [commands, value]);

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

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div
        className="palette-box"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(event) => event.stopPropagation()}
      >
        <input
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
              aria-selected={selectedIndex === index}
              className={selectedIndex === index ? "palette-item active" : "palette-item"}
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => onExecute(command.id)}
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

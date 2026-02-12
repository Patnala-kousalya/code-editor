import { useEffect, useRef } from "react";

function normalizeKey(key) {
  if (key.length === 1) {
    return key.toUpperCase();
  }

  const lower = key.toLowerCase();
  if (lower === "escape") return "Escape";
  if (lower === "arrowup") return "ArrowUp";
  if (lower === "arrowdown") return "ArrowDown";
  if (lower === "arrowleft") return "ArrowLeft";
  if (lower === "arrowright") return "ArrowRight";
  return key;
}

function isTextInput(target) {
  if (!target) {
    return false;
  }

  const tagName = target.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || tagName === "select") {
    return true;
  }

  return Boolean(target.isContentEditable);
}

function getCombo(event) {
  const key = normalizeKey(event.key);
  if (key === "Escape") {
    return "Escape";
  }

  const parts = [];
  if (event.ctrlKey || event.metaKey) {
    parts.push("Ctrl");
  }
  if (event.shiftKey) {
    parts.push("Shift");
  }
  if (event.altKey) {
    parts.push("Alt");
  }

  parts.push(key);
  return parts.join("+");
}

export default function useKeyboardShortcuts({
  handlers,
  enabled = true,
  allowInTextInput = false,
}) {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.defaultPrevented) {
        return;
      }

      const combo = getCombo(event);
      if (!allowInTextInput && combo !== "Escape" && isTextInput(event.target)) {
        return;
      }

      const handler = handlersRef.current?.[combo];
      if (!handler) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      handler(event);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [allowInTextInput, enabled]);
}

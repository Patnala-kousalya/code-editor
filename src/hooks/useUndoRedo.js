import { useCallback, useReducer, useRef } from "react";

export default function useUndoRedo({ maxHistory = 50 } = {}) {
  const historiesRef = useRef({});
  const [, forceRender] = useReducer((value) => value + 1, 0);

  const ensure = useCallback((key, initialValue = "") => {
    if (!historiesRef.current[key]) {
      historiesRef.current[key] = {
        stack: [initialValue],
        index: 0,
      };
    }

    return historiesRef.current[key];
  }, []);

  const reset = useCallback(
    (valuesByKey) => {
      const nextHistories = {};

      for (const [key, value] of Object.entries(valuesByKey)) {
        nextHistories[key] = {
          stack: [value],
          index: 0,
        };
      }

      historiesRef.current = nextHistories;
      forceRender();
    },
    [forceRender]
  );

  const setCurrent = useCallback(
    (key, value) => {
      const history = ensure(key, value);
      history.stack[history.index] = value;
    },
    [ensure]
  );

  const commit = useCallback(
    (key, value) => {
      const history = ensure(key, value);
      const current = history.stack[history.index];

      if (current === value) {
        return;
      }

      const truncated = history.stack.slice(0, history.index + 1);
      truncated.push(value);

      if (truncated.length > maxHistory) {
        const overflow = truncated.length - maxHistory;
        history.stack = truncated.slice(overflow);
        history.index = history.stack.length - 1;
      } else {
        history.stack = truncated;
        history.index = history.stack.length - 1;
      }

      forceRender();
    },
    [ensure, maxHistory]
  );

  const undo = useCallback(
    (key) => {
      const history = ensure(key, "");
      if (history.index === 0) {
        return history.stack[0];
      }

      history.index -= 1;
      forceRender();
      return history.stack[history.index];
    },
    [ensure]
  );

  const redo = useCallback(
    (key) => {
      const history = ensure(key, "");
      if (history.index >= history.stack.length - 1) {
        return history.stack[history.index];
      }

      history.index += 1;
      forceRender();
      return history.stack[history.index];
    },
    [ensure]
  );

  const canUndo = useCallback(
    (key) => {
      const history = ensure(key, "");
      return history.index > 0;
    },
    [ensure]
  );

  const canRedo = useCallback(
    (key) => {
      const history = ensure(key, "");
      return history.index < history.stack.length - 1;
    },
    [ensure]
  );

  return {
    reset,
    setCurrent,
    commit,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

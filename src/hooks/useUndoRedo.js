import { useState } from "react";

const useUndoRedo = (initialValue = "") => {
  const [history, setHistory] = useState([initialValue]);
  const [index, setIndex] = useState(0);

  const setValue = (value) => {
    const updatedHistory = history.slice(0, index + 1);
    updatedHistory.push(value);
    setHistory(updatedHistory);
    setIndex(updatedHistory.length - 1);
  };

  const undo = () => {
    if (index > 0) {
      setIndex(index - 1);
      return history[index - 1];
    }
    return history[index];
  };

  const redo = () => {
    if (index < history.length - 1) {
      setIndex(index + 1);
      return history[index + 1];
    }
    return history[index];
  };

  return {
    value: history[index],
    setValue,
    undo,
    redo,
  };
};

export default useUndoRedo;

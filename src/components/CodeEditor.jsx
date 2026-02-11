import { useCallback } from "react";

import useUndoRedo from "../hooks/useUndoRedo";

const CodeEditor = ({ onKeyEvent }) => {
    const { value, setValue, undo, redo } = useUndoRedo("");

    const handleChange = useCallback((e) => {
        setValue(e.target.value);
    }, [setValue]);


    const handleKeyDown = (e) => {
        // CTRL + S save
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();

            onKeyEvent({
                type: "save",
                key: "Ctrl+S",
            });

            return;
        }

        // TAB indentation
        if (e.key === "Tab") {
            e.preventDefault();

            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;

            const newValue =
                value.substring(0, start) + "  " + value.substring(end);

            setValue(newValue);

            // move cursor after spaces
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 2;
            }, 0);

            return;
        }
        // ENTER auto-indent
        if (e.key === "Enter") {
            e.preventDefault();

            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;

            // get text before cursor
            const textBeforeCursor = value.substring(0, start);

            // get current line
            const currentLine = textBeforeCursor.split("\n").pop();

            // detect leading spaces
            const indentation = currentLine.match(/^\s*/)[0];

            const newValue =
                value.substring(0, start) +
                "\n" +
                indentation +
                value.substring(end);

            setValue(newValue);

            // move cursor
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd =
                    start + 1 + indentation.length;
            }, 0);

            return;
        }


        // CTRL + Z
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
            e.preventDefault();
            const undone = undo();
            setValue(undone);
            return;
        }

        // CTRL + SHIFT + Z
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") {
            e.preventDefault();
            const redone = redo();
            setValue(redone);
            return;
        }

        const eventData = {
            key: e.key,
            ctrl: e.ctrlKey,
            shift: e.shiftKey,
            alt: e.altKey,
            type: "keydown",
        };

        onKeyEvent(eventData);
    };
    

    return (
        <div
            style={{
  background: "rgba(255,255,255,0.7)",
  padding: "10px",
  borderRadius: "18px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
  backdropFilter: "blur(10px)",
}}

        >
            {/* GREY FRAME */}
            <div
                style={{
                    background: "#f8fafc",
                    padding: "22px",
                    borderRadius: "20px",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                    backdropFilter: "blur(6px)",
                }}

            >
                {/* WHITE TEXT PAPER */}
                <textarea
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() =>
                        onKeyEvent({ type: "compositionstart", key: "IME Start" })
                    }
                    onCompositionEnd={() =>
                        onKeyEvent({ type: "compositionend", key: "IME End" })
                    }
                    onFocus={(e) =>
                    (e.target.style.boxShadow =
                        "0 0 0 3px rgba(99,102,241,0.25)")
                    }
                    onBlur={(e) =>
                    (e.target.style.boxShadow =
                        "0 6px 18px rgba(0,0,0,0.08)")
                    }

                    style={{
  width: "650px",
  height: "320px",
  background: "#ffffff",
  border: "none",
  borderRadius: "14px",
  padding: "18px",
  fontSize: "16px",
  boxShadow: "inset 0 2px 6px rgba(0,0,0,0.05)",
}}



                />
            </div>
        </div>
    );


};

export default CodeEditor;

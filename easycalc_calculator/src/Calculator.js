import React, { useState } from "react";
import "./Calculator.css";

// PUBLIC_INTERFACE
function Calculator() {
  /** Main calculator container component for EasyCalc.
   * Handles arithmetic, layout, and theme.
   */

  // State to store display value, the last operand, the pending operation, and flag for rewriting input
  const [display, setDisplay] = useState("0");
  const [accumulator, setAccumulator] = useState(null);
  const [pendingOp, setPendingOp] = useState(null);
  const [rewriteNext, setRewriteNext] = useState(false);

  // Colors (from requirements)
  const colors = {
    primary: "#ffffff",
    secondary: "#222222",
    accent: "#007bff",
    lightButton: "#f3f4f6",
    opButton: "#dbeafe"
  };

  // Helper for basic arithmetic
  function compute(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? "Err" : a / b;
      default: return b;
    }
  }

  // PUBLIC_INTERFACE
  function handleButton(value) {
    // Number input
    if (/^[0-9.]$/.test(value)) {
      if (rewriteNext || display === "Err") {
        setDisplay(value === "." ? "0." : value);
        setRewriteNext(false);
      } else {
        if (value === "." && display.includes(".")) return;
        setDisplay(display === "0" && value !== "." ? value : display + value);
      }
    }
    // Operations
    else if (["+", "-", "×", "÷"].includes(value)) {
      if (pendingOp && accumulator !== null && !rewriteNext) {
        const result = compute(accumulator, display, pendingOp);
        setDisplay(String(result));
        setAccumulator(result === "Err" ? null : result);
      } else {
        setAccumulator(display);
      }
      setPendingOp(value);
      setRewriteNext(true);
    }
    // Equal sign
    else if (value === "=") {
      if (pendingOp && accumulator !== null) {
        const result = compute(accumulator, display, pendingOp);
        setDisplay(String(result));
        setAccumulator(null);
        setPendingOp(null);
        setRewriteNext(true);
      }
    }
    // Clear/reset
    else if (value === "C") {
      setDisplay("0");
      setAccumulator(null);
      setPendingOp(null);
      setRewriteNext(false);
    }
  }

  // Layout: display + 4x5 grid of buttons
  // Button order: standard calculator grid
  const buttons = [
    { label: "C", className: "btn-func" },
    { label: "÷", className: "btn-op" },
    { label: "×", className: "btn-op" },
    { label: "-", className: "btn-op" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "+", className: "btn-op" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "=", className: "btn-eq" },
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "", className: "btn-placeholder" },
    { label: "0", className: "btn-zero" },
    { label: ".", className: "btn-dot" },
  ];

  return (
    <div className="easycalc-container">
      <div className="easycalc-display" data-testid="display">
        {display}
      </div>
      <div className="easycalc-keypad">
        {buttons.map((btn, idx) =>
          btn.label ? (
            <button
              key={idx}
              className={`calc-btn ${btn.className || ""}`}
              style={
                btn.className === "btn-op"
                  ? { background: colors.accent, color: colors.primary }
                  : btn.className === "btn-func"
                  ? { background: colors.opButton, color: colors.secondary }
                  : btn.className === "btn-eq"
                  ? { background: colors.accent, color: "#fff" }
                  : {}
              }
              onClick={() => handleButton(btn.label)}
              tabIndex={0}
              aria-label={btn.label}
            >
              {btn.label}
            </button>
          ) : (
            <div key={idx} className="calc-btn btn-empty" />
          )
        )}
      </div>
    </div>
  );
}

export default Calculator;

import React, { useState } from 'react';
import './App.css';

/**
 * Main Container for EasyCalc: A simple calculator implementation in React
 * Supports: addition, subtraction, multiplication, division, clear/reset, and instant result display.
 * Accessible, responsive, and themed using project color scheme.
 */

// Calculator button values definition
const buttons = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', 'C', '=', '+'],
];

// PUBLIC_INTERFACE
function App() {
  // Calculator state: display value, last operand, last operator, whether to clear display on next digit
  const [display, setDisplay] = useState('0');
  const [pendingValue, setPendingValue] = useState(null);
  const [pendingOperator, setPendingOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  function handleButtonClick(val) {
    setError(null);
    if ('0123456789'.includes(val)) {
      handleDigit(val);
    } else if (['+', '-', '*', '/'].includes(val)) {
      handleOperator(val);
    } else if (val === '=') {
      handleEquals();
    } else if (val === 'C') {
      handleClear();
    }
  }

  // PUBLIC_INTERFACE
  function handleDigit(digit) {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }

  // PUBLIC_INTERFACE
  function handleOperator(operator) {
    if (pendingOperator && !waitingForOperand) {
      const result = compute(pendingValue, parseFloat(display), pendingOperator);
      if (result === undefined) {
        setError('Error');
        setDisplay('0');
        setPendingOperator(null);
        setPendingValue(null);
        setWaitingForOperand(false);
      } else {
        setPendingValue(result);
        setDisplay(String(result));
        setPendingOperator(operator);
        setWaitingForOperand(true);
      }
    } else {
      setPendingOperator(operator);
      setPendingValue(parseFloat(display));
      setWaitingForOperand(true);
    }
  }

  // PUBLIC_INTERFACE
  function handleEquals() {
    if (pendingOperator && pendingValue !== null && !waitingForOperand) {
      const result = compute(pendingValue, parseFloat(display), pendingOperator);
      if (result === undefined) {
        setError('Error');
        setDisplay('0');
        setPendingOperator(null);
        setPendingValue(null);
        setWaitingForOperand(false);
      } else {
        setDisplay(String(result));
        setPendingOperator(null);
        setPendingValue(null);
        setWaitingForOperand(true);
      }
    }
  }

  // PUBLIC_INTERFACE
  function handleClear() {
    setDisplay('0');
    setPendingValue(null);
    setPendingOperator(null);
    setWaitingForOperand(false);
    setError(null);
  }

  // PUBLIC_INTERFACE
  function compute(a, b, op) {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        if (b === 0) return undefined;
        return a / b;
      default:
        return b;
    }
  }

  // For keyboard accessibility
  function handleKeyDown(e) {
    const { key } = e;
    if ('0123456789'.includes(key)) {
      handleButtonClick(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
      handleButtonClick(key);
    } else if (key === 'Enter' || key === '=') {
      handleButtonClick('=');
    } else if (key === 'Escape' || key.toUpperCase() === 'C') {
      handleButtonClick('C');
    }
  }

  return (
    <div
      className="app easycalc-main"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{ outline: 'none' }}
      aria-label="EasyCalc Calculator App"
    >
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> EasyCalc
            </div>
            <span style={{
              color: 'var(--kavia-orange)',
              fontWeight: 500,
              fontSize: '1.1rem',
              letterSpacing: 1
            }}>
              By KAVIA AI
            </span>
          </div>
        </div>
      </nav>

      <main>
        <div className="container easycalc-container">
          <h2 className="easycalc-title" style={{ marginBottom: 16, marginTop: 100 }}>Simple Calculator</h2>
          <div className="easycalc-calculator">
            <div className="easycalc-display" aria-live="polite">
              {error ? error : display}
            </div>
            <div className="easycalc-buttons">
              {buttons.map((row, i) =>
                <div className="easycalc-row" key={i}>
                  {row.map((btn) =>
                    <button
                      key={btn}
                      className={`easycalc-btn${'0123456789'.includes(btn) ? '' : ' easycalc-btn-op'}${btn === '=' ? ' easycalc-btn-equals' : ''}${btn === 'C' ? ' easycalc-btn-clear' : ''}`}
                      onClick={() => handleButtonClick(btn)}
                      aria-label={
                        btn === '*'
                          ? 'multiply'
                          : btn === '/'
                            ? 'divide'
                            : btn === 'C'
                              ? 'clear'
                              : btn === '='
                                ? 'equals'
                                : btn
                      }
                    >
                      {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="easycalc-footer">
        <span>
          &copy; {new Date().getFullYear()} KAVIA AI — EasyCalc
        </span>
      </footer>
    </div>
  );
}

export default App;

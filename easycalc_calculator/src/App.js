import React from 'react';
import './App.css';
import Calculator from './Calculator';

// PUBLIC_INTERFACE
function App() {
  // Main App wrapper integrating the EasyCalc calculator
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> EasyCalc
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '100px' }}>
          <Calculator />
        </div>
      </main>
    </div>
  );
}

export default App;
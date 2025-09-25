import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import TimeBrushGame from './components/TimeBrushGame';
import CompletionScreen from './components/CompletionScreen';
import './App.css';

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/game/:id" element={<TimeBrushGame />} />
          <Route path="/complete/:id" element={<CompletionScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

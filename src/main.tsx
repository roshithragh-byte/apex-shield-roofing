import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PitchDemoProvider } from './context/PitchDemoContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PitchDemoProvider>
      <App />
    </PitchDemoProvider>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom';


import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

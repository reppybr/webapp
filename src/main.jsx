import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importar o BrowserRouter
import App from './App';
import './index.css'; // Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolver o <App> com o <BrowserRouter> */}

      <App />

  </React.StrictMode>
);

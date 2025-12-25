import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './utils/axiosLogger.js' // Initialize axios logging
import './index.css'

console.log('🚀 [Main] Application initializing...');
console.log('🌐 [Main] Environment:', {
  mode: import.meta.env.MODE,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  nodeEnv: import.meta.env.NODE_ENV
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

console.log('✅ [Main] Application rendered successfully');


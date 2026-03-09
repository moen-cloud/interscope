import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Apply stored theme on load
const stored = localStorage.getItem('theme')
if (stored === 'light') {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
} else {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./App.css";
import App from './App'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
      <App />
      </Provider>
  </StrictMode>

)

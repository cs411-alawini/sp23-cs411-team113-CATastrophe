import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/styles/index.css'
// import Navbar from './Navbar'
import Router from './Router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import AppCustome from './App_custom.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppCustome/>
  </StrictMode>,
)

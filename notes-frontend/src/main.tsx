import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
  import { ToastContainer, toast } from 'react-toastify';

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <App />
  </StrictMode>,
)

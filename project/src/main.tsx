// project/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App'
import './index.css'

// Configure Framer Motion defaults for subtle animations
const motionConfig = {
  reducedMotion: "user",
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 30
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionConfig {...motionConfig}>
      <App />
    </MotionConfig>
  </React.StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext"

const CLIENTID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')).render(

  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENTID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
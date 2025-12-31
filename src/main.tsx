import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext';
import { CategoriesProvider } from './context/CategoriesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CategoriesProvider>
        <App />
      </CategoriesProvider>
    </AuthProvider>
  </StrictMode>,
)

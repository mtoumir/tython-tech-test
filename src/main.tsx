import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <h1 className='text-center font-medium p-4'>This is a technical test for Tython</h1>
      <AuthContextProvider>
        <RouterProvider router={router} /> 
      </AuthContextProvider>   
    </>
  </StrictMode>,
)

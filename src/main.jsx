import React from 'react'
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MundoCarnesPosRoutes from './routes'
import { Toaster } from 'react-hot-toast'
import './index.css'
import { initQZSecurity } from "./lib/qzSecurity"


const router = createBrowserRouter ( [
  ...MundoCarnesPosRoutes,
  { path: "*" }
])

initQZSecurity()

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <Toaster 
      position="top-right"
      containerStyle={{ top: 100, right: 16 }}
      toastOptions={{ duration: 3000, style: { background: '#841A1A', color: '#fff' } }}
    />
    <RouterProvider router={router}/>
  </React.StrictMode>
)
import React from 'react'
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MundoCarnesPosRoutes from './routes'
import './index.css'


const router = createBrowserRouter ( [
  ...MundoCarnesPosRoutes,
  { path: "*" }
])

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
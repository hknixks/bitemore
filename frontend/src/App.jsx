import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { SnackbarProvider } from 'notistack';
import ErrorPage from './Componet/Password/ErrorPage'
import User from './Componet/User'
import Admin from './Componet/Admin'
import Home from './Componet/Home'
import About from './Componet/User/About';


function App() {
  return (
    <>
      <SnackbarProvider maxSnack={2}>
        <Routes>
          <Route index element={<Home />} />
          <Route path='/contact' element={<About/>} />
          <Route path='/user/*' element={<User />} />
          <Route path='/admin/*' element={<Admin />} />
          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </SnackbarProvider>
    </>
  )
}

export default App

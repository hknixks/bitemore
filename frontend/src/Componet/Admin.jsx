import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminDashboard from './Amin/AdminDashboard'
import AdminSignup from './Amin/Register/AdminSignup'
import AdminLogin from './Amin/Register/AdminLogin'
import AdminLayout from './Amin/AdminLayout'
import AdminUpload from './Amin/AdminUpload'
import Order from './Amin/Order'
import About from './User/About'
import History from './Amin/History'

const Admin = () => {
  return (
    <Routes>
      <Route index path='/' element={<Navigate to={'/admin/login'} />} />
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/signup' element={<AdminSignup />} />



      <Route element={<AdminLayout />} >
        <Route path='/home' element={<Navigate to={'/admin/dashboard'} />} />
        <Route path='/dashboard' element={<AdminDashboard />} />
        <Route path='/order' element={<Order />} />
        <Route path='/upload' element={<AdminUpload />} />
        <Route path='/about' element={<About />} />
        <Route path='/history' element={<History/>} />
        {/* <Route path='/profile' element={<UserProfile />} /> */}
      </Route>
    </Routes>
  )
}

export default Admin
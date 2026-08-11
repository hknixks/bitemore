import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import UserForgotPassword from './User/Password/UserForgotPassword'
import UserLayout from './User/Register/UserLayout'
import UserLogin from './User/Register/UserLogin'
import UserSignup from './User/Register/UserSignup'
import UserMenu from './User/UserMenu'
import UserCart from './User/UserCart'
import UserProfile from './User/UserProfile'
import About from './User/About'
import UserHistory from './User/UserHistory'
import UserResetPassword from './User/Password/UserResetPassword'
import UserCheckout from './User/UserCheckout'
import NavBar from './User/UserNavbar'

const User = () => {
  return (
    <>
      <Routes>
        <Route index path='/' element={<Navigate to={'/user/login'} />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/forgotpassword' element={<UserForgotPassword />} />
        <Route path='/resetPassword' element={<UserResetPassword />} />
        <Route path='/nav' element={<NavBar />} />

        <Route element={<UserLayout />} >
          <Route path='/home' element={<Navigate to={'/menu'} />} />
          <Route path='/menu' element={<UserMenu />} />
          <Route path='/cart' element={<UserCart />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/about' element={<About />} />
          <Route path='/history' element={<UserHistory />} />
          <Route path='/checkout' element={<UserCheckout />} />
        </Route>
      </Routes>
    </>
  )
}

export default User
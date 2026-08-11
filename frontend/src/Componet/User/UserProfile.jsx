import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi'; 
import img from '../../assets/food2.jpg';
import axios from 'axios';
import * as Yup from 'yup';
import baseUrl from '../../BaseUrl';
import { passwordSchema, profileSchema } from '../../SchemaValidator';
import ava from '../../assets/000.png';

const UserProfile = () => {
  const user = useSelector((state) => state.user.user);
  const [editing, setEditing] = useState(false);
  const [editingPass, setEditingPass] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  
  const [userInfo, setUserInfo] = useState({
    id: user._id || '',
    firstName: user.firstname || '',
    lastName: user.lastname || '',
    email: user.email || '',
    phonenumber: user.phonenumber || '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleFileChange = e => {
    const file = e.target.files[0];
    setProfileImage(file);
  };
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await profileSchema.validate(userInfo, { abortEarly: false });

    const formData = new FormData();
    formData.append('firstname', userInfo.firstName);
    formData.append('lastname', userInfo.lastName);
    formData.append('email', userInfo.email);
    formData.append('phonenumber', userInfo.phonenumber);

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const response = await axios.patch(`${baseUrl}/updateUserProfile/${user._id}`, formData);

    if (response.data.status) {
      console.log('Profile updated successfully:', response.data.data);
    }

    setEditing(false);
  } catch (error) {
    if (error.response) {
      console.error('Network error:', error.response.data.message);
    } else if (error.errors) {
      console.error('Profile validation error:', error.errors);
    } else {
      console.error('An unexpected error occurred:', error.message);
    }
  } finally {
    setIsLoading(false);
  }
};

  const [messagee, setMessage] = useState();
  const [dataa, setDataa] = useState();

  const handleSubmitPass = async (e) => {
    e.preventDefault();
  setIsLoading(true);

    try {
      await passwordSchema.validate(userInfo, { abortEarly: false });
      const successMessage = {
        password: userInfo.password,
        newPassword: userInfo.newPassword,
      };

      const response = await axios.patch(`${baseUrl}/password/${user._id}`, successMessage);
      if (response.data.status) {
        setDataa(response.data.message);
        setTimeout(() => {
          setDataa(null);
        }, 6000);
        setUserInfo({
          password: '',
          newPassword: '',
        });
      }
      setEditingPass(false);
    }
    catch (error) {
      if (error.response) {
        console.error('Network error:', error.response.data.message);
      } else if (error.errors) {
        console.error('Profile validation error:', error.errors);
        setMessage(error.errors)

      } else {
        console.error('An unexpected error occurred:', error.message);
      }
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserInfo({
      ...userInfo,
      id: user._id ?? '',
      firstName: user.firstname ?? '',
      lastName: user.lastname ?? '',
      email: user.email ?? '',
      phonenumber: user.phonenumber ?? '',
    })
  }, [user])

  return (
    <>
      <div className=" bg-slate-100 pt-14 mb-10">
        <div className="container mx-auto mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="mr-4 -mt-24 overflow-hidden rounded-full">
                  <img src={user?.profileImage || ava} alt='profile' className="object-cover w-44 h-44" />
                </div>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} className="text-lg text-blue-500 hover:text-blue-700">
                  <FiEdit className="inline-block mr-1" />
                  Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">First Name:</label>
                {editing ? (
                  <input type="text" name="firstName" value={userInfo.firstName} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>{userInfo.firstName}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">Last Name:</label>
                {editing ? (
                  <input type="text" name="lastName" value={userInfo.lastName} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>{userInfo.lastName}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email:</label>
                {editing ? (
                  <input type="email" id="email" name="email" value={userInfo.email} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>{userInfo.email}</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="phonenumber" className="block mb-1">Phone Number:</label>
                {editing ? (
                  <input type="tel" name="phonenumber" value={userInfo.phonenumber} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>{userInfo.phonenumber}</span>
                )}
              </div>
              {editing && (
                <>
                  <div className="mb-4">
                    <label htmlFor="profileImage" className="block mb-1">Profile Image</label>
                    <input type="file" id="profileImage" name="profileImage" onChange={handleFileChange} className="w-full px-3 py-2 border rounded" accept="image/*" />
                  </div>
                  <button disabled={isLoading} name='submit' className="px-4 py-3 w-full text-white bg-red-600 text-2xl rounded">
                    <b>
                      {isLoading ? "Loading..." : "Submit"}
                    </b>
                  </button>
                </>
              )}
            </form>
          </div>

        </div>
        {/* <div className="container mx-auto mt-10 mb-3 text-3xl font-bold underline ps-2">
          Change Password
        </div>
        <div className="container mx-auto mb-10">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <p className='font-bold text-1xl  p-1 rounded-sm  text-center'>{dataa}</p>
              <div className="flex items-center text-3xl font-bold underline">
              </div>
              {!editingPass && (
                <button onClick={() => setEditingPass(true)} className="text-lg text-blue-500 hover:text-blue-700">
                  <FiEdit className="inline-block mr-1" />
                  Edit
                </button>
              )}
            </div>
            <form onSubmit={handleSubmitPass}>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">Password:</label>
                {editingPass ? (
                  <input type="text" name="password" placeholder='old password' value={userInfo.password} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>******</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1">New Password:</label>
                {editingPass ? (
                  <input type="text" name="newPassword" placeholder='new password' value={userInfo.newPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>******</span>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Confirm Password:</label>
                {editingPass ? (
                  <input type="text" placeholder='confirm password' name="confirmPassword" value={userInfo.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
                ) : (
                  <span className='text-lg font-medium first-letter:uppercase ps-6'>******</span>
                )}
                <p className='text-red-700 font-bold'>{messagee}</p>

              </div>
              {editingPass && (
                <button disabled={isLoading} name='submit' className="px-4 py-3 w-full text-white bg-blue-800 text-2xl rounded">
                    <b>
                      {isLoading ? "Loading..." : "Submit"}
                    </b>
                  </button>
              )}
            </form>
          </div>
        </div> */}
      </div>
    </>
  )
}

export default UserProfile
import React, { useEffect, useState } from "react";
import img from '../assets/gather.jpg'
import Fotter from "../Componet/Fotter";
import Navbar from "../Componet/Navbar";
import { useNavigate } from "react-router-dom";
import Whatapp from "../Componet/Dashboard/Whatapp";
import { GiFamilyHouse, GiStairsGoal } from "react-icons/gi";
import { BsUniversalAccess } from "react-icons/bs";
import { FcServices } from "react-icons/fc";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaMortarPestle } from "react-icons/fa6";
// import useGetUser from "../GetUser";
import useUserAuthorization from "../hooks/UserAuth";
// import { useSelector } from "react-redux";


const About = () => {
  const navigate = useNavigate();
  const { user } = useUserAuthorization();

  // const user = useSelector((state) => state.user.user);
  return (
    <>
      <Whatapp />
      <div className=" md:pt-20 pt-14 text">
        <div className="container flex flex-wrap mx-auto text">
          <div className="w-full p-3 text md:w-1/2"><img src={img} alt="" className="h-[400px] md:h-[450px] mx-auto rounded-tr-[80px] rounded-bl-[80px]" /></div>
          <div className="hidden w-full p-3 text-center text md:w-1/2 md:block lg:block">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cupiditate aspernatur consectetur veniam nam? Est laboriosam, provident at, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde, rerum temporibus quas sunt, autem illo culpa recusandae assumenda voluptates hic tempore totam maiores officiis? Eveniet, mollitia odit. Aspernatur, assumenda quisquam. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet odio quia ducimus magnam explicabo, sunt vero repellendus officiis dignissimos eaque distinctio iure, animi totam neque pariatur necessitatibus nihil recusandae nostrum! harum doloremque doloribus recusandae ullam ea odit nobis veritatis illum! Unde, nulla sit!</div>
        </div>
      </div>
      <div className="text">
        <header className="flex items-center justify-center h-20 font-serif text-3xl font-medium text-center uppercase text bg-slate-200">About us</header>
        <div className="container px-4 py-2 mx-auto text">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora repudiandae et aliquam in, dolorem dolores eaque veniam enim, sequi explicabo tempore sit ipsum reprehenderit delectus ad eos? Sapiente nobis neque vel. Odit consequatur animi omnis tempore temporibus molestiae quaerat, rerum fugiat quasi quisquam vitae at optio ipsam atque iure, explicabo suscipit non dignissimos perspiciatis obcaecati, veritatis soluta quis. Repellat necessitatibus inventore rem pariatur provident obcaecati alias? Ipsum minima ea nemo. Vel, quaerat? Sunt doloribus explicabo sequi distinctio nobis laborum repellendus consequatur recusandae fugiat! Repellat excepturi necessitatibus explicabo aut quidem unde quis, beatae delectus voluptatem! Tempore soluta libero sed possimus error!
        </div>
      </div>
      <div className="mx-auto text my-">
        <header className="flex items-center justify-center h-20 font-serif text-3xl font-medium text-center uppercase text bg-slate-200">What Makes Us Different</header>
        <div className="flex flex-wrap justify-between px-2 py-5 text md:px-5">
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <GiFamilyHouse className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">What Makes Us Different</header>
              At save spoon, we take immense pride in offering a dining experience that is truly unparalleled. Our commitment to excellence and innovation is what sets us apart from the rest. Here are the key elements that define our uniqueness:
            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <BsUniversalAccess className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Culinary Mastery</header>
              Our chefs are not just masters of the kitchen; they are artists, crafting each dish with precision, passion, and creativity. Every plate that leaves our kitchen is a masterpiece, a fusion of flavors and textures that tantalize your taste buds.
            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <GiStairsGoal className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Seasonal and Locally Sourced Ingredients</header>
              We believe that the freshest ingredients are the cornerstone of exceptional cuisine. That&lsquo;s why we maintain a close relationship with local farmers and artisans, ensuring that our kitchen is stocked with the finest seasonal produce and ingredients. This farm-to-table approach ensures that every bite bursts with flavor and quality.
            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <GiFamilyHouse className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Worldly Inspiration, Local Flair</header>
              Our menu is a reflection of our global influences, a culinary journey that combines international flavors with local, seasonal ingredients. From Mediterranean-inspired seafood to Asian-infused dishes and American classics with a twist, we offer a diverse range of dishes that cater to every palate.
            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <FaMortarPestle className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Community Engagement</header>
              We are proud to be a part of lagos and consider it our duty to give back to the community that has embraced us. save spoon actively participates in local events, sponsors charity initiatives, and partners with local organizations to make a positive impact. Your support of our restaurant goes beyond the dining experience; it contributes to the well-being of our community.

            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <FaMoneyBillAlt className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Unique and Cozy Ambiance</header>
              Step into save spoon, and you&lsquo;ll enter a world of warmth and sophistication. Our ambiance is thoughtfully designed to create a cozy and inviting atmosphere, making it the perfect backdrop for your dining experience. Whether you&lsquo;re here for a romantic dinner, a family celebration, or a casual get-together, our setting sets the stage for memorable moments.
            </div>
          </div>
          <div className="w-full px-3 my-4 text md:w-1/3 sm:w-1/2">
            <div className="p-2 bg-white border rounded-lg shadow-xl text">
              <FcServices className="mx-auto text-5xl text-center text-sky-800 " />
              <header className="py-2 font-mono text-2xl tracking-widest text-center text-indigo-500 underline underline-offset-4 ">Stellar Services</header>
              Our dedicated staff is not just here to serve; they are here to elevate your experience. Courteous, knowledgeable, and passionate about hospitality, our team is committed to ensuring that your visit is nothing short of exceptional. Your comfort and satisfaction are our top priorities.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="w-full p-3 mx-auto my-5 lg:w-5/6">
            <h1 className="my-8 text-2xl font-bold text-indigo-500 lg:text-4xl">Get in Touch!</h1>
            <input type="text" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Name" />
            <input type="email" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Email" />
            <input type="text" className="w-full px-3 py-2 my-3 text-base leading-8 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Subject" />
            <textarea className="w-full h-32 px-3 py-1 mt-4 text-base leading-6 text-gray-900 transition-colors duration-200 ease-in-out bg-white border border-gray-300 rounded-lg shadow-lg outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 shadow-gray-400 opacity-70" placeholder="Type your massage here..."></textarea>
            <button className="inline-flex px-6 py-2 my-4 text-lg font-medium text-white bg-indigo-600 border-0 rounded focus:outline-none hover:bg-indigo-700">
              Submit
            </button>
          </div>
        </div>
      </div>
      <Fotter />
    </>
  )
}

export default About
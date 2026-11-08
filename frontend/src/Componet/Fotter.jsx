import React from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaInstagram, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import logo from ".././assets/bit.jpeg"

// Change contact details in one place.
const CONTACT = {
  phoneDisplay: '034 260 958',
  phoneHref: 'tel:034260958',
  email: 'bitemore@gmail.com',
  instagramHandle: '@Bitemore',
  instagramUrl: 'https://www.instagram.com/bitemore/',
  whatsappUrl: 'https://api.whatsapp.com/send?phone=2348149445103',
}

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Order food', to: '/user/menu' },
  { label: 'My cart', to: '/user/cart' },
  { label: 'My orders', to: '/user/history' },
  { label: 'About & contact', to: '/contact' },
  { label: 'Log in', to: '/user/login' },
  { label: 'Sign up', to: '/user/signup' },
]

const linkClass =
  'text-gray-300 hover:text-red-400 focus-visible:text-red-400 focus-visible:underline focus:outline-none transition-colors'

const Fotter = () => {
  return (
    <div className="text">
      <footer className="text-white body-font bg-black">
        <div className="container mx-auto px-5 py-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center" aria-label="Bitemore home">
              <img src={logo} alt="" className="h-10 rounded" />
              <span className="ml-3 text-xl font-bold">Bitemore</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-300">
              Fresh, hot meals delivered to your door. Order in a few taps and we handle the rest.
            </p>
            <a
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-5 inline-flex items-center gap-2 text-sm ${linkClass}`}
            >
              <FaInstagram className="text-2xl" aria-hidden="true" />
              {CONTACT.instagramHandle}
            </a>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h2 className="mb-4 text-lg font-semibold tracking-widest uppercase">Quick links</h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className="mb-4 text-lg font-semibold tracking-widest uppercase">Contact us</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-3 ${linkClass}`}
                >
                  <FaWhatsapp className="text-lg text-green-500" aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className={`inline-flex items-center gap-3 ${linkClass}`}>
                  <FaPhoneAlt className="text-base" aria-hidden="true" />
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={`inline-flex items-center gap-3 break-all ${linkClass}`}>
                  <FaEnvelope className="text-base" aria-hidden="true" />
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800">
          <p className="container mx-auto px-5 py-5 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Bitemore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Fotter

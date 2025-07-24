"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdLibraryBooks,
  MdPeople,
  MdFavorite,
  MdOpenInNew,
  MdHelp,
  MdSchedule,
  MdPolicy,
} from "react-icons/md"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    library: [
      { name: "Browse Books", href: "/books", icon: MdLibraryBooks },
      { name: "Digital Resources", href: "#", icon: MdOpenInNew },
      { name: "Research Help", href: "#", icon: MdPeople },
      { name: "Study Spaces", href: "#", icon: MdLocationOn },
    ],
    services: [
      { name: "Book Borrowing", href: "#", icon: MdLibraryBooks },
      { name: "Community Programs", href: "#", icon: MdPeople },
      { name: "Educational Workshops", href: "#", icon: MdLibraryBooks },
      { name: "Digital Literacy", href: "#", icon: MdOpenInNew },
   ],
    support: [
      { name: "Help Center", href: "#", icon: MdHelp },
      { name: "Contact Us", href: "#", icon: MdEmail },
      { name: "Library Hours", href: "#", icon: MdSchedule },
      { name: "Policies", href: "#", icon: MdPolicy },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, href: "#", color: "hover:text-blue-400" },
    { name: "Twitter", icon: FaTwitter, href: "#", color: "hover:text-sky-400" },
    { name: "Instagram", icon: FaInstagram, href: "#", color: "hover:text-pink-400" },
    { name: "Youtube", icon: FaYoutube, href: "#", color: "hover:text-red-400" },
  ]

  const branches = [
    { name: "Lewa Primary Library", address: "256, Timau", phone: "+254112345555" },
    { name: "Community Branch", address: "122, meru", phone: "+2541123456789" },
    { name: "University Branch", address: "789 Campus Drive, University", phone: "+254123123232" },
  ]

  return (
    <footer className="bg-primary-500 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              {/* Logo */}
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden">
                  <img
                    src="/key-logo.ico"
                    alt="KEY Libraries"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "flex"
                    }}
                  />
                  <div
                    className="w-full h-full bg-primary-500 text-white font-bold text-lg items-center justify-center hidden"
                    style={{ display: "none" }}
                  >
                    KEY
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display">KEY Library</h3>
                  <p className="text-xs text-white/80">Knowledge Empowering Youth</p>
                </div>
              </div>

              <p className="text-white/80 text-sm leading-relaxed">
                Empowering communities through knowledge, fostering learning, and connecting people with resources.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-primary-400 ${social.color}`}
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-base font-semibold mb-4 text-white">Library Services</h4>
              <ul className="space-y-2">
                {footerLinks.library.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group text-sm"
                    >
                      <link.icon className="w-3.5 h-3.5 group-hover:scale-105 transition-transform duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Services */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-base font-semibold mb-4 text-white">Community Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group text-sm"
                    >
                      <link.icon className="w-3.5 h-3.5 group-hover:scale-105 transition-transform duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-base font-semibold mb-4 text-white">Contact & Support</h4>
              <ul className="space-y-2 mb-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group text-sm"
                    >
                      <link.icon className="w-3.5 h-3.5 group-hover:scale-105 transition-transform duration-300" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-white/80">
                  <MdEmail className="w-3.5 h-3.5 text-white" />
                  <span className="text-sm">info@keylibraries.org</span>
                </div>
                <div className="flex items-center space-x-2 text-white/80">
                  <MdPhone className="w-3.5 h-3.5 text-white" />
                  <span className="text-sm">+254 707665778</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Branch Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 pt-6 border-t border-white/20"
        >
          <h4 className="text-base font-semibold mb-4 text-white text-center">Our Locations</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {branches.map((branch, index) => (
              <div
                key={branch.name}
                className="bg-primary-600/50 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <h5 className="font-semibold text-white mb-2 text-sm">{branch.name}</h5>
                <div className="space-y-1.5">
                  <div className="flex items-start space-x-2 text-white/80">
                    <MdLocationOn className="w-3.5 h-3.5 text-white mt-0.5 flex-shrink-0" />
                    <span className="text-xs">{branch.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80">
                    <MdPhone className="w-3.5 h-3.5 text-white" />
                    <span className="text-xs">{branch.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 bg-primary-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-2 text-white/80 text-xs">
              <span>© {currentYear} KEY Libraries. All rights reserved.</span>
            </div>

            <div className="flex items-center space-x-4 text-xs text-white/80">
              <Link to="#" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-white transition-colors duration-300">
                Accessibility
              </Link>
            </div>

            <div className="flex items-center space-x-1.5 text-white/80 text-xs">
              <span>Made with</span>
              <MdFavorite className="w-3.5 h-3.5 text-red-400" />
              <span>for our community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

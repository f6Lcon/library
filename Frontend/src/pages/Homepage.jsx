"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"

const Homepage = () => {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Rita's Cloudinary image URL (you'll get this after running the setup script)
  const ritaImageUrl =
    "https://res.cloudinary.com/your-cloud-name/image/upload/v1/key-library/profiles/rita-field-marsham.webp"

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
      title: "Main Branch Reading Hall",
      description: "Students enjoying quiet study time in our spacious reading areas",
    },
    {
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop",
      title: "Community Learning Space",
      description: "Collaborative learning environments for group studies",
    },
    {
      url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=600&fit=crop",
      title: "Digital Learning Center",
      description: "Modern technology integrated with traditional learning",
    },
  ]

  const facilities = [
    {
      icon: "📚",
      title: "Extensive Book Collection",
      description: "Over 50,000 books across all genres and academic subjects",
      features: ["Fiction & Non-Fiction", "Academic Textbooks", "Research Materials", "Digital Archives"],
    },
    {
      icon: "💻",
      title: "Digital Learning Centers",
      description: "State-of-the-art computer labs and digital resources",
      features: ["High-Speed Internet", "Research Databases", "Online Learning Platforms", "Digital Literacy Programs"],
    },
    {
      icon: "👥",
      title: "Study Spaces",
      description: "Variety of learning environments for different needs",
      features: ["Quiet Study Areas", "Group Discussion Rooms", "Collaborative Workspaces", "Private Study Pods"],
    },
    {
      icon: "🎓",
      title: "Educational Programs",
      description: "Workshops, seminars, and skill development programs",
      features: ["Reading Clubs", "Research Workshops", "Digital Skills Training", "Academic Support"],
    },
    {
      icon: "🌐",
      title: "Community Outreach",
      description: "Programs connecting libraries with local communities",
      features: ["Mobile Library Services", "School Partnerships", "Community Events", "Literacy Programs"],
    },
    {
      icon: "♿",
      title: "Accessibility Services",
      description: "Ensuring equal access to knowledge for everyone",
      features: ["Wheelchair Accessibility", "Audio Books", "Large Print Materials", "Assistive Technology"],
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.url || "/placeholder.svg"} alt={image.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 via-primary-800/60 to-primary-700/40"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
                <span className="text-primary-600 font-bold text-4xl">K</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-primary-200">KEY Library</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-primary-100 font-semibold">Knowledge Empowering Youth</p>
            <p className="text-xl mb-8 text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Discover knowledge, explore worlds, and unlock your potential across our network of modern libraries
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                📚 Explore Our Collection
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="bg-primary-400 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-300 transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  📊 Go to Dashboard
                </Link>
              )}
            </div>

            {/* Image Indicators */}
            <div className="flex justify-center space-x-3">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            {/* Current Image Info */}
            <div className="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
              <h3 className="font-bold text-lg">{heroImages[currentSlide].title}</h3>
              <p className="text-primary-200 text-sm">{heroImages[currentSlide].description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-primary-200 font-semibold">Books Available</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2">7</div>
              <div className="text-primary-200 font-semibold">Branch Locations</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2">15K+</div>
              <div className="text-primary-200 font-semibold">Active Members</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-primary-200 font-semibold">Digital Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section - Founder */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Founder</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The visionary leader who established KEY Library with a mission to empower youth through knowledge and
              education
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Rita Field-Marsham */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Photo */}
                <div className="order-2 lg:order-1">
                  <div className="relative">
                    <img
                      src={ritaImageUrl || "/placeholder.svg"}
                      alt="Rita Field-Marsham - Founder & CEO"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                      onError={(e) => {
                        // Fallback to placeholder if Cloudinary image fails
                        e.target.src =
                          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face"
                      }}
                    />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">K</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="order-1 lg:order-2 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Rita Field-Marsham</h3>
                  <p className="text-primary-600 font-semibold text-xl mb-6">Founder & CEO</p>

                  <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                    <p>
                      As a Kenyan-born lawyer, Rita has always been aware of the transformative power of language,
                      reading and a well-rounded education. It has been a very personal goal of hers to ensure children
                      have the knowledge they need to shape and transform their own destinies.
                    </p>

                    <p>
                      Before moving to Canada in 2004, Rita was a lawyer in private practice in Kenya and provided pro
                      bono legal services to the High Court, Court of Appeal, and FIDA-Kenya for litigants unable to
                      afford the services of a lawyer.
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">
                        Board Director - Kenya Scholar Access Program (KenSAP)
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">
                        Board Director - Andre De Grasse Family Foundation
                      </span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                      <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">Board Governor - MPESA Foundation Academy</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      ⚖️ Legal Advocate
                    </span>
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      📚 Education Champion
                    </span>
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      🌍 Global Leader
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-xl text-primary-100 max-w-4xl mx-auto leading-relaxed mb-6">
              "I believe that knowledge is the most powerful tool for empowering youth and building stronger
              communities. Through KEY Library, we're creating spaces where curiosity thrives, learning never stops, and
              every individual has the opportunity to unlock their full potential and shape their own destiny."
            </p>
            <p className="text-primary-200 italic">- Rita Field-Marsham, Founder & CEO</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold">2004</div>
                <div className="text-primary-200">Vision Born</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">7</div>
                <div className="text-primary-200">Branches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">15K+</div>
                <div className="text-primary-200">Lives Transformed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-20 bg-gradient-to-br from-primary-50 via-white to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">World-Class Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the comprehensive range of services and amenities designed to enhance your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-primary-100"
              >
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{facility.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{facility.title}</h3>
                  <p className="text-gray-600">{facility.description}</p>
                </div>

                <div className="space-y-3">
                  {facility.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Library Branches Showcase */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Library Network</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the beauty and functionality of our modern library spaces across the city
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Branch */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                alt="Main Branch"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Main Branch</h3>
                <p className="text-sm text-gray-200">Downtown • 4 Floors • 24/7 Access</p>
              </div>
            </div>

            {/* North Branch */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop"
                alt="North Branch"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">North Branch</h3>
                <p className="text-sm text-gray-200">Northside • Modern Design • Tech Hub</p>
              </div>
            </div>

            {/* Community Branch */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
                alt="Community Branch"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Community Branch</h3>
                <p className="text-sm text-gray-200">Residential • Family Friendly • Events</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Begin Your Learning Journey?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Join thousands of learners who trust KEY Library for their educational and personal growth needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/books"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              📚 Explore Books
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                📊 Access Your Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">K</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">KEY Library</span>
                  <span className="text-sm text-gray-400">Knowledge Empowering Youth</span>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering communities through accessible knowledge, innovative learning spaces, and comprehensive
                educational resources across our network of modern libraries.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span>📘</span>
                </div>
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span>📧</span>
                </div>
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                  <span>📱</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link to="/books" className="hover:text-white transition-colors">
                    📚 Browse Books
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    ✨ Become a Member
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    🔑 Member Login
                  </Link>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    👥 About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Info</h3>
              <div className="text-gray-400 space-y-3">
                <p className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>info@keylibrary.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>(555) 123-4567</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>7 locations citywide</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>Mon-Sun: 6AM-11PM</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KEY Library. All rights reserved. | Founded by Rita Field-Marsham</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage

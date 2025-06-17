"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Homepage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-primary-200">KEY Library</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-100">Knowledge Empowering Youth</p>
            <p className="text-lg mb-8 text-primary-200">
              Discover knowledge, explore worlds, and unlock your potential
            </p>
            <div className="space-x-4">
              <Link
                to="/books"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-block"
              >
                Browse Books
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-primary-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-300 transition-colors inline-block"
                >
                  Join Today
                </Link>
              )}
              {user && (
                <Link
                  to="/dashboard"
                  className="bg-primary-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-300 transition-colors inline-block"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose KEY Library?</h2>
            <p className="text-lg text-gray-600">Experience the future of library services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Vast Collection</h3>
              <p className="text-gray-600">
                Access thousands of books across multiple genres and categories from all our branches.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Branches</h3>
              <p className="text-gray-600">
                Visit any of our conveniently located branches across the city for easy access.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Experience</h3>
              <p className="text-gray-600">
                Modern digital library management system for seamless book browsing and borrowing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
              <div className="text-gray-600">Books Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">5</div>
              <div className="text-gray-600">Branch Locations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Online Access</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of readers who trust KEY Library for their knowledge needs.
          </p>
          {!user ? (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors inline-block"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block"
            >
              Access Your Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">K</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">KEY Library</span>
                  <span className="text-xs text-gray-400">Knowledge Empowering Youth</span>
                </div>
              </div>
              <p className="text-gray-400">
                Your gateway to knowledge and learning. Serving the community with excellence since day one.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/books" className="hover:text-white transition-colors">
                    Browse Books
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Become a Member
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Member Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="text-gray-400 space-y-2">
                <p>📧 info@keylibrary.com</p>
                <p>📞 (555) 123-4567</p>
                <p>📍 Multiple locations citywide</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 KEY Library. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage

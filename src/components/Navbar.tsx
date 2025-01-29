'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { FaCalendar, FaSignOutAlt, FaBars, FaTimes, FaUser, FaChartLine } from 'react-icons/fa'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold hover:text-blue-100 transition-colors flex items-center space-x-2"
            >
              <FaCalendar className="text-2xl" />
              <span>Interview Tracker</span>
            </Link>

            {/* Main Navigation - Desktop */}
            {session && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/interviews"
                  className="flex items-center space-x-2 hover:text-blue-100 transition-colors text-sm"
                >
                  <FaChartLine />
                  <span>Dashboard</span>
                </Link>
              </div>
            )}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {session ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-blue-200">
                      {session.user?.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in border-t border-blue-500">
            <div className="py-4 space-y-4">
              {session ? (
                <>
                  <div className="px-4 py-3 bg-blue-700 rounded-lg flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{session.user?.name}</div>
                      <div className="text-sm text-blue-200">{session.user?.email}</div>
                    </div>
                  </div>
                  <Link
                    href="/interviews"
                    className="block px-4 py-2 hover:bg-blue-700 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <FaChartLine />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <div className="px-4 pt-4 border-t border-blue-500">
                    <button
                      onClick={() => signOut()}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-4">
                  <button
                    onClick={() => signIn('google')}
                    className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
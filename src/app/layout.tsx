import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/components/AuthProvider'
import { ToastContainer } from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interview Tracker - Manage Your Job Interviews',
  description: 'Track your job interviews, sync with Google Calendar, and stay organized throughout your job search journey.',
  keywords: 'interview tracker, job search, calendar sync, interview management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        <AuthProvider>
          <div className="flex-1 flex flex-col">
            {/* Navigation */}
            <header className="sticky top-0 z-40 bg-white shadow-sm animate-slide-in">
              <Navbar />
            </header>

            {/* Main Content */}
            <main className="flex-1 animate-fade-in">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="container-custom py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Brand */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Interview Tracker
                    </h3>
                    <p className="text-gray-600">
                      Your personal interview management assistant. Stay organized and never miss an opportunity.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Quick Links
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <a href="/interviews" className="text-gray-600 hover:text-blue-600 transition-colors">
                          My Interviews
                        </a>
                      </li>
                      <li>
                        <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                          Home
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Connect
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="https://github.com/yourusername/interview-tracker"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          GitHub
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-center text-gray-600">
                    © {new Date().getFullYear()} Interview Tracker. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>

            {/* Toast Container for Notifications */}
            <ToastContainer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

'use client'

import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { FaCalendar, FaChartLine, FaBook, FaBell } from 'react-icons/fa'
import Notes from '@/components/Notes'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Master Your Interview Journey
            </h1>
            <p className="text-xl mb-8">
              Keep track of all your job interviews, sync with Google Calendar, and never miss an opportunity. Your personal interview management assistant.
            </p>
            {session ? (
              <Link
                href="/interviews"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
              >
                <FaCalendar />
                <span>View Your Dashboard</span>
              </Link>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center space-x-2"
              >
                <FaCalendar />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Features */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Everything You Need to Succeed
              </h2>
              <div className="grid gap-6">
                <FeatureCard
                  icon={<FaCalendar className="w-8 h-8 text-blue-500" />}
                  title="Calendar Integration"
                  description="Seamlessly sync with Google Calendar. Get reminders and never miss an interview."
                />
                <FeatureCard
                  icon={<FaChartLine className="w-8 h-8 text-blue-500" />}
                  title="Track Progress"
                  description="Monitor your interview journey with detailed statistics and insights."
                />
                <FeatureCard
                  icon={<FaBook className="w-8 h-8 text-blue-500" />}
                  title="Quick Notes"
                  description="Keep important notes and reminders right where you need them."
                />
              </div>
            </div>

            {/* Notes Section */}
            {session ? (
              <div className="md:pl-8">
                <Notes userId={session.user.id} />
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <FaBell className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sign In to Access Notes
                </h3>
                <p className="text-gray-600 mb-6">
                  Keep track of important information, preparation materials, and interview tips.
                </p>
                <button
                  onClick={() => signIn('google')}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Sign In to Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

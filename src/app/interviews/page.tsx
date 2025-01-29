'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import InterviewForm from '@/components/InterviewForm'
import InterviewList from '@/components/InterviewList'
import CalendarView from '@/components/CalendarView'
import { FaPlus, FaCalendar, FaList } from 'react-icons/fa'
import { LoadingScreen } from '@/components/LoadingSpinner'

interface Interview {
  id: string
  company: string
  position: string
  date: string
  status: string
  round: string
  location?: string
  notes?: string
  salary?: string
}

export default function InterviewsPage() {
  const { data: session, status } = useSession()
  const [showForm, setShowForm] = useState(false)
  const [editInterview, setEditInterview] = useState<Interview | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  if (status === 'loading') {
    return <LoadingScreen />
  }

  if (!session) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in to manage your interviews
          </h1>
          <p className="text-gray-600">
            Sign in to track your interviews and sync with Google Calendar
          </p>
        </div>
      </div>
    )
  }

  const handleEdit = (interview: Interview) => {
    setEditInterview(interview)
    setSelectedDate(null)
    setShowForm(true)
  }

  const handleAddOnDate = (date: Date) => {
    setSelectedDate(date)
    setEditInterview(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditInterview(null)
    setSelectedDate(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditInterview(null)
    setSelectedDate(null)
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Interviews</h1>
          <p className="text-gray-600">
            Track and manage your interview schedule
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          {/* View Toggle */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                view === 'list'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Show list view"
            >
              <FaList />
              <span>List</span>
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 transition-colors ${
                view === 'calendar'
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Show calendar view"
            >
              <FaCalendar />
              <span>Calendar</span>
            </button>
          </div>

          {/* Add Interview Button */}
          <button
            onClick={() => {
              setEditInterview(null)
              setSelectedDate(null)
              setShowForm(true)
            }}
            className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            aria-label="Add new interview"
          >
            <FaPlus />
            <span>Add Interview</span>
          </button>
        </div>
      </div>

      {/* Interview Form Modal */}
      {showForm && (
        <InterviewForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          initialData={editInterview}
          isEdit={!!editInterview}
          selectedDate={selectedDate || undefined}
          userId={session.user.id}
        />
      )}

      {/* View Content */}
      <div className="animate-fade-in">
        {view === 'list' ? (
          <InterviewList 
            userId={session.user.id} 
            onEdit={handleEdit}
          />
        ) : (
          <CalendarView 
            userId={session.user.id}
            onInterviewClick={handleEdit}
            onAddInterview={handleAddOnDate}
          />
        )}
      </div>

      {/* Quick Help */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-sm font-medium text-blue-800 mb-2">Quick Tips</h2>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Click on any date in the calendar to schedule an interview</li>
          <li>• Click on an interview to edit its details</li>
          <li>• Toggle between list and calendar views using the buttons above</li>
          <li>• All interviews are automatically synced with your Google Calendar</li>
          <li>• Updates appear in real-time across all views</li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaCalendar, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaStickyNote } from 'react-icons/fa'
import LoadingSpinner from './LoadingSpinner'
import { useToast } from './Toast'
import { mutate } from 'swr'

interface InterviewFormProps {
  onClose: () => void
  onSuccess: () => void
  initialData?: any
  isEdit?: boolean
  selectedDate?: Date
  userId: string
}

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'pending', label: 'Pending Decision' },
  { value: 'passed', label: 'Passed' },
  { value: 'failed', label: 'Failed' },
  { value: 'second_round', label: 'Second Round' },
  { value: 'final_round', label: 'Final Round' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

const ROUND_OPTIONS = [
  { value: 'screening', label: 'Initial Screening' },
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
  { value: 'system_design', label: 'System Design' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'final', label: 'Final' },
  { value: 'assignment', label: 'Take-home Assignment' },
  { value: 'pair_programming', label: 'Pair Programming' }
]

export default function InterviewForm({ 
  onClose, 
  onSuccess, 
  initialData, 
  isEdit = false,
  selectedDate,
  userId
}: InterviewFormProps) {
  const [loading, setLoading] = useState(false)
  const { showToast, ToastDisplay } = useToast()

  // Convert selectedDate to local datetime string
  const getInitialDate = () => {
    if (initialData?.date) {
      return new Date(initialData.date).toISOString().slice(0, 16)
    }
    if (selectedDate) {
      const date = new Date(selectedDate)
      // Set time to noon by default for new interviews
      if (!initialData) {
        date.setHours(12, 0, 0, 0)
      }
      return date.toISOString().slice(0, 16)
    }
    return ''
  }

  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    date: getInitialDate(),
    round: initialData?.round || 'technical',
    status: initialData?.status || 'scheduled',
    location: initialData?.location || '',
    notes: initialData?.notes || '',
    salary: initialData?.salary || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.company.trim() || !formData.position.trim() || !formData.date) {
        throw new Error('Please fill in all required fields')
      }

      const url = isEdit ? `/api/interviews/${initialData.id}` : '/api/interviews'
      const method = isEdit ? 'PUT' : 'POST'

      // Ensure date is in ISO format
      const dateToSend = new Date(formData.date).toISOString()

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: dateToSend
        }),
      })

      if (!response.ok) {
        throw new Error(isEdit ? 'Failed to update interview' : 'Failed to create interview')
      }

      showToast(
        isEdit ? 'Interview updated successfully!' : 'Interview created successfully!',
        'success'
      )
      
      // Trigger revalidation of the interviews data
      mutate(`/api/interviews?userId=${userId}`)
      
      onSuccess()
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Failed to save interview',
        'error'
      )
      console.error('Error saving interview:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-labelledby="interview-form-title"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 id="interview-form-title" className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Interview' : 'Add New Interview'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close form"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaBuilding />
                </div>
                <input
                  id="company"
                  type="text"
                  required
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaBriefcase />
                </div>
                <input
                  id="position"
                  type="text"
                  required
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaCalendar />
                </div>
                <input
                  id="date"
                  type="datetime-local"
                  required
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="round" className="block text-sm font-medium text-gray-700 mb-1">
                Round
              </label>
              <select
                id="round"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.round}
                onChange={(e) => setFormData({ ...formData, round: e.target.value })}
              >
                {ROUND_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location/Link
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaMapMarkerAlt />
                </div>
                <input
                  id="location"
                  type="text"
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Office address or meeting link"
                />
              </div>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                Expected Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaDollarSign />
                </div>
                <input
                  id="salary"
                  type="text"
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400">
                <FaStickyNote />
              </div>
              <textarea
                id="notes"
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any preparation notes or requirements..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEdit ? 'Update Interview' : 'Save Interview'}</span>
              )}
            </button>
          </div>
        </form>
        <ToastDisplay />
      </div>
    </div>
  )
}

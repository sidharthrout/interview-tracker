'use client'

import { useState } from 'react'
import { FaCalendar, FaEdit, FaTrash, FaMapMarkerAlt, FaDollarSign, FaStickyNote } from 'react-icons/fa'
import { format } from 'date-fns'
import { LoadingScreen } from './LoadingSpinner'
import { useToast } from './Toast'
import useSWR, { mutate } from 'swr'

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

interface InterviewListProps {
  userId: string
  onEdit?: (interview: Interview) => void
}

const STATUS_BADGES = {
  scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Scheduled' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending Decision' },
  passed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Passed' },
  failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed' },
  second_round: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Second Round' },
  final_round: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Final Round' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
}

const ROUND_LABELS: { [key: string]: string } = {
  screening: 'Initial Screening',
  technical: 'Technical',
  hr: 'HR',
  system_design: 'System Design',
  behavioral: 'Behavioral',
  final: 'Final',
  assignment: 'Take-home Assignment',
  pair_programming: 'Pair Programming'
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function InterviewList({ userId, onEdit }: InterviewListProps) {
  const { showToast, ToastDisplay } = useToast()
  const { data: interviews, error, isLoading } = useSWR<Interview[]>(
    `/api/interviews?userId=${userId}`,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) {
      return
    }

    try {
      const response = await fetch(`/api/interviews/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete interview')
      }

      // Trigger a revalidation of the interviews data
      mutate(`/api/interviews?userId=${userId}`)
      showToast('Interview deleted successfully', 'success')
    } catch (error) {
      showToast('Failed to delete interview', 'error')
      console.error('Error deleting interview:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badgeConfig = STATUS_BADGES[status as keyof typeof STATUS_BADGES] || STATUS_BADGES.scheduled
    return `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`
  }

  if (error) {
    showToast('Failed to load interviews', 'error')
    console.error('Error fetching interviews:', error)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!interviews || interviews.length === 0) {
    return (
      <>
        <div className="text-center py-12 bg-white rounded-lg shadow animate-fade-in">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
          <p className="text-gray-600">Add your first interview using the button above.</p>
        </div>
        <ToastDisplay />
      </>
    )
  }

  return (
    <>
      <div className="space-y-4 animate-fade-in">
        {interviews.map((interview: Interview) => (
          <div
            key={interview.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {interview.position}
                    </h3>
                    <p className="text-blue-600 font-medium">{interview.company}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendar className="text-blue-500" />
                      <span>{format(new Date(interview.date), 'PPp')}</span>
                    </span>
                    <span className={getStatusBadge(interview.status)}>
                      {STATUS_BADGES[interview.status as keyof typeof STATUS_BADGES]?.label || interview.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {ROUND_LABELS[interview.round] || interview.round}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    onClick={() => onEdit && onEdit(interview)}
                    title="Edit interview"
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => handleDelete(interview.id)}
                    title="Delete interview"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>

              {(interview.location || interview.notes || interview.salary) && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm space-y-2">
                  {interview.location && (
                    <p className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      <span>{interview.location}</span>
                    </p>
                  )}
                  {interview.salary && (
                    <p className="flex items-center text-gray-600">
                      <FaDollarSign className="mr-2 text-gray-400" />
                      <span>{interview.salary}</span>
                    </p>
                  )}
                  {interview.notes && (
                    <p className="flex items-start text-gray-600">
                      <FaStickyNote className="mr-2 mt-1 text-gray-400" />
                      <span>{interview.notes}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <ToastDisplay />
    </>
  )
}

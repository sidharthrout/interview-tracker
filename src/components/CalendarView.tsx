'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { format } from 'date-fns'
import { LoadingScreen } from './LoadingSpinner'
import { useToast } from './Toast'
import useSWR from 'swr'

interface Interview {
  id: string
  company: string
  position: string
  date: string
  status: string
  round: string
  location?: string
}

interface CalendarViewProps {
  userId: string
  onInterviewClick?: (interview: Interview) => void
  onAddInterview?: (date: Date) => void
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CalendarView({ userId, onInterviewClick, onAddInterview }: CalendarViewProps) {
  const { showToast } = useToast()
  
  const { data: interviews, error, isLoading } = useSWR<Interview[]>(
    `/api/interviews?userId=${userId}`,
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )

  if (error) {
    showToast('Failed to load interviews', 'error')
    console.error('Error fetching interviews:', error)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return '#EAB308' // Yellow
      case 'completed':
        return '#22C55E' // Green
      case 'passed':
        return '#10B981' // Emerald
      case 'failed':
        return '#EF4444' // Red
      case 'pending':
        return '#F59E0B' // Amber
      case 'second_round':
        return '#6366F1' // Indigo
      case 'final_round':
        return '#8B5CF6' // Purple
      case 'cancelled':
        return '#9CA3AF' // Gray
      default:
        return '#6B7280' // Gray
    }
  }

  const formatEventTitle = (interview: Interview) => {
    const time = format(new Date(interview.date), 'h:mm a')
    return `${time} - ${interview.company}`
  }

  const events = (interviews || []).map((interview: Interview) => ({
    id: interview.id,
    title: formatEventTitle(interview),
    start: new Date(interview.date),
    end: new Date(new Date(interview.date).getTime() + 60 * 60 * 1000), // 1 hour duration
    backgroundColor: getStatusColor(interview.status),
    borderColor: getStatusColor(interview.status),
    textColor: '#FFFFFF',
    extendedProps: {
      interview,
      tooltip: `
        ${interview.position} at ${interview.company}
        Status: ${interview.status}
        Round: ${interview.round}
        ${interview.location ? `Location: ${interview.location}` : ''}
      `.trim()
    }
  }))

  const handleDateClick = (info: { date: Date, allDay: boolean }) => {
    if (onAddInterview) {
      // Create a date at noon to avoid timezone issues
      const selectedDate = new Date(info.date)
      selectedDate.setHours(12, 0, 0, 0)
      onAddInterview(selectedDate)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <style jsx global>{`
        .fc-event {
          cursor: pointer !important;
          transition: transform 0.1s ease-in-out !important;
        }
        .fc-event:hover {
          transform: scale(1.02) !important;
        }
        .fc-daygrid-event {
          white-space: normal !important;
          align-items: center !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          padding: 2px 4px !important;
        }
        .event-tooltip {
          position: absolute;
          background: white;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 1000;
          max-width: 300px;
          white-space: pre-line;
        }
      `}</style>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        events={events}
        eventContent={(arg) => {
          return (
            <div className="w-full">
              <div className="font-medium">{arg.event.title}</div>
              {arg.view.type === 'dayGridMonth' && (
                <div className="text-xs opacity-90">{arg.event.extendedProps.interview.position}</div>
              )}
            </div>
          )
        }}
        eventDidMount={(info) => {
          // Add tooltip
          const tooltip = document.createElement('div')
          tooltip.className = 'event-tooltip'
          tooltip.innerHTML = info.event.extendedProps.tooltip.replace(/\n/g, '<br/>')
          tooltip.style.display = 'none'

          info.el.addEventListener('mouseover', (e) => {
            tooltip.style.display = 'block'
            tooltip.style.left = e.pageX + 10 + 'px'
            tooltip.style.top = e.pageY + 10 + 'px'
            document.body.appendChild(tooltip)
          })

          info.el.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px'
            tooltip.style.top = e.pageY + 10 + 'px'
          })

          info.el.addEventListener('mouseout', () => {
            tooltip.parentNode?.removeChild(tooltip)
          })
        }}
        eventClick={({ event }) => {
          if (onInterviewClick) {
            onInterviewClick(event.extendedProps.interview)
          }
        }}
        dateClick={handleDateClick}
        height="auto"
        aspectRatio={1.8}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        slotLabelFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }}
        views={{
          dayGridMonth: {
            titleFormat: { year: 'numeric', month: 'long' }
          },
          timeGridWeek: {
            titleFormat: { year: 'numeric', month: 'long', day: '2-digit' }
          },
          timeGridDay: {
            titleFormat: { year: 'numeric', month: 'long', day: '2-digit' }
          },
          listWeek: {
            titleFormat: { year: 'numeric', month: 'long' }
          }
        }}
      />

      {/* Status Legend */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Interview Status</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { status: 'scheduled', label: 'Scheduled' },
            { status: 'pending', label: 'Pending' },
            { status: 'passed', label: 'Passed' },
            { status: 'failed', label: 'Failed' },
            { status: 'second_round', label: 'Second Round' },
            { status: 'final_round', label: 'Final Round' },
            { status: 'completed', label: 'Completed' },
            { status: 'cancelled', label: 'Cancelled' }
          ].map(({ status, label }) => (
            <div key={status} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getStatusColor(status) }}
              />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

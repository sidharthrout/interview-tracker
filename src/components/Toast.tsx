'use client'

import { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const toastStyles = {
  success: {
    bg: 'bg-green-500',
    icon: <FaCheckCircle className="w-5 h-5" />,
  },
  error: {
    bg: 'bg-red-500',
    icon: <FaExclamationCircle className="w-5 h-5" />,
  },
  info: {
    bg: 'bg-blue-500',
    icon: <FaInfoCircle className="w-5 h-5" />,
  },
}

export default function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`
        fixed bottom-4 right-4 flex items-center ${toastStyles[type].bg} text-white px-4 py-3 rounded-lg shadow-lg
        transition-opacity duration-300 animate-fade-in
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      role="alert"
    >
      <div className="mr-3">{toastStyles[type].icon}</div>
      <p className="mr-8">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="absolute right-2 top-2 text-white hover:text-gray-200 transition-colors"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  )
}

// Toast container to manage multiple toasts
interface Toast {
  id: number
  message: string
  type: ToastType
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

// Hook to use toast
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts((current) => [...current, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const ToastDisplay = () => (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )

  return {
    showToast,
    ToastDisplay,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info'),
  }
}
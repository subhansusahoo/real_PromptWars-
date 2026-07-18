// Loading spinner component
import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner

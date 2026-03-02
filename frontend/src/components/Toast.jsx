import React from 'react'

export default function Toast({ message, type = 'success', isVisible }) {
  const bgColor = {
    success: 'bg-green-50 text-green-700 border-green-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }[type]

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm transition-all duration-300 z-50 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      <div className={`card border ${bgColor} p-4`}>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function StatusDropdown({ status, onStatusChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)

  const statuses = ['Pending', 'Approved', 'Rejected']
  const statusColors = {
    Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dotColor: 'bg-yellow-400' },
    Approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dotColor: 'bg-green-500' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dotColor: 'bg-red-500' },
  }

  const currentConfig = statusColors[status] || statusColors.Pending

  const handleStatusSelect = (newStatus) => {
    if (newStatus !== status) {
      onStatusChange(newStatus)
    }
    setIsOpen(false)
  }

  // close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.status-dropdown-root')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative status-dropdown-root">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${currentConfig.bg} ${currentConfig.text} border ${currentConfig.border} px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className={`w-2 h-2 rounded-full ${currentConfig.dotColor}`}></span>
        {status}
        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="p-1">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusSelect(s)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors ${
                  s === status ? 'bg-blue-50' : ''
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${statusColors[s].dotColor}`}></span>
                  <span className={statusColors[s].text}>{s}</span>
                </span>
                {s === status && <CheckIcon className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

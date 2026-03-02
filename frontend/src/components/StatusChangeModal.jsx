import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function StatusChangeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentStatus, 
  newStatus, 
  isLoading = false 
}) {
  if (!isOpen) return null

  const statusEmojis = {
    Pending: '⏳',
    Approved: '✅',
    Rejected: '❌',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-pulse">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-50 rounded-full">
          <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
        </div>

        <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Change Application Status?</h2>
        
        <p className="text-slate-600 text-center mb-6">
          Are you sure you want to change the status from <span className="font-semibold">{currentStatus}</span> to <span className="font-semibold">{newStatus}</span>?
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Current</p>
              <p className="text-2xl font-bold flex items-center gap-2 justify-center">
                <span>{statusEmojis[currentStatus]}</span>
                {currentStatus}
              </p>
            </div>
            <div className="text-slate-400 font-bold">→</div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">New</p>
              <p className="text-2xl font-bold flex items-center gap-2 justify-center">
                <span>{statusEmojis[newStatus]}</span>
                {newStatus}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? 'Updating...' : 'Confirm Change'}
          </button>
        </div>
      </div>
    </div>
  )
}

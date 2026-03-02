import React from 'react'

export default function ConfirmDialog({ title, message, isOpen, onConfirm, onCancel, isDangerous = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-smooth ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

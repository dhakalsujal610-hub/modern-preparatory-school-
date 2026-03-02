import React from 'react'

export default function StatusBadge({ status }) {
  const configs = {
    Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    Approved: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  }

  const config = configs[status] || configs.Pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  )
}

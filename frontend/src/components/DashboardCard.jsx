import React from 'react'

export default function DashboardCard({ title, value, icon, trend, trendColor, borderColor, onClick, isClickable = false }) {
  return (
    <div 
      onClick={onClick}
      className={`card p-6 border-l-4 ${borderColor} ${
        isClickable ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trendColor}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}

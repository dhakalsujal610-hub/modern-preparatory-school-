import React from 'react'

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-12 w-full"></div>
      <div className="skeleton h-12 w-full"></div>
      <div className="skeleton h-12 w-full"></div>
    </div>
  )
}

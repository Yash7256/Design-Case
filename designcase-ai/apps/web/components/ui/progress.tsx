'use client'

import * as React from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export function Progress({ value = 0, max = 100, className = '', ...props }: ProgressProps) {
  const percentage = Math.min(Math.max(value / max * 100, 0), 100)

  return (
    <div
      className={`relative w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="h-full bg-indigo-600 transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

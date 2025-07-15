// src/components/Progress/Progress.tsx
import React from 'react'

interface ProgressProps {
  title: string
  value: number
}

export default function Progress({ title, value }: ProgressProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span>{title}</span>
        <span className="text-sm">{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div
          className="bg-orange-500 h-2 rounded-full"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  )
}

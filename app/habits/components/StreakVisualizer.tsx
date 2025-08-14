'use client'

import { Flame } from 'lucide-react'

interface StreakVisualizerProps {
  streak: number
  size?: 'sm' | 'md' | 'lg'
}

export function StreakVisualizer({ streak, size = 'md' }: StreakVisualizerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }
  
  // Determine flame color based on streak length
  const getFlameColor = () => {
    if (streak >= 80) return 'text-red-500'
    if (streak >= 50) return 'text-orange-500'
    if (streak >= 20) return 'text-yellow-500'
    if (streak >= 5) return 'text-amber-500'
    return 'text-gray-400'
  }
  
  // Determine animation based on streak length
  const getAnimation = () => {
    if (streak >= 50) return 'animate-bounce'
    if (streak >= 20) return 'animate-pulse'
    return ''
  }
  
  return (
    <div className="flex items-center">
      <Flame 
        className={`${sizeClasses[size]} ${getFlameColor()} ${getAnimation()}`} 
      />
      <span className={`ml-1 font-bold ${textSizeClasses[size]}`}>
        {streak}
      </span>
    </div>
  )
}

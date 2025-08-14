'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ProgressVisualizationProps {
  currentValue: number
  previousValue?: number
  label: string
  color?: string
}

export function ProgressVisualization({ 
  currentValue, 
  previousValue, 
  label,
  color = 'primary'
}: ProgressVisualizationProps) {
  const hasComparison = previousValue !== undefined
  const difference = hasComparison ? currentValue - previousValue : 0
  const percentageChange = hasComparison && previousValue !== 0 
    ? Math.round((difference / previousValue) * 100) 
    : 0
  
  const getTrendIcon = () => {
    if (!hasComparison) return null
    if (difference > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (difference < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }
  
  const getTrendColor = () => {
    if (!hasComparison) return 'text-gray-500'
    if (difference > 0) return 'text-green-500'
    if (difference < 0) return 'text-red-500'
    return 'text-gray-500'
  }
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border">
      <div>
        <p className="text-2xl font-bold">{currentValue}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      {hasComparison && (
        <div className={`flex items-center ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1 text-sm font-medium">
            {percentageChange > 0 ? '+' : ''}{percentageChange}%
          </span>
        </div>
      )}
    </div>
  )
}

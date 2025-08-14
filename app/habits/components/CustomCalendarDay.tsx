'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Habit, HabitCompletion } from '../types'

interface CustomCalendarDayProps {
  date: Date
  habits: Habit[]
  completions: HabitCompletion[]
  onToggleCompletion: (habitId: string, date: string) => void
}

export function CustomCalendarDay({ 
  date, 
  habits, 
  completions, 
  onToggleCompletion 
}: CustomCalendarDayProps) {
  const [showHabits, setShowHabits] = useState(false)
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  const dateStr = formatDate(date)
  const dayCompletions = completions.filter(c => c.date === dateStr)
  
  // Get completion percentage
  const completionPercentage = habits.length > 0 
    ? Math.round((dayCompletions.length / habits.length) * 100)
    : 0
  
  // Determine day status
  const getDayStatus = () => {
    if (completionPercentage === 100) return 'completed'
    if (completionPercentage >= 50) return 'partial'
    if (completionPercentage > 0) return 'started'
    return 'none'
  }
  
  const dayStatus = getDayStatus()
  
  // Get status color
  const getStatusColor = () => {
    switch (dayStatus) {
      case 'completed': return 'bg-green-500'
      case 'partial': return 'bg-yellow-500'
      case 'started': return 'bg-orange-500'
      default: return 'bg-gray-200'
    }
  }
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative h-8 w-8 p-0 font-normal",
          dayStatus !== 'none' && "text-white"
        )}
        onClick={() => setShowHabits(!showHabits)}
      >
        {date.getDate()}
        {dayStatus !== 'none' && (
          <div className={cn(
            "absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full",
            getStatusColor()
          )} />
        )}
      </Button>
      
      {showHabits && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 w-48 bg-background border rounded-md shadow-lg p-2">
          <div className="text-sm font-medium mb-1">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {completionPercentage}% completion
          </div>
          
          {habits.length === 0 ? (
            <p className="text-xs text-muted-foreground">No habits created</p>
          ) : dayCompletions.length === 0 ? (
            <p className="text-xs text-muted-foreground">No habits completed</p>
          ) : (
            <div className="space-y-1">
              {dayCompletions.map(completion => {
                const habit = habits.find(h => h.id === completion.habitId)
                return habit ? (
                  <div key={completion.id} className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full ${habit.color} mr-2`}></div>
                    {habit.name}
                  </div>
                ) : null
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

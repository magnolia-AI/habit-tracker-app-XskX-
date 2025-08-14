'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Habit, HabitCompletion } from '../types'
import { CustomCalendarDay } from './CustomCalendarDay'

interface CalendarViewProps {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggleCompletion: (habitId: string, date: string) => void
}

export function CalendarView({ habits, completions, onToggleCompletion }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  const getCompletionsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return completions.filter(c => c.date === dateStr)
  }
  
  const isHabitCompletedOnDate = (habitId: string, date: Date) => {
    const dateStr = formatDate(date)
    return completions.some(c => c.habitId === habitId && c.date === dateStr)
  }
  
  const navigateDays = (days: number) => {
    if (!selectedDate) return
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
  }
  
  const selectedDateCompletions = selectedDate ? getCompletionsForDate(selectedDate) : []
  
  // Get habits for the selected date
  const habitsForSelectedDate = habits.map(habit => ({
    ...habit,
    completed: isHabitCompletedOnDate(habit.id, selectedDate || new Date())
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <Card className="md:w-2/3">
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              classNames={{
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
              components={{
                Day: (props) => (
                  <CustomCalendarDay
                    date={props.day.date}
                    habits={habits}
                    completions={completions}
                    onToggleCompletion={onToggleCompletion}
                  />
                )
              }}
            />
          </CardContent>
        </Card>
        
        {/* Date Details */}
        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Habits for this day</h3>
                  {habits.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No habits created yet</p>
                  ) : (
                    <div className="space-y-2">
                      {habitsForSelectedDate.map((habit) => (
                        <div 
                          key={habit.id} 
                          className="flex items-center justify-between p-2 rounded-md border"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
                            <span className="text-sm">{habit.name}</span>
                          </div>
                          <Badge 
                            variant={habit.completed ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => onToggleCompletion(habit.id, formatDate(selectedDate))}
                          >
                            {habit.completed ? "Completed" : "Mark done"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Completed habits</h3>
                  {selectedDateCompletions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No habits completed on this day</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateCompletions.map((completion) => {
                        const habit = habits.find(h => h.id === completion.habitId)
                        return habit ? (
                          <div 
                            key={completion.id} 
                            className="flex items-center space-x-2 p-2 rounded-md bg-muted"
                          >
                            <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
                            <span className="text-sm">{habit.name}</span>
                          </div>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a date to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Navigation */}
      <div className="flex justify-center space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigateDays(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigateDays(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}




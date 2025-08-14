'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { HabitTracker } from './components/HabitTracker'
import { StatsDashboard } from './components/StatsDashboard'
import { CalendarView } from './components/CalendarView'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Habit, HabitCompletion } from './types'

export default function HabitsPage() {
  const searchParams = useSearchParams()
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'tracker')

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits')
    const savedCompletions = localStorage.getItem('habitCompletions')
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
    
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('habitCompletions', JSON.stringify(completions))
  }, [completions])

  const addHabit = (name: string, description: string, color: string, reminder?: { time: string, enabled: boolean }) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      description,
      color,
      createdAt: new Date().toISOString(),
      reminder,
    }
    setHabits([...habits, newHabit])
  }

  const toggleHabitCompletion = (habitId: string, date: string) => {
    const completionId = `${habitId}-${date}`
    const existingCompletion = completions.find(c => c.id === completionId)
    
    if (existingCompletion) {
      // Remove completion
      setCompletions(completions.filter(c => c.id !== completionId))
    } else {
      // Add completion
      const newCompletion: HabitCompletion = {
        id: completionId,
        habitId,
        date,
        completedAt: new Date().toISOString(),
      }
      setCompletions([...completions, newCompletion])
    }
  }

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId))
    // Also remove all completions for this habit
    setCompletions(completions.filter(completion => completion.habitId !== habitId))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
            <p className="text-muted-foreground">Build better habits, one day at a time</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Habit
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tracker" className="mt-6">
            <HabitTracker 
              habits={habits} 
              completions={completions}
              onToggleCompletion={toggleHabitCompletion}
              onDeleteHabit={deleteHabit}
              onAddHabit={addHabit}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <StatsDashboard 
              habits={habits} 
              completions={completions} 
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-6">
            <CalendarView 
              habits={habits} 
              completions={completions}
              onToggleCompletion={toggleHabitCompletion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}




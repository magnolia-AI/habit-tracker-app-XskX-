'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Achievements } from './Achievements'
import { ProgressVisualization } from './ProgressVisualization'
import { Habit, HabitCompletion } from '../types'

interface StatsDashboardProps {
  habits: Habit[]
  completions: HabitCompletion[]
}

export function StatsDashboard({ habits, completions }: StatsDashboardProps) {
  // Calculate overall stats
  const totalHabits = habits.length
  const totalCompletions = completions.length
  
  // Calculate completion rate
  const completionRate = totalHabits > 0 
    ? Math.round((totalCompletions / (totalHabits * 7)) * 100) // Assuming 7 days for simplicity
    : 0
  
  // Find best streak
  const getBestStreak = () => {
    if (habits.length === 0) return 0
    
    let bestStreak = 0
    
    habits.forEach(habit => {
      const habitCompletions = completions
        .filter(c => c.habitId === habit.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      if (habitCompletions.length === 0) return
      
      let currentStreak = 1
      let maxStreak = 1
      
      for (let i = 1; i < habitCompletions.length; i++) {
        const prevDate = new Date(habitCompletions[i-1].date)
        const currentDate = new Date(habitCompletions[i].date)
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          currentStreak++
        } else {
          maxStreak = Math.max(maxStreak, currentStreak)
          currentStreak = 1
        }
      }
      
      maxStreak = Math.max(maxStreak, currentStreak)
      bestStreak = Math.max(bestStreak, maxStreak)
    })
    
    return bestStreak
  }
  
  const bestStreak = getBestStreak()
  
  // Get habits with streaks
  const getHabitsWithStreaks = () => {
    return habits.map(habit => {
      const habitCompletions = completions
        .filter(c => c.habitId === habit.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      if (habitCompletions.length === 0) {
        return { ...habit, currentStreak: 0, longestStreak: 0 }
      }
      
      let currentStreak = 1
      let longestStreak = 1
      
      // Calculate current streak
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      const todayCompleted = habitCompletions.some(c => c.date === todayStr)
      const yesterdayCompleted = habitCompletions.some(c => c.date === yesterdayStr)
      
      if (todayCompleted || yesterdayCompleted) {
        currentStreak = 1
        
        // Count backwards from today/yesterday
        const currentDate = todayCompleted ? today : yesterday
        let currentDateStr = currentDate.toISOString().split('T')[0]
        
        for (let i = 0; i < habitCompletions.length; i++) {
          if (habitCompletions[i].date === currentDateStr) {
            const nextDate = new Date(currentDate)
            nextDate.setDate(nextDate.getDate() - 1)
            currentDateStr = nextDate.toISOString().split('T')[0]
            
            if (habitCompletions.some(c => c.date === currentDateStr)) {
              currentStreak++
            } else {
              break
            }
          }
        }
      }
      
      // Calculate longest streak
      let maxStreak = 1
      let tempStreak = 1
      
      for (let i = 1; i < habitCompletions.length; i++) {
        const prevDate = new Date(habitCompletions[i-1].date)
        const currentDate = new Date(habitCompletions[i].date)
        const diffDays = Math.round((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          tempStreak++
        } else {
          maxStreak = Math.max(maxStreak, tempStreak)
          tempStreak = 1
        }
      }
      
      longestStreak = Math.max(maxStreak, tempStreak)
      
      return { 
        ...habit, 
        currentStreak, 
        longestStreak,
        totalCompletions: habitCompletions.length
      }
    })
  }
  
  const habitsWithStreaks: any[] = getHabitsWithStreaks()
  
  // Sort by current streak (descending)
  const topHabits = [...habitsWithStreaks]
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 3)
  
  // Get completion data for the last 7 days
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    return days
  }
  
  const last7Days = getLast7Days()
  
  const getDailyCompletionData = () => {
    return last7Days.map(date => {
      const completionsForDay = completions.filter(c => c.date === date)
      return {
        date,
        count: completionsForDay.length,
        habits: completionsForDay.map(c => c.habitId)
      }
    })
  }
  
  const dailyData = getDailyCompletionData()
  
  // Find the most active day
  const mostActiveDay = dailyData.reduce((max, current) => 
    current.count > max.count ? current : max, 
    { date: '', count: 0, habits: [] }
  )

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ProgressVisualization 
          currentValue={totalHabits} 
          label="Total Habits" 
        />
        
        <ProgressVisualization 
          currentValue={totalCompletions} 
          label="Total Completions" 
        />
        
        <ProgressVisualization 
          currentValue={bestStreak} 
          label="Best Streak (days)" 
        />
        
        <ProgressVisualization 
          currentValue={completionRate} 
          label="Completion Rate (%)" 
        />
      </div>
      
      {/* Top Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Top Habits by Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topHabits.length > 0 ? (
              topHabits.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${habit.color}`}></div>
                    <div>
                      <p className="font-medium">{habit.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {habit.totalCompletions} completions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{habit.currentStreak} days</p>
                    <p className="text-sm text-muted-foreground">Current streak</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Complete some habits to see your top streaks
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyData.map((day, index) => {
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
              const date = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{dayName}</span>
                    <span className="text-muted-foreground">{date}</span>
                    <span>{day.count} completed</span>
                  </div>
                  <Progress value={totalHabits > 0 ? (day.count / totalHabits) * 100 : 0} />
                </div>
              )
            })}
          </div>
          
          {mostActiveDay.count > 0 && (
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Your most active day was{' '}
                <span className="font-medium">
                  {new Date(mostActiveDay.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>{' '}
                with <span className="font-medium">{mostActiveDay.count}</span> habit completions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    {/* Achievements */}
      <Achievements habits={habits} completions={completions} />
    </div>
  )
}








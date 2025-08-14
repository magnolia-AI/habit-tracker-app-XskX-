'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trophy, Calendar, Plus, Trash2 } from 'lucide-react'
import { StreakVisualizer } from './StreakVisualizer'
import { Habit, HabitCompletion } from '../types'

interface HabitTrackerProps {
  habits: Habit[]
  completions: HabitCompletion[]
  onToggleCompletion: (habitId: string, date: string) => void
  onDeleteHabit: (habitId: string) => void
  onAddHabit: (name: string, description: string, color: string, reminder?: { time: string, enabled: boolean }) => void
}

const COLORS = [
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Teal', value: 'bg-teal-500' },
]

export function HabitTracker({ habits, completions, onToggleCompletion, onDeleteHabit, onAddHabit }: HabitTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitDescription, setNewHabitDescription] = useState('')
  const [newHabitColor, setNewHabitColor] = useState('bg-blue-500')
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderTime, setReminderTime] = useState('09:00')

  const today = new Date().toISOString().split('T')[0]

  const calculateStreak = (habitId: string) => {
    const habitCompletions = completions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (habitCompletions.length === 0) return { current: 0, longest: 0 }
    
    let currentStreak = 0
    let longestStreak = 0
    let currentDate = new Date()
    
    // Check if the habit was completed today or yesterday
    const todayCompleted = habitCompletions.some(c => c.date === today)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const yesterdayCompleted = habitCompletions.some(c => c.date === yesterdayStr)
    
    // Start streak count
    if (todayCompleted) {
      currentStreak = 1
    } else if (yesterdayCompleted) {
      currentStreak = 1
    }
    
    // Count consecutive days
    for (let i = 0; i < habitCompletions.length; i++) {
      const completionDate = new Date(habitCompletions[i].date)
      
      // If we're at the first completion and it's today or yesterday, continue
      if (i === 0 && (habitCompletions[i].date === today || habitCompletions[i].date === yesterdayStr)) {
        // Already handled above
      } 
      // Check if consecutive
      else if (i > 0) {
        const prevDate = new Date(habitCompletions[i-1].date)
        const diffDays = Math.round((prevDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          currentStreak++
        } else if (diffDays > 1) {
          // Break in streak
          if (currentStreak > longestStreak) {
            longestStreak = currentStreak
          }
          currentStreak = 1
        }
      }
      
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
    }
    
    return { current: currentStreak, longest: longestStreak }
  }

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      const reminder = reminderEnabled ? { time: reminderTime, enabled: true } : undefined
      onAddHabit(newHabitName, newHabitDescription, newHabitColor, reminder)
      setNewHabitName('')
      setNewHabitDescription('')
      setNewHabitColor('bg-blue-500')
      setReminderEnabled(false)
      setReminderTime('09:00')
      setIsAddDialogOpen(false)
    }
  }

  const isHabitCompletedToday = (habitId: string) => {
    return completions.some(c => c.habitId === habitId && c.date === today)
  }

  return (
    <div className="space-y-6">
      {habits.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No habits yet</h3>
          <p className="text-muted-foreground mb-4">Add your first habit to start building consistency</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Habit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Habit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g., Drink 8 glasses of water"
                  />
                </div>
                <div>
                  <Label htmlFor="habit-description">Description</Label>
                  <Textarea
                    id="habit-description"
                    value={newHabitDescription}
                    onChange={(e) => setNewHabitDescription(e.target.value)}
                    placeholder="Describe your habit (optional)"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Select value={newHabitColor} onValueChange={setNewHabitColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${color.value} mr-2`}></div>
                            {color.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reminder">Daily Reminder</Label>
                    <div 
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                        reminderEnabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                      onClick={() => setReminderEnabled(!reminderEnabled)}
                    >
                      <div 
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          reminderEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {reminderEnabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-auto"
                      />
                      <span className="text-sm text-muted-foreground">Daily reminder</span>
                    </div>
                  )}
                </div>
                
                <Button onClick={handleAddHabit}>Add Habit</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => {
            const streak = calculateStreak(habit.id)
            const isCompletedToday = isHabitCompletedToday(habit.id)
            const completionCount = completions.filter(c => c.habitId === habit.id).length
            
            return (
              <Card key={habit.id} className="overflow-hidden">
                <div className={`${habit.color} h-2`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{habit.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteHabit(habit.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{habit.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <StreakVisualizer streak={streak.current} size="sm" />
                      <span className="font-medium">{streak.current} day streak</span>
                    </div>
                    <Badge variant="secondary">{completionCount} completions</Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{streak.longest} day record</span>
                    </div>
                    <Progress value={(streak.current / Math.max(streak.longest, 1)) * 100} />
                  </div>
                  
                  <Button
                    className="w-full"
                    variant={isCompletedToday ? "secondary" : "default"}
                    onClick={() => onToggleCompletion(habit.id, today)}
                  >
                    {isCompletedToday ? (
                      <>
                        <Trophy className="mr-2 h-4 w-4" />
                        Completed Today
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Mark as Done
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
          
          <Card className="border-dashed border-2 flex flex-col items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => setIsAddDialogOpen(true)}>
            <CardContent className="text-center py-12">
              <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">Add New Habit</h3>
              <p className="text-sm text-muted-foreground">Create a new habit to track</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>
            <div>
              <Label htmlFor="habit-description">Description</Label>
              <Textarea
                id="habit-description"
                value={newHabitDescription}
                onChange={(e) => setNewHabitDescription(e.target.value)}
                placeholder="Describe your habit (optional)"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Select value={newHabitColor} onValueChange={setNewHabitColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${color.value} mr-2`}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddHabit}>Add Habit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}







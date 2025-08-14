export interface Habit {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
  reminder?: {
    time: string // HH:MM format
    enabled: boolean
  }
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string // YYYY-MM-DD format
  completedAt: string
}

export interface HabitWithStreak extends Habit {
  currentStreak: number
  longestStreak: number
  totalCompletions: number
  completionRate: number
}

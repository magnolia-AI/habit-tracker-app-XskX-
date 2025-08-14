'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Flame, Target } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  earned: boolean
  progress?: number
  target?: number
}

interface AchievementsProps {
  habits: any[]
  completions: any[]
}

export function Achievements({ habits, completions }: AchievementsProps) {
  // Calculate achievements based on habits and completions
  const achievements: Achievement[] = [
    {
      id: 'first-habit',
      title: 'First Step',
      description: 'Create your first habit',
      icon: <Target className="h-5 w-5" />,
      earned: habits.length > 0,
    },
    {
      id: 'first-completion',
      title: 'Getting Started',
      description: 'Complete your first habit',
      icon: <Star className="h-5 w-5" />,
      earned: completions.length > 0,
    },
    {
      id: '3-day-streak',
      title: 'Building Momentum',
      description: 'Achieve a 3-day streak',
      icon: <Flame className="h-5 w-5" />,
      earned: habits.some(habit => {
        // Simplified streak calculation for this achievement
        return completions.filter(c => c.habitId === habit.id).length >= 3
      }),
    },
    {
      id: '7-day-streak',
      title: 'Week Warrior',
      description: 'Achieve a 7-day streak',
      icon: <Flame className="h-5 w-5" />,
      earned: habits.some(habit => {
        return completions.filter(c => c.habitId === habit.id).length >= 7
      }),
    },
    {
      id: '10-habits',
      title: 'Habit Collector',
      description: 'Track 10 different habits',
      icon: <Trophy className="h-5 w-5" />,
      earned: habits.length >= 10,
    },
    {
      id: '100-completions',
      title: 'Century Club',
      description: 'Complete 100 habit instances',
      icon: <Trophy className="h-5 w-5" />,
      earned: completions.length >= 100,
    },
  ]

  const earnedCount = achievements.filter(a => a.earned).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Achievements</span>
          <Badge variant="secondary">
            {earnedCount} / {achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${
                achievement.earned
                  ? 'bg-primary/5 border-primary/20'
                  : 'bg-muted/50 border-muted'
              }`}
            >
              <div
                className={`mt-0.5 p-2 rounded-full ${
                  achievement.earned
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {achievement.icon}
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    achievement.earned
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { Flame, TrendingUp, Calendar, Trophy, Target, Bell } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  
  const features = [
    {
      title: "Streak Tracking",
      description: "Build momentum with visual streak counters that motivate you to keep going.",
      icon: Flame,
    },
    {
      title: "Detailed Statistics",
      description: "Gain insights into your progress with comprehensive analytics and trends.",
      icon: TrendingUp,
    },
    {
      title: "Calendar View",
      description: "See your habits in context with a beautiful calendar visualization.",
      icon: Calendar,
    },
    {
      title: "Gamified Experience",
      description: "Earn rewards and achievements as you build better habits.",
      icon: Trophy,
    },
    {
      title: "Goal Setting",
      description: "Set meaningful targets and track your progress toward them.",
      icon: Target,
    },
    {
      title: "Daily Reminders",
      description: "Never miss a habit with customizable notification reminders.",
      icon: Bell,
    },
  ]

  return (
    <div className="min-h-full">
      <section className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-[800px] mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl mb-6 bg-gradient-to-r from-[#9b59b6] to-[#3498db] bg-clip-text text-transparent">
            Build Better Habits
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px] mx-auto mb-10">
            Transform your life one habit at a time with our powerful tracking and gamification system.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-[#9b59b6] to-[#3498db] hover:from-[#8e44ad] hover:to-[#2980b9]"
            onClick={() => router.push('/habits')}
          >
            Start Building Habits
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-[#9b59b6]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#9b59b6]" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#9b59b6] flex items-center justify-center text-white mx-auto">
                1
              </div>
              <h3 className="font-semibold">Create Habits</h3>
              <p className="text-sm text-muted-foreground">
                Define the habits you want to build with custom goals and reminders.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#3498db] flex items-center justify-center text-white mx-auto">
                2
              </div>
              <h3 className="font-semibold">Track Daily</h3>
              <p className="text-sm text-muted-foreground">
                Mark your progress each day and build unstoppable momentum.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#2ecc71] flex items-center justify-center text-white mx-auto">
                3
              </div>
              <h3 className="font-semibold">Achieve Goals</h3>
              <p className="text-sm text-muted-foreground">
                Watch your consistency grow and achieve your long-term objectives.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}







import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'Track your habits and build better routines',
}

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

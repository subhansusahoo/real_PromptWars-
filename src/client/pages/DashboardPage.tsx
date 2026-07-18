// Dashboard Page - Overview and stats
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import { useHabitsStore } from '../stores/habitsStore'
import { userAPI } from '../api/habits'
import { useNavigate } from 'react-router-dom'

interface UserStats {
  totalHabits: number
  activeHabits: number
  totalCheckIns: number
  totalSuccessfulDays: number
  successRate: number
  longestOverallStreak: number
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { habits, isLoading, fetchHabits } = useHabitsStore()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchHabits()
      try {
        const response = await userAPI.getStats()
        setStats(response.data.data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    loadData()
  }, [fetchHabits])

  if (isLoading || statsLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Your progress towards breaking harmful habits
          </p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase">
                Active Habits
              </h3>
              <p className="text-4xl font-bold text-blue-600">
                {stats.activeHabits}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                of {stats.totalHabits} total habits
              </p>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase">
                Success Rate
              </h3>
              <p className="text-4xl font-bold text-green-600">
                {stats.successRate}%
              </p>
              <p className="text-xs text-slate-500 mt-2">
                {stats.totalSuccessfulDays} successful days
              </p>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase">
                Longest Streak
              </h3>
              <p className="text-4xl font-bold text-purple-600">
                {stats.longestOverallStreak}
              </p>
              <p className="text-xs text-slate-500 mt-2">days</p>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-slate-600 mb-2 uppercase">
                Total Check-ins
              </h3>
              <p className="text-4xl font-bold text-orange-600">
                {stats.totalCheckIns}
              </p>
              <p className="text-xs text-slate-500 mt-2">tracking days</p>
            </Card>
          </div>
        )}

        {/* Active Habits */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900">Active Habits</h2>
            <Button
              variant="primary"
              onClick={() => navigate('/habits')}
              ariaLabel="View all habits"
            >
              View All
            </Button>
          </div>

          {habits.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-slate-600 mb-4 text-lg">
                No habits yet. Start your journey today!
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/habits')}
                ariaLabel="Create your first habit"
              >
                Create First Habit
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.slice(0, 4).map((habit) => (
                <Card
                  key={habit.id}
                  onClick={() => navigate(`/habits/${habit.id}`)}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/habits/${habit.id}`)
                    }
                  }}
                  ariaLabel={`${habit.name} - ${habit.streakCount} day streak`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {habit.name}
                      </h3>
                      <p className="text-sm text-slate-600 capitalize">
                        {habit.category}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {habit.streakCount}
                      {' '}
                      <span className="hidden sm:inline">day streak</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-slate-600">Success</p>
                      <p className="font-bold text-green-600">
                        {habit.successfulDays}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-slate-600">Failed</p>
                      <p className="font-bold text-red-600">
                        {habit.failedDays}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded p-2 text-center">
                      <p className="text-slate-600">Best</p>
                      <p className="font-bold text-blue-600">
                        {habit.longestStreak}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {habits.length < 3 && (
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 text-center py-12">
            <h3 className="text-2xl font-bold text-blue-900 mb-3">
              🚀 Ready to Break More Habits?
            </h3>
            <p className="text-blue-800 mb-6">
              Add more habits to track and get AI-powered support for each one
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/habits')}
              ariaLabel="Add a new habit"
            >
              Add New Habit
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}

export default DashboardPage

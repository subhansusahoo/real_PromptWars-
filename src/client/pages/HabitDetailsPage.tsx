// Habit Details Page - Main tracking page
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import StreakTimer from '../components/StreakTimer'
import PanicButton from '../components/PanicButton'
import LoadingSpinner from '../components/LoadingSpinner'
import { useHabitsStore } from '../stores/habitsStore'
import { checkInAPI, aiAPI } from '../api/habits'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const HabitDetailsPage: React.FC = () => {
  const { habitId } = useParams<{ habitId: string }>()
  const navigate = useNavigate()
  const { selectedHabit, setSelectedHabit, isLoading, fetchHabitById, resetStreak } =
    useHabitsStore()

  const [habit, setHabit] = useState<any>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [messageLoading, setMessageLoading] = useState(false)
  const [checkInSubmitting, setCheckInSubmitting] = useState(false)
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const loadHabit = async () => {
      if (!habitId) return

      try {
        setPageLoading(true)
        const habitData = await fetchHabitById(habitId)
        setHabit(habitData)
        setSelectedHabit(habitData)

        // Load today's check-in
        const todayResponse = await checkInAPI.getTodayCheckIn(habitId)
        setTodayCheckIn(todayResponse.data.data)

        // Load check-ins for chart
        const checkInsResponse = await checkInAPI.getCheckIns(habitId)
        const chartData = checkInsResponse.data.data
          .slice(0, 30)
          .reverse()
          .map((checkIn: any) => ({
            date: new Date(checkIn.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }),
            success: checkIn.status === 'success' ? 1 : 0,
            failed: checkIn.status === 'failed' ? 1 : 0,
          }))
        setChartData(chartData)

        // Load motivational message
        loadMotivationalMessage(habitId)
      } catch (error) {
        console.error('Failed to load habit:', error)
      } finally {
        setPageLoading(false)
      }
    }

    loadHabit()
  }, [habitId, fetchHabitById, setSelectedHabit])

  const loadMotivationalMessage = async (hid: string) => {
    try {
      setMessageLoading(true)
      const response = await aiAPI.getMotivationalMessage(hid)
      setMotivationalMessage(response.data.data.message)
    } catch (error) {
      console.error('Failed to load motivational message:', error)
      setMotivationalMessage(
        "You've got this! Every day is a new opportunity to be stronger."
      )
    } finally {
      setMessageLoading(false)
    }
  }

  const handleCheckIn = async (status: 'success' | 'failed') => {
    if (!habitId) return

    try {
      setCheckInSubmitting(true)
      const response = await checkInAPI.createCheckIn({
        habitId,
        status,
      })

      setTodayCheckIn(response.data.data)

      // Refresh habit data
      if (habitId) {
        const habitData = await fetchHabitById(habitId)
        setHabit(habitData)
        setSelectedHabit(habitData)
      }

      // Reload motivational message
      loadMotivationalMessage(habitId)
    } catch (error) {
      console.error('Failed to create check-in:', error)
    } finally {
      setCheckInSubmitting(false)
    }
  }

  const handleResetStreak = async () => {
    if (!habitId || !window.confirm(
      'Are you sure you want to reset your streak? This will mark today as failed.'
    )) {
      return
    }

    try {
      await resetStreak(habitId)
      const habitData = await fetchHabitById(habitId)
      setHabit(habitData)
      setSelectedHabit(habitData)

      // Create a failed check-in
      await handleCheckIn('failed')
    } catch (error) {
      console.error('Failed to reset streak:', error)
    }
  }

  if (pageLoading || !habit) {
    return <LoadingSpinner message="Loading habit details..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/habits')}
          className="text-blue-600 hover:text-blue-700 mb-4 font-semibold flex items-center gap-2"
          aria-label="Go back to habits"
        >
          ← Back to Habits
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {habit.name}
          </h1>
          <p className="text-slate-600 capitalize text-lg">
            Category: {habit.category}
          </p>
        </div>

        {/* Streak Timer */}
        <div className="mb-8">
          <StreakTimer habit={habit} />
        </div>

        {/* Daily Check-in Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Daily Check-in
          </h2>

          {todayCheckIn ? (
            <div className="bg-white rounded-lg p-6 border-2 border-green-200">
              <p className="text-lg mb-3">
                ✅ You already checked in today!
              </p>
              <p className="text-slate-600">
                Status:{' '}
                <span
                  className={`font-bold ${
                    todayCheckIn.status === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {todayCheckIn.status === 'success'
                    ? 'Success'
                    : 'Failed'}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-700 mb-4">
                How did you do today? Mark your progress:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => handleCheckIn('success')}
                  disabled={checkInSubmitting}
                  className="w-full"
                  ariaLabel="Check in as success"
                >
                  🎉 I stayed strong today!
                </Button>

                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => handleCheckIn('failed')}
                  disabled={checkInSubmitting}
                  className="w-full"
                  ariaLabel="Check in as failed"
                >
                  😞 I struggled today
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Motivational Message */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            💪 Daily Motivation
          </h2>

          {messageLoading ? (
            <p className="text-slate-600">Loading your personalized message...</p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-slate-800 italic">
                "{motivationalMessage}"
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => loadMotivationalMessage(habitId!)}
                ariaLabel="Get another motivational message"
              >
                Get Another Message
              </Button>
            </div>
          )}
        </Card>

        {/* Panic Button */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Feeling Overwhelmed?
          </h2>
          <p className="text-slate-600 mb-6">
            If you're struggling with an urge or temptation right now, click the
            button below for immediate support:
          </p>
          <PanicButton habitId={habitId!} habitName={habit.name} />
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Current Streak:</span>
                <span className="font-bold text-green-600">
                  {habit.streakCount} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Longest Streak:</span>
                <span className="font-bold text-blue-600">
                  {habit.longestStreak} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Successful Days:</span>
                <span className="font-bold text-green-600">
                  {habit.successfulDays}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Failed Days:</span>
                <span className="font-bold text-red-600">
                  {habit.failedDays}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Success Rate:</span>
                <span className="font-bold text-purple-600">
                  {habit.totalCheckIns > 0
                    ? Math.round(
                      (habit.successfulDays / habit.totalCheckIns) * 100
                    )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => navigate(`/habits`)}
                ariaLabel="Go to all habits"
              >
                View All Habits
              </Button>

              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={handleResetStreak}
                ariaLabel="Reset your current streak"
              >
                Reset Streak
              </Button>
            </div>
          </Card>
        </div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <Card>
            <h3 className="font-bold text-slate-900 mb-6 text-lg">
              Last 30 Days Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="success" fill="#22c55e" name="Successful Days" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed Days" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </main>
    </div>
  )
}

export default HabitDetailsPage

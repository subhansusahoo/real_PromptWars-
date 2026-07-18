// Streak Timer component - displays ongoing streak
import React, { useEffect, useState } from 'react'

interface StreakTimerProps {
  habit: any
  ariaLabel?: string
}

const StreakTimer: React.FC<StreakTimerProps> = ({
  habit,
  ariaLabel,
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    const startDate = new Date(habit.startDate)
    const updateTimer = () => {
      const now = new Date()
      const elapsed = Math.floor(
        (now.getTime() - startDate.getTime()) / 1000
      )
      setTimeElapsed(elapsed)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [habit.startDate])

  const days = Math.floor(timeElapsed / (24 * 60 * 60))
  const hours = Math.floor((timeElapsed % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((timeElapsed % (60 * 60)) / 60)
  const seconds = timeElapsed % 60

  return (
    <div
      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-8 text-center border-2 border-green-200"
      role="region"
      aria-label={ariaLabel || `Current streak: ${days} days`}
    >
      <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">
        Current Streak
      </h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Days', value: days },
          { label: 'Hours', value: hours },
          { label: 'Minutes', value: minutes },
          { label: 'Seconds', value: seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div
              className="text-4xl font-bold text-green-600 mb-1"
              aria-label={`${item.value} ${item.label.toLowerCase()}`}
            >
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs font-medium text-slate-600 uppercase">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="text-2xl font-bold text-slate-700">
        {habit.streakCount > 0 && (
          <>
            <span className="text-green-600">{habit.streakCount}</span> day
            {habit.streakCount !== 1 ? 's' : ''} strong! 💪
          </>
        )}
      </div>

      {habit.longestStreak > 0 && (
        <p className="text-sm text-slate-600 mt-4">
          Personal best: <span className="font-bold">{habit.longestStreak}</span> days
        </p>
      )}
    </div>
  )
}

export default StreakTimer

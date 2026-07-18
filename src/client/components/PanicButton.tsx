// Panic Button component - triggers AI support
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from './Button'
import Card from './Card'
import { aiAPI } from '../api/habits'

interface PanicButtonProps {
  habitId: string
  habitName: string
}

interface Activity {
  title: string
  description: string
  duration: number
}

const PanicButton: React.FC<PanicButtonProps> = ({ habitId, habitName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<{
    message: string
    activities: Activity[]
  } | null>(null)

  const handlePanic = async () => {
    try {
      setIsLoading(true)
      const result = await aiAPI.getPanicSupport(habitId)
      setResponse(result.data.data)
      setIsOpen(true)
    } catch (error) {
      console.error('Error fetching panic support:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="danger"
        size="lg"
        onClick={handlePanic}
        disabled={isLoading}
        className="w-full md:w-auto animate-pulse-slow"
        ariaLabel={`Panic button for ${habitName}. Click for emergency support.`}
      >
        {isLoading ? 'Loading...' : '🆘 PANIC BUTTON'}
      </Button>

      <AnimatePresence>
        {isOpen && response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="panic-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6">
                <h2 id="panic-modal-title" className="text-2xl font-bold mb-2">
                  You Got This! 💪
                </h2>
                <p className="text-sm opacity-90">
                  You are stronger than the urge. Take a moment to breathe.
                </p>
              </div>

              <Card className="m-0 rounded-none">
                <div className="mb-6">
                  <p className="text-lg font-semibold text-slate-800 mb-3">
                    {response.message}
                  </p>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-700 mb-3">
                      Try one of these activities:
                    </h3>
                    {response.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500"
                      >
                        <h4 className="font-semibold text-slate-800 mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500">
                          ⏱️ {activity.duration} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  I'm Ready to Move Forward
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PanicButton

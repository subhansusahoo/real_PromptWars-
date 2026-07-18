// Habits Management Page
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import LoadingSpinner from '../components/LoadingSpinner'
import { useHabitsStore } from '../stores/habitsStore'
import { habitAPI, PREDEFINED_ADDICTIONS } from '../api/habits'

const HabitsPage: React.FC = () => {
  const navigate = useNavigate()
  const { habits, isLoading, fetchHabits, createHabit } = useHabitsStore()

  const [showForm, setShowForm] = useState(false)
  const [predefinedAddictions, setPredefinedAddictions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    category: 'smoking',
    description: '',
    reason: '',
  })
  const [formErrors, setFormErrors] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchHabits()
    const loadPredefined = async () => {
      const response = await habitAPI.getPredefinedAddictions()
      setPredefinedAddictions(response.data.data)
    }
    loadPredefined()
  }, [fetchHabits])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: any = {}
    if (!formData.name) errors.name = 'Habit name is required'
    if (!formData.category) errors.category = 'Category is required'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      setSubmitting(true)
      await createHabit(formData)
      setFormData({
        name: '',
        category: 'smoking',
        description: '',
        reason: '',
      })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create habit:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading your habits..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Habits</h1>
            <p className="text-slate-600">
              Track and manage your habits to break free from addiction
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowForm(!showForm)}
            ariaLabel={showForm ? 'Close form' : 'Create new habit'}
          >
            {showForm ? '✕ Cancel' : '+ New Habit'}
          </Button>
        </div>

        {/* Create Habit Form */}
        {showForm && (
          <Card className="mb-8 bg-blue-50 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Create New Habit
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Input
                  type="text"
                  name="name"
                  label="Habit Name"
                  placeholder="e.g., Stop smoking"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  required
                  ariaLabel="Habit name"
                />

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    aria-label="Select addiction category"
                  >
                    {predefinedAddictions.map((addiction) => (
                      <option key={addiction.id} value={addiction.id}>
                        {addiction.name}
                      </option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your habit and what you want to improve"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  rows={3}
                  aria-label="Habit description"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Why do you want to break this habit?
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  placeholder="Share your motivation..."
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  rows={3}
                  aria-label="Your motivation"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={submitting}
                ariaLabel="Create habit"
              >
                {submitting ? 'Creating...' : 'Create Habit'}
              </Button>
            </form>
          </Card>
        )}

        {/* Habits List */}
        {habits.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-600 mb-4 text-lg">
              No habits yet. Create one to start your journey!
            </p>
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              ariaLabel="Create your first habit"
            >
              Create First Habit
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {habits.map((habit) => (
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
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {habit.name}
                  </h3>
                  <p className="text-sm text-slate-600 capitalize">
                    {habit.category}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {habit.streakCount}
                  </p>
                  <p className="text-xs text-slate-600">day streak</p>
                </div>

                {habit.description && (
                  <p className="text-sm text-slate-600 mb-4">
                    {habit.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <p className="text-slate-600">Success</p>
                    <p className="font-bold text-green-600">
                      {habit.successfulDays}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <p className="text-slate-600">Failed</p>
                    <p className="font-bold text-red-600">{habit.failedDays}</p>
                  </div>
                  <div className="bg-slate-50 rounded p-2 text-center">
                    <p className="text-slate-600">Best</p>
                    <p className="font-bold text-blue-600">
                      {habit.longestStreak}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-blue-600 font-semibold">
                  Click to view details →
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default HabitsPage

// Register Page
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading, error } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [validationErrors, setValidationErrors] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (validationErrors[name]) {
      setValidationErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: any = {}
    if (!formData.name) errors.name = 'Name is required'
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.password) errors.password = 'Password is required'
    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await register(formData.email, formData.password, formData.name)
      navigate('/')
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🎯 HabitBreaker</h1>
          <p className="text-slate-600">Create your account and start your journey</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 mb-6">
            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={validationErrors.name}
              required
              autoComplete="name"
              ariaLabel="Full name"
            />

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={validationErrors.email || error}
              required
              autoComplete="email"
              ariaLabel="Email address"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={validationErrors.password}
              required
              autoComplete="new-password"
              ariaLabel="Password"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={validationErrors.confirmPassword}
              required
              ariaLabel="Confirm password"
            />
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign in here
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage

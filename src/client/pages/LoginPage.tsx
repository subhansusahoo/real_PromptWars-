// Login Page
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading, error } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev: any) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const errors: any = {}
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.password) errors.password = 'Password is required'

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">🎯 HabitBreaker</h1>
          <p className="text-slate-600">
            Break free from harmful habits with AI-powered support
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 mb-6">
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
              autoComplete="current-password"
              ariaLabel="Password"
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Register here
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage

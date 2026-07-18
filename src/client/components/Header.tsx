// Header/Navigation component
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from './Button'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <nav
        className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">🎯 HabitBreaker</h1>
          <div className="hidden md:flex gap-6">
            <a
              href="/"
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              aria-current="page"
            >
              Dashboard
            </a>
            <a
              href="/habits"
              className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
            >
              Habits
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-slate-700 text-sm">Welcome, {user.name}</span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header

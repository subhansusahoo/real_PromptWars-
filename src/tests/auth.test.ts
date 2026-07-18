// Auth service tests
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from '../../server/services/authService'
import { prisma } from '../../server/index'

vi.mock('../../server/index')

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123'
      const hash = await AuthService.hashPassword(password)
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testPassword123'
      const hash = await AuthService.hashPassword(password)
      const isValid = await AuthService.verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testPassword123'
      const hash = await AuthService.hashPassword(password)
      const isValid = await AuthService.verifyPassword('wrongPassword', hash)
      expect(isValid).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('should generate a JWT token', async () => {
      const token = await AuthService.generateToken('userId123')
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
    })
  })
})

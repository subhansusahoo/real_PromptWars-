// Authentication API
import apiClient from './client'

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
}

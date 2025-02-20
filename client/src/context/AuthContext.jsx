// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setIsLoading(false)
          return
        }

        // Verify token with backend
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth verification error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) throw new Error('Login failed')

      const { token, user } = await response.json()
      
      localStorage.setItem('token', token)
      setUser(user)
      setIsAuthenticated(true)
      navigate('/')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
    navigate('/auth')
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
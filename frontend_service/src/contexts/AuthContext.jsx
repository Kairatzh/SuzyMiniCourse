import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import apiService from '../services/apiService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    apiService.clearToken()
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const userData = await apiService.getCurrentUser()
      if (userData) {
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        throw new Error('No user data returned')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      apiService.clearToken()
      setUser(null)
      setIsAuthenticated(false)
      throw error // Re-throw to let caller handle it
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    let timeoutId = null

    const initializeAuth = async () => {
      try {
        // Fast path: check existing token first
        const token = localStorage.getItem('access_token')
        if (token) {
          apiService.setToken(token)
          try {
            await checkAuth()
            if (isMounted) {
              setLoading(false)
            }
            return
          } catch (error) {
            console.error('Auth check failed:', error)
            apiService.clearToken()
            localStorage.removeItem('access_token')
          }
        }

        // Auto-login in demo mode
        if (apiService.demoMode) {
          try {
            const response = await apiService.login('demo@fill.ai', 'demo')
            if (response?.access_token) {
              apiService.setToken(response.access_token)
              try {
                await checkAuth()
              } catch (error) {
                // Fallback: set demo user directly
                if (isMounted) {
                  setIsAuthenticated(true)
                  setUser({
                    id: 1,
                    username: "demo_user",
                    email: "demo@fill.ai",
                    created_at: "2025-01-01T00:00:00Z"
                  })
                }
              }
            } else {
              // Set demo user if no token
              if (isMounted) {
                setIsAuthenticated(true)
                setUser({
                  id: 1,
                  username: "demo_user",
                  email: "demo@fill.ai",
                  created_at: "2025-01-01T00:00:00Z"
                })
              }
            }
          } catch (error) {
            console.error('Auto-login failed:', error)
            // Always set demo user in demo mode, even on error
            if (isMounted) {
              setIsAuthenticated(true)
              setUser({
                id: 1,
                username: "demo_user",
                email: "demo@fill.ai",
                created_at: "2025-01-01T00:00:00Z"
              })
            }
          }
        }

        if (isMounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (isMounted) {
          if (apiService.demoMode) {
            setIsAuthenticated(true)
            setUser({
              id: 1,
              username: "demo_user",
              email: "demo@fill.ai",
              created_at: "2025-01-01T00:00:00Z"
            })
          }
          setLoading(false)
        }
      }
    }

    // Safety timeout - always complete loading after 1.5 seconds
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth init timeout - forcing completion')
        if (apiService.demoMode && !isAuthenticated) {
          setIsAuthenticated(true)
          setUser({
            id: 1,
            username: "demo_user",
            email: "demo@fill.ai",
            created_at: "2025-01-01T00:00:00Z"
          })
        }
        setLoading(false)
      }
    }, 1500)

    initializeAuth()

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [checkAuth, isAuthenticated])

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password)
      if (response.access_token) {
        apiService.setToken(response.access_token)
        await checkAuth()
        return { success: true }
      }
      return { success: false, error: 'Invalid credentials' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (username, email, password) => {
    try {
      await apiService.register(username, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


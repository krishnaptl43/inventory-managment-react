import { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../webservice/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('inventory-token')
    const userData = localStorage.getItem('inventory-user')

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Simulate API call - Replace with actual backend API

      const userData = await authAPI.login({ email, password })

      if (userData.success) {
        localStorage.setItem('inventory-token', userData.token)
        localStorage.setItem('inventory-user', JSON.stringify(userData.user))
        setUser(userData.user)
        return { success: true, user: userData.user }
      } else {
        return { success: false, error: userData.message }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)

      if (response.success) {
        const { token, user: newUser } = response

        localStorage.setItem('inventory-token', token)
        localStorage.setItem('inventory-user', JSON.stringify(newUser))
        setUser(newUser)

        return { success: true, user: newUser }
      } else {
        return { success: false, error: response.message }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    localStorage.removeItem('inventory-token')
    localStorage.removeItem('inventory-user')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
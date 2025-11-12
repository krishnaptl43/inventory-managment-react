import { createContext, useState, useContext, useEffect } from 'react'

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
      if (email === 'admin@inventory.com' && password === 'password') {
        const userData = {
          id: 1,
          name: 'Admin User',
          email: email,
          role: 'admin'
        }
        
        const token = 'mock-jwt-token-' + Date.now()
        
        localStorage.setItem('inventory-token', token)
        localStorage.setItem('inventory-user', JSON.stringify(userData))
        setUser(userData)
        
        return { success: true, user: userData }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      // Simulate API call - Replace with actual backend API
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      }
      
      const token = 'mock-jwt-token-' + Date.now()
      
      localStorage.setItem('inventory-token', token)
      localStorage.setItem('inventory-user', JSON.stringify(newUser))
      setUser(newUser)
      
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' }
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
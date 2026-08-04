import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api'

const AuthContext = createContext()

const TOKEN_KEY = 'token'
const USER_KEY = 'authUser'

function loadUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  const refreshAuthState = useCallback(() => {
    const storedUser = loadUser()
    const storedToken = localStorage.getItem(TOKEN_KEY) || ''
    setUser(storedUser)
    setToken(storedToken)
  }, [])

  useEffect(() => {
    refreshAuthState()
  }, [refreshAuthState])

  const isLoggedIn = Boolean(token)
  const userRole = user?.role || loadUser()?.role || null
  // Convenience flags used to branch navigation between customer and seller UIs.
  const isAdmin = userRole === 'admin'
  // Admins have full seller capabilities (dashboard, products, orders, approvals).
  const isSeller = userRole === 'seller' || userRole === 'admin'

  const login = useCallback(async (email, password) => {
    const data = await apiLogin({ email, password })
    const authUser = { _id: data._id, name: data.name, email: data.email, role: data.role }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    setToken(data.token)
    setUser(authUser)
    return data
  }, [])

  const register = useCallback(async (name, email, password, role = 'user') => {
    const data = await apiRegister({ name, email, password, role })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken('')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isAdmin, isSeller, login, register, logout, refreshAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

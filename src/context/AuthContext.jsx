import { createContext, useContext, useState, useCallback } from 'react'
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

  const isLoggedIn = Boolean(token)

  const login = useCallback(async (email, password) => {
    const data = await apiLogin({ email, password })
    const authUser = { _id: data._id, name: data.name, email: data.email }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
    setToken(data.token)
    setUser(authUser)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await apiRegister({ name, email, password })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken('')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

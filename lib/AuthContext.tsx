'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type User = { id: string; email: string; displayName: string; role: string } | null

const AuthContext = createContext<{
  user: User
  setUser: (u: User) => void
  logout: () => void
}>({ user: null, setUser: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(u => setUser(u))
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
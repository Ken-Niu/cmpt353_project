'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, displayName, password })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) return setError(data.error)
    setUser(data.user)
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <p className="mt-4 text-center text-sm">
        Have account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  )
}
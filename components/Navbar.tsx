'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl text-blue-600">
        Channel-based programming Q&A tool
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/search" className="text-gray-600 hover:text-blue-600">Search</Link>
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.displayName}</span>
            {user.role === 'admin' && (
              <Link href="/admin" className="text-red-600 hover:underline">Admin</Link>
            )}
            <button onClick={logout} className="text-gray-600 hover:text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link href="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/AuthContext'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Channel-Based Programming Q&A Tool',
  description: 'Revised project specification',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
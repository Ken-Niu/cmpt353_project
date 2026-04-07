'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'

type User = { id: string; email: string; displayName: string; role: string }
type Channel = { id: string; name: string }
type Post = { id: string; title: string; author: { displayName: string } }

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [channels, setChannels] = useState<Channel[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (user && user.role !== 'admin') router.push('/')
  }, [user])

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(setUsers)
    fetch('/api/channels').then(r => r.json()).then(setChannels)
    fetch('/api/posts').then(r => r.json()).then(setPosts)
  }, [])

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setUsers(users.filter(u => u.id !== id))
  }

  const deleteChannel = async (id: string) => {
    if (!confirm('Delete this channel?')) return
    await fetch(`/api/channels/${id}`, { method: 'DELETE' })
    setChannels(channels.filter(c => c.id !== id))
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    setPosts(posts.filter(p => p.id !== id))
  }

  if (!user || user.role !== 'admin') return <p>Access denied.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          {users.map(u => (
            <div key={u.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <span className="font-medium">{u.displayName}</span>
                <span className="text-gray-500 text-sm ml-2">{u.email}</span>
                {u.role === 'admin' && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">admin</span>}
              </div>
              {u.role !== 'admin' && (
                <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Channels</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          {channels.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 border-b">
              <span>#{c.name}</span>
              <button onClick={() => deleteChannel(c.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          {posts.map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <span className="font-medium">{p.title}</span>
                <span className="text-gray-500 text-sm ml-2">by {p.author.displayName}</span>
              </div>
              <button onClick={() => deletePost(p.id)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
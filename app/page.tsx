'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

type Channel = {
  id: string
  name: string
  description: string | null
  createdBy: string
  creator: { displayName: string }
  _count: { posts: number }
}

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetch('/api/channels')
      .then(r => r.json())
      .then(data => { setChannels(data); setLoading(false) })
  }, [])

  const createChannel = async () => {
    const res = await fetch('/api/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error || 'Failed to create channel')
      return
    }
    setChannels([data, ...channels])
    setName('')
    setDescription('')
    setShowForm(false)
  }

  const deleteChannel = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (!confirm('Delete this channel?')) return
    await fetch(`/api/channels/${id}`, { method: 'DELETE' })
    setChannels(channels.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Channels</h1>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Channel
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Create Channel</h2>
          <input
            placeholder="Channel name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <button
            onClick={createChannel}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : channels.length === 0 ? (
        <p className="text-gray-500">No channels yet. Create one!</p>
      ) : (
        <div className="grid gap-4">
          {channels.map(channel => (
            <Link key={channel.id} href={`/channels/${channel.id}`}>
              <div className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600">#{channel.name}</h2>
                    {channel.description && <p className="text-gray-600 mt-1">{channel.description}</p>}
                    <p className="text-sm text-gray-400 mt-2">
                      {channel._count?.posts ?? 0} posts · created by {channel.creator?.displayName}
                    </p>
                  </div>
                  {(user?.id === channel.createdBy || user?.role === 'admin') && (
                    <button
                      onClick={e => deleteChannel(e, channel.id)}
                      className="text-red-600 hover:underline text-sm ml-4"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
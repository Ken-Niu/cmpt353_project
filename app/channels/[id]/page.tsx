'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'

type Post = {
  id: string
  title: string
  body: string
  createdAt: string
  author: { displayName: string }
  _count: { replies: number; votes: number }
}

export default function ChannelPage() {
  const { id } = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetch(`/api/posts?channelId=${id}`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false) })
  }, [id])

  const createPost = async () => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, channelId: id })
    })
    const data = await res.json()
    if (res.ok) {
      setPosts([data, ...posts])
      setTitle('')
      setBody('')
      setShowForm(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-blue-600 hover:underline text-sm">← Channels</Link>
          <h1 className="text-3xl font-bold mt-1">Posts</h1>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Post
          </button>
        )}
      </div>

      {!user && (
        <p className="text-gray-500 mb-4">
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link> to create posts.
        </p>
      )}

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Create Post</h2>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <button
            onClick={createPost}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first!</p>
      ) : (
        <div className="grid gap-4">
          {posts.map(post => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <div className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-1 line-clamp-2">{post.body}</p>
                <p className="text-sm text-gray-400 mt-2">
                  by {post.author?.displayName} · {post._count?.replies ?? 0} replies
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
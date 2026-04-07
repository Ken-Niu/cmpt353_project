'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import Link from 'next/link'

type Reply = {
  id: string
  body: string
  createdAt: string
  authorId: string
  author: { displayName: string }
  votes: { value: number; userId: string }[]
  childReplies: Reply[]
  attachments: { id: string; path: string }[]
}

type Post = {
  id: string
  title: string
  body: string
  createdAt: string
  authorId: string
  author: { displayName: string }
  votes: { value: number; userId: string }[]
  replies: Reply[]
  attachments: { id: string; path: string }[]
}

function ReplyItem({ reply, postId, onReplyAdded, depth = 0 }: {
  reply: Reply
  postId: string
  onReplyAdded: () => void
  depth?: number
}) {
  const [showForm, setShowForm] = useState(false)
  const [body, setBody] = useState('')
  const { user } = useAuth()
  const score = reply.votes.reduce((s, v) => s + v.value, 0)

  const submitReply = async () => {
    await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body, postId, parentReplyId: reply.id })
    })
    setBody('')
    setShowForm(false)
    onReplyAdded()
  }

  const vote = async (value: number) => {
    const currentVote = reply.votes.find(v => v.userId === user?.id)
    const newValue = currentVote?.value === value ? 0 : value
    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType: 'reply', targetId: reply.id, value: newValue })
    })
    onReplyAdded()
  }

  const deleteReply = async () => {
    if (!confirm('Delete this reply?')) return
    await fetch(`/api/replies/${reply.id}`, { method: 'DELETE' })
    onReplyAdded()
  }

  return (
    <div className={`border-l-2 border-gray-200 pl-4 mt-3 ${depth > 0 ? 'ml-4' : ''}`}>
      <div className="bg-white p-3 rounded shadow-sm">
        <p className="text-gray-800">{reply.body}</p>
        {reply.attachments?.map(a => (
          <img key={a.id} src={a.path} alt="attachment" className="mt-2 max-w-xs rounded" />
        ))}
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <span>{reply.author?.displayName}</span>
          {user && (
            <>
              <button onClick={() => vote(1)} className="hover:text-green-600">▲</button>
              <span>{score}</span>
              <button onClick={() => vote(-1)} className="hover:text-red-600">▼</button>
              <button onClick={() => setShowForm(!showForm)} className="hover:text-blue-600">Reply</button>
              {(user.role === 'admin' || user.id === reply.authorId) && (
                <button onClick={deleteReply} className="text-red-600 hover:underline">Delete</button>
              )}
            </>
          )}
        </div>
        {showForm && (
          <div className="mt-2">
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Write a reply..."
            />
            <button
              onClick={submitReply}
              className="mt-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {reply.childReplies?.map(child => (
        <ReplyItem key={child.id} reply={child} postId={postId} onReplyAdded={onReplyAdded} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function PostPage() {
  const { id } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyBody, setReplyBody] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const loadPost = () => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(data => { setPost(data); setLoading(false) })
  }

  useEffect(() => { loadPost() }, [id])

  const submitReply = async () => {
    const res = await fetch('/api/replies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: replyBody, postId: id })
    })
    const reply = await res.json()
    if (res.ok && file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('targetType', 'reply')
      formData.append('targetId', reply.id)
      await fetch('/api/upload', { method: 'POST', body: formData })
    }
    setReplyBody('')
    setFile(null)
    loadPost()
  }

  const vote = async (value: number) => {
    const currentVote = post?.votes.find(v => v.userId === user?.id)
    const newValue = currentVote?.value === value ? 0 : value
    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType: 'post', targetId: id, value: newValue })
    })
    loadPost()
  }

  const deletePost = async () => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    router.push('/')
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!post) return <p className="text-red-500">Post not found.</p>

  const score = post.votes.reduce((s, v) => s + v.value, 0)

  return (
    <div>
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Back</Link>

      <div className="bg-white p-6 rounded shadow mt-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <p className="text-gray-700 mt-3">{post.body}</p>
        {post.attachments?.map(a => (
          <img key={a.id} src={a.path} alt="attachment" className="mt-3 max-w-sm rounded" />
        ))}
        <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
          <span>by {post.author?.displayName}</span>
          {user && (
            <>
              <button onClick={() => vote(1)} className="hover:text-green-600">▲</button>
              <span>{score}</span>
              <button onClick={() => vote(-1)} className="hover:text-red-600">▼</button>
              {(user.id === post.authorId || user.role === 'admin') && (
                <button onClick={deletePost} className="text-red-600 hover:underline ml-2">
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Replies</h2>

      {user ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <textarea
            value={replyBody}
            onChange={e => setReplyBody(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2"
            placeholder="Write a reply..."
          />
          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm text-gray-600">
              Screenshot:
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="ml-2"
              />
            </label>
            <button
              onClick={submitReply}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reply
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link> to reply.
        </p>
      )}

      {post.replies.length === 0 ? (
        <p className="text-gray-500">No replies yet.</p>
      ) : (
        post.replies.map(reply => (
          <ReplyItem key={reply.id} reply={reply} postId={post.id} onReplyAdded={loadPost} />
        ))
      )}
    </div>
  )
}
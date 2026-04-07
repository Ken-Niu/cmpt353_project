'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('content')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const search = async (p = 1) => {
    setLoading(true)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}&page=${p}`)
    const data = await res.json()
    setResults(data)
    setPage(p)
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex gap-2 mb-3">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search()}
            placeholder="Search..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={() => search()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'content', label: 'Content' },
            { value: 'author', label: 'By Author' },
            { value: 'top_posters', label: 'Top Posters' },
            { value: 'least_posters', label: 'Least Posters' },
            { value: 'top_voted', label: 'Top Voted' },
          ].map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={`px-3 py-1 rounded text-sm ${type === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}

      {results && (
        <div>
          {/* Content / Author / Top Voted results */}
          {results.posts && (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Posts ({results.posts.length})</h2>
              {results.posts.length === 0 ? (
                <p className="text-gray-500">No posts found.</p>
              ) : (
                results.posts.map((p: any) => (
                  <Link key={p.id} href={`/posts/${p.id}`}>
                    <div className="bg-white p-3 rounded shadow mb-2 hover:shadow-md cursor-pointer">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-gray-500">by {p.author.displayName} · #{p.channel?.name}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {results.replies && results.replies.length > 0 && (
            <div className="mb-6">
              <h2 className="font-semibold mb-3">Replies ({results.replies.length})</h2>
              {results.replies.map((r: any) => (
                <Link key={r.id} href={`/posts/${r.post?.id}`}>
                  <div className="bg-white p-3 rounded shadow mb-2 hover:shadow-md cursor-pointer">
                    <p className="text-gray-800">{r.body}</p>
                    <p className="text-sm text-gray-500">by {r.author.displayName} · in "{r.post?.title}"</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Top/Least posters */}
          {results.users && (
            <div>
              <h2 className="font-semibold mb-3">Users</h2>
              {results.users.map((u: any) => (
                <div key={u.id} className="bg-white p-3 rounded shadow mb-2 flex justify-between">
                  <span>{u.displayName}</span>
                  <span className="text-gray-500 text-sm">{u._count.posts} posts</span>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {(results.posts?.length === 10 || results.replies?.length === 10) && (
            <div className="flex gap-2 mt-4">
              {page > 1 && (
                <button onClick={() => search(page - 1)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                  Previous
                </button>
              )}
              <button onClick={() => search(page + 1)} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
import { useState } from 'react'
import type { User } from '../types/user'
import { UserCard } from './UserCard'
import { UserDetailModal } from './UserDetailModal'

type UserDirectoryProps = {
  users: User[]
}

export function UserDirectory({ users }: UserDirectoryProps) {
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const normalizedQuery = query.trim().toLowerCase()

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(normalizedQuery) ||
    user.email.toLowerCase().includes(normalizedQuery),
  )

  if (users.length === 0) {
    return <p className="text-slate-600">Belum ada pengguna tersedia.</p>
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
            <label
            htmlFor="user-search"
            className="block text-sm font-semibold text-slate-700"
            >
            Cari pengguna
            </label>

            <input
            id="user-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau email..."
            aria-describedby="search-results"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />
        </div>

        <p
            id="search-results"
            role="status"
            className="shrink-0 text-sm text-slate-500"
        >
            Menampilkan{' '}
            <span className="font-semibold text-slate-900">
            {filteredUsers.length}
            </span>{' '}
            dari {users.length} pengguna
        </p>
        </div>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-slate-600">Tidak ada pengguna yang cocok.</p>

          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-3 rounded-lg px-3 py-2 font-medium text-indigo-600 hover:bg-indigo-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Hapus pencarian
          </button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <li key={user.id} className="min-w-0">
              <UserCard user={user} onSelect={setSelectedUser} />
            </li>
          ))}
        </ul>
      )}

      {selectedUser !== null && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  )
}
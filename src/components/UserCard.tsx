import type { User } from '../types/user'

type UserCardProps = {
  user: User
  onSelect: (user: User) => void
}

export function UserCard({ user, onSelect }: UserCardProps) {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase() || '?'

  return (
    <article className="flex h-full flex-col rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-sage-50 text-base font-semibold text-sage-700"
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-snug text-stone-900">
            {user.name}
          </h2>

          <p className="mt-1 break-all text-xs text-stone-500">
            @{user.username}
          </p>
        </div>
      </div>

      <p className="mt-4 break-all text-sm text-stone-600">
        {user.email}
      </p>

      <div className="mt-auto pt-5">
        <div className="border-t border-stone-100 pt-4">
          <p className="text-xs text-stone-500">
            Perusahaan
          </p>

          <p className="mt-1 break-words text-sm font-medium text-stone-700">
            {user.company.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelect(user)}
          aria-haspopup="dialog"
          aria-label={`Lihat detail ${user.name}`}
          className="mt-4 inline-flex min-h-10 w-full cursor-pointer items-center justify-center rounded-lg border border-sage-200 bg-sage-50 px-4 py-2 text-sm font-medium text-sage-700 transition-colors hover:border-sage-300 hover:bg-sage-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-600"
        >
          Lihat detail
        </button>
      </div>
    </article>
  )
}
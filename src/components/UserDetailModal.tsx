import { useEffect, useRef } from 'react'
import type { User } from '../types/user'

type UserDetailModalProps = {
  user: User
  onClose: () => void
}

export function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow

    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow

      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [])

  const details = [
    { label: 'Username', value: user.username },
    { label: 'Email', value: user.email },
    { label: 'Telepon', value: user.phone },
    { label: 'Website', value: user.website },
    {
      label: 'Alamat',
      value: `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`,
    },
    { label: 'Perusahaan', value: user.company.name },
    { label: 'Tentang perusahaan', value: user.company.catchPhrase },
  ]

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="user-detail-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className="m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/50"
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Detail pengguna</p>

          <h2 id="user-detail-title" className="mt-1 text-2xl font-bold">
            {user.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Tutup
        </button>
      </header>

      <dl className="mt-6 space-y-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="mt-1 break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </dialog>
  )
}
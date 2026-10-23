import { useUsers } from './hooks/useUsers'
import { UserDirectory } from './components/UserDirectory'

export default function App() {
  const { state, retry } = useUsers()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 border-b border-stone-200 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-stone-500">
                Direktori pengguna
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                User Dashboard
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-600">
                Informasi kontak dan perusahaan dalam satu tempat.
              </p>
            </div>

            {state.status === 'success' && (
              <p className="shrink-0 text-sm text-stone-500">
                <span className="font-semibold text-stone-900">
                  {state.users.length}
                </span>{' '}
                pengguna
              </p>
            )}
          </div>
        </header>

        <section
          aria-label="Daftar pengguna"
          aria-busy={state.status === 'loading'}
        >
          {state.status === 'loading' && (
            <p role="status" className="text-slate-600">
              Sedang memuat pengguna...
            </p>
          )}

          {state.status === 'error' && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p role="alert" className="text-red-800">
                {state.message}
              </p>

              <button
                type="button"
                onClick={retry}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Coba lagi
              </button>
            </div>
          )}

          {state.status === 'success' && (
            <UserDirectory users={state.users} />
          )}
        </section>
      </div>
    </main>
  )
}
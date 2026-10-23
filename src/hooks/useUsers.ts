import { useEffect, useState } from 'react'
import { fetchUsers } from '../api/users'
import type { User } from '../types/user'

type UsersState =
  | { status: 'loading' }
  | { status: 'success'; users: User[] }
  | { status: 'error'; message: string }

export function useUsers() {
  const [state, setState] = useState<UsersState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const users = await fetchUsers(controller.signal)

        if (!controller.signal.aborted) {
          setState({ status: 'success', users })
        }
      } catch {
        if (!controller.signal.aborted) {
          setState({
            status: 'error',
            message: 'Data pengguna belum dapat dimuat. Silakan coba lagi.',
          })
        }
      }
    }

    void loadUsers()

    return () => controller.abort()
  }, [attempt])

  function retry() {
    setState({ status: 'loading' })
    setAttempt((previous) => previous + 1)
  }

  return { state, retry }
}
import type { User } from '../types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false

  const { address, company } = value

  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.username === 'string' &&
    typeof value.email === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.website === 'string' &&
    isRecord(address) &&
    typeof address.street === 'string' &&
    typeof address.suite === 'string' &&
    typeof address.city === 'string' &&
    typeof address.zipcode === 'string' &&
    isRecord(company) &&
    typeof company.name === 'string' &&
    typeof company.catchPhrase === 'string'
  )
}

export async function fetchUsers(signal: AbortSignal): Promise<User[]> {
  const response = await fetch(USERS_URL, { signal })

  if (!response.ok) {
    throw new Error('Gagal mengambil data pengguna.')
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data) || !data.every(isUser)) {
    throw new Error('Format data pengguna tidak sesuai.')
  }

  return data
}
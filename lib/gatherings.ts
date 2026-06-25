import { API_BASE_URL } from '@/lib/config'
import { getAuthHeaders } from '@/lib/auth'

export interface Gathering {
  id: number
  name: string
  code: string
  owner: string
  member_count: number
  is_owner: boolean
  leaderboard?: LeaderboardEntry[]
}

export interface LeaderboardEntry {
  username: string
  total_points: number
  rank: number
  correct_predictions?: number
  total_predictions?: number
}

export async function listGatherings(): Promise<Gathering[]> {
  const response = await fetch(`${API_BASE_URL}/api/accounts/gatherings/`, {
    headers:{ 
      'Content-Type': 'application/json',
      ...Object.fromEntries(
      Object.entries(await getAuthHeaders()).filter(([, value]) => value !== undefined)
    )},
  })

  if (!response.ok) {
    throw new Error('Failed to fetch gatherings')
  }

  return response.json()
}

export async function createGathering(name: string): Promise<Gathering> {
  const response = await fetch(`${API_BASE_URL}/api/accounts/gatherings/`, {
    method: 'POST',
    headers:{ 
      'Content-Type': 'application/json',
      ...Object.fromEntries(
      Object.entries(await getAuthHeaders()).filter(([, value]) => value !== undefined)
    )},
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.name?.[0] || errorData.detail || 'Failed to create gathering')
  }

  return response.json()
}

export async function getGathering(code: string): Promise<Gathering> {
  const headers = {
    'Content-Type': 'application/json',
    ...Object.fromEntries(
      Object.entries(await getAuthHeaders()).filter(([, value]) => value !== undefined)
    ),
  }
  const response = await fetch(`${API_BASE_URL}/api/accounts/gatherings/${code}/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch gathering')
  }

  return response.json()
}

export async function joinGathering(code: string): Promise<Gathering> {
  const response = await fetch(`${API_BASE_URL}/api/accounts/gatherings/${code}/join/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(
        Object.entries(await getAuthHeaders()).filter(([, value]) => value !== undefined),
      )},
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || 'Failed to join gathering')
  }

  return response.json()
}

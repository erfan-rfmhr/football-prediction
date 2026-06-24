// داده‌های نمونه برای برنامه پیش‌بینی جام جهانی

import * as auth from './auth'
import { API_BASE_URL } from './config'

export interface ApiTeam {
  id: number
  name: string
  country?: string
}

export interface ApiTournament {
  id: number
  name: string
  season: string
}

export interface ApiPrediction {
  id: number
  user: number
  match: number
  home_score: number
  away_score: number
  final_home_score: number | null
  final_away_score: number | null
  home_team: string
  away_team: string
  points: number | null
}

export interface ApiDashboardData {
  total_points: number
  user_rank: number
  total_predictions: number
  correct_predictions: number
  accuracy_percentage: number
}

export interface ApiMatch {
  id: number
  tournament: ApiTournament
  home_team: ApiTeam
  away_team: ApiTeam
  user_prediction: ApiPrediction | Record<string, never>
  stage: string
  home_score: number | null
  away_score: number | null
  start_at: string
}

export interface Match {
  id: string
  homeTeam: ApiTeam
  awayTeam: ApiTeam
  date: string
  time: string
  stage: string
  group?: string
  status: 'upcoming' | 'live' | 'finished'
  homeScore?: number
  awayScore?: number
  userPrediction?: {
    id: number
    homeScore: number
    awayScore: number
  }
  tournament?: ApiTournament
  startedAt?: string
}

// Convert API Match to Match
export function convertApiMatchToMatch(apiMatch: ApiMatch): Match {
  const date = new Date(apiMatch.start_at)
  const userPrediction = Object.keys(apiMatch.user_prediction).length > 0 
    ? apiMatch.user_prediction as ApiPrediction 
    : undefined
  
  return {
    id: apiMatch.id.toString(),
    homeTeam: apiMatch.home_team,
    awayTeam: apiMatch.away_team,
    date: date.toISOString().split('T')[0],
    time: date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    stage: apiMatch.stage,
    status: apiMatch.home_score !== null && apiMatch.away_score !== null ? 'finished' : 'upcoming',
    homeScore: apiMatch.home_score ?? undefined,
    awayScore: apiMatch.away_score ?? undefined,
    userPrediction: userPrediction 
      ? {
          id: userPrediction.id,
          homeScore: userPrediction.home_score,
          awayScore: userPrediction.away_score,
        }
      : undefined,
    tournament: apiMatch.tournament,
    startedAt: apiMatch.start_at,
  }
}

export interface User {
  id: string
  name: string
  points: number
  rank: number
  correctPredictions: number
  totalPredictions: number
}

// API response interface for leaderboard
export interface ApiLeaderboardEntry {
  username: string
  points: number
  rank: number
  correct_predictions: number
  total_predictions: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export interface Prediction {
  id: string
  match: Match
  prediction: 'میزبان' | 'مساوی' | 'مهمان'
  result?: 'correct' | 'incorrect' | 'pending'
  pointsEarned?: number
}

export interface Activity {
  id: string
  type: 'prediction' | 'points' | 'rank'
  message: string
  timestamp: string
}

// Current user data
export const currentUser: User = {
  id: '1',
  name: 'علی',
  points: 127,
  rank: 5,
  correctPredictions: 18,
  totalPredictions: 24,
}

// Leaderboard data
export const leaderboard: User[] = [
  { id: '2', name: 'محمد',  points: 156, rank: 1, correctPredictions: 22, totalPredictions: 24},
  { id: '3', name: 'سارا',  points: 148, rank: 2, correctPredictions: 21, totalPredictions: 24},
  { id: '4', name: 'حسین',  points: 142, rank: 3, correctPredictions: 20, totalPredictions: 24},
  { id: '5', name: 'زهرا',  points: 138, rank: 4, correctPredictions: 19, totalPredictions: 24},
  { id: '1', name: 'علی',  points: 127, rank: 5, correctPredictions: 18, totalPredictions: 24},
  { id: '6', name: 'رضا',  points: 124, rank: 6, correctPredictions: 17, totalPredictions: 24},
  { id: '7', name: 'مریم',  points: 119, rank: 7, correctPredictions: 16, totalPredictions: 24},
  { id: '8', name: 'امیر',  points: 115, rank: 8, correctPredictions: 16, totalPredictions: 24},
  { id: '9', name: 'فاطمه',  points: 108, rank: 9, correctPredictions: 15, totalPredictions: 24},
  { id: '10', name: 'حسین',  points: 102, rank: 10,  correctPredictions: 14, totalPredictions: 24},
]

// Helper function to determine if a prediction was correct
export function isPredictionCorrect(match: Match): boolean | null {
  if (match.status !== 'finished' || match.homeScore === undefined || match.awayScore === undefined || !match.userPrediction) {
    return null
  }
  
  let actualResult: 'میزبان' | 'مساوی' | 'مهمان'
  if (match.homeScore > match.awayScore) {
    actualResult = 'میزبان'
  } else if (match.homeScore < match.awayScore) {
    actualResult = 'مهمان'
  } else {
    actualResult = 'مساوی'
  }
  
  let predictedResult: 'میزبان' | 'مساوی' | 'مهمان'
  if (match.userPrediction.homeScore > match.userPrediction.awayScore) {
    predictedResult = 'میزبان'
  } else if (match.userPrediction.homeScore < match.userPrediction.awayScore) {
    predictedResult = 'مهمان'
  } else {
    predictedResult = 'مساوی'
  }
  
  return predictedResult === actualResult
}

export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'امروز'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'فردا'
  } else {
    return date.toLocaleDateString('fa-IR', { weekday: 'short', month: 'short', day: 'numeric' })
  }
}


async function getAuthHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  const accessToken = auth.getAccessToken()
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }
  
  return headers
}

export async function createPrediction(matchId: number, homeScore: number, awayScore: number): Promise<ApiPrediction> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/competitions/predictions/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      match: matchId,
      home_score: homeScore,
      away_score: awayScore,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create prediction')
  }
  
  return response.json()
}

export async function updatePrediction(predictionId: number, homeScore: number, awayScore: number): Promise<ApiPrediction> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/competitions/predictions/${predictionId}/`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      home_score: homeScore,
      away_score: awayScore,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to update prediction')
  }
  
  return response.json()
}

export async function getPredictions(): Promise<ApiPrediction[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/competitions/predictions/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch predictions')
  }

  return response.json()
}

export async function getDashboardData(): Promise<ApiDashboardData> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/accounts/dashboard/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data')
  }

  return response.json()
}

export async function getLeaderboard(): Promise<User[]> {
  const headers = await getAuthHeaders()
  const response = await fetch(`${API_BASE_URL}/api/competitions/leaderboard/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data')
  }

  const apiData: ApiLeaderboardEntry[] = await response.json()

  // Transform API data to User type
  return apiData.map((entry) => ({
    id: entry.username, // Use username as id since API doesn't provide id
    name: entry.username,
    points: entry.points,
    rank: entry.rank,
    correctPredictions: entry.correct_predictions,
    totalPredictions: entry.total_predictions,
  }))
}

export { getAuthHeaders }

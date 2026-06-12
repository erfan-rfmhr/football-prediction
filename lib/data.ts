// داده‌های نمونه برای برنامه پیش‌بینی جام جهانی

import * as auth from './auth'

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
  match: number | ApiMatch
  created_at: string
  updated_at: string
  home_score: number
  away_score: number
  points?: number | null
  user?: number
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
  predictionLocked?: boolean
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
  }
}

export interface User {
  id: string
  name: string
  avatar: string
  points: number
  rank: number
  previousRank: number
  correctPredictions: number
  totalPredictions: number
  memberSince: string
  achievements: Achievement[]
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
  avatar: 'ع',
  points: 127,
  rank: 5,
  previousRank: 7,
  correctPredictions: 18,
  totalPredictions: 24,
  memberSince: 'خرداد ۱۴۰۵',
  achievements: [
    { id: '1', title: 'اولین پیش‌بینی', description: 'اولین پیش‌بینی خود را انجام دادید', icon: 'trophy', earned: true, earnedDate: '2026-06-01' },
    { id: '2', title: 'ده‌گانه', description: 'به ده‌گانه برتر جدول رده‌بندی رسیدید', icon: 'medal', earned: true, earnedDate: '2026-06-10' },
    { id: '3', title: 'استاد پیش‌بینی', description: '۱۰ پیش‌بینی درست متوالی داشتید', icon: 'star', earned: true, earnedDate: '2026-06-15' },
    { id: '4', title: 'متخصص جام جهانی', description: 'دقت پیش‌بینی ۸۰٪ را کسب کنید', icon: 'crown', earned: false },
    { id: '5', title: 'هفته کامل', description: 'همه پیش‌بینی‌های یک هفته را درست انجام دهید', icon: 'zap', earned: false },
    { id: '6', title: 'قهرمان', description: 'لیگ پیش‌بینی را ببرید', icon: 'award', earned: false },
  ],
}

// Leaderboard data
export const leaderboard: User[] = [
  { id: '2', name: 'محمد', avatar: 'م', points: 156, rank: 1, previousRank: 1, correctPredictions: 22, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '3', name: 'سارا', avatar: 'س', points: 148, rank: 2, previousRank: 3, correctPredictions: 21, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '4', name: 'حسین', avatar: 'ح', points: 142, rank: 3, previousRank: 2, correctPredictions: 20, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '5', name: 'زهرا', avatar: 'ز', points: 138, rank: 4, previousRank: 4, correctPredictions: 19, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '1', name: 'علی', avatar: 'ع', points: 127, rank: 5, previousRank: 7, correctPredictions: 18, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '6', name: 'رضا', avatar: 'ر', points: 124, rank: 6, previousRank: 5, correctPredictions: 17, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '7', name: 'مریم', avatar: 'م', points: 119, rank: 7, previousRank: 8, correctPredictions: 16, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '8', name: 'امیر', avatar: 'ا', points: 115, rank: 8, previousRank: 6, correctPredictions: 16, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '9', name: 'فاطمه', avatar: 'ف', points: 108, rank: 9, previousRank: 9, correctPredictions: 15, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
  { id: '10', name: 'حسین', avatar: 'ح', points: 102, rank: 10, previousRank: 10, correctPredictions: 14, totalPredictions: 24, memberSince: 'خرداد ۱۴۰۵', achievements: [] },
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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
  const response = await fetch(`${API_BASE_URL}/api/predictions/`, {
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
  const response = await fetch(`${API_BASE_URL}/api/predictions/${predictionId}/`, {
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
  const response = await fetch(`${API_BASE_URL}/api/predictions/`, {
    headers,
  })

  if (!response.ok) {
    throw new Error('Failed to fetch predictions')
  }

  return response.json()
}

export { getAuthHeaders }

// Sample data for the World Cup Predictor app

export const teams = {
  ARG: { name: 'Argentina', flag: '🇦🇷', code: 'ARG' },
  BRA: { name: 'Brazil', flag: '🇧🇷', code: 'BRA' },
  FRA: { name: 'France', flag: '🇫🇷', code: 'FRA' },
  GER: { name: 'Germany', flag: '🇩🇪', code: 'GER' },
  ESP: { name: 'Spain', flag: '🇪🇸', code: 'ESP' },
  ENG: { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
  POR: { name: 'Portugal', flag: '🇵🇹', code: 'POR' },
  NED: { name: 'Netherlands', flag: '🇳🇱', code: 'NED' },
  BEL: { name: 'Belgium', flag: '🇧🇪', code: 'BEL' },
  CRO: { name: 'Croatia', flag: '🇭🇷', code: 'CRO' },
  URU: { name: 'Uruguay', flag: '🇺🇾', code: 'URU' },
  MEX: { name: 'Mexico', flag: '🇲🇽', code: 'MEX' },
  USA: { name: 'USA', flag: '🇺🇸', code: 'USA' },
  JPN: { name: 'Japan', flag: '🇯🇵', code: 'JPN' },
  KOR: { name: 'South Korea', flag: '🇰🇷', code: 'KOR' },
  SEN: { name: 'Senegal', flag: '🇸🇳', code: 'SEN' },
} as const

export type TeamCode = keyof typeof teams

export interface Match {
  id: string
  homeTeam: TeamCode
  awayTeam: TeamCode
  date: string
  time: string
  stage: 'Group Stage' | 'Round of 16' | 'Quarter Final' | 'Semi Final' | 'Final'
  group?: string
  status: 'upcoming' | 'live' | 'finished'
  homeScore?: number
  awayScore?: number
  userPrediction?: 'home' | 'draw' | 'away'
  predictionLocked?: boolean
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
  prediction: 'home' | 'draw' | 'away'
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
  name: 'Alex',
  avatar: 'A',
  points: 127,
  rank: 5,
  previousRank: 7,
  correctPredictions: 18,
  totalPredictions: 24,
  memberSince: 'June 2026',
  achievements: [
    { id: '1', title: 'First Prediction', description: 'Made your first prediction', icon: 'trophy', earned: true, earnedDate: '2026-06-01' },
    { id: '2', title: 'Top 10', description: 'Reached the top 10 on the leaderboard', icon: 'medal', earned: true, earnedDate: '2026-06-10' },
    { id: '3', title: 'Prediction Master', description: 'Get 10 correct predictions in a row', icon: 'star', earned: true, earnedDate: '2026-06-15' },
    { id: '4', title: 'World Cup Expert', description: 'Achieve 80% prediction accuracy', icon: 'crown', earned: false },
    { id: '5', title: 'Perfect Week', description: 'Get all predictions correct in a week', icon: 'zap', earned: false },
    { id: '6', title: 'Champion', description: 'Win the prediction league', icon: 'award', earned: false },
  ],
}

// Leaderboard data
export const leaderboard: User[] = [
  { id: '2', name: 'Marcus', avatar: 'M', points: 156, rank: 1, previousRank: 1, correctPredictions: 22, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '3', name: 'Sofia', avatar: 'S', points: 148, rank: 2, previousRank: 3, correctPredictions: 21, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '4', name: 'James', avatar: 'J', points: 142, rank: 3, previousRank: 2, correctPredictions: 20, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '5', name: 'Emma', avatar: 'E', points: 138, rank: 4, previousRank: 4, correctPredictions: 19, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '1', name: 'Alex', avatar: 'A', points: 127, rank: 5, previousRank: 7, correctPredictions: 18, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '6', name: 'Lucas', avatar: 'L', points: 124, rank: 6, previousRank: 5, correctPredictions: 17, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '7', name: 'Olivia', avatar: 'O', points: 119, rank: 7, previousRank: 8, correctPredictions: 16, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '8', name: 'Noah', avatar: 'N', points: 115, rank: 8, previousRank: 6, correctPredictions: 16, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '9', name: 'Ava', avatar: 'V', points: 108, rank: 9, previousRank: 9, correctPredictions: 15, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
  { id: '10', name: 'Ethan', avatar: 'T', points: 102, rank: 10, previousRank: 10, correctPredictions: 14, totalPredictions: 24, memberSince: 'June 2026', achievements: [] },
]

// Matches data
export const matches: Match[] = [
  // Upcoming matches
  { id: '1', homeTeam: 'ARG', awayTeam: 'BRA', date: '2026-06-15', time: '18:00', stage: 'Group Stage', group: 'A', status: 'upcoming', userPrediction: 'home' },
  { id: '2', homeTeam: 'FRA', awayTeam: 'GER', date: '2026-06-15', time: '21:00', stage: 'Group Stage', group: 'B', status: 'upcoming' },
  { id: '3', homeTeam: 'ESP', awayTeam: 'ENG', date: '2026-06-16', time: '15:00', stage: 'Group Stage', group: 'C', status: 'upcoming' },
  { id: '4', homeTeam: 'POR', awayTeam: 'NED', date: '2026-06-16', time: '18:00', stage: 'Group Stage', group: 'D', status: 'upcoming' },
  { id: '5', homeTeam: 'BEL', awayTeam: 'CRO', date: '2026-06-17', time: '21:00', stage: 'Group Stage', group: 'E', status: 'upcoming' },
  
  // Live match
  { id: '6', homeTeam: 'URU', awayTeam: 'MEX', date: '2026-06-14', time: '18:00', stage: 'Group Stage', group: 'F', status: 'live', homeScore: 1, awayScore: 1, userPrediction: 'draw' },
  
  // Finished matches
  { id: '7', homeTeam: 'USA', awayTeam: 'JPN', date: '2026-06-13', time: '15:00', stage: 'Group Stage', group: 'G', status: 'finished', homeScore: 2, awayScore: 1, userPrediction: 'home', predictionLocked: true },
  { id: '8', homeTeam: 'KOR', awayTeam: 'SEN', date: '2026-06-13', time: '18:00', stage: 'Group Stage', group: 'H', status: 'finished', homeScore: 0, awayScore: 2, userPrediction: 'home', predictionLocked: true },
  { id: '9', homeTeam: 'ARG', awayTeam: 'MEX', date: '2026-06-12', time: '21:00', stage: 'Group Stage', group: 'A', status: 'finished', homeScore: 3, awayScore: 0, userPrediction: 'home', predictionLocked: true },
  { id: '10', homeTeam: 'FRA', awayTeam: 'ENG', date: '2026-06-12', time: '18:00', stage: 'Group Stage', group: 'B', status: 'finished', homeScore: 2, awayScore: 2, userPrediction: 'draw', predictionLocked: true },
  { id: '11', homeTeam: 'BRA', awayTeam: 'GER', date: '2026-06-11', time: '21:00', stage: 'Group Stage', group: 'A', status: 'finished', homeScore: 1, awayScore: 1, userPrediction: 'home', predictionLocked: true },
  { id: '12', homeTeam: 'ESP', awayTeam: 'POR', date: '2026-06-11', time: '18:00', stage: 'Group Stage', group: 'C', status: 'finished', homeScore: 3, awayScore: 2, userPrediction: 'away', predictionLocked: true },
]

// Helper function to determine if a prediction was correct
export function isPredictionCorrect(match: Match): boolean | null {
  if (match.status !== 'finished' || match.homeScore === undefined || match.awayScore === undefined || !match.userPrediction) {
    return null
  }
  
  let actualResult: 'home' | 'draw' | 'away'
  if (match.homeScore > match.awayScore) {
    actualResult = 'home'
  } else if (match.homeScore < match.awayScore) {
    actualResult = 'away'
  } else {
    actualResult = 'draw'
  }
  
  return match.userPrediction === actualResult
}

// User predictions
export const predictions: Prediction[] = matches
  .filter(m => m.userPrediction)
  .map(match => {
    const correct = isPredictionCorrect(match)
    return {
      id: `pred-${match.id}`,
      match,
      prediction: match.userPrediction!,
      result: match.status === 'finished' ? (correct ? 'correct' : 'incorrect') : 'pending',
      pointsEarned: match.status === 'finished' ? (correct ? 3 : 0) : undefined,
    }
  })

// Recent activity
export const recentActivity: Activity[] = [
  { id: '1', type: 'prediction', message: 'Predicted Argentina vs Brazil', timestamp: '2 hours ago' },
  { id: '2', type: 'points', message: 'Earned 3 points for USA vs Japan', timestamp: '1 day ago' },
  { id: '3', type: 'rank', message: 'Moved up to Rank #5', timestamp: '1 day ago' },
  { id: '4', type: 'prediction', message: 'Predicted France vs Germany', timestamp: '2 days ago' },
  { id: '5', type: 'points', message: 'Earned 3 points for Argentina vs Mexico', timestamp: '3 days ago' },
]

// Format date helper
export function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }
}

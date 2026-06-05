// داده‌های نمونه برای برنامه پیش‌بینی جام جهانی

export const teams = {
  ARG: { name: 'آرژانتین', flag: '🇦🇷', code: 'ARG' },
  BRA: { name: 'برزیل', flag: '🇧🇷', code: 'BRA' },
  FRA: { name: 'فرانسه', flag: '🇫🇷', code: 'FRA' },
  GER: { name: 'آلمان', flag: '🇩🇪', code: 'GER' },
  ESP: { name: 'اسپانیا', flag: '🇪🇸', code: 'ESP' },
  ENG: { name: 'انگلستان', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', code: 'ENG' },
  POR: { name: 'پرتغال', flag: '🇵🇹', code: 'POR' },
  NED: { name: 'هلند', flag: '🇳🇱', code: 'NED' },
  BEL: { name: 'بلژیک', flag: '🇧🇪', code: 'BEL' },
  CRO: { name: 'کرواسی', flag: '🇭🇷', code: 'CRO' },
  URU: { name: 'اروگوئه', flag: '🇺🇾', code: 'URU' },
  MEX: { name: 'مکزیک', flag: '🇲🇽', code: 'MEX' },
  USA: { name: 'آمریکا', flag: '🇺🇸', code: 'USA' },
  JPN: { name: 'ژاپن', flag: '🇯🇵', code: 'JPN' },
  KOR: { name: 'کره جنوبی', flag: '🇰🇷', code: 'KOR' },
  SEN: { name: 'سنگال', flag: '🇸🇳', code: 'SEN' },
} as const

export type TeamCode = keyof typeof teams

export interface Match {
  id: string
  homeTeam: TeamCode
  awayTeam: TeamCode
  date: string
  time: string
  stage: 'مرحله گروهی' | 'مرحله یک‌هشتم' | 'یک‌چهارم نهایی' | 'نیمه‌نهایی' | 'فینال'
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

// Matches data
export const matches: Match[] = [
  { id: '1', homeTeam: 'ARG', awayTeam: 'BRA', date: '2026-06-15', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'A', status: 'upcoming', userPrediction: 'home' },
  { id: '2', homeTeam: 'FRA', awayTeam: 'GER', date: '2026-06-15', time: '۲۱:۰۰', stage: 'مرحله گروهی', group: 'B', status: 'upcoming' },
  { id: '3', homeTeam: 'ESP', awayTeam: 'ENG', date: '2026-06-16', time: '۱۵:۰۰', stage: 'مرحله گروهی', group: 'C', status: 'upcoming' },
  { id: '4', homeTeam: 'POR', awayTeam: 'NED', date: '2026-06-16', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'D', status: 'upcoming' },
  { id: '5', homeTeam: 'BEL', awayTeam: 'CRO', date: '2026-06-17', time: '۲۱:۰۰', stage: 'مرحله گروهی', group: 'E', status: 'upcoming' },
  { id: '6', homeTeam: 'URU', awayTeam: 'MEX', date: '2026-06-14', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'F', status: 'live', homeScore: 1, awayScore: 1, userPrediction: 'draw' },
  { id: '7', homeTeam: 'USA', awayTeam: 'JPN', date: '2026-06-13', time: '۱۵:۰۰', stage: 'مرحله گروهی', group: 'G', status: 'finished', homeScore: 2, awayScore: 1, userPrediction: 'home', predictionLocked: true },
  { id: '8', homeTeam: 'KOR', awayTeam: 'SEN', date: '2026-06-13', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'H', status: 'finished', homeScore: 0, awayScore: 2, userPrediction: 'home', predictionLocked: true },
  { id: '9', homeTeam: 'ARG', awayTeam: 'MEX', date: '2026-06-12', time: '۲۱:۰۰', stage: 'مرحله گروهی', group: 'A', status: 'finished', homeScore: 3, awayScore: 0, userPrediction: 'home', predictionLocked: true },
  { id: '10', homeTeam: 'FRA', awayTeam: 'ENG', date: '2026-06-12', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'B', status: 'finished', homeScore: 2, awayScore: 2, userPrediction: 'draw', predictionLocked: true },
  { id: '11', homeTeam: 'BRA', awayTeam: 'GER', date: '2026-06-11', time: '۲۱:۰۰', stage: 'مرحله گروهی', group: 'A', status: 'finished', homeScore: 1, awayScore: 1, userPrediction: 'home', predictionLocked: true },
  { id: '12', homeTeam: 'ESP', awayTeam: 'POR', date: '2026-06-11', time: '۱۸:۰۰', stage: 'مرحله گروهی', group: 'C', status: 'finished', homeScore: 3, awayScore: 2, userPrediction: 'away', predictionLocked: true },
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
  { id: '1', type: 'prediction', message: 'پیش‌بینی آرژانتین vs برزیل', timestamp: '۲ ساعت پیش' },
  { id: '2', type: 'points', message: '۳ امتیاز برای آمریکا vs ژاپن کسب کردید', timestamp: '۱ روز پیش' },
  { id: '3', type: 'rank', message: 'به رتبه ۵ ارتقا یافتید', timestamp: '۱ روز پیش' },
  { id: '4', type: 'prediction', message: 'پیش‌بینی فرانسه vs آلمان', timestamp: '۲ روز پیش' },
  { id: '5', type: 'points', message: '۳ امتیاز برای آرژانتین vs مکزیک کسب کردید', timestamp: '۳ روز پیش' },
]

// Format date helper
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

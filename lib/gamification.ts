// 游戏化系统
export interface PlayerStats {
  level: number // 棋士等级（1-10级）
  score: number // 总积分
  experience: number // 经验值
  nextLevelXP: number // 下一级所需经验
  dailyScore: number // 今日得分
  completedPuzzles: number // 完成的战术题数
  learnedOpenings: number // 学习的开局数
  streak: number // 连续学习天数
  badges: string[] // 获得的徽章
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress: number
  total: number
}

// 成就定义
export const AchievementDefinitions: Achievement[] = [
  {
    id: 'first-puzzle',
    title: '初试锋芒',
    description: '完成第一个战术题',
    icon: '🎯',
    rarity: 'common',
    progress: 0,
    total: 1
  },
  {
    id: 'ten-puzzles',
    title: '战术新手',
    description: '完成10个战术题',
    icon: '🔥',
    rarity: 'common',
    progress: 0,
    total: 10
  },
  {
    id: 'fifty-puzzles',
    title: '战术达人',
    description: '完成50个战术题',
    icon: '⚡',
    rarity: 'rare',
    progress: 0,
    total: 50
  },
  {
    id: 'hundred-puzzles',
    title: '战术大师',
    description: '完成100个战术题',
    icon: '👑',
    rarity: 'epic',
    progress: 0,
    total: 100
  },
  {
    id: 'first-opening',
    title: '开局入门',
    description: '学习第一个开局',
    icon: '📚',
    rarity: 'common',
    progress: 0,
    total: 1
  },
  {
    id: 'five-openings',
    title: '开局专家',
    description: '学习5个开局',
    icon: '🎓',
    rarity: 'rare',
    progress: 0,
    total: 5
  },
  {
    id: 'perfect-score',
    title: '满分天才',
    description: '在一个练习中获得满分',
    icon: '⭐',
    rarity: 'epic',
    progress: 0,
    total: 1
  },
  {
    id: 'streak-7',
    title: '持之以恒',
    description: '连续7天学习',
    icon: '📅',
    rarity: 'rare',
    progress: 0,
    total: 7
  },
  {
    id: 'streak-30',
    title: '月度冠军',
    description: '连续30天学习',
    icon: '🏆',
    rarity: 'legendary',
    progress: 0,
    total: 30
  },
  {
    id: 'score-1000',
    title: '积分达人',
    description: '获得1000积分',
    icon: '💰',
    rarity: 'rare',
    progress: 0,
    total: 1000
  },
  {
    id: 'score-5000',
    title: '积分王者',
    description: '获得5000积分',
    icon: '👑',
    rarity: 'legendary',
    progress: 0,
    total: 5000
  },
  {
    id: 'analysis-master',
    title: '局面侦探',
    description: '完成20次局面分析',
    icon: '🔍',
    rarity: 'rare',
    progress: 0,
    total: 20
  },
  {
    id: 'level-5',
    title: '中级棋士',
    description: '达到5级',
    icon: '🎖️',
    rarity: 'rare',
    progress: 0,
    total: 5
  },
  {
    id: 'level-10',
    title: '高级棋士',
    description: '达到10级',
    icon: '🏅',
    rarity: 'epic',
    progress: 0,
    total: 10
  }
]

// 徽章系统
export const BadgeDefinitions = {
  'speed-demon': {
    name: '速度恶魔',
    description: '快速完成10个战术题',
    icon: '🚀',
    color: 'bg-red-500'
  },
  'perfectionist': {
    name: '完美主义者',
    description: '连续5个题目全对',
    icon: '💎',
    color: 'bg-blue-500'
  },
  'explorer': {
    name: '探索者',
    description: '尝试所有类型的战术题',
    icon: '🗺️',
    color: 'bg-green-500'
  },
  'opening-master': {
    name: '开局大师',
    description: '掌握所有基础开局',
    icon: '📖',
    color: 'bg-purple-500'
  },
  'daily-learner': {
    name: '每日学习者',
    description: '连续7天完成每日挑战',
    icon: '📆',
    color: 'bg-yellow-500'
  }
}

// 积分系统
export const PointsSystem = {
  // 战术题积分
  puzzleSolved: {
    easy: 10,
    medium: 20,
    hard: 30
  },
  
  // 开局学习积分
  openingCompleted: 50,
  openingMastered: 100,
  
  // 局面分析积分
  analysisCompleted: 15,
  
  // 每日挑战奖励
  dailyChallengeBonus: 2, // 双倍积分
  streakBonus: {
    '3': 1.2, // 3连胜 1.2倍
    '7': 1.5, // 7连胜 1.5倍
    '14': 2, // 14连胜 2倍
    '30': 3 // 30连胜 3倍
  }
}

// 等级系统
export const LevelSystem = {
  // 等级到棋士等级的映射
  getRankTitle: (level: number): string => {
    if (level >= 10) return '特级大师'
    if (level >= 8) return '大师'
    if (level >= 6) return '棋协大师'
    if (level >= 4) return '候补大师'
    if (level >= 2) return '业余棋手'
    return '入门棋手'
  },

  // 计算下一级所需经验
  getXPForNextLevel: (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  },

  // 检查是否升级
  checkLevelUp: (currentLevel: number, currentXP: number): boolean => {
    const nextLevelXP = LevelSystem.getXPForNextLevel(currentLevel)
    return currentXP >= nextLevelXP
  },

  // 获取等级进度百分比
  getLevelProgress: (currentXP: number, currentLevel: number): number => {
    const currentLevelXP = LevelSystem.getXPForNextLevel(currentLevel - 1)
    const nextLevelXP = LevelSystem.getXPForNextLevel(currentLevel)
    const progress = ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    return Math.min(100, Math.max(0, progress))
  }
}

// 奖励系统
export const RewardSystem = {
  // 计算积分
  calculatePoints: (
    basePoints: number,
    difficulty: 'easy' | 'medium' | 'hard',
    streak: number
  ): number => {
    let points = basePoints

    // 难度加成
    if (difficulty === 'medium') points *= 1.5
    if (difficulty === 'hard') points *= 2

    // 连胜加成
    if (streak >= 30) points *= PointsSystem.streakBonus['30']
    else if (streak >= 14) points *= PointsSystem.streakBonus['14']
    else if (streak >= 7) points *= PointsSystem.streakBonus['7']
    else if (streak >= 3) points *= PointsSystem.streakBonus['3']

    return Math.round(points)
  },

  // 检查成就解锁
  checkAchievements: (stats: PlayerStats): Achievement[] => {
    const unlockedAchievements: Achievement[] = []

    AchievementDefinitions.forEach(achievement => {
      let progress = 0

      switch (achievement.id) {
        case 'first-puzzle':
          progress = stats.completedPuzzles >= 1 ? 1 : 0
          break
        case 'ten-puzzles':
          progress = stats.completedPuzzles >= 10 ? 1 : 0
          break
        case 'fifty-puzzles':
          progress = stats.completedPuzzles >= 50 ? 1 : 0
          break
        case 'hundred-puzzles':
          progress = stats.completedPuzzles >= 100 ? 1 : 0
          break
        case 'first-opening':
          progress = stats.learnedOpenings >= 1 ? 1 : 0
          break
        case 'five-openings':
          progress = stats.learnedOpenings >= 5 ? 1 : 0
          break
        case 'perfect-score':
          progress = stats.score >= 100 ? 1 : 0
          break
        case 'streak-7':
          progress = stats.streak >= 7 ? 1 : 0
          break
        case 'streak-30':
          progress = stats.streak >= 30 ? 1 : 0
          break
        case 'score-1000':
          progress = stats.score >= 1000 ? 1 : 0
          break
        case 'score-5000':
          progress = stats.score >= 5000 ? 1 : 0
          break
        case 'analysis-master':
          progress = stats.experience >= 20 ? 1 : 0
          break
        case 'level-5':
          progress = stats.level >= 5 ? 1 : 0
          break
        case 'level-10':
          progress = stats.level >= 10 ? 1 : 0
          break
      }

      const updatedAchievement = { ...achievement, progress }
      if (progress >= achievement.total) {
        if (!stats.badges.includes(achievement.id)) {
          unlockedAchievements.push(updatedAchievement)
        }
      }
    })

    return unlockedAchievements
  },

  // 获取稀有度颜色
  getRarityColor: (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }
}

// 每日挑战系统
export const DailyChallengeSystem = {
  // 检查是否完成今日挑战
  isCompleted: (): boolean => {
    const lastCompleted = localStorage.getItem('lastDailyChallenge')
    if (!lastCompleted) return false

    const today = new Date().toDateString()
    return lastCompleted === today
  },

  // 标记今日挑战完成
  markCompleted: (): void => {
    localStorage.setItem('lastDailyChallenge', new Date().toDateString())
  },

  // 获取今日挑战题目
  getTodayChallenge: () => {
    // 使用日期作为种子来选择题目
    const today = new Date().getDate()
    const month = new Date().getMonth()
    const seed = today * month

    // 这里应该从题库中根据seed选择题目
    // 简化版：返回固定的每日挑战
    return {
      title: '今日挑战',
      description: '完成这个战术题获得双倍积分！',
      difficulty: 'medium',
      puzzleId: `daily-${seed}`
    }
  }
}

// 本地存储管理
export const StorageManager = {
  // 保存玩家数据
  savePlayerStats: (stats: PlayerStats): void => {
    localStorage.setItem('playerStats', JSON.stringify(stats))
  },

  // 加载玩家数据
  loadPlayerStats: (): PlayerStats => {
    const saved = localStorage.getItem('playerStats')
    if (saved) {
      return JSON.parse(saved)
    }

    // 默认初始数据
    return {
      level: 1,
      score: 0,
      experience: 0,
      nextLevelXP: 100,
      dailyScore: 0,
      completedPuzzles: 0,
      learnedOpenings: 0,
      streak: 0,
      badges: [],
      achievements: []
    }
  },

  // 更新连胜
  updateStreak: (): number => {
    const lastLogin = localStorage.getItem('lastLogin')
    const today = new Date().toDateString()
    
    if (lastLogin === today) {
      // 今天已经登录过，保持连胜
      const stats = StorageManager.loadPlayerStats()
      return stats.streak
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (lastLogin === yesterday.toDateString()) {
      // 连续登录，增加连胜
      const stats = StorageManager.loadPlayerStats()
      stats.streak += 1
      StorageManager.savePlayerStats(stats)
      return stats.streak
    } else {
      // 中断了连胜，重置为1
      const stats = StorageManager.loadPlayerStats()
      stats.streak = 1
      StorageManager.savePlayerStats(stats)
      return 1
    }
  }
}

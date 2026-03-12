'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Crown, Award, TrendingUp, Calendar, Target, Flame, Medal } from 'lucide-react'
import {
  StorageManager,
  RewardSystem,
  LevelSystem,
  AchievementDefinitions,
  type PlayerStats
} from '@/lib/gamification'

interface GamificationPanelProps {
  show?: boolean
  onClose?: () => void
}

export default function GamificationPanel({ show = true, onClose }: GamificationPanelProps) {
  const [stats, setStats] = useState<PlayerStats>(StorageManager.loadPlayerStats())
  const [newAchievements, setNewAchievements] = useState<any[]>([])

  useEffect(() => {
    // 加载玩家数据
    setStats(StorageManager.loadPlayerStats())

    // 检查新成就
    const achievements = RewardSystem.checkAchievements(stats)
    if (achievements.length > 0) {
      setNewAchievements(achievements)
    }

    // 更新连胜
    const streak = StorageManager.updateStreak()
    setStats(prev => ({ ...prev, streak }))
  }, [])

  const getRarityColor = (rarity: string) => {
    return RewardSystem.getRarityColor(rarity)
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return '普通'
      case 'rare': return '稀有'
      case 'epic': return '史诗'
      case 'legendary': return '传说'
      default: return '普通'
    }
  }

  return (
    <>
      {/* 成就解锁通知 */}
      <AnimatePresence>
        {newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl max-w-md">
              <div className="flex items-center gap-4">
                <div className="text-6xl">
                  🏆
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">成就解锁！</h3>
                  <p className="text-sm">
                    {newAchievements.map(a => a.title).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 游戏化面板 */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-20 w-80 max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 z-40"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">我的成就</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 等级和积分 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-gray-800">{LevelSystem.getRankTitle(stats.level)}</span>
                </div>
                <span className="text-sm text-gray-600">Lv.{stats.level}</span>
              </div>

              {/* 经验条 */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>经验值</span>
                  <span>{stats.experience} / {stats.nextLevelXP}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${LevelSystem.getLevelProgress(stats.experience, stats.level)}%`
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                  />
                </div>
              </div>

              {/* 积分和连胜 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-gray-600">总积分</span>
                  </div>
                  <p className="text-xl font-bold text-yellow-700">{stats.score}</p>
                </div>

                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-gray-600">连胜</span>
                  </div>
                  <p className="text-xl font-bold text-red-700">{stats.streak}天</p>
                </div>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-blue-50 p-3 rounded-xl text-center">
                <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-700">{stats.completedPuzzles}</p>
                <p className="text-xs text-gray-600">战术题</p>
              </div>

              <div className="bg-purple-50 p-3 rounded-xl text-center">
                <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-purple-700">{stats.learnedOpenings}</p>
                <p className="text-xs text-gray-600">开局</p>
              </div>

              <div className="bg-green-50 p-3 rounded-xl text-center">
                <Medal className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">{stats.badges.length}</p>
                <p className="text-xs text-gray-600">徽章</p>
              </div>
            </div>

            {/* 成就列表 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                成就 ({stats.badges.length}/{AchievementDefinitions.length})
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {AchievementDefinitions.slice(0, 6).map((achievement) => {
                  const isUnlocked = stats.badges.includes(achievement.id)
                  const progress = achievement.progress >= achievement.total

                  return (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${isUnlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-bold text-sm ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h4>
                            {isUnlocked && (
                              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${getRarityColor(achievement.rarity)}`}>
                                {getRarityLabel(achievement.rarity)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>

                          {!isUnlocked && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {isUnlocked && (
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 每日挑战进度 */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">今日进度</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">今日得分</span>
                <span className="text-lg font-bold text-blue-600">{stats.dailyScore}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

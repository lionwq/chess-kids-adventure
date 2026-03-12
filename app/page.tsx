'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Trophy, Star, Target, BookOpen, Play, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const gameModes = [
    {
      id: 'openings',
      title: '开局大师',
      description: '学习经典开局，走好第一步棋',
      icon: <BookOpen className="w-12 h-12" />,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'tactics',
      title: '战术训练营',
      description: '解决有趣的战术问题，提升棋力',
      icon: <Target className="w-12 h-12" />,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'analysis',
      title: '局面侦探',
      description: '分析棋盘，找出对手的弱点',
      icon: <Star className="w-12 h-12" />,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      {/* 头部 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 2, ease: "linear", repeat: isPlaying ? Infinity : 0 }}
          className="inline-block"
        >
          <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-yellow-300 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          🎮 象棋冒险乐园 🎮
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-6">
          小朋友，来一场精彩的象棋冒险吧！
        </p>
        
        {/* 玩家信息 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3"
        >
          <Trophy className="w-8 h-8 text-yellow-300" />
          <div className="text-left">
            <div className="text-white font-bold text-lg">3级棋士</div>
            <div className="text-white/80 text-sm">继续努力，升级在望！</div>
          </div>
          <Star className="w-8 h-8 text-yellow-300 animate-pulse" />
        </motion.div>
      </motion.div>

      {/* 游戏模式选择 */}
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
        >
          选择你的冒险模式 ✨
        </motion.h2>

        {gameModes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsPlaying(true)
              setTimeout(() => {
                window.location.href = `/${mode.id}`
              }, 300)
            }}
            className="w-full card-kid bg-gradient-to-r from-white to-white/90 hover:from-white hover:to-white/95 relative overflow-hidden group"
          >
            <div className="flex items-center gap-6 p-6 md:p-8">
              {/* 背景装饰 */}
              <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* 图标 */}
              <motion.div
                whileHover={{ rotate: 15 }}
                className={`${mode.bgColor} p-4 rounded-2xl relative z-10`}
              >
                {mode.icon}
              </motion.div>
              
              {/* 内容 */}
              <div className="flex-1 text-left relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {mode.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {mode.description}
                </p>
              </div>

              {/* 箭头 */}
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10 text-gray-400 group-hover:text-purple-600"
              >
                <Play className="w-8 h-8" />
              </motion.div>
            </div>

            {/* 装饰性边框 */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${mode.color} w-0 group-hover:w-full transition-all duration-300`} />
          </motion.button>
        ))}
      </div>

      {/* 每日挑战 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="max-w-4xl mx-auto mt-12"
      >
        <div className="card-kid bg-gradient-to-r from-yellow-100 to-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/30 rounded-full blur-xl" />
          
          <div className="relative z-10 flex items-center justify-between p-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-bold text-orange-800">每日挑战</span>
              </div>
              <p className="text-gray-700">
                完成今天的挑战，获得双倍积分！
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                window.location.href = '/tactics?daily=true'
              }}
            >
              开始挑战
              <ArrowRight className="inline ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 底部信息 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center mt-12 text-white/80"
      >
        <p className="text-lg mb-2">🌟 坚持学习，你就是小象棋大师！ 🌟</p>
        <p className="text-sm">已完成 12 节课程 | 获得 350 积分 | 胜率 68%</p>
      </motion.div>
    </div>
  )
}

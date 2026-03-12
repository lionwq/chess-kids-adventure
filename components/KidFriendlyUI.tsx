'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Sparkles, Star, Heart, Music } from 'lucide-react'
import { soundEffects } from '@/lib/sound-effects'

interface KidFriendlyUIProps {
  children: React.ReactNode
}

export default function KidFriendlyUI({ children }: KidFriendlyUIProps) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    soundEffects.setEnabled(newState)
    if (newState) {
      soundEffects.playClick()
    }
  }

  const triggerCelebration = () => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
    soundEffects.playAchievement()
  }

  // 漂浮的装饰元素
  const FloatingDecoration = ({ delay, emoji }: { delay: number, emoji: string }) => (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: [-100, 100], opacity: [0, 0.3, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity }}
      className="fixed text-4xl pointer-events-none select-none"
      style={{ left: `${Math.random() * 90 + 5}%` }}
    >
      {emoji}
    </motion.div>
  )

  return (
    <>
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <FloatingDecoration delay={0} emoji="✨" />
        <FloatingDecoration delay={1} emoji="⭐" />
        <FloatingDecoration delay={2} emoji="🎯" />
        <FloatingDecoration delay={3} emoji="👑" />
        <FloatingDecoration delay={4} emoji="🎮" />
      </div>

      {/* 庆祝动画 */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-9xl"
            >
              🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 声音控制 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSound}
        className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        {soundEnabled ? (
          <Volume2 className="w-6 h-6 text-purple-600" />
        ) : (
          <VolumeX className="w-6 h-6 text-gray-500" />
        )}
      </motion.button>

      {/* 特效按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={triggerCelebration}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="庆祝一下！"
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* 快捷键提示 */}
      <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg text-xs text-gray-600 hidden md:block">
        <div className="font-bold mb-1">快捷键</div>
        <div>🎯 点击棋子选择</div>
        <div>✨ 再次点击移动</div>
        <div>💡 H 显示提示</div>
        <div>🔄 R 重新开始</div>
      </div>

      {/* 主内容 */}
      <div className="min-h-screen">
        {children}
      </div>
    </>
  )
}

// 儿童友好的按钮组件
interface KidButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
}

export function KidButton({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = ''
}: KidButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    secondary: 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
  }

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={() => {
        if (!disabled) {
          soundEffects.playClick()
          onClick?.()
        }
      }}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        font-bold rounded-2xl shadow-lg
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}

// 儿童友好的卡片组件
interface KidCardProps {
  children: React.ReactNode
  className?: string
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'yellow'
}

export function KidCard({ children, className = '', color = 'blue' }: KidCardProps) {
  const colors = {
    blue: 'from-blue-50 to-cyan-50 border-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    pink: 'from-pink-50 to-red-50 border-pink-200',
    yellow: 'from-yellow-50 to-orange-50 border-yellow-200'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        bg-gradient-to-br ${colors[color]}
        border-4 rounded-3xl p-6 shadow-xl
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// 进度条组件
interface KidProgressBarProps {
  progress: number
  total: number
  color?: 'purple' | 'green' | 'blue' | 'orange'
  label?: string
}

export function KidProgressBar({ progress, total, color = 'purple', label }: KidProgressBarProps) {
  const percentage = (progress / total) * 100

  const colors = {
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-400 to-emerald-500',
    blue: 'from-blue-400 to-cyan-500',
    orange: 'from-yellow-400 to-orange-500'
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          <span className="font-bold">{progress} / {total}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
        />
      </div>
    </div>
  )
}

// 星星评分组件
interface KidStarRatingProps {
  rating: number
  max: number
  onRate?: (rating: number) => void
}

export function KidStarRating({ rating, max = 5, onRate }: KidStarRatingProps) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => onRate?.(index + 1)}
          className="text-3xl cursor-pointer"
        >
          <Star
            className={`w-8 h-8 ${
              index < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </motion.button>
      ))}
    </div>
  )
}

// 奖励弹出框
interface RewardPopupProps {
  show: boolean
  type: 'points' | 'achievement' | 'level-up'
  value: number
  message: string
  onClose: () => void
}

export function RewardPopup({ show, type, value, message, onClose }: RewardPopupProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-3xl p-8 max-w-md text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-8xl mb-4"
            >
              {type === 'points' && '🎁'}
              {type === 'achievement' && '🏆'}
              {type === 'level-up' && '⭐'}
            </motion.div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {type === 'points' && '获得积分！'}
              {type === 'achievement' && '成就解锁！'}
              {type === 'level-up' && '升级啦！'}
            </h2>

            <p className="text-2xl font-bold text-purple-600 mb-2">
              {type === 'points' && `+${value} 分`}
              {type === 'achievement' && '恭喜你！'}
              {type === 'level-up' && `Lv.${value}`}
            </p>

            <p className="text-gray-600 mb-6">{message}</p>

            <KidButton onClick={onClose} size="large">
              太棒了！
            </KidButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

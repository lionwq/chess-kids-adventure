'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Target, Trophy, Lightbulb, Star, RotateCcw, ArrowRight, CheckCircle, XCircle, Brain, Zap, Shield, Crown } from 'lucide-react'
import Chess from 'chess.js'
import ChessBoard from '@/components/ChessBoard'
import { TacticalPuzzles, TacticalCategories, DifficultyLevels } from '@/lib/tactical-puzzles'

export default function TacticsPage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [moveIndex, setMoveIndex] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set())
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  // 筛选后的战术题
  const filteredPuzzles = TacticalPuzzles.filter(puzzle => {
    if (selectedDifficulty !== 'all' && puzzle.difficulty !== selectedDifficulty) return false
    if (selectedCategory && puzzle.category !== selectedCategory) return false
    return true
  })

  const currentPuzzle = filteredPuzzles[currentPuzzleIndex]

  useEffect(() => {
    if (currentPuzzle) {
      setGame(new Chess(currentPuzzle.fen))
      setMoveIndex(0)
      setIsCorrect(null)
      setShowHint(false)
      setShowExplanation(false)
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }, [currentPuzzle, currentPuzzleIndex])

  useEffect(() => {
    // 加载已解决的题目
    const saved = localStorage.getItem('solvedPuzzles')
    if (saved) {
      setSolvedPuzzles(new Set(JSON.parse(saved)))
    }

    // 加载总分
    const savedScore = localStorage.getItem('totalScore')
    if (savedScore) {
      setTotalScore(parseInt(saved))
    }
  }, [])

  const handleSquareClick = (square: string) => {
    if (!currentPuzzle || isCorrect === false) return

    const expectedMove = currentPuzzle.moves[moveIndex]
    if (!expectedMove) return

    if (selectedSquare) {
      // 尝试走棋
      const move = game.move({
        from: selectedSquare,
        to: square,
        promotion: 'q'
      })

      if (move) {
        const moveSan = move.san.toLowerCase().replace(/[x+#!?]/g, '')
        const expectedSan = expectedMove.toLowerCase()

        // 检查是否正确
        if (moveSan === expectedSan || expectedMove.includes(square)) {
          setIsCorrect(true)

          // 检查是否完成所有步骤
          if (moveIndex + 1 >= currentPuzzle.moves.length) {
            // 完成题目
            handlePuzzleComplete()
          } else {
            // 继续下一步
            setTimeout(() => {
              setMoveIndex(prev => prev + 1)
              setIsCorrect(null)
              setSelectedSquare(null)
              setPossibleMoves([])

              // 自动执行对手的回应（如果有）
              if (moveIndex + 1 < currentPuzzle.moves.length) {
                const opponentMove = currentPuzzle.moves[moveIndex + 1]
                if (opponentMove) {
                  game.move(opponentMove)
                  setMoveIndex(prev => prev + 1)
                }
              }
            }, 1000)
          }
        } else {
          // 错误的走法
          game.undo()
          setIsCorrect(false)
          setTimeout(() => setIsCorrect(null), 2000)
        }
      } else {
        // 无效的走法
        setIsCorrect(false)
        setTimeout(() => setIsCorrect(null), 2000)
      }

      setSelectedSquare(null)
      setPossibleMoves([])
    } else {
      // 选择棋子
      const piece = game.get(square)
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square)
        const moves = game.moves({ square, verbose: true })
        setPossibleMoves(moves.map(m => m.to))
      }
    }
  }

  const handlePuzzleComplete = () => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)

    // 更新分数
    const newScore = totalScore + currentPuzzle.points
    setTotalScore(newScore)
    localStorage.setItem('totalScore', newScore.toString())

    // 标记为已解决
    const newSolved = new Set(solvedPuzzles)
    newSolved.add(currentPuzzle.id)
    setSolvedPuzzles(newSolved)
    localStorage.setItem('solvedPuzzles', JSON.stringify([...newSolved]))

    // 显示解释
    setShowExplanation(true)
  }

  const nextPuzzle = () => {
    if (currentPuzzleIndex < filteredPuzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1)
    } else {
      setCurrentPuzzleIndex(0)
    }
  }

  const resetPuzzle = () => {
    setGame(new Chess(currentPuzzle.fen))
    setMoveIndex(0)
    setIsCorrect(null)
    setSelectedSquare(null)
    setPossibleMoves([])
    setShowExplanation(false)
    setShowHint(false)
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Star className="w-5 h-5 text-green-500" />
      case 'medium': return <Star className="w-5 h-5 text-yellow-500" />
      case 'hard': return <Star className="w-5 h-5 text-red-500" />
      default: return <Star className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryInfo = TacticalCategories[category as keyof typeof TacticalCategories]
    return categoryInfo ? categoryInfo.icon : '🎯'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 p-4 md:p-8">
      {/* 庆祝动画 */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="text-9xl"
            >
              🎉
            </motion.div>
            <div className="absolute text-6xl font-bold text-white">
              太棒了！+{currentPuzzle?.points}分
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回首页
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-white text-center flex-1"
          >
            <Target className="inline w-10 h-10 mr-2" />
            战术训练营
          </motion.h1>

          <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
            {totalScore}分
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {/* 筛选器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-kid mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 难度筛选 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">选择难度</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDifficulty('all')}
                  className={`px-4 py-2 rounded-xl font-bold ${
                    selectedDifficulty === 'all'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  全部
                </motion.button>
                {Object.entries(DifficultyLevels).map(([key, level]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDifficulty(key as any)}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
                      selectedDifficulty === key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {getDifficultyIcon(key)}
                    {level.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 类型筛选 */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">选择类型</h3>
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-xl font-bold ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  全部
                </motion.button>
                {Object.entries(TacticalCategories).map(([key, category]) => (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl font-bold ${
                      selectedCategory === key
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {currentPuzzle ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：棋盘 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 card-kid"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getDifficultyIcon(currentPuzzle.difficulty)}
                  <h2 className="text-2xl font-bold text-gray-800">
                    {currentPuzzle.title}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetPuzzle}
                  className="bg-purple-500 text-white p-2 rounded-xl"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex justify-center mb-6">
                <ChessBoard
                  fen={game.fen()}
                  onSquareClick={handleSquareClick}
                  selectedSquare={selectedSquare}
                  possibleMoves={possibleMoves}
                  isInteractive={true}
                />
              </div>

              {/* 状态反馈 */}
              <AnimatePresence>
                {isCorrect === true && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-6 h-6" />
                    正确！继续加油！
                  </motion.div>
                )}
                {isCorrect === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-6 h-6" />
                    再试一次！
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 进度 */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>步骤 {moveIndex + 1}</span>
                  <span>共 {currentPuzzle.moves.length} 步</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((moveIndex + 1) / currentPuzzle.moves.length) * 100}%` }}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* 右侧：信息面板 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* 题目信息 */}
              <div className="card-kid">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{getCategoryIcon(currentPuzzle.category)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {TacticalCategories[currentPuzzle.category].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {TacticalCategories[currentPuzzle.category].description}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-lg mb-4">
                  {currentPuzzle.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="w-4 h-4" />
                  <span>难度: {DifficultyLevels[currentPuzzle.difficulty].name}</span>
                  <span className="mx-2">•</span>
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-yellow-600">{currentPuzzle.points}分</span>
                </div>
              </div>

              {/* 进度导航 */}
              <div className="card-kid">
                <h3 className="font-bold text-gray-800 mb-4">
                  题目进度
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-600">
                    {currentPuzzleIndex + 1}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {filteredPuzzles.length}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPuzzleIndex(Math.max(0, currentPuzzleIndex - 1))}
                    disabled={currentPuzzleIndex === 0}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    上一题
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPuzzle}
                    disabled={currentPuzzleIndex === filteredPuzzles.length - 1}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                  >
                    下一题
                    <ArrowRight className="inline w-5 h-5 ml-1" />
                  </motion.button>
                </div>
              </div>

              {/* 提示 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowHint(!showHint)}
                className={`w-full card-kid text-left transition-all ${
                  showHint ? 'bg-yellow-50 border-yellow-400' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className={`w-6 h-6 ${showHint ? 'text-yellow-500' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {showHint ? '隐藏提示' : '显示提示'}
                    </h3>
                    {showHint && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-gray-600 mt-2"
                      >
                        {currentPuzzle.hint}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* 解释 */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="card-kid bg-green-50 border-green-400"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-6 h-6 text-green-500" />
                    <h3 className="font-bold text-gray-800">战术解释</h3>
                  </div>
                  <p className="text-gray-700">
                    {currentPuzzle.explanation}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextPuzzle}
                    className="w-full mt-4 btn-kid bg-gradient-to-r from-green-400 to-emerald-500"
                  >
                    继续下一题
                    <ArrowRight className="inline w-5 h-5 ml-2" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              没有找到题目
            </h2>
            <p className="text-white/80 mb-8">
              试试选择其他的筛选条件
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

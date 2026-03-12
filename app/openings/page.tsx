'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, BookOpen, Lightbulb, Star, CheckCircle, Play, RotateCcw, Home } from 'lucide-react'
import Chess from 'chess.js'
import ChessBoard from '@/components/ChessBoard'
import { ChessOpenings, type OpeningProgress } from '@/lib/chess-openings'

export default function OpeningsPage() {
  const [selectedOpening, setSelectedOpening] = useState<string | null>(null)
  const [selectedVariation, setSelectedVariation] = useState<number>(0)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [game, setGame] = useState(new Chess())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showNotation, setShowNotation] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [progress, setProgress] = useState<OpeningProgress[]>([])

  const loadProgress = () => {
    // 在实际应用中，这里应该从本地存储或数据库加载进度
    return []
  }

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const handleOpeningSelect = (openingId: string) => {
    setSelectedOpening(openingId)
    setSelectedVariation(0)
    setCurrentMoveIndex(0)
    setGame(new Chess())
    setIsCorrect(null)
    setShowHint(false)
    setShowTip(false)
    setShowNotation(false)
    setShowAnswer(false)
  }

  const handleVariationSelect = (variationIndex: number) => {
    setSelectedVariation(variationIndex)
    setCurrentMoveIndex(0)
    setGame(new Chess())
    setIsCorrect(null)
    setShowHint(false)
    setShowTip(false)
    setShowNotation(false)
    setShowAnswer(false)
  }

  const getCurrentOpening = () => {
    if (!selectedOpening) return null
    return ChessOpenings[selectedOpening as keyof typeof ChessOpenings]
  }

  const getCurrentVariation = () => {
    const opening = getCurrentOpening()
    if (!opening) return null
    return opening.variations[selectedVariation]
  }

  const getExpectedMove = () => {
    const opening = getCurrentOpening()
    const variation = getCurrentVariation()
    if (!opening || !variation) return null

    const allMoves = [...opening.moves, ...variation.moves]
    if (currentMoveIndex < allMoves.length) {
      return allMoves[currentMoveIndex]
    }
    return null
  }

  const handleSquareClick = (square: string) => {
    if (!selectedOpening || isCorrect === false) return

    const expectedMove = getExpectedMove()
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

        if (moveSan === expectedSan || expectedMove.includes(square)) {
          // 正确的走法
          setIsCorrect(true)
          setTimeout(() => {
            setCurrentMoveIndex(prev => prev + 1)
            setIsCorrect(null)
            setSelectedSquare(null)
            setPossibleMoves([])

            // 检查是否完成所有走法
            const opening = getCurrentOpening()
            const variation = getCurrentVariation()
            const allMoves = [...opening.moves, ...variation.moves]
            if (currentMoveIndex + 1 >= allMoves.length) {
              // 完成开局
              showCompletionMessage()
            }
          }, 1000)
        } else {
          // 错误的走法
          game.undo()
          setIsCorrect(false)
          setShowAnswer(true)
          setTimeout(() => setIsCorrect(null), 3000)
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

  const showCompletionMessage = () => {
    alert('🎉 太棒了！你完成了这个开局！')
  }

  const resetOpening = () => {
    setGame(new Chess())
    setCurrentMoveIndex(0)
    setIsCorrect(null)
    setShowHint(false)
    setShowTip(false)
    setShowNotation(false)
    setShowAnswer(false)
  }

  const getOpeningProgress = (openingId: string) => {
    const item = progress.find(p => p.openingId === openingId)
    return item?.score || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 md:p-8">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-6"
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
            <BookOpen className="inline w-10 h-10 mr-2" />
            开局大师
          </motion.h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto">
        {!selectedOpening ? (
          /* 开局选择界面 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(ChessOpenings).map(([id, opening], index) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpeningSelect(id)}
                className="card-kid cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="relative">
                  <div className={`absolute top-2 right-2 ${
                    getOpeningProgress(id) >= 80 ? 'text-green-500' :
                    getOpeningProgress(id) >= 50 ? 'text-yellow-500' : 'text-gray-400'
                  }`}>
                    <Star className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {opening.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {opening.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {opening.variations.length} 个变例
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < getOpeningProgress(id) / 20 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <motion.div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 w-0 group-hover:w-full transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* 开局学习界面 */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：棋盘 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-kid"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {getCurrentOpening()?.name}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetOpening}
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
                    className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold"
                  >
                    ✅ 正确！
                  </motion.div>
                )}
                {isCorrect === false && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold"
                  >
                    ❌ 再试一次！
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 提示按钮 */}
              <div className="flex gap-4 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHint(!showHint)}
                  className={`flex-1 btn-kid ${showHint ? 'bg-yellow-500' : 'bg-yellow-400'}`}
                >
                  <Lightbulb className="inline w-5 h-5 mr-2" />
                  {showHint ? '隐藏提示' : '显示提示'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTip(!showTip)}
                  className={`flex-1 btn-kid ${showTip ? 'bg-blue-500' : 'bg-blue-400'}`}
                >
                  <Play className="inline w-5 h-5 mr-2" />
                  {showTip ? '隐藏小技巧' : '查看小技巧'}
                </motion.button>
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-yellow-100 text-yellow-800 p-4 rounded-xl mt-4"
                >
                  <p className="font-bold mb-2">💡 提示：</p>
                  <p>下一步应该走：{getExpectedMove()}</p>
                </motion.div>
              )}

              {showTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-blue-100 text-blue-800 p-4 rounded-xl mt-4"
                >
                  <p className="font-bold mb-2">📚 小技巧：</p>
                  <p>{getCurrentVariation()?.tip}</p>
                </motion.div>
              )}
            </motion.div>

            {/* 右侧：变例和进度 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* 变例选择 */}
              <div className="card-kid">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  选择变例
                </h3>
                <div className="space-y-3">
                  {getCurrentOpening()?.variations.map((variation, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVariationSelect(index)}
                      className={`w-full p-4 rounded-xl text-left font-bold transition-all ${
                        selectedVariation === index
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{variation.name}</span>
                        {selectedVariation === index && (
                          <CheckCircle className="w-6 h-6" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 走法进度 */}
              <div className="card-kid">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    学习进度
                  </h3>
                  {!showNotation && !showAnswer && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotation(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      📖 查看棋谱
                    </motion.button>
                  )}
                </div>

                {/* 进度条（始终显示） */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>已完成 {currentMoveIndex} 步</span>
                    <span>
                      共 {getCurrentOpening()?.moves.length + getCurrentVariation()?.moves.length} 步
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((currentMoveIndex) / (
                          getCurrentOpening()?.moves.length + getCurrentVariation()?.moves.length
                        )) * 100}%`
                      }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                    />
                  </div>
                </div>

                {/* 走错后的按钮 */}
                <AnimatePresence>
                  {showAnswer && !showNotation && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-4 space-y-3"
                    >
                      <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center">
                        <p className="font-bold mb-2">❌ 这一步走错了</p>
                        <p className="text-sm">要不要看看正确的走法？</p>
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowNotation(true)
                            setShowAnswer(false)
                          }}
                          className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl font-bold"
                        >
                          💡 看答案
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setShowAnswer(false)
                            setSelectedSquare(null)
                            setPossibleMoves([])
                          }}
                          className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-xl font-bold"
                        >
                          🔄 再试试
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 走法列表 - 默认隐藏 */}
                <AnimatePresence>
                  {showNotation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {showAnswer && (
                        <div className="bg-orange-100 text-orange-800 p-3 rounded-xl text-center font-bold mb-4">
                          💡 这里是正确的走法（只显示当前步）
                        </div>
                      )}

                      {getCurrentOpening()?.moves.map((move, index) => {
                        // 如果是走错后显示答案,只显示当前步
                        const shouldShow = !showAnswer || index === currentMoveIndex

                        return shouldShow ? (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              index < currentMoveIndex
                                ? 'bg-green-100 text-green-800'
                                : index === currentMoveIndex
                                ? 'bg-yellow-100 text-yellow-800 font-bold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span className="font-mono text-lg">{move}</span>
                            {index < currentMoveIndex && (
                              <CheckCircle className="inline w-4 h-4 ml-2" />
                            )}
                          </div>
                        ) : null
                      })}
                      {getCurrentVariation()?.moves.map((move, index) => {
                        const totalMoves = getCurrentOpening()?.moves.length || 0
                        const actualIndex = totalMoves + index
                        // 如果是走错后显示答案,只显示到当前步
                        const shouldShow = !showAnswer || actualIndex <= currentMoveIndex

                        return shouldShow ? (
                          <div
                            key={actualIndex}
                            className={`p-3 rounded-lg ${
                              actualIndex < currentMoveIndex
                                ? 'bg-green-100 text-green-800'
                                : actualIndex === currentMoveIndex
                                ? 'bg-yellow-100 text-yellow-800 font-bold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span className="font-mono text-lg">{move}</span>
                            {actualIndex < currentMoveIndex && (
                              <CheckCircle className="inline w-4 h-4 ml-2" />
                            )}
                          </div>
                        ) : null
                      })}

                      {showAnswer && (
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-xl text-center text-sm mt-4">
                          📝 后面的走法需要继续学习才能看到
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showNotation && !showAnswer && (
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-center">
                    <p className="font-bold">🤔 自己先试试看！</p>
                    <p className="text-sm mt-1">走错了会提示</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

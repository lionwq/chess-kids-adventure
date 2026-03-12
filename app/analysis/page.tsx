'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Star, Brain, Eye, Target, Zap, Lightbulb, TrendingUp, Shield, BookOpen, RotateCcw, Crown } from 'lucide-react'
import Chess from 'chess.js'
import ChessBoard from '@/components/ChessBoard'
import { PositionAnalyzer, PositionExercises } from '@/lib/position-analysis'

export default function AnalysisPage() {
  const [game, setGame] = useState(new Chess())
  const [mode, setMode] = useState<'explore' | 'exercise'>('explore')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)

  const currentExercise = PositionExercises[currentExerciseIndex]

  useEffect(() => {
    if (mode === 'explore') {
      analyzeCurrentPosition()
    }
  }, [mode])

  const analyzeCurrentPosition = () => {
    const result = PositionAnalyzer.analyzePosition(game.fen(), game.turn() === 'w' ? 'white' : 'black')
    setAnalysis(result)
  }

  const handleSquareClick = (square: string) => {
    if (mode !== 'explore') return
    
    // 在探索模式下，允许用户点击棋子
    const piece = game.get(square)
    if (piece) {
      // 显示选中棋子的信息
      alert(`${piece.color === 'w' ? '白棋' : '黑棋'} ${getPieceName(piece.type)}`)
    }
  }

  const getPieceName = (type: string): string => {
    const names: Record<string, string> = {
      'p': '兵',
      'n': '马',
      'b': '象',
      'r': '车',
      'q': '后',
      'k': '王'
    }
    return names[type] || type
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)

    if (index === currentExercise.correct) {
      setScore(prev => prev + 10)
      analyzeCurrentPosition()
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < PositionExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setGame(new Chess(PositionExercises[currentExerciseIndex + 1].fen))
    } else {
      setCurrentExerciseIndex(0)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setGame(new Chess(PositionExercises[0].fen))
    }
  }

  const resetPosition = () => {
    setGame(new Chess())
    analyzeCurrentPosition()
  }

  const getEvaluationColor = (score: number): string => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-blue-600'
    if (score >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEvaluationEmoji = (score: number): string => {
    if (score >= 80) return '😎'
    if (score >= 70) return '🙂'
    if (score >= 50) return '😐'
    if (score >= 30) return '😟'
    return '😰'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 p-4 md:p-8">
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
            <Brain className="inline w-10 h-10 mr-2" />
            局面侦探
          </motion.h1>

          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              {score}分
            </div>
          </div>
        </div>
      </motion.div>

      {/* 模式切换 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-6"
      >
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMode('explore')
              analyzeCurrentPosition()
            }}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              mode === 'explore'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Eye className="inline w-5 h-5 mr-2" />
            局面探索
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setMode('exercise')
              setGame(new Chess(PositionExercises[0].fen))
            }}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              mode === 'exercise'
                ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            <Target className="inline w-5 h-5 mr-2" />
            局面练习
          </motion.button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        {mode === 'explore' ? (
          /* 局面探索模式 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：棋盘 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 card-kid"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  局面分析
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetPosition}
                  className="bg-purple-500 text-white p-2 rounded-xl"
                >
                  <RotateCcw className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex justify-center mb-6">
                <ChessBoard
                  fen={game.fen()}
                  onSquareClick={handleSquareClick}
                  isInteractive={true}
                />
              </div>

              <p className="text-center text-gray-600 text-sm">
                💡 点击棋子查看详细信息
              </p>
            </motion.div>

            {/* 右侧：分析结果 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {analysis && (
                <>
                  {/* 总体评估 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-kid"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">{getEvaluationEmoji(analysis.score)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          局面评估
                        </h3>
                        <p className={`text-3xl font-bold ${getEvaluationColor(analysis.score)}`}>
                          {PositionAnalyzer.getEvaluationLevel(analysis.score)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>局面评分</span>
                        <span className="font-bold">{analysis.score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.score}%` }}
                          className={`h-full rounded-full ${
                            analysis.score >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            analysis.score >= 50 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                            analysis.score >= 30 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-red-400 to-pink-500'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* 优势 */}
                  {analysis.advantages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="card-kid bg-green-50 border-green-400"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-gray-800">你的优势</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.advantages.map((advantage: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{advantage}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* 劣势 */}
                  {analysis.disadvantages.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card-kid bg-red-50 border-red-400"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-6 h-6 text-red-600" />
                        <h3 className="font-bold text-gray-800">需要注意</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.disadvantages.map((disadvantage: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Zap className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{disadvantage}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* 对手威胁 */}
                  {analysis.opponentThreats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="card-kid bg-yellow-50 border-yellow-400"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-6 h-6 text-yellow-600" />
                        <h3 className="font-bold text-gray-800">对手的威胁</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.opponentThreats.map((threat: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5">⚠️</div>
                            <span className="text-gray-700">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* 走棋建议 */}
                  {analysis.suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="card-kid bg-blue-50 border-blue-400"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                        <h3 className="font-bold text-gray-800">走棋建议</h3>
                      </div>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        ) : (
          /* 局面练习模式 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：棋盘 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 card-kid"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  局面练习
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {currentExerciseIndex + 1} / {PositionExercises.length}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <ChessBoard
                  fen={currentExercise.fen}
                  isInteractive={false}
                />
              </div>

              {/* 问题 */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl mb-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-2">
                      {currentExercise.question}
                    </h3>
                    <p className="text-gray-600">
                      选择正确的答案，仔细思考！
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 右侧：选项和结果 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-gray-800 text-xl">选择答案</h3>

              {currentExercise.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    showExplanation
                      ? index === currentExercise.correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-800'
                        : index === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-500 text-red-800'
                        : 'bg-gray-100 text-gray-400 opacity-50'
                      : selectedAnswer === index
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showExplanation && index === currentExercise.correct && (
                      <Star className="w-6 h-6 text-green-500" fill="currentColor" />
                    )}
                  </div>
                </motion.button>
              ))}

              {/* 解释 */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="card-kid bg-blue-50 border-blue-400"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-6 h-6 text-blue-600" />
                      <h3 className="font-bold text-gray-800">解析</h3>
                    </div>
                    <p className="text-gray-700">
                      {currentExercise.explanation}
                    </p>

                    {selectedAnswer === currentExercise.correct ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center"
                      >
                        <div className="text-4xl mb-2">🎉</div>
                        <p className="text-green-600 font-bold text-lg">回答正确！+10分</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center"
                      >
                        <div className="text-4xl mb-2">😅</div>
                        <p className="text-red-600 font-bold text-lg">再接再厉！</p>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextExercise}
                      className="w-full mt-6 btn-kid bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      下一题
                      <ArrowLeft className="inline w-5 h-5 ml-2 rotate-180" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

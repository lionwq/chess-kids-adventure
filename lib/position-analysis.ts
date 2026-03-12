// 局面分析系统
export interface PositionAnalysis {
  evaluation: string // 局面评估
  advantages: string[] // 优势
  disadvantages: string[] // 劣势  
  opponentThreats: string[] // 对手威胁
  weaknesses: string[] // 对手弱点
  suggestions: string[] // 走棋建议
  score: number // 0-100分
}

export const PositionAnalyzer = {
  // 分析局面并提供建议
  analyzePosition(fen: string, turn: 'white' | 'black'): PositionAnalysis {
    const analysis: PositionAnalysis = {
      evaluation: '均势',
      advantages: [],
      disadvantages: [],
      opponentThreats: [],
      weaknesses: [],
      suggestions: [],
      score: 50
    }

    // 简化的局面分析逻辑
    // 在实际应用中，这里应该调用真实的国际象棋引擎
    
    const pieces = this.parsePieces(fen)
    
    // 分析控制
    const control = this.analyzeControl(pieces, turn)
    if (control.advantage > 0.5) {
      analysis.advantages.push('控制了中心')
      analysis.score += 15
    } else if (control.advantage < -0.5) {
      analysis.disadvantages.push('中心控制不足')
      analysis.score -= 10
    }

    // 分析子力
    const material = this.analyzeMaterial(pieces, turn)
    if (material.advantage > 2) {
      analysis.advantages.push('子力占优')
      analysis.score += 10
    } else if (material.advantage < -2) {
      analysis.disadvantages.push('子力落后')
      analysis.score -= 10
    }

    // 分析安全
    const safety = this.analyzeSafety(pieces, turn)
    analysis.opponentThreats = safety.threats
    analysis.weaknesses = safety.weaknesses

    // 分析活动性
    const activity = this.analyzeActivity(pieces, turn)
    if (activity.good) {
      analysis.advantages.push('子力活跃')
      analysis.score += 10
    } else {
      analysis.suggestions.push('提高子力活动性')
    }

    // 生成走棋建议
    analysis.suggestions = this.generateSuggestions(pieces, turn)

    // 确定评估
    if (analysis.score >= 70) {
      analysis.evaluation = '优势'
    } else if (analysis.score >= 60) {
      analysis.evaluation = '略优'
    } else if (analysis.score <= 30) {
      analysis.evaluation = '劣势'
    } else if (analysis.score <= 40) {
      analysis.evaluation = '略劣'
    }

    // 限制分数范围
    analysis.score = Math.max(0, Math.min(100, analysis.score))

    return analysis
  },

  // 解析FEN字符串获取棋子信息
  parsePieces(fen: string): any {
    const pieces: any = {
      white: { pawns: 0, knights: 0, bishops: 0, rooks: 0, queens: 0, king: 0 },
      black: { pawns: 0, knights: 0, bishops: 0, rooks: 0, queens: 0, king: 0 }
    }

    const boardPart = fen.split(' ')[0]
    
    for (let i = 0; i < boardPart.length; i++) {
      const char = boardPart[i]
      if (char === '/') continue
      
      if (!isNaN(parseInt(char))) continue
      
      if (char === char.toUpperCase()) {
        // 白棋
        const piece = char.toLowerCase()
        if (piece === 'p') pieces.white.pawns++
        else if (piece === 'n') pieces.white.knights++
        else if (piece === 'b') pieces.white.bishops++
        else if (piece === 'r') pieces.white.rooks++
        else if (piece === 'q') pieces.white.queens++
        else if (piece === 'k') pieces.white.king++
      } else {
        // 黑棋
        const piece = char
        if (piece === 'p') pieces.black.pawns++
        else if (piece === 'n') pieces.black.knights++
        else if (piece === 'b') pieces.black.bishops++
        else if (piece === 'r') pieces.black.rooks++
        else if (piece === 'q') pieces.black.queens++
        else if (piece === 'k') pieces.black.king++
      }
    }

    return pieces
  },

  // 分析控制力
  analyzeControl(pieces: any, turn: 'white' | 'black'): any {
    // 简化版本：基于中心格子（e4, d4, e5, d5）的控制
    // 实际应用中需要更复杂的计算
    return { advantage: 0 }
  },

  // 分析子力
  analyzeMaterial(pieces: any, turn: 'white' | 'black'): any {
    const white = pieces.white
    const black = pieces.black

    const whiteScore = white.pawns * 1 + white.knights * 3 + white.bishops * 3 + 
                      white.rooks * 5 + white.queens * 9
    const blackScore = black.pawns * 1 + black.knights * 3 + black.bishops * 3 + 
                      black.rooks * 5 + black.queens * 9

    const advantage = turn === 'white' ? whiteScore - blackScore : blackScore - whiteScore
    return { advantage }
  },

  // 分析安全
  analyzeSafety(pieces: any, turn: 'white' | 'black'): any {
    return {
      threats: [],
      weaknesses: []
    }
  },

  // 分析活动性
  analyzeActivity(pieces: any, turn: 'white' | 'black'): any {
    // 简化版本
    return { good: Math.random() > 0.5 }
  },

  // 生成走棋建议
  generateSuggestions(pieces: any, turn: 'white' | 'black'): string[] {
    const suggestions: string[] = [
      '控制中心',
      '发展轻子（马和象）',
      '王车易位',
      '注意安全，不要被将杀'
    ]

    return suggestions
  },

  // 对手意图分析
  analyzeOpponentIntent(fen: string, lastMove: string): string[] {
    const intents: string[] = []

    // 基于最后一步走法分析意图
    if (lastMove.includes('x')) {
      intents.push('对手正在吃掉你的棋子')
    } else if (lastMove.includes('+')) {
      intents.push('对手正在将军你的王！')
    } else if (lastMove.includes('#')) {
      intents.push('对手正在将杀你！')
    }

    // 分析开局意图
    const fenLower = fen.toLowerCase()
    if (fenLower.includes('e4')) {
      intents.push('对手选择了开放的进攻性开局')
    } else if (fenLower.includes('d4')) {
      intents.push('对手选择了稳健的控制性开局')
    }

    return intents
  },

  // 识别对手弱点
  findWeaknesses(fen: string, turn: 'white' | 'black'): string[] {
    const weaknesses: string[] = []
    
    // 常见弱点
    weaknesses.push('f7位置（最弱点）')
    weaknesses.push('孤立的兵')
    weaknesses.push('落后的兵')
    weaknesses.push('暴露的王')
    weaknesses.push('被动的子力')

    return weaknesses
  },

  // 局面评估等级
  getEvaluationLevel(score: number): string {
    if (score >= 80) return '绝对优势'
    if (score >= 70) return '明显优势'
    if (score >= 60) return '略优'
    if (score >= 40) return '均势'
    if (score >= 30) return '略劣'
    if (score >= 20) return '劣势'
    return '严重劣势'
  }
}

// 练习题数据
export const PositionExercises = [
  {
    id: 'pos-1',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    question: '这是初始局面，白棋应该怎么走？',
    options: [
      'e4 - 控制中心',
      'd4 - 稳健控制',
      'Nf3 - 发展马',
      'e3 - 保守走法'
    ],
    correct: 0,
    explanation: 'e4是最好的一步，可以控制中心，并为白格象和王后打开线路'
  },
  {
    id: 'pos-2',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    question: '黑棋走了e5，白棋最好的回应是？',
    options: [
      'e4 - 继续控制中心',
      'Nf3 - 攻击黑棋的兵',
      'd3 - 保守走法',
      'Bc4 - 发展象'
    ],
    correct: 1,
    explanation: 'Nf3攻击e5的兵，同时发展马，是一步很好的棋'
  },
  {
    id: 'pos-3',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    question: '黑棋走了Nc6，白棋应该怎么走？',
    options: [
      'Bb4 - 牵制',
      'Bc4 - 意大利开局',
      'd4 - 苏格兰开局',
      'd3 - 稳健走法'
    ],
    correct: 1,
    explanation: 'Bc4是意大利开局，可以快速发展和控制中心'
  }
]

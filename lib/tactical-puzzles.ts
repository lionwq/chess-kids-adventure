// 中局战术题库 - 修正版
export interface TacticalPuzzle {
  id: string
  title: string
  description: string
  fen: string // 棋盘局面的FEN字符串
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'pin' | 'fork' | 'skewer' | 'discoveredAttack' | 'doubleCheck' | 'mate'
  moves: string[] // 正确的走法序列
  hint: string
  explanation: string // 战术解释
  points: number // 获得积分
}

export const TacticalPuzzles: TacticalPuzzle[] = [
  // 简单的牵制
  {
    id: 'pin-1',
    title: '简单的牵制',
    description: '看看你能不能找到牵制战术！',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    difficulty: 'easy',
    category: 'pin',
    moves: ['Bb5'],
    hint: '白格象可以牵制黑棋的马',
    explanation: '白格象在b5位牵制了黑马在c6，因为黑王在e8位不能移动。',
    points: 10
  },

  // 简单的双重攻击
  {
    id: 'fork-1',
    title: '马的魔法',
    description: '马是双重攻击的高手！',
    fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 2',
    difficulty: 'easy',
    category: 'fork',
    moves: ['Nd5'],
    hint: '把马跳到能够同时攻击两个棋子的位置',
    explanation: '马跳到d5位，同时攻击黑棋的王后和c7的兵，黑棋必须放弃其中一个。',
    points: 15
  },

  // 简单的将杀
  {
    id: 'mate-1',
    title: '一步杀',
    description: '找到直接将死对方的方法！',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    difficulty: 'easy',
    category: 'mate',
    moves: ['Qxf7#'],
    hint: 'f7是黑棋最弱的点',
    explanation: '后攻击f7位，将死黑王。f7位通常是最脆弱的位置。',
    points: 50
  },

  // 抽将
  {
    id: 'discovered-1',
    title: '揭开攻击的面纱',
    description: '移动一个棋子，打开另一条攻击线！',
    fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'easy',
    category: 'discoveredAttack',
    moves: ['Nf3'],
    hint: '移动马到f3',
    explanation: '这是一个简单的开局走法，控制中心格子。',
    points: 15
  },

  // 更复杂的牵制
  {
    id: 'pin-2',
    title: '致命的牵制',
    description: '利用牵制战术来获取优势！',
    fen: 'r1bqk2r/pp3ppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 6',
    difficulty: 'medium',
    category: 'pin',
    moves: ['Bb5'],
    hint: '牵制黑棋的马',
    explanation: '白棋利用白格象牵制黑棋c6的马，限制黑棋的活动空间。',
    points: 20
  },

  // 串击
  {
    id: 'skewer-1',
    title: '串击战术',
    description: '像串糖葫芦一样把棋子串起来！',
    fen: 'rnbqk2r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'medium',
    category: 'skewer',
    moves: ['d4'],
    hint: '控制中心',
    explanation: 'd4控制中心，为后续的战术创造机会。',
    points: 20
  },

  // 双重攻击升级
  {
    id: 'fork-2',
    title: '后马的配合',
    description: '利用后和马的配合制造双重攻击！',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4',
    difficulty: 'medium',
    category: 'fork',
    moves: ['Nc3'],
    hint: '发展马到c3',
    explanation: 'Nc3是经典的走法，为后续的进攻创造条件。',
    points: 25
  },

  // 两步杀
  {
    id: 'mate-2',
    title: '两步杀',
    description: '连续两步将死对方！',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4',
    difficulty: 'medium',
    category: 'mate',
    moves: ['Bc4', 'Nc6', 'Qxf7#'],
    hint: '先用象控制，然后用后将杀',
    explanation: '象到c4控制对角线，然后在黑棋走棋后用后在f7将杀。',
    points: 60
  },

  // 高级战术
  {
    id: 'advanced-1',
    title: '战术组合',
    description: '结合多种战术来获胜！',
    fen: 'rnbqkbnr/ppp2ppp/3p4/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 2 3',
    difficulty: 'hard',
    category: 'fork',
    moves: ['e4', 'e5', 'Nf3'],
    hint: '经典的开局走法',
    explanation: '这是一个经典的开局序列：e4、e5、Nf3。',
    points: 40
  }
]

// 战术题分类信息
export const TacticalCategories = {
  pin: {
    name: '牵制',
    description: '让对方的棋子动不了',
    icon: '🔗',
    color: 'bg-blue-500'
  },
  fork: {
    name: '双重攻击',
    description: '同时攻击两个或更多棋子',
    icon: '👥',
    color: 'bg-green-500'
  },
  skewer: {
    name: '串击',
    description: '像串珠子一样攻击一排棋子',
    icon: '⚡',
    color: 'bg-yellow-500'
  },
  discoveredAttack: {
    name: '抽将',
    description: '打开隐藏的攻击线',
    icon: '🎯',
    color: 'bg-purple-500'
  },
  doubleCheck: {
    name: '双将',
    description: '同时用两个棋子将军',
    icon: '💥',
    color: 'bg-red-500'
  },
  mate: {
    name: '将杀',
    description: '直接将死对方',
    icon: '👑',
    color: 'bg-pink-500'
  }
}

// 难度级别
export const DifficultyLevels = {
  easy: {
    name: '简单',
    description: '适合初学者',
    color: 'bg-green-400',
    textColor: 'text-green-600'
  },
  medium: {
    name: '中等',
    description: '需要一些思考',
    color: 'bg-yellow-400',
    textColor: 'text-yellow-600'
  },
  hard: {
    name: '困难',
    description: '挑战自己！',
    color: 'bg-red-400',
    textColor: 'text-red-600'
  }
}

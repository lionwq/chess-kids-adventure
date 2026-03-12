// 中局战术题库
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
  // 牵制（Pin）
  {
    id: 'pin-1',
    title: '简单的牵制',
    description: '看看你能不能找到牵制战术！',
    fen: 'rnb1k1nr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'easy',
    category: 'pin',
    moves: ['Bb5'],
    hint: '白格象可以牵制黑棋的马，保护王后',
    explanation: '白格象在b5位牵制了黑马在c6，因为黑王在e8位不能移动。这样黑棋的马就不能保护d4的兵。',
    points: 10
  },
  {
    id: 'pin-2',
    title: '致命的牵制',
    description: '利用牵制战术来获取优势！',
    fen: 'r1bqk2r/pp3ppp/2n1pn2/2pp4/4P3/2NP1N2/PPP2PPP/R1BQKB1R w KQkq - 0 6',
    difficulty: 'medium',
    category: 'pin',
    moves: ['Bb5', 'Bd7', 'd5'],
    hint: '先牵制黑棋的马，然后再推进d兵',
    explanation: '白棋利用白格象牵制黑棋c6的马，限制黑棋的活动空间。',
    points: 20
  },

  // 双重攻击（Fork）
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
  {
    id: 'fork-2',
    title: '后马的配合',
    description: '利用后和马的配合制造双重攻击！',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4',
    difficulty: 'medium',
    category: 'fork',
    moves: ['Qb3'],
    hint: '后可以同时攻击两个弱棋',
    explanation: '后从d1移到b3，同时攻击黑棋的b7和f7两个弱点，黑棋难以防守。',
    points: 25
  },

  // 串击（Skewer）
  {
    id: 'skewer-1',
    title: '串击战术',
    description: '像串糖葫芦一样把棋子串起来！',
    fen: 'rnbqk2r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'medium',
    category: 'skewer',
    moves: ['Qh5'],
    hint: '王后可以同时攻击王和另一个棋子',
    explanation: '后到h5位，同时威胁f7的兵和黑王，迫使黑棋做出选择。',
    points: 20
  },

  // 抽将（Discovered Attack）
  {
    id: 'discovered-1',
    title: '揭开攻击的面纱',
    description: '移动一个棋子，打开另一条攻击线！',
    fen: 'rnbqk2r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3',
    difficulty: 'easy',
    category: 'discoveredAttack',
    moves: ['Ng5'],
    hint: '移动马，让白格象的攻击线显现出来',
    explanation: '马从f3跳到g5，同时白格象在c4位可以攻击黑棋的王后或王。',
    points: 15
  },

  // 双将（Double Check）
  {
    id: 'double-check-1',
    title: '双将的威力',
    description: '同时用两个棋子将军！',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 4 4',
    difficulty: 'hard',
    category: 'doubleCheck',
    moves: ['Bxf7'],
    hint: '同时用象和另一个棋子攻击黑王',
    explanation: '这是双将的情况，黑王必须移动，没有其他选择。',
    points: 30
  },

  // 将杀（Mate）
  {
    id: 'mate-1',
    title: '一步杀',
    description: '找到直接将死对方的方法！',
    fen: 'r1b1k2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
    difficulty: 'easy',
    category: 'mate',
    moves: ['Qxf7#'],
    hint: 'f7是黑棋最弱的点',
    explanation: '后攻击f7位，将死黑王。f7位通常是最脆弱的位置。',
    points: 50
  },
  {
    id: 'mate-2',
    title: '两步杀',
    description: '连续两步将死对方！',
    fen: 'r1b1k2r/pppp1ppp/2n2n2/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 0 5',
    difficulty: 'medium',
    category: 'mate',
    moves: ['Bxf7', 'Kf8', 'Qf7#'],
    hint: '先用象换掉f7的兵，然后再用后将杀',
    explanation: '第一步象到f7将军，黑王必须移动，然后后再f7将死。',
    points: 60
  },

  // 高级战术题
  {
    id: 'advanced-1',
    title: '战术组合',
    description: '结合多种战术来获胜！',
    fen: 'rnbqkbnr/ppp2ppp/3p4/4p3/2B1P3/2N2N2/PPPP1PPP/R1BQK2R w KQkq - 2 3',
    difficulty: 'hard',
    category: 'fork',
    moves: ['Ng5', 'f6', 'Qf3'],
    hint: '先用马威胁，再用后进攻',
    explanation: '这是一个组合战术，利用马的威胁为后创造进攻机会。',
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

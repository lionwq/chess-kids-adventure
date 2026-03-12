// 常见国际象棋开局及变例
export const ChessOpenings = {
  // 意大利开局
  italian: {
    name: "意大利开局",
    description: "开局最快的发展棋子，控制中心，适合新手学习",
    moves: [
      "e4", "e5",
      "Nf3", "Nc6",
      "Bc4"
    ],
    variations: [
      {
        name: "双马防御",
        moves: [
          "Nf6",
          "Ng5",
          "d5",
          "exd5",
          "Nxf7"
        ],
        tip: "这是一个陷阱！黑棋不能轻易接受弃兵"
      },
      {
        name: "三马防御",
        moves: [
          "Nf6",
          "d3",
          "Bc5",
          "Bg5"
        ],
        tip: "稳固的防御，避免过早交换象"
      }
    ]
  },

  // 西班牙开局
  spanish: {
    name: "西班牙开局",
    description: "最经典的开局之一，策略性强，适合提高水平",
    moves: [
      "e4", "e5",
      "Nf3", "Nc6",
      "Bb5"
    ],
    variations: [
      {
        name: "柏林防御",
        moves: [
          "Nf6",
          "O-O",
          "Nxe4",
          "d4"
        ],
        tip: "黑棋选择稳健，兑换双马后进入中局"
      },
      {
        name: "齐果林防御",
        moves: [
          "a6",
          "Ba4",
          "Nf6",
          "O-O",
          "Re1",
          "b5",
          "Bb3",
          "d6"
        ],
        tip: "弹性很强的防御体系"
      }
    ]
  },

  // 后翼弃兵
  queensGambit: {
    name: "后翼弃兵",
    description: "白棋通过弃兵来控制中心，策略性强",
    moves: [
      "d4", "d5",
      "c4"
    ],
    variations: [
      {
        name: "接受弃兵",
        moves: [
          "dxc4",
          "e3",
          "e5",
          "Bxc4",
          "exd4"
        ],
        tip: "黑棋接受弃兵，但需要小心白棋的反击"
      },
      {
        name: "拒绝弃兵",
        moves: [
          "c6",
          "Nf3",
          "Nf6",
          "e3"
        ],
        tip: "斯拉夫防御，非常稳固"
      }
    ]
  },

  // 苏格兰开局
  scottish: {
    name: "苏格兰开局",
    description: "快速的出子和中心控制，适合进攻型棋手",
    moves: [
      "e4", "e5",
      "Nf3", "Nc6",
      "d4"
    ],
    variations: [
      {
        name: "主要变化",
        moves: [
          "exd4",
          "Nxd4",
          "Bc5",
          "Be3",
          "Qf6"
        ],
        tip: "黑棋攻击d4马，白棋需要小心应对"
      }
    ]
  },

  // 卡罗·康防御
  carokann: {
    name: "卡罗·康防御",
    description: "黑棋选择坚固的防御体系",
    moves: [
      "e4", "c6"
    ],
    variations: [
      {
        name: "主变化",
        moves: [
          "d4",
          "d5",
          "e5",
          "Bf5",
          "exd6",
          "exd6"
        ],
        tip: "黑棋的象在f5位，可以很好地控制对角线"
      }
    ]
  }
}

// 开局学习进度数据结构
export interface OpeningProgress {
  openingId: string
  completedMoves: number
  totalMoves: number
  lastPracticed: Date
  score: number // 0-100
}

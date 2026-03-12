'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 棋子符号（实心）
const PIECE_SYMBOLS: Record<string, string> = {
  'wK': '♚', 'wQ': '♛', 'wR': '♜', 'wB': '♝', 'wN': '♞', 'wP': '♟',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
}

interface ChessBoardProps {
  fen?: string
  orientation?: 'white' | 'black'
  onSquareClick?: (square: string) => void
  selectedSquare?: string
  possibleMoves?: string[]
  lastMove?: string
  isInteractive?: boolean
}

export default function ChessBoard({
  fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  orientation = 'white',
  onSquareClick,
  selectedSquare,
  possibleMoves = [],
  lastMove,
  isInteractive = true
}: ChessBoardProps) {
  const [board, setBoard] = useState<(string | null)[][]>([])
  const [isPieceMoving, setIsPieceMoving] = useState(false)

  // 解析FEN字符串
  const parseFEN = (fenString: string) => {
    const boardState: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    const fenParts = fenString.split(' ')
    const position = fenParts[0]
    
    let row = 0
    let col = 0
    
    for (let i = 0; i < position.length; i++) {
      const char = position[i]
      
      if (char === '/') {
        row++
        col = 0
      } else if (char >= '1' && char <= '8') {
        col += parseInt(char)
      } else {
        const color = char === char.toUpperCase() ? 'w' : 'b'
        const piece = char.toLowerCase().toUpperCase()
        boardState[row][col] = color + piece
        col++
      }
    }
    
    return boardState
  }

  useEffect(() => {
    setBoard(parseFEN(fen))
  }, [fen])

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']

  const getSquareName = (row: number, col: number): string => {
    return `${files[col]}${ranks[row]}`
  }

  const handleSquareClick = (row: number, col: number) => {
    if (!isInteractive) return
    
    const squareName = getSquareName(row, col)
    onSquareClick?.(squareName)
  }

  const isLightSquare = (row: number, col: number) => {
    return (row + col) % 2 === 0
  }

  const isSelected = (row: number, col: number) => {
    if (!selectedSquare) return false
    const [file, rank] = selectedSquare
    return files[col] === file && ranks[row] === rank
  }

  const isPossibleMove = (row: number, col: number) => {
    return possibleMoves.includes(getSquareName(row, col))
  }

  const isLastMove = (row: number, col: number) => {
    if (!lastMove) return false
    const squares = lastMove.split('-')
    return squares.includes(getSquareName(row, col))
  }

  return (
    <div className="inline-block bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-2xl p-6">
      {/* 坐标标签 - 左侧数字 */}
      <div className="flex">
        <div className="flex flex-col mr-2">
          {board.map((_, rowIndex) => (
            <div
              key={`rank-${rowIndex}`}
              className="flex items-center justify-center w-6"
              style={{ height: '3.5rem' }}
            >
              <span className="text-sm font-bold text-slate-700">
                {8 - rowIndex}
              </span>
            </div>
          ))}
        </div>

        {/* 棋盘 */}
        <div className="grid grid-cols-8 gap-0 border-4 border-slate-700 rounded-lg overflow-hidden">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = isLightSquare(rowIndex, colIndex)
              const squareName = getSquareName(rowIndex, colIndex)
              const selected = isSelected(rowIndex, colIndex)
              const possible = isPossibleMove(rowIndex, colIndex)
              const lastMoveHighlight = isLastMove(rowIndex, colIndex)

              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  disabled={!isInteractive}
                  className={`
                    relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                    ${isLight ? 'bg-chess-light' : 'bg-chess-dark'}
                    ${selected ? 'bg-chess-highlight !shadow-inner' : ''}
                    ${possible ? 'bg-green-400/60 !shadow-lg' : ''}
                    ${lastMoveHighlight ? 'bg-yellow-400/70' : ''}
                    ${isInteractive ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
                    transition-all duration-200
                    flex items-center justify-center
                  `}
                  style={{
                    boxShadow: selected ? 'inset 0 0 20px rgba(0,0,0,0.3)' : undefined
                  }}
                >
                  {/* 可移动的提示 */}
                  {possible && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-green-500 rounded-full opacity-60" />
                    </div>
                  )}

                  {/* 棋子 */}
                  {piece && (
                    <span
                      className={`
                        text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                        ${piece[0] === 'w' ? 'text-gray-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}
                        select-none piece
                      `}
                      style={{
                        textShadow: piece[0] === 'w'
                          ? '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.5)'
                          : '2px 2px 4px rgba(255,255,255,0.3)'
                      }}
                    >
                      {PIECE_SYMBOLS[piece]}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* 坐标标签 - 底部字母 */}
      <div className="flex ml-8 mt-1">
        {files.map((file, colIndex) => (
          <div
            key={`file-${file}`}
            className="flex items-center justify-center"
            style={{ width: '3.5rem' }}
          >
            <span className="text-sm font-bold text-slate-700">
              {file}
            </span>
          </div>
        ))}
      </div>

      {/* 棋盘底部信息 */}
      {isInteractive && (
        <div className="mt-4 text-center text-slate-800 font-bold text-sm bg-white/60 px-4 py-2 rounded-lg">
          {orientation === 'white' ? '⬜ 白棋' : '⬛ 黑棋'} 走棋
        </div>
      )}
    </div>
  )
}

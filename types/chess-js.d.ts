declare module 'chess.js' {
  export interface Chess {
    new(): Chess;
    board(): Array<(string | null)[]>;
    move(move: string | Move): Move | null;
    moves(options?: { square?: string; verbose?: boolean }): string[] | Move[];
    undo(): void;
    reset(): void;
    load(fen: string): boolean;
    fen(): string;
    pgn(options?: { max_width?: number; newline_char?: string }): string;
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    insufficient_material(): boolean;
    game_over(): boolean;
    validate_move(move: string | Move): boolean;
    ascii(): string;
    turn(): 'w' | 'b';
    header(): { [key: string]: string | undefined };
    remove_header(key: string): void;
    set_header(key: string, value: string): void;
    history(options?: { verbose?: boolean }): string[] | Move[];
    get_comment(): string;
    set_comment(comment: string): void;
    delete_comment(): void;
    get_castling(): { w: { k: boolean; q: boolean }; b: { k: boolean; q: boolean } };
    put(piece: { type: string; color: string }, square: string): boolean;
    remove(square: string): { type: string; color: string } | null;
    get(square: string): { type: string; color: string } | null;
    square_color(square: string): 'light' | 'dark';
    STATUS: {
      INVALID: number;
      NORMAL: number;
      CHECK: number;
      CHECKMATE: number;
      DRAW: number;
      STALEMATE: number;
      THREEFOLD_REPETITION: number;
      INSUFFICIENT_MATERIAL: number;
    };
  }

  export interface Move {
    color: 'w' | 'b';
    from: string;
    to: string;
    piece: string;
    captured?: string;
    promoted?: string;
    flags: string;
    san?: string;
    lan?: string;
    before?: string;
    after?: string;
  }

  const Chess: Chess;
  export default Chess;
}

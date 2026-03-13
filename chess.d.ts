declare module 'chess.js' {
  class Chess {
    constructor();
    board(): any[];
    move(move: string | any): any | null;
    moves(options?: { square?: string; verbose?: boolean }): string[] | any[];
    undo(): void;
    reset(): void;
    load(fen: string): boolean;
    fen(): string;
    pgn(options?: any): string;
    in_check(): boolean;
    in_checkmate(): boolean;
    in_draw(): boolean;
    in_stalemate(): boolean;
    in_threefold_repetition(): boolean;
    insufficient_material(): boolean;
    game_over(): boolean;
    validate_move(move: string | any): boolean;
    ascii(): string;
    turn(): string;
    header(): any;
    remove_header(key: string): void;
    set_header(key: string, value: string): void;
    history(options?: any): any[];
    get_comment(): string;
    set_comment(comment: string): void;
    delete_comment(): void;
    get_castling(): any;
    put(piece: any, square: string): boolean;
    remove(square: string): any;
    get(square: string): any;
    square_color(square: string): string;
  }

  export default Chess;
}

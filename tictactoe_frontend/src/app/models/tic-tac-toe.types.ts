export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[]; // Always length 9

export interface MoveResult {
  valid: boolean;
  reason?: string;
}

export type GameMode = 'PVP' | 'PVC';

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'DRAW' | null;
  mode: GameMode;
  isGameOver: boolean;
}

export interface AuditRecord {
  userId?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  entity: 'GAME' | 'MOVE' | 'MODE';
  before?: unknown;
  after?: unknown;
  reason?: string;
  timestampISO: string;
  level?: 'INFO' | 'WARN' | 'ERROR';
}

// PUBLIC_INTERFACE
/** A helper to create immutable deep copies for audit logging to avoid mutation artifacts. */
export function deepClone<T>(obj: T): T {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

import { Injectable, signal } from '@angular/core';
import { AiService } from './ai.service';
import { AuditRecord, Board, GameMode, GameState, MoveResult, Player, deepClone } from '../models/tic-tac-toe.types';

/**
// ============================================================================
// FEATURE IMPLEMENTATION - GameService
// ============================================================================
// Function: GameService
// Purpose: Manage Tic Tac Toe game state, validation, moves, AI integration, audit logs.
// GxP Critical: No; client-side only. Provides best-effort audit trail.
// Parameters: Public methods documented below.
// Returns: Signals and methods enabling component UI to drive the game.
// Throws: None, returns structured results and safeguards state changes.
// Audit: All operations generate AuditRecord items with before/after snapshots.
// ============================================================================
 */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly initialBoard: Board = Array(9).fill(null);
  private readonly userId = 'guest'; // TODO: integrate with auth in future backend

  // Reactive state signals
  state = signal<GameState>({
    board: deepClone(this.initialBoard),
    currentPlayer: 'X',
    winner: null,
    mode: 'PVC',
    isGameOver: false,
  });

  auditLog = signal<AuditRecord[]>([]);

  constructor(private readonly ai: AiService) {
    // Initialize audit trail with CREATE record
    this.appendAudit({
      action: 'CREATE',
      entity: 'GAME',
      before: null,
      after: deepClone(this.state()),
      reason: 'Initialize game',
      level: 'INFO'
    });
  }

  // PUBLIC_INTERFACE
  /** Resets the game to initial state. */
  reset(reason = 'User requested reset'): void {
    const before = deepClone(this.state());
    this.state.set({
      board: deepClone(this.initialBoard),
      currentPlayer: 'X',
      winner: null,
      mode: before.mode,
      isGameOver: false,
    });
    this.appendAudit({
      action: 'UPDATE',
      entity: 'GAME',
      before,
      after: deepClone(this.state()),
      reason,
      level: 'INFO'
    });
  }

  // PUBLIC_INTERFACE
  /** Switch between PvP and PvC. */
  setMode(mode: GameMode): void {
    const current = this.state();
    if (current.mode === mode) return;
    const before = deepClone(current);
    this.state.update((s) => ({ ...s, mode }));
    this.appendAudit({
      action: 'UPDATE',
      entity: 'MODE',
      before,
      after: deepClone(this.state()),
      reason: `Switch mode to ${mode}`,
      level: 'INFO'
    });
    // If switched to PVC and it's O's turn and AI is O, it will play when user clicks; no auto-move on switch.
  }

  // PUBLIC_INTERFACE
  /**
   * Attempts to make a move at the provided index for the current player.
   * Validates state, prevents overriding non-empty cells, and updates winner.
   */
  playerMove(index: number): MoveResult {
    const s = this.state();
    if (s.isGameOver) {
      return { valid: false, reason: 'Game is already over.' };
    }
    if (index < 0 || index > 8) {
      return { valid: false, reason: 'Invalid cell index.' };
    }
    if (s.board[index] !== null) {
      return { valid: false, reason: 'Cell already occupied.' };
    }

    const before = deepClone(s);
    const board = [...s.board];
    board[index] = s.currentPlayer;
    const nextState = this.evaluate(board, s.currentPlayer, s.mode);

    this.state.set(nextState);
    this.appendAudit({
      action: 'UPDATE',
      entity: 'MOVE',
      before,
      after: deepClone(nextState),
      reason: `Player ${before.currentPlayer} clicked cell ${index}`,
      level: 'INFO'
    });

    // If in PVC and game not over, trigger AI move.
    if (nextState.mode === 'PVC' && !nextState.isGameOver) {
      this.performAiMove();
    }

    return { valid: true };
  }

  // PUBLIC_INTERFACE
  /** Returns a user-friendly status string describing the current game state. */
  getStatus(): string {
    const { winner, isGameOver, currentPlayer } = this.state();
    if (winner === 'DRAW') return 'It’s a draw!';
    if (winner) return `Player ${winner} wins!`;
    return isGameOver ? 'Game over' : `Player ${currentPlayer}'s turn`;
  }

  // PUBLIC_INTERFACE
  /** Clears audit log. Intended for debugging; keep in UI as collapsible. */
  clearAudit(reason = 'User cleared audit'): void {
    const before = deepClone(this.auditLog());
    this.auditLog.set([]);
    this.appendAudit({
      action: 'DELETE',
      entity: 'GAME',
      before,
      after: [],
      reason,
      level: 'WARN'
    });
  }

  private performAiMove(): void {
    const s = this.state();
    const aiPlayer: Player = s.currentPlayer; // after player move, currentPlayer toggled; if PVC, AI is current
    const index = this.ai.selectMove(s.board, aiPlayer);
    if (index === -1) return; // no move available (shouldn’t happen if not game over)

    const before = deepClone(this.state());
    const board = [...s.board];
    if (board[index] !== null) {
      // Safeguard; treat as error but continue gracefully
      this.appendAudit({
        action: 'UPDATE',
        entity: 'MOVE',
        before,
        after: deepClone(this.state()),
        reason: `AI attempted illegal move at ${index}`,
        level: 'ERROR'
      });
      return;
    }
    board[index] = aiPlayer;
    const next = this.evaluate(board, aiPlayer, s.mode);
    this.state.set(next);

    this.appendAudit({
      action: 'UPDATE',
      entity: 'MOVE',
      before,
      after: deepClone(next),
      reason: `AI (${aiPlayer}) moved to cell ${index}`,
      level: 'INFO'
    });
  }

  private evaluate(board: Board, lastPlayer: Player, mode: GameMode): GameState {
    const winner = this.calculateWinner(board);
    const isFull = board.every((c) => c !== null);
    const isGameOver = winner !== null || isFull;
    let currentPlayer: Player = lastPlayer === 'X' ? 'O' : 'X';

    if (isGameOver) {
      currentPlayer = lastPlayer; // freeze
    }

    return {
      board,
      currentPlayer,
      winner: winner ?? (isFull ? 'DRAW' : null),
      mode,
      isGameOver
    };
  }

  private calculateWinner(board: Board): Player | null {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
  }

  private appendAudit(entry: Omit<AuditRecord, 'timestampISO' | 'userId'>): void {
    const record: AuditRecord = {
      userId: this.userId,
      timestampISO: new Date().toISOString(),
      ...entry
    };
    this.auditLog.update((log) => [...log, record]);
  }
}

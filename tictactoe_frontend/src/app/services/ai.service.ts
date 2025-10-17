import { Injectable } from '@angular/core';
import { Board, Cell, Player } from '../models/tic-tac-toe.types';

/**
// ============================================================================
// FEATURE IMPLEMENTATION - AiService
// ============================================================================
// Function: AiService
// Purpose: Provide a simple, deterministic AI move selection for Tic Tac Toe.
// GxP Critical: No (frontend-only); audit done in GameService.
// Parameters: selectMove(board, aiPlayer): board validation occurs in GameService before call.
// Returns: index (0-8) of chosen cell, or -1 if no moves available.
// Throws: none (returns -1 if board full)
// Audit: AI decisions are logged by GameService after applied.
// ============================================================================
 */
@Injectable({ providedIn: 'root' })
export class AiService {
  // PUBLIC_INTERFACE
  /**
   * Selects a move for the AI with a simple heuristic:
   * 1) Win if possible
   * 2) Block opponent immediate win
   * 3) Center, then corners, then sides
   */
  selectMove(board: Board, aiPlayer: Player): number {
    const opp: Player = aiPlayer === 'X' ? 'O' : 'X';
    const empty = this.getEmpty(board);
    if (empty.length === 0) return -1;

    // 1. Try winning move
    for (const i of empty) {
      if (this.isWinningMove(board, i, aiPlayer)) return i;
    }

    // 2. Block opponent
    for (const i of empty) {
      if (this.isWinningMove(board, i, opp)) return i;
    }

    // 3. Center
    if (board[4] === null) return 4;

    // 4. Corners
    const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
    if (corners.length) return corners[0];

    // 5. Sides
    return empty[0];
  }

  private getEmpty(board: Board): number[] {
    const idxs: number[] = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) idxs.push(i);
    }
    return idxs;
  }

  private isWinningMove(board: Board, index: number, player: Player): boolean {
    const tmp: Cell[] = [...board];
    tmp[index] = player;
    return this.calculateWinner(tmp) === player;
  }

  private calculateWinner(board: Board): Player | null {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];
    for (const [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
}

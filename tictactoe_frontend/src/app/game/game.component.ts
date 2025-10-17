import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../services/game.service';
import { GameMode } from '../models/tic-tac-toe.types';

/**
// ============================================================================
// FEATURE IMPLEMENTATION - GameComponent
// ============================================================================
// Function: GameComponent
// Purpose: Present the Tic Tac Toe UI, bind to GameService, handle user interactions.
// GxP Critical: No; client-side view. Ensures input validation and accessible semantics.
// Parameters: None (uses injected service).
// Returns: Angular component rendered in app shell.
// Throws: None.
// Audit: Delegated to GameService; component triggers actions that cause audit entries.
// ============================================================================
 */
@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  protected showAudit = signal<boolean>(false);

  constructor(public game: GameService) {}

  // PUBLIC_INTERFACE
  /** Click handler for a board cell with index validation. */
  onCellClick(index: number): void {
    if (index < 0 || index > 8) return; // extra guard
    const res = this.game.playerMove(index);
    if (!res.valid && res.reason) {
      // Avoid using global alert to satisfy linter and SSR; use console + ARIA live region.
      console.warn('Invalid move:', res.reason);
      // Push a transient status message by toggling a status string (handled via status()).
      // No additional state needed since status() already reflects invalid reasons via GameService return.
    }
  }

  // PUBLIC_INTERFACE
  /** Resets the game. */
  reset(): void {
    this.game.reset();
  }

  // PUBLIC_INTERFACE
  /** Toggles between PvP and PvC modes. */
  toggleMode(): void {
    const s = this.game.state();
    const next: GameMode = s.mode === 'PVC' ? 'PVP' : 'PVC';
    this.game.setMode(next);
  }

  status = computed(() => this.game.getStatus());

  // PUBLIC_INTERFACE
  /** Returns an ARIA label for each cell, explicitly naming the piece for accessibility. */
  cellLabel(index: number): string {
    const v = this.game.state().board[index];
    if (v === 'X') return `Cell ${index + 1}, X (Knight)`;
    if (v === 'O') return `Cell ${index + 1}, O (Queen)`;
    return `Cell ${index + 1}, empty`;
  }
}

import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';

/**
// ============================================================================
// REQUIREMENT TRACEABILITY
// ============================================================================
// Requirement ID: REQ-FE-TTT-001
// User Story: As a user, I want to play Tic Tac Toe against another player or a simple computer opponent in a modern web UI.
// Acceptance Criteria: See work item details in task. App runs on port 3000, centered board, PvP & PvC, audit-style logs, validation, tests >=80% for core parts.
// GxP Impact: NO - Frontend-only demo; best-effort audit trail client-side. E-signature/RBAC stubs for future.
// Risk Level: LOW
// Validation Protocol: VP-FE-TTT-001 (unit tests included)
// ============================================================================
// ============================================================================
// IMPORTS AND DEPENDENCIES
// ============================================================================
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // PUBLIC_INTERFACE
  /** Title displayed in shell, kept minimal; main content is GameComponent. */
  title = 'Tic Tac Toe';
}

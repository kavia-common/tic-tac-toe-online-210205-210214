# Tic Tac Toe Frontend (Angular)

Ocean Professional themed Tic Tac Toe UI with Player vs Player and Player vs Computer modes, client-side audit-style logs, validation, and unit tests.

Features:
- Centered responsive 3x3 board with accessible semantics (role="grid" / "gridcell")
- PvP and PvC (AI heuristic: win/block/center/corner/side)
- Input validation and error handling (cannot override non-empty cells)
- Client-side audit trail with ISO timestamps, in-memory and viewable in collapsible panel
- Ocean Professional theme (blue primary, amber accents, subtle shadows and gradients)
- Unit tests (Jasmine/Karma) targeting >80% coverage for core parts

Getting started:
- npm install
- npm start
- Visit http://localhost:3000

Testing:
- npm test

Structure:
- src/app/models/tic-tac-toe.types.ts: shared types and AuditRecord
- src/app/services/game.service.ts: state management, validation, audit, AI integration
- src/app/services/ai.service.ts: simple deterministic AI selector
- src/app/game/game.component.*: main UI
- src/app/app.component.*: application shell
- src/app/services/*.spec.ts and src/app/game/*.spec.ts: unit tests

Compliance notes (frontend-only):
- Best-effort client-side audit trail included; e-signature and RBAC placeholders for future backend integration.
- No external services or environment variables required.


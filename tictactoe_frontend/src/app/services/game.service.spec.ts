import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { AiService } from './ai.service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameService, AiService]
    });
    service = TestBed.inject(GameService);
  });

  it('should initialize with default state and audit', () => {
    const s = service.state();
    expect(s.board.length).toBe(9);
    expect(s.currentPlayer).toBe('X');
    expect(service.auditLog().length).toBeGreaterThan(0);
  });

  it('should prevent overriding non-empty cells', () => {
    // First move valid
    expect(service.playerMove(0).valid).toBeTrue();
    // Second attempt to same cell invalid
    const res = service.playerMove(0);
    expect(res.valid).toBeFalse();
    expect(res.reason?.toLowerCase()).toContain('occupied');
  });

  it('should detect row winner', () => {
    // X at 0
    service.playerMove(0);
    // AI may play (PVC). Force PvP to control sequence:
    service.setMode('PVP');
    // O at 3
    service.playerMove(3);
    // X at 1
    service.playerMove(1);
    // O at 4
    service.playerMove(4);
    // X at 2 -> X wins
    service.playerMove(2);
    expect(service.state().winner).toBe('X');
    expect(service.state().isGameOver).toBeTrue();
  });

  it('reset should clear board and preserve mode', () => {
    service.setMode('PVP');
    service.playerMove(0);
    service.reset('test');
    const s = service.state();
    expect(s.board.every(c => c === null)).toBeTrue();
    expect(s.mode).toBe('PVP');
    expect(s.winner).toBeNull();
    expect(s.isGameOver).toBeFalse();
  });

  it('mode switch should be logged', () => {
    const beforeCount = service.auditLog().length;
    service.setMode('PVP');
    const afterCount = service.auditLog().length;
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  it('AI should make a legal move in PVC', () => {
    service.setMode('PVC');
    const before = service.state();
    // Player X move center
    service.playerMove(4);
    const s = service.state();
    expect(s.board[4]).toBe('X');
    // After player move, AI should have responded somewhere else
    const filled = s.board.filter(c => c !== null).length;
    expect(filled).toBe(2);
    // AI can't play on occupied cell
    expect(s.board[4]).toBe('X');
  });

  it('should not allow moves after game over', () => {
    // Create quick win: X:0, O:3, X:1, O:4, X:2
    service.setMode('PVP');
    service.playerMove(0);
    service.playerMove(3);
    service.playerMove(1);
    service.playerMove(4);
    service.playerMove(2); // X wins
    expect(service.state().isGameOver).toBeTrue();
    const res = service.playerMove(5);
    expect(res.valid).toBeFalse();
    expect(res.reason?.toLowerCase()).toContain('over');
  });
});

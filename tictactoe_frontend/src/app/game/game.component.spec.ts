import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { GameService } from '../services/game.service';
import { AiService } from '../services/ai.service';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [GameService, AiService]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render 9 cells', () => {
    const el: HTMLElement = fixture.nativeElement;
    const cells = el.querySelectorAll('.cell');
    expect(cells.length).toBe(9);
  });

  it('clicking a cell should update UI', () => {
    const el: HTMLElement = fixture.nativeElement;
    const firstCell = el.querySelectorAll('.cell')[0] as unknown as { click: () => void; textContent: string | null };
    firstCell.click();
    fixture.detectChanges();
    expect(firstCell.textContent?.trim()).toMatch(/X|O/); // depends on AI timing/mode but should fill
  });

  it('should toggle audit panel', () => {
    const el: HTMLElement = fixture.nativeElement;
    const toggle = el.querySelector('.btn.ghost:nth-child(3)') as unknown as { click: () => void };
    toggle.click();
    fixture.detectChanges();
    expect(el.querySelector('#audit-panel')).toBeTruthy();
  });

  it('reset button should clear board content', () => {
    const el: HTMLElement = fixture.nativeElement;
    const firstCell = el.querySelectorAll('.cell')[0] as unknown as { click: () => void; textContent: string | null };
    firstCell.click();
    fixture.detectChanges();
    const reset = el.querySelector('.btn.primary') as unknown as { click: () => void };
    reset.click();
    fixture.detectChanges();
    const firstCellAfter = el.querySelectorAll('.cell')[0] as unknown as { textContent: string | null };
    expect(firstCellAfter.textContent?.trim()).toBe('');
  });
});

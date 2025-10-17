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
    const el = fixture.nativeElement as HTMLElement;
    const cells = el.querySelectorAll('.cell');
    expect(cells.length).toBe(9);
  });

  it('clicking a cell should render an icon (knight or queen) instead of raw text', () => {
    const el = fixture.nativeElement as HTMLElement;
    const firstCell: any = el.querySelectorAll('.cell')[0];
    firstCell.click();
    fixture.detectChanges();

    // Expect an SVG to be present inside the clicked cell
    const svg = firstCell.querySelector('svg');
    expect(svg).toBeTruthy();

    // And either X (Knight) or O (Queen) class applied on icon wrapper
    const hasKnight = !!firstCell.querySelector('.cell-x');
    const hasQueen = !!firstCell.querySelector('.cell-o');
    expect(hasKnight || hasQueen).toBeTrue();
  });

  it('should toggle audit panel', () => {
    const el = fixture.nativeElement as HTMLElement;
    const toggle: any = el.querySelector('.btn.ghost:nth-child(3)');
    toggle.click();
    fixture.detectChanges();
    expect(el.querySelector('#audit-panel')).toBeTruthy();
  });

  it('reset button should clear board content (no icons present)', () => {
    const el = fixture.nativeElement as HTMLElement;
    const firstCell: any = el.querySelectorAll('.cell')[0];
    firstCell.click();
    fixture.detectChanges();

    const reset: any = el.querySelector('.btn.primary');
    reset.click();
    fixture.detectChanges();

    const firstCellAfter: any = el.querySelectorAll('.cell')[0];
    expect(firstCellAfter.querySelector('svg')).toBeFalsy();
    expect(firstCellAfter.querySelector('.cell-x, .cell-o')).toBeFalsy();
  });
});

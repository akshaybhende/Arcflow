import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  let fixture: ComponentFixture<StatCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatCard],
      imports: [MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCard);
    const component = fixture.componentInstance;
    component.label = 'Total Contacts';
    component.value = 42;
    component.icon = 'people';
    component.iconColor = 'var(--color-primary)';
    component.trend = '+12%';
    component.trendDirection = 'up';
    fixture.detectChanges();
  });

  it('renders label and value', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Total Contacts');
    expect(el.textContent).toContain('42');
    expect(el.textContent).toContain('+12%');
  });
});

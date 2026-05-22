import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Avatar, InitialsPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(Avatar);
  });

  it('shows initials when no image src', () => {
    fixture.componentInstance.name = 'Jane Doe';
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('JD');
  });

  it('renders image when src is provided', () => {
    fixture.componentInstance.name = 'Jane Doe';
    fixture.componentInstance.src = 'https://example.com/avatar.png';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
  });
});

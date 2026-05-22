import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  const data: ConfirmDialogData = {
    title: 'Delete item',
    message: 'Are you sure?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    destructive: true,
  };

  beforeEach(async () => {
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      declarations: [ConfirmDialog],
      imports: [MatButtonModule, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    fixture.detectChanges();
  });

  it('closes with false on cancel', () => {
    fixture.componentInstance.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('closes with true on confirm', () => {
    fixture.componentInstance.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});

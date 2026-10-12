import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountStatusDialogComponent } from './account-status-dialog-component';

describe('AccountStatusDialogComponent', () => {
  let component: AccountStatusDialogComponent;
  let fixture: ComponentFixture<AccountStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountStatusDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRepaymentsComponent } from './loan-repayments-component';

describe('LoanRepaymentsComponent', () => {
  let component: LoanRepaymentsComponent;
  let fixture: ComponentFixture<LoanRepaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanRepaymentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanRepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

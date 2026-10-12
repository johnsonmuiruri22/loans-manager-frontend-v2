import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanProcessingComponent } from './loan-processing-component';

describe('LoanProcessingComponent', () => {
  let component: LoanProcessingComponent;
  let fixture: ComponentFixture<LoanProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanProcessingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

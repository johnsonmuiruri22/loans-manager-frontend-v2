import { TestBed } from '@angular/core/testing';

import { LoanAIAssessmentService } from './loan-aiassessment-service';

describe('LoanAIAssessmentService', () => {
  let service: LoanAIAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanAIAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

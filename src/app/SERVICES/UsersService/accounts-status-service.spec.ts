import { TestBed } from '@angular/core/testing';

import { AccountsStatusService } from './accounts-status-service';

describe('AcountsStatusService', () => {
  let service: AccountsStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

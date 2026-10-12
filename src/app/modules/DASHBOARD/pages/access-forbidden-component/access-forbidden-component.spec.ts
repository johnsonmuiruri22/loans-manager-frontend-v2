import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessForbiddenComponent } from './access-forbidden-component';

describe('AccessForbiddenComponent', () => {
  let component: AccessForbiddenComponent;
  let fixture: ComponentFixture<AccessForbiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessForbiddenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessForbiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MustChangePasswordComponent } from './must-change-password-component';

describe('MustChangePasswordComponent', () => {
  let component: MustChangePasswordComponent;
  let fixture: ComponentFixture<MustChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MustChangePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MustChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

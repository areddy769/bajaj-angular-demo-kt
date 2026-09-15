import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnjComponent } from './anj.component';

describe('AnjComponent', () => {
  let component: AnjComponent;
  let fixture: ComponentFixture<AnjComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnjComponent]
    });
    fixture = TestBed.createComponent(AnjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [PaginationComponent] });
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('emits pageChange for a valid page', () => {
    component.page = 1;
    component.totalPages = 5;
    let emitted = 0;
    component.pageChange.subscribe((p) => (emitted = p));
    component.go(3);
    expect(emitted).toBe(3);
  });

  it('ignores out-of-range pages', () => {
    component.page = 1;
    component.totalPages = 5;
    let emitted = 0;
    component.pageChange.subscribe((p) => (emitted = p));
    component.go(99);
    expect(emitted).toBe(0);
  });
});

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(CustomerService);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('sends search/filter/sort/pagination as query params', () => {
    service
      .list({ page: 2, limit: 5, search: 'rahul', status: 'ACTIVE', sortBy: 'firstName', sortOrder: 'asc' })
      .subscribe();

    const req = backend.expectOne((r) => r.url === 'http://localhost:3000/api/customers');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('search')).toBe('rahul');
    expect(req.request.params.get('status')).toBe('ACTIVE');
    req.flush({ success: true, data: { items: [], pagination: { page: 2, limit: 5, totalItems: 0, totalPages: 0 } } });
  });

  it('fetches a customer by id', () => {
    service.getById(3).subscribe();
    const req = backend.expectOne('http://localhost:3000/api/customers/3');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: {} });
  });
});

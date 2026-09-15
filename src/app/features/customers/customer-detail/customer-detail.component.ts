import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, map, of, startWith, switchMap } from 'rxjs';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';

interface DetailState {
  loading: boolean;
  error: string | null;
  customer: Customer | null;
}

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  state$!: Observable<DetailState>;

  constructor(
    private route: ActivatedRoute,
    private customersApi: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Route param → API call. switchMap cancels the previous request if the id changes.
    this.state$ = this.route.paramMap.pipe(
      switchMap((params) =>
        this.customersApi.getById(Number(params.get('id'))).pipe(
          map((res) => ({ loading: false, error: null, customer: res.data })),
          catchError(() => of({ loading: false, error: 'Customer not found.', customer: null }))
        )
      ),
      startWith({ loading: true, error: null, customer: null })
    );
  }

  back(): void {
    void this.router.navigate(['/customers']);
  }

  edit(id: number): void {
    void this.router.navigate(['/customers', id, 'edit']);
  }
}

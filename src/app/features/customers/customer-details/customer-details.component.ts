import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';

@Component({
   selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  customer: Customer | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loading = true;
    this.errorMessage = '';

    this.customerService.getCustomerById(id).subscribe({

      next: (response) => {
        this.loading = false;

        this.customer = response.data;
      },

      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load customer details.';
      }

    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  editCustomer(): void {
    if (this.customer) {
      this.router.navigate(['/customers/edit', this.customer.id]);
    }
  }
}
import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../../core/models/customer.model';

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(customer: Customer | null | undefined): string {
    if (!customer) return '';
    return `${customer.firstName} ${customer.lastName}`;
  }
}

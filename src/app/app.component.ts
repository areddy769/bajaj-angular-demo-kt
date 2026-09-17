import { Component } from '@angular/core';

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  active: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  searchText: string = '';

  selectedEmployee: Employee | null = null;

  employees: Employee[] = [
    {
      id: 1,
      name: 'Priya',
      email: 'priya@gmail.com',
      department: 'IT',
      role: 'Angular Developer',
      active: true
    },
    {
      id: 2,
      name: 'Rahul',
      email: 'rahul@gmail.com',
      department: 'HR',
      role: 'HR Manager',
      active: true
    },
    {
      id: 3,
      name: 'Sneha',
      email: 'sneha@gmail.com',
      department: 'Finance',
      role: 'Accountant',
      active: false
    },
    {
      id: 4,
      name: 'Amit',
      email: 'amit@gmail.com',
      department: 'IT',
      role: 'Backend Developer',
      active: true
    },
    {
      id: 5,
      name: 'Neha',
      email: 'neha@gmail.com',
      department: 'Marketing',
      role: 'Marketing Executive',
      active: true
    }
  ];
  // Product example
  product = {
    name: 'iPhone 13',
    price: 700,
    color: 'Black',
    discount: 8.7
  };
  // Filter employees
  get filteredEmployees(): Employee[] {
    return this.employees.filter(employee =>
      employee.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }
  // Count active employees
  get activeEmployees(): number {
    return this.employees.filter(employee => employee.active).length;
  }
  // Count inactive employees
  get inactiveEmployees(): number {
    return this.employees.filter(employee => !employee.active).length;
  }
  // View employee
  viewEmployee(employee: Employee): void {
    this.selectedEmployee = employee;
  }


  // Close employee details

  closeDetails(): void {
    this.selectedEmployee = null;
  }


  // Change employee status

  toggleStatus(employee: Employee): void {
    employee.active = !employee.active;
  }


  // Clear search

  clearSearch(): void {
    this.searchText = '';
  }
}
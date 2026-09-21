import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
id: number;
firstName: string;
lastName: string;
email: string;
mobile: string;
city: string;
customerType: string;
status: string;
}

@Injectable({
providedIn: 'root'
})
export class CustomerService {

private apiUrl = 'http://localhost:3000/api/customers';

constructor(private http: HttpClient) {}

getCustomers(): Observable<any> {
return this.http.get<any>(this.apiUrl);
}

getCustomerById(id: string | number): Observable<any> {
return this.http.get<any>(`${this.apiUrl}/${id}`);
}

createCustomer(customer: any): Observable<any> {
return this.http.post<any>(this.apiUrl, customer);
}

updateCustomer(id: string | number, customer: any): Observable<any> {
return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
}

deleteCustomer(id: string | number): Observable<any> {
return this.http.delete<any>(`${this.apiUrl}/${id}`);
}
}

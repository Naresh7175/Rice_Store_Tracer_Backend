import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
    id?: number;
    name: string;
    brand: string;
    quantity: number;
    price: number;
    description?: string;
}

export interface Customer {
    id?: number;
    name: string;
    phone: string;
    address: string;
    totalDebt: number;
}

export interface SaleItemRequest {
    productId: number;
    quantity: number;
}

export interface SaleRequest {
    customerId: number;
    items: SaleItemRequest[];
    discount: number;
    paidAmount: number;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient) { }

    // Inventory
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.baseUrl}/inventory`);
    }

    addProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(`${this.baseUrl}/inventory`, product);
    }

    // Customers
    getCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${this.baseUrl}/customers`);
    }

    addCustomer(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(`${this.baseUrl}/customers`, customer);
    }

    // Sales
    createSale(sale: SaleRequest): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/sales`, sale);
    }

    // Reports
    getRevenue(period: string): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/reports/revenue?period=${period}`);
    }
}

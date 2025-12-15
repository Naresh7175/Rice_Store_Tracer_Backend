import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer } from '../../services/api.service';

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
    customers: Customer[] = [];
    filteredCustomers: Customer[] = [];
    showForm: boolean = false;
    searchTerm: string = '';

    newCustomer: Customer = {
        name: '',
        phone: '',
        address: '',
        totalDebt: 0
    };

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadCustomers();
    }

    loadCustomers() {
        this.apiService.getCustomers().subscribe(data => {
            this.customers = data;
            this.applyFilter();
        });
    }

    toggleForm() {
        this.showForm = !this.showForm;
    }

    applyFilter() {
        if (this.searchTerm && this.searchTerm.trim() !== '') {
            const term = this.searchTerm.toLowerCase();
            this.filteredCustomers = this.customers.filter(c =>
                c.name.toLowerCase().includes(term) ||
                c.phone.includes(term)
            );
        } else {
            this.filteredCustomers = this.customers;
        }
    }

    addCustomer() {
        this.apiService.addCustomer(this.newCustomer).subscribe(data => {
            this.loadCustomers();
            this.newCustomer = { name: '', phone: '', address: '', totalDebt: 0 };
            this.showForm = false; // Close form
        });
    }
}

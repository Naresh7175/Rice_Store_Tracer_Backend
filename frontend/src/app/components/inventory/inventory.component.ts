import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './inventory.component.html',
    styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit {
    products: Product[] = [];
    newProduct: Product = {
        name: '',
        brand: '',
        quantity: 0,
        price: 0,
        description: ''
    };

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadProducts();
    }

    loadProducts() {
        this.apiService.getProducts().subscribe(data => {
            this.products = data;
        });
    }

    addProduct() {
        this.apiService.addProduct(this.newProduct).subscribe(data => {
            this.loadProducts();
            this.newProduct = { name: '', brand: '', quantity: 0, price: 0, description: '' };
        });
    }
}

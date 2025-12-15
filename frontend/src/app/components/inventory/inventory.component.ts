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
    showForm: boolean = false;
    newProduct: Product = {
        name: '',
        brand: '',
        quantity: 0,
        price: 0,
        description: '',
        image: ''
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

    toggleForm() {
        this.showForm = !this.showForm;
    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.newProduct.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    addProduct() {
        this.apiService.addProduct(this.newProduct).subscribe(data => {
            this.loadProducts();
            this.newProduct = { name: '', brand: '', quantity: 0, price: 0, description: '', image: '' };
            this.showForm = false; // Close form after adding
        });
    }

    // getImage helper not needed if we use Base64 directly in src
    getImage(product: Product): string {
        return product.image || 'assets/placeholder-rice.png';
    }
}

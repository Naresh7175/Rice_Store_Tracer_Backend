import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer, Product, SaleRequest, SaleItemRequest } from '../../services/api.service';

@Component({
    selector: 'app-sales',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
    customers: Customer[] = [];
    products: Product[] = [];

    selectedCustomerId: number | null = null;

    // Current Item being added
    selectedProductId: number | null = null;
    selectedQuantity: number = 1;

    // Cart
    cartItems: { product: Product, quantity: number, total: number }[] = [];

    discount: number = 0;
    paidAmount: number = 0;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getCustomers().subscribe(data => this.customers = data);
        this.apiService.getProducts().subscribe(data => this.products = data);
    }

    addToCart() {
        if (this.selectedProductId && this.selectedQuantity > 0) {
            const product = this.products.find(p => p.id == this.selectedProductId);
            if (product) {
                if (product.quantity < this.selectedQuantity) {
                    alert('Insufficient Stock!');
                    return;
                }

                this.cartItems.push({
                    product: product,
                    quantity: this.selectedQuantity,
                    total: product.price * this.selectedQuantity
                });

                // Reset selection
                this.selectedProductId = null;
                this.selectedQuantity = 1;
            }
        }
    }

    get totalAmount(): number {
        return this.cartItems.reduce((sum, item) => sum + item.total, 0);
    }

    get finalAmount(): number {
        return this.totalAmount - this.discount;
    }

    get balance(): number {
        return this.finalAmount - this.paidAmount;
    }

    submitSale() {
        if (!this.selectedCustomerId) {
            alert('Please select a customer');
            return;
        }
        if (this.cartItems.length === 0) {
            alert('Cart is empty');
            return;
        }

        const saleRequest: SaleRequest = {
            customerId: this.selectedCustomerId,
            items: this.cartItems.map(item => ({
                productId: item.product.id!,
                quantity: item.quantity
            })),
            discount: this.discount,
            paidAmount: this.paidAmount
        };

        this.apiService.createSale(saleRequest).subscribe({
            next: (res) => {
                alert('Sale completed successfully!');
                this.resetForm();
            },
            error: (err) => {
                alert('Error processing sale: ' + err.message);
            }
        });
    }

    resetForm() {
        this.cartItems = [];
        this.selectedCustomerId = null;
        this.discount = 0;
        this.paidAmount = 0;
        // Refresh products to update stock
        this.apiService.getProducts().subscribe(data => this.products = data);
    }
}

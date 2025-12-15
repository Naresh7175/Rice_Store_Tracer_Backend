import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Customer, Product, SaleRequest, SaleItemRequest } from '../../services/api.service';

export interface ProductViewModel extends Product {
    selQuantity: number;
    selUnit: string;
}

@Component({
    selector: 'app-sales',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './sales.component.html',
    styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
    customers: Customer[] = [];
    products: ProductViewModel[] = [];

    selectedCustomerId: number | null = null;

    // Cart
    cartItems: { product: Product, quantity: number, unit: string, price: number, total: number }[] = [];

    discount: number = 0;
    paidAmount: number = 0;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.apiService.getCustomers().subscribe(data => this.customers = data);
        this.apiService.getProducts().subscribe(data => {
            this.products = data.map(p => ({
                ...p,
                selQuantity: 0,
                selUnit: 'BAG'
            }));
        });
    }

    addToCart(item: ProductViewModel) {
        if (item.selQuantity > 0) {
            // Determine price based on unit
            let price = item.price;
            let quantityToCheck = item.selQuantity;

            if (item.selUnit === 'KG') {
                price = item.price / 26.0;
                quantityToCheck = item.selQuantity / 26.0;
            }

            if (item.quantity < quantityToCheck) {
                alert('Insufficient Stock for ' + item.name);
                return;
            }

            this.cartItems.push({
                product: item,
                quantity: item.selQuantity,
                unit: item.selUnit,
                price: price,
                total: price * item.selQuantity
            });

            // Reset selection for this item
            item.selQuantity = 0;
            item.selUnit = 'BAG';
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
                quantity: item.quantity,
                unit: item.unit
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
        this.apiService.getProducts().subscribe(data => {
            this.products = data.map(p => ({
                ...p,
                selQuantity: 0,
                selUnit: 'BAG'
            }));
        });
    }
}

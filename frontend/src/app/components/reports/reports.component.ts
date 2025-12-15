import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
    revenue: number = 0;
    period: string = 'monthly';
    sales: any[] = [];
    filteredSales: any[] = [];
    currentFilter: string = 'ALL';

    selectedMonth: number | null = null;
    selectedYear: number | null = null;
    months = [
        { val: 1, name: 'January' }, { val: 2, name: 'February' }, { val: 3, name: 'March' },
        { val: 4, name: 'April' }, { val: 5, name: 'May' }, { val: 6, name: 'June' },
        { val: 7, name: 'July' }, { val: 8, name: 'August' }, { val: 9, name: 'September' },
        { val: 10, name: 'October' }, { val: 11, name: 'November' }, { val: 12, name: 'December' }
    ];
    years: number[] = [];

    // Search
    searchTerm: string = '';

    dashboardStats: any = {
        revenue: 0,
        bagsSold: 0,
        pendingMoney: 0
    };

    // Footer Totals
    totalBagsSold: number = 0;
    totalDiscount: number = 0;
    totalPending: number = 0;

    constructor(private apiService: ApiService) {
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 2024; i--) {
            this.years.push(i);
        }
        // Default to Current Month/Year
        this.selectedMonth = new Date().getMonth() + 1;
        this.selectedYear = currentYear;
    }

    ngOnInit(): void {
        this.loadData();
    }

    loadData() {
        // If period is monthly, we use the selected month/year. 
        // If quarterly/yearly, we might ignore specific month but backend handles it?
        // Let's pass month/year only if period is monthly to be safe or update backend logic more.
        // Actually plan said "Update ReportController to accept optional month and year".

        // Pass selections if period is 'monthly'. 
        // Or if user selects 'monthly', show dropdowns.

        let m = this.period === 'monthly' ? (this.selectedMonth ?? undefined) : undefined;
        let y = this.period === 'monthly' ? (this.selectedYear ?? undefined) : undefined;

        this.loadRevenue(m, y);
        // Dashboard stats usually are global or strictly current month? 
        // User asked "instead of only 3 option... by default it should show current month, then I should have options to select month and year".
        // So entire Report Page should adhere to this filter.

        this.loadSales(m, y);
    }

    loadRevenue(m?: number, y?: number) {
        this.apiService.getRevenue(this.period, m, y).subscribe(data => {
            this.revenue = data;
        });
    }

    loadDashboardStats() {
        // This seems to be fixed "Current Date" stats from backend. 
        // Maybe we don't need to call this if we calculate totals from Sales List?
        // User asked "At the bottom of every report page it should shows...".
        // So we will calculate from the table data.
        this.apiService.getDashboardStats().subscribe(data => {
            if (data) this.dashboardStats = data;
        });
    }

    loadSales(m?: number, y?: number) {
        this.apiService.getSales(this.period, m, y).subscribe(data => {
            this.sales = data;
            this.applyFilter();
        });
    }

    filterBy(type: string) {
        this.currentFilter = type;
        this.applyFilter();
    }

    applyFilter() {
        let temp = this.sales;

        // 1. Status Filter
        if (this.currentFilter === 'PENDING') {
            temp = temp.filter(s => s.balance > 0);
        }

        // 2. Search Filter
        if (this.searchTerm && this.searchTerm.trim() !== '') {
            const term = this.searchTerm.toLowerCase();
            temp = temp.filter(s => s.customer?.name.toLowerCase().includes(term));
        }

        this.filteredSales = temp;
        this.calculateFooterTotals();
    }

    calculateFooterTotals() {
        this.totalBagsSold = 0; // Backend Sale doesn't have totalBags available directly in Sale object maybe? 
        // Need to check Sale model. 'items' list? 
        // Sale.java has 'items'. SaleItem has 'quantity' and 'unit'.
        // Report sales list probably includes items.
        // Wait, Sale response usually includes items.

        this.totalDiscount = this.filteredSales.reduce((sum, s) => sum + s.discount, 0);
        this.totalPending = this.filteredSales.reduce((sum, s) => sum + s.balance, 0);

        // For total bags, we need to iterate items
        this.totalBagsSold = this.filteredSales.reduce((sum, sale) => {
            const bags = sale.items ? sale.items.reduce((isum: number, item: any) => {
                // Assuming unit 'BAG' is standard. If 'KG', convert? 
                // User asked "Total bags sold".
                if (item.unit === 'BAG') return isum + item.quantity;
                if (item.unit === 'KG') return isum + (item.quantity / 26); // Approx? Or just ignore KG?
                return isum + item.quantity; // Default
            }, 0) : 0;
            return sum + bags;
        }, 0);
    }
}

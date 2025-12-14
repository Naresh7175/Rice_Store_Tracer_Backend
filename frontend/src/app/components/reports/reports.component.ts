import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.css'
})
export class ReportsComponent {
    revenue: number | null = null;
    currentPeriod: string = '';

    constructor(private apiService: ApiService) { }

    getRevenue(period: string) {
        this.currentPeriod = period;
        this.apiService.getRevenue(period).subscribe(data => {
            this.revenue = data;
        });
    }
}

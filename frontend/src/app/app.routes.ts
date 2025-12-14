import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { CustomersComponent } from './components/customers/customers.component';
import { SalesComponent } from './components/sales/sales.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'inventory', component: InventoryComponent },
    { path: 'customers', component: CustomersComponent },
    { path: 'sales', component: SalesComponent },
    { path: 'reports', component: ReportsComponent }
];

import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { RequestsPage } from './pages/requests/requests.page';
import { ResidentDetailPage } from './pages/residents/resident-detail/resident-detail.page';
import { ResidentFormPage } from './pages/residents/resident-form/resident-form.page';
import { ResidentListPage } from './pages/residents/resident-list/resident-list.page';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPage },
  { path: 'requests', component: RequestsPage },
  { path: 'residents', component: ResidentListPage },
  { path: 'residents/new', component: ResidentFormPage },
  { path: 'residents/:residentId', component: ResidentDetailPage },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' },
];

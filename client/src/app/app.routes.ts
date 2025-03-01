import { Routes } from '@angular/router';
import { UserDetailsForm } from './user-details/user-details-form.component';
import { BillFormComponent } from './bill-form/bill-form.component';

export const routes: Routes = [
  { path: 'profile', component: UserDetailsForm },
  { path: 'create', component: BillFormComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

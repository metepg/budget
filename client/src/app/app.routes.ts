import { Routes } from '@angular/router';
import { UserDetailsForm } from './user-details/user-details-form.component';
import { BillFormComponent } from './bill-form/bill-form.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { EditBillComponent } from './edit-bill/edit-bill.component';

export const routes: Routes = [
  { path: 'profile', component: UserDetailsForm },
  {
    path: 'bills',
    children: [
      { path: 'new', component: BillFormComponent },
      { path: ':id', component: EditBillComponent },
      { path: '', component: PlaceholderComponent },
    ],
  },
  { path: 'stats', component: PlaceholderComponent },
  { path: '**', redirectTo: 'bills/new', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { UserDetailsForm } from './user-details/user-details-form.component';
import { BillFormComponent } from './bill-form/bill-form.component';
import { PlaceholderComponent } from './placeholder/placeholder.component';
import { EditBillComponent } from './edit-bill/edit-bill.component';
import { ShowBillsComponent } from './show-bills/show-bills.component';

export const routes: Routes = [
  {
    path: 'bills',
    children: [
      { path: 'new', component: BillFormComponent },
      { path: '', component: ShowBillsComponent },
      { path: ':id', component: EditBillComponent },
    ],
  },
  { path: 'stats', component: PlaceholderComponent },
  { path: 'profile', component: UserDetailsForm },
  { path: '**', redirectTo: 'bills/new', pathMatch: 'full' },
];

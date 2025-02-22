import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    InputNumber,
    FloatLabel,
  ],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails {
  userForm: FormGroup;

 constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      netIncome: [0, [Validators.required, Validators.min(1)]],
      otherIncome: [0, [Validators.required]],
      savingsGoal: [0, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted:', this.userForm.value);
    }
  }
}
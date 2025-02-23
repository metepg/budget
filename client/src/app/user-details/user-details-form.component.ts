import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumber } from 'primeng/inputnumber';
import { FloatLabel } from 'primeng/floatlabel';
import { IncomeService } from '../../services/income.service';
import { Income } from '../../models/Income';
import { User } from '../../models/User';

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
  templateUrl: './user-details-form.component.html',
  styleUrl: './user-details-form.component.css'
})
export class UserDetailsForm {
  userForm: FormGroup;

  @Input() user: User | null;
  @Output() firstLoginComplete = new EventEmitter<void>();

 constructor(private fb: FormBuilder, private incomeService: IncomeService) {
    this.userForm = this.fb.group({
      netIncome: [0, [Validators.required, Validators.min(1)]],
      otherIncome: [0, [Validators.required]],
      savingsGoal: [0, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.userForm.valid && this.user != null) {
      const newIncome: Income = {
        username: this.user.username,
        netIncome: this.userForm.get('netIncome')?.value,
        otherIncome: this.userForm.get('otherIncome')?.value
      };
      this.incomeService.saveIncome(newIncome).subscribe({
        next: (response) => {
          console.log('Income saved:', response);
          this.firstLoginComplete.emit();
        },
        error: (err) => console.error('Error saving income:', err)
      });
      console.log('Form Submitted:', this.userForm.value);
    }
  }
}
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from '../../models/Category';
import { User } from '../../models/User';
import { ConfirmationService } from 'primeng/api';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Bill } from '../../models/Bill';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { isValidDescription } from '../../utils/formValidationUtils';
import MonthlyRecordType from '../../enums/MonthlyRecordType';
import { CategoryService } from '../../services/category/category.service';
import { Card } from 'primeng/card';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
import { DatePicker } from 'primeng/datepicker';
import { Tooltip } from 'primeng/tooltip';

interface FormCategory {
  description: string;
  index: number;
}

interface TransactionTypeOption {
  label: string;
  value: MonthlyRecordType;
}

@Component({
  selector: 'app-bill-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    RadioButtonModule,
    DropdownModule,
    Button,
    Card,
    IconField,
    InputIcon,
    Select,
    FloatLabel,
    SelectButton,
    DatePicker,
    Tooltip
  ],
  templateUrl: './bill-form.component.html',
  styleUrl: './bill-form.component.scss'
})

export class BillFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  categories: Category[] = [];
  formCategories: FormCategory[] = [];
  submitButtonIsDisabled: boolean;
  user: User | null;
  transactionTypeOptions: TransactionTypeOption[];
  @Input() disabledFields: string[] = [];
  @Input() id: number | undefined;
  @Input() showDeleteBillButton = false;
  @Input() description: string;
  @Input() amount: number;
  @Input() category: number;
  @Output() formEmitter = new EventEmitter<Bill>();
  @Output() deleteBillEmitter = new EventEmitter<number>();
  billFormBuilder: FormGroup<{
    amount: FormControl<number | null>;
    category: FormControl<number | null>;
    description: FormControl<string | null>;
    date: FormControl<Date | null>;
    transactionType: FormControl<string | null>;
  }>
  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService
  ) {
    this.submitButtonIsDisabled = true;
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.formCategories = categories.sort((a, b) => a.index - b.index);
      this.billFormBuilder.get('category')?.updateValueAndValidity();
    });

    this.transactionTypeOptions = [
      { label: 'Meno', value: MonthlyRecordType.EXPENSE },
      { label: 'Tulo', value: MonthlyRecordType.INCOME }
    ];

    this.billFormBuilder = this.formBuilder.group({
      amount: new FormControl<number | null>(
        { value: this.amount, disabled: this.disabledFields.includes('amount') },
        [Validators.required, Validators.min(1)]
      ),
      transactionType: new FormControl<string | null>(
        'EXPENSE',
        [Validators.required]
      ),
      category: new FormControl<number | null>(
        { value: this.category, disabled: this.disabledFields.includes('category') },
        [Validators.required]
      ),
      description: new FormControl<string | null>(
        { value: this.description, disabled: this.disabledFields.includes('description') },
        [Validators.required, isValidDescription as ValidatorFn]
      ),
      date: new FormControl<Date | null>(
        new Date(),
        [Validators.required]
      )
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.billFormBuilder.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    this.submitButtonIsDisabled = true;
    const {amount, category, description} = this.billFormBuilder.value;
    this.user = this.localStorageService.getUser();

    if (!this.billFormBuilder.valid || !this.user || !amount || !category || !description) {
      return;
    }

    const bill = {
      amount,
      ownerName: this.user.username,
      categoryId: category,
      date: new Date(),
      type: MonthlyRecordType.EXPENSE,
      description
    }
    console.log(bill)
    this.formEmitter.emit(bill);
    this.submitButtonIsDisabled = false;
  }

  deleteBill() {
    if (!this.id) return;

    this.confirmationService.confirm({header: 'Varmistus', message: `Haluatko varmasti poistaa laskun?`,
      accept: (): void => {
        this.deleteBillEmitter.emit(this.id);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      reject: () => {},
    });
  }

  ngOnDestroy() {
    this.billFormBuilder.reset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
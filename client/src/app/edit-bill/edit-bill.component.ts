import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from '../../models/Category';
import { User } from '../../models/User';
import MonthlyRecordType from '../../enums/MonthlyRecordType';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from '../../services/category/category.service';
import { IncomeService } from '../../services/income/income.service';
import { BudgetService } from '../../services/budget/budget.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ActivatedRoute } from '@angular/router';
import { isValidDescription } from '../../utils/formValidationUtils';
import { Card } from 'primeng/card';
import { SelectButton } from 'primeng/selectbutton';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { NgIf } from '@angular/common';

interface TransactionTypeOption {
  label: string;
  value: MonthlyRecordType;
}

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  imports: [
    Card,
    SelectButton,
    DatePicker,
    FloatLabel,
    IconField,
    InputIcon,
    ReactiveFormsModule,
    InputText,
    Select,
    Checkbox,
    Button,
    Tooltip,
    NgIf
  ],
  styleUrls: ['./edit-bill.component.scss']
})

export class EditBillComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  categories: Category[] = [];
  submitButtonIsDisabled = true;
  user: User | null;
  transactionTypeOptions: TransactionTypeOption[];
  billId: number | null = null;

  billForm: FormGroup;
  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private incomeService: IncomeService,
    private messageService: MessageService,
    private budgetService: BudgetService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute
  ) {
    this.billForm = this.formBuilder.group({
      amount: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      transactionType: new FormControl<MonthlyRecordType>(MonthlyRecordType.EXPENSE, [Validators.required]),
      category: new FormControl<number | null>(null, [Validators.required]),
      description: new FormControl<string | null>('', [Validators.required, isValidDescription as ValidatorFn]),
      recurring: new FormControl<boolean>(false),
      date: new FormControl<Date | null>(new Date(), [Validators.required])
    });
  }

  ngOnInit(): void {
    this.user = this.localStorageService.getUser();

    // Get categories
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories.sort((a, b) => a.index - b.index);
    });

    // Get bill ID from route
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.billId = +id;
        this.loadBill(this.billId);
      }
    });

    this.transactionTypeOptions = [
      { label: 'Meno', value: MonthlyRecordType.EXPENSE },
      { label: 'Tulo', value: MonthlyRecordType.INCOME }
    ];
  }

  private loadBill(id: number): void {
    this.incomeService.getBill(id).subscribe(bill => {
      this.billForm.patchValue(bill);
    });
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.billForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    this.submitButtonIsDisabled = true;

    if (!this.billForm.valid || !this.user) {
      return;
    }

    const billData = {
      ...this.billForm.value,
      id: this.billId,
      username: this.user.username
    };

    this.incomeService.saveIncome([billData]).subscribe(_response => {
      this.messageService.add({ severity: 'success', summary: 'Tallennus onnistui', life: 1500 });
      this.budgetService.notifyBudgetChange();
      this.billForm.reset({
        amount: null,
        transactionType: MonthlyRecordType.EXPENSE,
        category: null,
        description: '',
        recurring: false,
        date: new Date()
      });
      this.submitButtonIsDisabled = false;
    });
  }

  deleteBill(): void {
    if (!this.billId) return;

    this.confirmationService.confirm({
      header: 'Varmistus',
      message: `Haluatko varmasti poistaa tapahtuman?`,
      acceptLabel: 'Kyllä',
      rejectLabel: 'Ei',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.incomeService.deleteBill(this.billId!).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Tapahtuma poistettu', life: 1500 });
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.billForm.reset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cancel(): void {
    window.history.back();
  }
}

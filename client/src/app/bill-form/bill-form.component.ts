import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category } from '../../models/Category';
import { User } from '../../models/User';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Bill } from '../../models/Bill';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { isValidDescription } from '../../utils/formValidationUtils';
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
import { Checkbox } from 'primeng/checkbox';
import { BillService } from '../../services/bill/bill.service';
import { BudgetService } from '../../services/budget/budget.service';
import BillType from '../../enums/BillType';
import { fixDateToFinnishTime } from '../../utils/dateUtils';

interface FormCategory {
  id?: number;
  description: string;
  index: number;
  color: string;
}

interface TransactionTypeOption {
  label: string;
  value: BillType;
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
    Tooltip,
    Checkbox
  ],
  templateUrl: './bill-form.component.html',
  styleUrl: './bill-form.component.scss'
})

export class BillFormComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  protected readonly BillType = BillType;
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
  @Input() category: Category;
  @Input() recurring: boolean;
  @Output() formEmitter = new EventEmitter<Bill>();
  @Output() deleteBillEmitter = new EventEmitter<number>();
  billFormBuilder: FormGroup<{
    amount: FormControl<number | null>;
    category: FormControl<Category | null>;
    description: FormControl<string | null>;
    date: FormControl<Date | null>;
    recurring: FormControl<boolean | null>;
    transactionType: FormControl<BillType | null>;
  }>;
  today: Date = new Date();
  private incomeCategory: FormCategory = {
    id: 999,
    description: 'Tulo',
    color: 'black',
    index: 999
  }

  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private incomeService: BillService,
    private messageService: MessageService,
    private budgetService: BudgetService,
    private localStorageService: LocalStorageService
  ) {
    this.submitButtonIsDisabled = true;
  }

  ngOnInit(): void {
    this.billFormBuilder = this.formBuilder.group({
      amount: new FormControl<number | null>(
        { value: this.amount, disabled: this.disabledFields.includes('amount') },
        [Validators.required, Validators.min(1)]
      ),
      transactionType: new FormControl<BillType | null>(
        BillType.EXPENSE,
        [Validators.required]
      ),
      category: new FormControl<Category | null>(
        { value: this.category, disabled: this.disabledFields.includes('category') },
        [Validators.required]
      ),
      description: new FormControl<string | null>(
        { value: this.description, disabled: this.disabledFields.includes('description') },
        [Validators.required, isValidDescription as ValidatorFn]
      ),
      recurring: new FormControl<boolean>(
        { value: this.recurring ?? false, disabled: this.disabledFields.includes('recurring') },
      ),
      date: new FormControl<Date | null>(
        new Date(),
        [Validators.required]
      )
    });

    this.billFormBuilder.get('transactionType')?.valueChanges.subscribe(value => {
      if (value === BillType.INCOME) {
        this.billFormBuilder.patchValue({ category: this.incomeCategory });
      }
    });

    this.categoryService.getAll().subscribe(categories => {
      this.formCategories = categories.sort((a, b) => a.index - b.index);

      // 🔹 Ensure selected category is updated after categories load
      if (this.billFormBuilder.get('category')?.value) {
        const selectedCategory = this.formCategories.find(c => c.id === this.billFormBuilder.get('category')?.value?.id);
        this.billFormBuilder.patchValue({ category: selectedCategory || null });
      }

      this.billFormBuilder.get('category')?.updateValueAndValidity();
    });

    this.transactionTypeOptions = [
      { label: 'Tulo', value: BillType.INCOME },
      { label: 'Meno', value: BillType.EXPENSE }
    ];
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.billFormBuilder.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  onSubmit(): void {
    this.submitButtonIsDisabled = true;
    const { amount, date, category, description, transactionType, recurring } = this.billFormBuilder.value;
    this.user = this.localStorageService.getUser();

    let selectedCategory: Category | undefined;

    if (transactionType === BillType.INCOME) {
      selectedCategory = this.incomeCategory;
    } else {
      selectedCategory = this.formCategories.find(c => c.id === category);
      if (!selectedCategory) return;
    }

    console.log("here")
    if (!this.billFormBuilder.valid || !this.user || !amount || !description || !transactionType || !date) {
      return;
    }

    console.log("here2")
    const bill = {
      id: null,
      amount,
      username: this.user.username,
      category: selectedCategory,
      date: fixDateToFinnishTime(date),
      type: transactionType,
      recurring: recurring!,
      description
    };

    this.incomeService.saveIncome([bill]).subscribe(_ => {
      this.messageService.add({ severity: 'success', summary: 'Tallennus onnistui', life: 1500 });
      this.budgetService.notifyBudgetChange();
      this.billFormBuilder.reset({
        amount: null,
        transactionType: BillType.EXPENSE,
        category: null,
        description: '',
        recurring: false,
        date: new Date()
      });
      this.submitButtonIsDisabled = false;
    });
  }

  deleteBill() {
    if (!this.id) return;

    this.confirmationService.confirm({
      header: 'Varmistus', message: `Haluatko varmasti poistaa laskun?`,
      accept: (): void => {
        this.deleteBillEmitter.emit(this.id);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      reject: () => {
      },
    });
  }

  ngOnDestroy() {
    this.billFormBuilder.reset();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
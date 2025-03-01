import { User } from '../../models/User';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MonthlyRecord } from '../../models/MonthlyRecord';
import { TabPanel, TabView } from 'primeng/tabview';
import { EntryFormComponent } from './form/entry.form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IncomeService } from '../../services/income/income.service';
import { CategoriesComponent } from './categories/categories.component';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category/category.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import MonthlyRecordType from '../../enums/MonthlyRecordType';

@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details-form.component.html',
  imports: [
    TabView,
    TabPanel,
    EntryFormComponent,
    CategoriesComponent
  ],
})

export class UserDetailsForm implements OnInit {
  @ViewChild('incomeForm') incomeForm!: EntryFormComponent;
  @ViewChild('expenseForm') expenseForm!: EntryFormComponent;
  @ViewChild('categoryForm') categoryForm!: CategoriesComponent;
  @Output() firstLoginComplete = new EventEmitter();

  private previousTabIndex: number = 0;
  activeTabIndex = 0;
  user: User;
  records: MonthlyRecord[] = [];
  categories: Category[] = [];

  get incomes(): MonthlyRecord[] {
    return this.records
      ?.filter(entry => entry.type === MonthlyRecordType.INCOME)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)) || [];
  }

  get expenses(): MonthlyRecord[] {
    return this.records
      ?.filter(entry => entry.type === MonthlyRecordType.EXPENSE)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)) || [];
  }

  constructor(private incomeService: IncomeService,
              private messageService: MessageService,
              private categoryService: CategoryService,
              private localStorageService: LocalStorageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
    const storedUser = this.localStorageService.getUser();
    if (!storedUser) return;

    this.user = storedUser
    this.incomeService.getAll(this.user.username).subscribe(records => {
      this.records = records;
    });
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  updateEntries(updatedEntries: MonthlyRecord[], type: MonthlyRecordType) {
    this.incomeService.saveIncome(updatedEntries).subscribe(response => {
      this.records = this.records.filter(entry => entry.type !== type);
      this.records = [...this.records, ...response];
      this.messageService.add({ severity: 'success', summary: 'Tallennus onnistui', life: 1500 });
    });
  }

  updateCategories(categories: Category[]) {
    this.categories = categories;
  }

  saveCategories(categories: Category[]) {
    this.categoryService.saveCategories(categories).subscribe(response => {
      this.categories = response;
      this.messageService.add({ severity: 'success', summary: 'Tallennus onnistui', life: 1500 });
    });
  }

  confirmTabChange(index: number) {
    const forms = [this.incomeForm, this.expenseForm, this.categoryForm];
    const currentForm = forms[this.previousTabIndex];

    // Store the current tab index before any changes
    const previousIndex = this.activeTabIndex;
    this.previousTabIndex = previousIndex; // Save last tab

    if (currentForm.isDirty) {
      this.activeTabIndex = previousIndex;

      this.confirmationService.confirm({
        message: 'Sinulla oli tallentamattomia muutoksia. Haluatko tallentaa tekemäsi muutokset?',
        header: 'Vahvista',
        acceptLabel: 'Kyllä',
        rejectLabel: 'Ei',
        closable: false,
        closeOnEscape: false,
        icon: 'pi pi-exclamation-circle',
        accept: () => {
          currentForm.save();
          this.activeTabIndex = index;
        },
        reject: () => {
          if (currentForm instanceof CategoriesComponent) {
            currentForm.categories = [...currentForm.originalCategories];
          } else {
            this.records = [...this.incomes, ...this.expenses];
            currentForm.populateForm();
          }
        },
      });
    } else {
      this.activeTabIndex = index;
    }
  }

  protected readonly MonthlyRecordType = MonthlyRecordType;
}

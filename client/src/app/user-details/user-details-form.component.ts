import { User } from '../../models/User';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Bill } from '../../models/Bill';
import { TabPanel, TabView } from 'primeng/tabview';
import { EntryFormComponent } from './form/entry.form.component';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { BillService } from '../../services/bill/bill.service';
import { CategoriesComponent } from './categories/categories.component';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category/category.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import BillType from '../../enums/BillType';
import { BudgetService } from '../../services/budget/budget.service';
import { FormsModule } from '@angular/forms';
import { BudgetComponent } from '../budget/budget.component';

@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details-form.component.html',
  imports: [
    TabView,
    TabPanel,
    EntryFormComponent,
    CategoriesComponent,
    PrimeTemplate,
    FormsModule,
    BudgetComponent
  ],
})

export class UserDetailsForm implements OnInit {
  @ViewChild('incomeForm') incomeForm!: EntryFormComponent;
  @ViewChild('expenseForm') expenseForm!: EntryFormComponent;
  @ViewChild('categoryForm') categoryForm!: CategoriesComponent;
  @Output() firstLoginComplete = new EventEmitter();

  protected readonly BillType = BillType;
  activeTabIndex = 0;
  user: User;
  records: Bill[] = [];
  categories: Category[] = [];

  get incomes(): Bill[] {
    return this.records
      ?.filter(entry => entry.type === BillType.INCOME)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)) || [];
  }

  get expenses(): Bill[] {
    return this.records
      ?.filter(entry => entry.type === BillType.EXPENSE)
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)) || [];
  }

  constructor(private incomeService: BillService,
              private messageService: MessageService,
              private categoryService: CategoryService,
              private budgetService: BudgetService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    const storedUser = this.localStorageService.getUser();
    if (!storedUser) return;

    this.user = storedUser;
    this.incomeService.getAllRecurring().subscribe(records => {
      this.records = records;
    });
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  removeEntry(entry: Bill) {
    this.incomeService.removeIncome(entry).subscribe(_e => {
      this.records = this.records.filter(e => e.id !== entry.id);
      this.messageService.add({ severity: 'success', summary: 'Poistaminen onnistui', life: 1500 });
      this.budgetService.notifyBudgetChange();
    });
  }

  updateEntries(updatedEntries: Bill[], type: BillType) {
    this.incomeService.saveIncome(updatedEntries).subscribe(response => {
      this.records = this.records.filter(entry => entry.type !== type);
      this.records = [...this.records, ...response];
      this.messageService.add({ severity: 'success', summary: 'Tallennus onnistui', life: 1500 });
      this.budgetService.notifyBudgetChange();
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

}

import { Component, OnInit } from '@angular/core';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { BudgetService } from '../../services/budget/budget.service';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  imports: [Select, FormsModule]
})

export class BudgetComponent implements OnInit {
  budgetOptions = [
    { label: 'Päivä', value: 'day' },
    { label: 'Viikko', value: 'week' },
    { label: 'Kuukausi', value: 'month' }
  ];

  selectedBudget: string | null = null;

  constructor(private budgetService: BudgetService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.selectedBudget = this.localStorageService.getSelectedBudget() ?? 'week';
  }

  onBudgetChange(newBudget: string) {
    console.log("hepl")
    this.selectedBudget = newBudget;
    this.saveSelection();
  }

  saveSelection() {
    if (this.selectedBudget) {
      this.budgetService.setBudgetType(this.selectedBudget);
    }
  }
}

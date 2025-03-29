import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Category } from '../../models/Category';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  }

  getSelectedMonth(): number | null {
    const selectedMonth = localStorage.getItem('selectedMonth');
    return selectedMonth ? JSON.parse(selectedMonth) : null;
  }

  setSelectedMonth(month: number) {
    localStorage.setItem('selectedMonth', JSON.stringify(month));
  }

  setCategories(categories: Category[]) {
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  getCategories(): Category[] | null {
    const categoriesFromStorage = localStorage.getItem('categories');
    return categoriesFromStorage ? JSON.parse(categoriesFromStorage) : null;
  }

  setSelectedBudget(budgetType: string) {
    localStorage.setItem('selectedBudget', budgetType);
  }

  getSelectedBudget(): string | null {
    return localStorage.getItem('selectedBudget');
  }
}

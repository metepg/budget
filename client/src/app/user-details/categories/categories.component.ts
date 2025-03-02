import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { OrderList } from 'primeng/orderlist';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Category } from '../../../models/Category';
import { Tooltip } from 'primeng/tooltip';
import { deepEqual } from '../../../utils/utils';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  imports: [
    OrderList,
    FormsModule,
    PrimeTemplate,
    InputText,
    Button,
    Tooltip
  ],
})

export class CategoriesComponent implements OnInit, OnChanges {
  @Input() categories: Category[] = [];
  @Output() updateCategories = new EventEmitter<Category[]>();
  @Output() saveCategories = new EventEmitter<Category[]>();

  originalCategories: Category[];

  ngOnInit() {
    if (this.categories.length === 0) {
      this.addCategory();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] && changes['categories'].currentValue) {
      this.originalCategories = JSON.parse(JSON.stringify(this.categories));
    }
  }

  addCategory() {
    this.categories = [...this.categories, { index: this.categories.length, description: '', id: undefined }];
  }

  onCategoriesReorder(event: any) {
    const { dragIndex, dropIndex } = event;
    if (dragIndex !== dropIndex) {
      const movedItem = this.categories.splice(dragIndex, 1)[0];
      this.categories.splice(dropIndex, 0, movedItem);
      this.updateCategories.emit([...this.categories]);
    }
  }

  removeCategory(index: number) {
    const currentCategory = this.categories[index];
    if (currentCategory.description === '') {
      this.categories = this.categories.filter((_, i) => i !== index);
      return;
    }
    const isOk = confirm(`Poistetaanko '${currentCategory.description}'?`);
    if (!isOk) return;

    this.categories = this.categories.filter((_, i) => i !== index);
    this.updateCategories.emit([...this.categories]);
  }

  save() {
    this.saveCategories.emit(this.categories);
  }

  get isDirty(): boolean {
    return !deepEqual(this.originalCategories, this.categories);
  }
}
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Category } from '../models/Category';

export function isValidCategory(control: AbstractControl, categories: Category[]): ValidationErrors | null {
  return Object.values(categories).includes(control.value) ? null : { invalidCategory: true };
}

export function isValidDescription(control: AbstractControl): ValidationErrors | null {
  return isNonEmptyString(control.value) && control.value.length > 2 ? null : { invalidDescription: true };
}

function isNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim() !== '';
}

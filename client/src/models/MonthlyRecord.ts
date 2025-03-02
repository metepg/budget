import MonthlyRecordType from '../enums/MonthlyRecordType';
import { Category } from './Category';

export interface MonthlyRecord {
  id: number | null;
  date: Date;
  category: Category;
  username: string;
  type: MonthlyRecordType;
  description: string;
  amount: number;
  recurring: boolean;
  recordedAt?: string;
}

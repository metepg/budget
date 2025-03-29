import BillType from '../enums/BillType';
import { Category } from './Category';

export interface Bill {
  id: number | null;
  date: Date;
  category: Category;
  username: string;
  type: BillType;
  description: string;
  amount: number;
  recurring: boolean;
  recordedAt?: string;
}

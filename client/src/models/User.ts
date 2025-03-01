import { MonthlyRecord } from './MonthlyRecord';

export interface User {
  enabled: boolean;
  income: MonthlyRecord[];
  username: string;
}
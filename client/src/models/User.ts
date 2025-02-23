import { Income } from './Income';

export interface User {
  enabled: boolean;
  income: Income;
  username: string;
}
import { Bill } from './Bill';

export interface User {
  enabled: boolean;
  income: Bill[];
  username: string;
}
import MonthlyRecordType from '../enums/MonthlyRecordType';

export interface MonthlyRecord {
  id: number | null;
  username: string;
  type: MonthlyRecordType;
  description: string;
  amount: number;
  recurring: boolean;
  recordedAt?: string;
}

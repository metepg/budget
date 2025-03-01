import MonthlyRecordType from '../enums/MonthlyRecordType';

export interface Bill {
  id?: number;
  amount?: number;
  categoryId: number;
  date: Date;
  type: MonthlyRecordType;
  description: string;
  ownerName: string
}

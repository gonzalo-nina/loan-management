export interface Loan {
  id: string;
  name: string;
  amount: number;
  installments: number;
  installmentAmount: number;
  startDate: string;
  description?: string;
}

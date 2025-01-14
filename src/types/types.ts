// src/types/types.ts
export interface Loan {
  id: string;
  name: string;
  amount: number;
  installments: number;
  installmentAmount: number;
  startDate: string;
  description?: string;
  installmentsData?: InstallmentData[];
  paidInstallments: number[];
}

export interface InstallmentData {
  number: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

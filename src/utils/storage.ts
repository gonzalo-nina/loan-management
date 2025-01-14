import { Loan, InstallmentData } from '../types/types';

export const StorageKeys = {
  LOANS: 'loans_data'
};

export const saveLoans = (loans: Loan[]): void => {
  localStorage.setItem(StorageKeys.LOANS, JSON.stringify(loans));
};

export const loadLoans = (): Loan[] => {
  const data = localStorage.getItem(StorageKeys.LOANS);
  return data ? JSON.parse(data) : [];
};

export const updateLoanInstallments = (loanId: string, installments: InstallmentData[]): void => {
  const loans = loadLoans();
  const updatedLoans = loans.map(loan => 
    loan.id === loanId 
      ? { ...loan, installmentsData: installments }
      : loan
  );
  saveLoans(updatedLoans);
};

export const getLoanInstallments = (loanId: string): InstallmentData[] | undefined => {
  const loans = loadLoans();
  const loan = loans.find(loan => loan.id === loanId);
  return loan?.installmentsData;
};
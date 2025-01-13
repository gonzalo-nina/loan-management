import { Loan } from '../types/types';

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
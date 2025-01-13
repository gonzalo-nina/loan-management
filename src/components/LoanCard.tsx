import React from 'react';
import styled from 'styled-components';
import { Loan } from '../types/types';

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin: 10px;
  width: 300px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &.edit {
    background: #ffc107;
    color: #000;
  }

  &.delete {
    background: #dc3545;
    color: #fff;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin: 10px 0;
  font-style: italic;
`;

interface LoanCardProps {
    loan: Loan;
    onEdit: (loan: Loan) => void;
    onDelete: (id: string) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onEdit, onDelete }) => {
    return (
        <Card>
            <ButtonGroup>
                <ActionButton 
                    className="edit"
                    onClick={() => onEdit(loan)}
                >
                    Editar
                </ActionButton>
                <ActionButton 
                    className="delete"
                    onClick={() => onDelete(loan.id)}
                >
                    Eliminar
                </ActionButton>
            </ButtonGroup>

            <h3>{loan.name}</h3>
            {loan.description && (
                <Description>{loan.description}</Description>
            )}
            <p>Monto: ${loan.amount}</p>
            <p>Cuotas: {loan.installments}</p>
            <p>Monto por cuota: ${loan.installmentAmount}</p>
            <p>Fecha de inicio: {new Date(loan.startDate).toLocaleDateString()}</p>
        </Card>
    );
};
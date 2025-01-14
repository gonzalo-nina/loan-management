import React, { useState } from 'react';
import styled from 'styled-components';
import { Loan } from '../types/types';
import { LoanDashboard } from './LoanDashboard';

const Card = styled.div`
  background: linear-gradient(145deg, #2a3245, #1e2432);
  padding: 25px;
  border-radius: 12px;
  position: relative;
  transition: transform 0.2s ease;
  width: 100%;
  color: #fff;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    color: #64ffda;
    font-size: 1.5rem;
    margin: 0 0 15px 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
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
  color: #8892b0;
  margin: 10px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Amount = styled.p`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 15px 0;
  background: linear-gradient(90deg, #64ffda, #34ffe9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
  
  p {
    color: #8892b0;
    margin: 5px 0;
  }
`;

interface LoanCardProps {
    loan: Loan;
    onEdit: (loan: Loan) => void;
    onDelete: (id: string) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onEdit, onDelete }) => {
    const [showDashboard, setShowDashboard] = useState(false);

    return (
        <>
            <Card>
                <h3>{loan.name}</h3>
                
                {loan.description && (
                    <Description>{loan.description}</Description>
                )}
                
                <Amount>S/. {loan.amount.toFixed(2)}</Amount>
                
                <InfoGrid>
                    <p>Cuotas: {loan.installments}</p>
                    <p>Cuota mensual: S/. {loan.installmentAmount.toFixed(2)}</p>
                    <p>Fecha inicio: {new Date(loan.startDate).toLocaleDateString()}</p>
                </InfoGrid>

                <ButtonGroup>
                    <ActionButton 
                        className="edit"
                        onClick={() => onEdit(loan)}
                    >
                        ✏ Editar
                    </ActionButton>
                    <ActionButton 
                        className="delete"
                        onClick={() => onDelete(loan.id)}
                    >
                        🗑 Eliminar
                    </ActionButton>
                    <ActionButton 
                        className="primary"
                        onClick={() => setShowDashboard(true)}
                    >
                        👁 Ver Detalles
                    </ActionButton>
                </ButtonGroup>
            </Card>

            {showDashboard && (
                <LoanDashboard
                    loan={loan}
                    onClose={() => setShowDashboard(false)}
                    onInstallmentUpdate={(loanId, installments) => {
                        // Implementar lógica de actualización
                        console.log('Actualizando cuotas:', loanId, installments);
                    }}
                />
            )}
        </>
    );
};
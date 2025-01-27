import React, { useState } from 'react';
import styled from 'styled-components';
import { Loan } from '../types/types';
import { LoanDashboard } from './LoanDashboard';

const Card = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h3`
  color: #2d3748;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  p {
    color: #4a5568;
    font-size: 1rem;
    margin: 0.3rem 0;

    strong {
      color: #3182ce;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.primary {
    background: #ebf8ff;
    color: #3182ce;
    border: 1px solid #90cdf4;
    
    &:hover {
      background: #bee3f8;
      transform: translateY(-1px);
    }
  }
  
  &.edit {
    background: #e6fffa;
    color: #38b2ac;
    border: 1px solid #81e6d9;
    
    &:hover {
      background: #b2f5ea;
      transform: translateY(-1px);
    }
  }
  
  &.delete {
    background: #fff5f5;
    color: #e53e3e;
    border: 1px solid #feb2b2;
    
    &:hover {
      background: #fed7d7;
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

const ProgressBar = styled.div`
  background: #edf2f7;
  border-radius: 9999px;
  height: 8px;
  margin: 1rem 0;
  overflow: hidden;

  div {
    background: linear-gradient(90deg, #4299e1, #63b3ed);
    height: 100%;
    transition: width 0.3s ease;
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
                <Title>{loan.name}</Title>
                
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
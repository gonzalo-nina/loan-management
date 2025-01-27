// src/components/LoanDashboard.tsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Loan } from '../types/types';
import { getLoanInstallments, updateLoanInstallments, saveLoans, loadLoans } from '../utils/storage';

// Add this helper function at the top of the file, before the styled components
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).replace(/\//g, ' / ');
};

const DashboardOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const DashboardContainer = styled.div`
  background: #1a1f2e;
  width: 95vw;
  height: 90vh;
  border-radius: 16px;
  overflow: auto;
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 20px;
  padding: 30px;
  color: #fff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const MainSection = styled.div`
  padding-right: 20px;
`;

const SideSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  height: fit-content;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(145deg, #2a3245, #1e2432);
  padding: 20px;
  border-radius: 12px;
  text-align: left;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 0.9rem;
    color: #64ffda;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    font-size: 1.6rem;
    margin: 0;
    font-weight: 600;
    background: linear-gradient(90deg, #64ffda, #34ffe9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  font-size: 0.9rem;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    background: rgba(100, 255, 218, 0.1);
    color: #64ffda;
    font-weight: 500;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  td {
    color: #fff;
  }

  tr:hover td {
    background: rgba(255, 255, 255, 0.05);
  }

  th:nth-child(1), td:nth-child(1) { width: 8%; }
  th:nth-child(2), td:nth-child(2) { width: 15%; }
  th:nth-child(3), td:nth-child(3) { width: 15%; }
  th:nth-child(4), td:nth-child(4) { width: 15%; }
  th:nth-child(5), td:nth-child(5) { width: 20%; }
`;

interface ActionButtonProps {
    isPaid?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  background: transparent;
  color: #64ffda;
  border: 1px solid #64ffda;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: translateY(-1px);
  }

  ${props => props.isPaid && `
    background: rgba(100, 255, 218, 0.1);
    border-color: #64ffda;
  `}
`;

const StatCard = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);

  h4 {
    color: #64ffda;
    margin: 0 0 10px 0;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    font-size: 1.2rem;
    color: white;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #64ffda;
  border: 1px solid #64ffda;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: translateY(-2px);
  }
`;

interface InstallmentData {
    number: number;
    dueDate: string;
    amount: number;
    isPaid: boolean;
}

interface Props {
    loan: Loan;
    onClose: () => void;
    onInstallmentUpdate: (loanId: string, installments: InstallmentData[]) => void;
}

export const LoanDashboard: React.FC<Props> = ({ loan, onClose, onInstallmentUpdate }) => {
    const [installments, setInstallments] = useState<InstallmentData[]>([]);

    useEffect(() => {
      // First try to get saved installments
      const savedInstallments = getLoanInstallments(loan.id);
      
      if (savedInstallments) {
          // Use saved installments if they exist
          setInstallments(savedInstallments);
      } else {
          // Initialize new installments with paid status from loan.paidInstallments
          const initialInstallments = Array.from({ length: loan.installments }, (_, index) => ({
              number: index + 1,
              dueDate: new Date(new Date(loan.startDate).setMonth(new Date(loan.startDate).getMonth() + index)).toISOString().split('T')[0],
              amount: loan.installmentAmount,
              isPaid: loan.paidInstallments?.includes(index + 1) || false
          }));
          setInstallments(initialInstallments);
          // Save initial installments
          updateLoanInstallments(loan.id, initialInstallments);
      }
  }, [loan]);

    const totalPaid = installments.filter(i => i.isPaid).length * loan.installmentAmount;
    const remainingInstallments = loan.installments - installments.filter(i => i.isPaid).length;
    const remainingTotal = remainingInstallments * loan.installmentAmount;

    const handleInstallmentToggle = (index: number) => {
      const newInstallments = installments.map((inst, i) => 
          i === index ? { ...inst, isPaid: !inst.isPaid } : inst
      );
      setInstallments(newInstallments);
      
      // Update in storage
      updateLoanInstallments(loan.id, newInstallments);
      
      // Update parent component
      onInstallmentUpdate(loan.id, newInstallments);
      
      // Update paidInstallments in loan
      const paidNumbers = newInstallments
          .filter(inst => inst.isPaid)
          .map(inst => inst.number);
          
      const updatedLoans = loadLoans().map(l => 
          l.id === loan.id 
              ? { ...l, paidInstallments: paidNumbers }
              : l
      );
      
      saveLoans(updatedLoans);
  };

    return (
        <DashboardOverlay onClick={onClose}>
            <DashboardContainer onClick={e => e.stopPropagation()}>
                <MainSection>
                    <BackButton onClick={onClose}>← Volver</BackButton>
                    <h2>Detalles del Préstamo: {loan.name}</h2>
                    <SummarySection>
                        <SummaryCard>
                            <h3>Cuotas Restantes</h3>
                            <p>{remainingInstallments} de {loan.installments}</p>
                        </SummaryCard>
                        <SummaryCard>
                            <h3>Total Acumulado Restante</h3>
                            <p>S/. {remainingTotal.toFixed(2)}</p>
                        </SummaryCard>
                    </SummarySection>
                    <Table>
                        <thead>
                            <tr>
                                <th>Cuota #</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {installments.map((installment, index) => (
                                <tr key={index}>
                                    <td>{installment.number}</td>
                                    <td>{formatDate(installment.dueDate)}</td>
                                    <td>S/. {installment.amount.toFixed(2)}</td>
                                    <td style={{
                                        color: installment.isPaid ? '#27ae60' : '#e74c3c',
                                        fontWeight: 'bold'
                                    }}>
                                        {installment.isPaid ? 'Pagada' : 'Pendiente'}
                                    </td>
                                    <td>
                                        <ActionButton
                                            isPaid={installment.isPaid}
                                            onClick={() => handleInstallmentToggle(index)}
                                        >
                                            {installment.isPaid ? '↺ Desmarcar' : '✓ Marcar como pagada'}
                                        </ActionButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </MainSection>

                <SideSection>
                    <StatCard>
                        <h4>Progreso de Pago</h4>
                        <p>{Math.round((totalPaid / loan.amount) * 100)}%</p>
                    </StatCard>
                    <StatCard>
                        <h4>Total Pagado</h4>
                        <p>S/. {totalPaid.toFixed(2)}</p>
                    </StatCard>
                    <StatCard>
                        <h4>Cuota Mensual</h4>
                        <p>S/. {loan.installmentAmount.toFixed(2)}</p>
                    </StatCard>
                    <StatCard>
                        <h4>Monto Total</h4>
                        <p>S/. {loan.amount.toFixed(2)}</p>
                    </StatCard>
                </SideSection>
            </DashboardContainer>
        </DashboardOverlay>
    );
};
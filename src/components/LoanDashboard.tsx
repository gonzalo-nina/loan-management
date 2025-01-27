// src/components/LoanDashboard.tsx
import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Loan } from '../types/types';
import { getLoanInstallments, updateLoanInstallments, saveLoans, loadLoans } from '../utils/storage';
import { device } from '../utils/breakpoints';

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
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const DashboardContainer = styled.div`
  background: #f5f7fa;
  width: 95vw;
  height: 90vh;
  border-radius: 16px;
  overflow: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 15px;
  color: #2d3748;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  ${device.tablet} {
    grid-template-columns: 70% 30%;
    padding: 30px;
  }
`;

const MainSection = styled.div`
  padding-right: 20px;
`;

const SideSection = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const SummaryCard = styled.div`
  background: linear-gradient(145deg, #ebf8ff, #ffffff);
  border: 1px solid #bee3f8;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0.5rem;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #2c5282;
    margin-bottom: 0.5rem;
  }

  p {
    color: #3182ce;
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  overflow-x: auto;
  display: block;
  font-size: 14px;

  ${device.tablet} {
    display: table;
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  th {
    background: #e6f0ff;
    color: #4a5568;
    font-weight: 500;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  td {
    color: #2d3748;
  }

  tr:hover td {
    background: #f8fafc;
  }

  th:nth-child(1), td:nth-child(1) { width: 8%; }
  th:nth-child(2), td:nth-child(2) { width: 15%; }
  th:nth-child(3), td:nth-child(3) { width: 15%; }
  th:nth-child(4), td:nth-child(4) { width: 15%; }
  th:nth-child(5), td:nth-child(5) { width: 20%; }

  tbody tr:nth-child(even) {
    background: #f8fafc;
  }
`;

interface ActionButtonProps {
    isPaid?: boolean;
}

const ActionButton = styled.button<{ isPaid: boolean }>`
  background: ${props => props.isPaid ? '#ebfaf0' : '#ebf8ff'};
  color: ${props => props.isPaid ? '#38a169' : '#3182ce'};
  border: 1px solid ${props => props.isPaid ? '#9ae6b4' : '#90cdf4'};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.isPaid ? '#c6f6d5' : '#bee3f8'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f0f7ff);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  h4 {
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  p {
    color: #3182ce;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

// Add this new styled component
const StaticStatCard = styled(StatCard)`
  background: linear-gradient(145deg, #ffffff, #f0ffff);
  border: 1px solid #bee3f8;
  
  p {
    color: #2c5282;
  }

  &:hover {
    background: linear-gradient(145deg, #ffffff, #e6fffa);
  }
`;

const BackButton = styled.button`
  background: #e6fffa;
  color: #38b2ac;
  border: 1px solid #38b2ac;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: #b2f5ea;
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

    // In the component, add this calculation near other calculations
    const totalToReceive = loan.installmentAmount * loan.installments;

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
                    <h2 style={{marginBottom: '15px' }} >Detalles del Préstamo: {loan.name}</h2>
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
                                        color: installment.isPaid ? '#38a169' : '#e53e3e',
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
                    <h3 style={{ color: '#4a5568', marginBottom: '20px' }}>Información Dinámica</h3>
                    <StatCard>
                        <h4>Progreso de Pago</h4>
                        <p>{Math.round((totalPaid / loan.amount) * 100)}%</p>
                    </StatCard>
                    <StatCard>
                        <h4>Total Pagado</h4>
                        <p>S/. {totalPaid.toFixed(2)}</p>
                    </StatCard>

                    <h3 style={{ color: '#4a5568', margin: '30px 0 20px' }}>Información del Préstamo</h3>
                    <StaticStatCard>
                        <h4>Total a Recibir</h4>
                        <p>S/. {totalToReceive.toFixed(2)}</p>
                    </StaticStatCard>
                    <StaticStatCard>
                        <h4>Cuota Mensual</h4>
                        <p>S/. {loan.installmentAmount.toFixed(2)}</p>
                    </StaticStatCard>
                    <StaticStatCard>
                        <h4>Monto Prestado</h4>
                        <p>S/. {loan.amount.toFixed(2)}</p>
                    </StaticStatCard>
                    <StaticStatCard>
                        <h4>Ganancia Total</h4>
                        <p>S/. {(totalToReceive - loan.amount).toFixed(2)}</p>
                    </StaticStatCard>
                </SideSection>
            </DashboardContainer>
        </DashboardOverlay>
    );
};
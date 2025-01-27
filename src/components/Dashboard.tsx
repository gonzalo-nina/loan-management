import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { LoanCard } from './LoanCard';
import { AddLoanModal } from './AddLoanCard';
import { v4 as uuidv4 } from 'uuid';
import { Loan } from '../types/types';
import { saveLoans, loadLoans } from '../utils/storage';
import { InstallmentData } from '../types/types'; // Add this line to import InstallmentData
import { LoanDashboard } from './LoanDashboard';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: #f5f7fa;
    overflow-x: hidden;
  }
`;

const DashboardWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
`;

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h1 {
    color: #2d3748;
    font-size: 2rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  background: #ebf8ff;
  color: #3182ce;
  border: 1px solid #90cdf4;
  
  &:hover {
    background: #bee3f8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const StyledLoanCard = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #2d3748;
    margin: 0 0 15px 0;
  }

  .amount {
    font-size: 1.4rem;
    font-weight: bold;
    margin: 10px 0;
    color: #3182ce;
  }

  .details {
    margin: 15px 0;
    color: #4a5568;
  }

  ${ActionButtons} {
    margin-top: 1rem;
    
    ${Button} {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }
  }
`;

export const Dashboard: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [loanToEdit, setLoanToEdit] = useState<Loan | null>(null);
    const [showLoanDashboard, setShowLoanDashboard] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedLoans = loadLoans();
        setLoans(savedLoans);
    }, []);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedLoans = JSON.parse(e.target?.result as string);
                if (Array.isArray(importedLoans)) {
                    const validatedLoans = importedLoans.map(loan => ({
                        ...loan,
                        paidInstallments: Array.isArray(loan.paidInstallments) ? loan.paidInstallments : []
                    }));
                    setLoans(validatedLoans);
                    saveLoans(validatedLoans);
                    alert('Datos importados correctamente');
                }
            } catch (error) {
                alert('Error al importar los datos.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const handleDownload = async () => {
        const dataToExport = loans.map(loan => ({
            ...loan,
            paidInstallments: loan.installmentsData 
                ? loan.installmentsData
                    .map((inst, index) => inst.isPaid ? index + 1 : null)
                    .filter(num => num !== null)
                : []
        }));
    
        try {
            // Configure save dialog
            const opts = {
                suggestedName: 'prestamoData.json',
                types: [{
                    description: 'JSON File',
                    accept: { 'application/json': ['.json'] }
                }],
            };
    
            // Get file handle
            const handle = await (window as any).showSaveFilePicker(opts);
            
            // Create writable stream
            const writable = await handle.createWritable();
            
            // Write the file
            await writable.write(JSON.stringify(dataToExport, null, 2));
            await writable.close();
        } catch (err) {
            // Fallback for browsers that don't support FileSystem API
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'prestamoData.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    };

    const handleAddLoan = (newLoan: Omit<Loan, 'id'>) => {
        const loanWithId = {
            ...newLoan,
            id: uuidv4(),
            name: newLoan.name || `Prestamo ${generateRandomCode()}`
        };

        const updatedLoans = [...loans, loanWithId];
        setLoans(updatedLoans);
        saveLoans(updatedLoans);
    };

    const handleUpdateLoan = (updatedLoan: Loan) => {
        const newLoans = loans.map(l => l.id === updatedLoan.id ? updatedLoan : l);
        setLoans(newLoans);
        saveLoans(newLoans);
    };

    const handleEditLoan = (loan: Loan) => {
        setLoanToEdit(loan);
        setShowModal(true);
    };

    const handleDeleteLoan = (id: string) => {
        const updatedLoans = loans.filter(loan => loan.id !== id);
        setLoans(updatedLoans);
        saveLoans(updatedLoans);
    };

    const handleInstallmentUpdate = (loanId: string, installmentsData: InstallmentData[]) => {
        const updatedLoans = loans.map(loan =>
            loan.id === loanId
                ? { ...loan, installmentsData }
                : loan
        );
        setLoans(updatedLoans);
        saveLoans(updatedLoans);
    };

    const handleViewDetails = (loan: Loan) => {
        setSelectedLoan(loan);
        setShowLoanDashboard(true);
    };

    return (
        <>
            <GlobalStyle />
            <DashboardWrapper>
                <DashboardContainer>
                    <Header>
                        <h1>Gestión de Préstamos</h1>
                        <ActionButtons>
                            <Button onClick={() => setShowModal(true)}>
                                + Nuevo Préstamo
                            </Button>
                            <Button onClick={handleDownload}>
                                ⬆ Exportar Datos
                            </Button>
                            <Button onClick={() => fileInputRef.current?.click()}>
                            ⬇ Cargar Datos
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                                accept=".txt,.json"
                            />
                        </ActionButtons>
                    </Header>

                    <LoansGrid>
                        {loans.map((loan) => (
                            <StyledLoanCard key={loan.id}>
                                <h3>{loan.name}</h3>
                                <div className="amount">
                                    S/. {loan.amount.toFixed(2)}
                                </div>
                                <div className="details">
                                    <p>Cuotas: {loan.installments}</p>
                                    <p>Cuota Mensual: S/. {loan.installmentAmount.toFixed(2)}</p>
                                </div>
                                <ActionButtons>
                                    <Button onClick={() => handleEditLoan(loan)}>
                                        ✏ Editar
                                    </Button>
                                    <Button onClick={() => handleDeleteLoan(loan.id)}>
                                        🗑 Eliminar
                                    </Button>
                                    <Button onClick={() => handleViewDetails(loan)}>
                                        👁 Detalles
                                    </Button>
                                </ActionButtons>
                            </StyledLoanCard>
                        ))}
                    </LoansGrid>

                    {showModal && (
                        <AddLoanModal
                            onAdd={handleAddLoan}
                            onUpdate={handleUpdateLoan}
                            editingLoan={loanToEdit}
                            onClose={() => {
                                setShowModal(false);
                                setLoanToEdit(null);
                            }}
                        />
                    )}

                    {showLoanDashboard && selectedLoan && (
                        <LoanDashboard
                            loan={selectedLoan}
                            onClose={() => setShowLoanDashboard(false)}
                            onInstallmentUpdate={(loanId, installments) => {
                                const updatedLoans = loans.map(loan => 
                                    loan.id === loanId 
                                        ? { ...loan, installmentsData: installments }
                                        : loan
                                );
                                setLoans(updatedLoans);
                                saveLoans(updatedLoans);
                            }}
                        />
                    )}
                </DashboardContainer>
            </DashboardWrapper>
        </>
    );
};
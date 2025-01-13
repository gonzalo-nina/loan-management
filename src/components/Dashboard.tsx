import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LoanCard } from './LoanCard';
import { AddLoanModal } from './AddLoanCard';
import { v4 as uuidv4 } from 'uuid';
import { Loan } from '../types/types';
import { saveLoans, loadLoans } from '../utils/storage';

const Container = styled.div`
  padding: 20px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const FileControls = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

export const Dashboard: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedLoans = loadLoans();
        setLoans(savedLoans);
    }, []);
    

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const parsedLoans = JSON.parse(content);
                    setLoans(parsedLoans);
                    saveLoans(parsedLoans);
                } catch (error) {
                    alert('Error al leer el archivo');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDownload = () => {
        const data = JSON.stringify(loans, null, 2);
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'prestamos.txt');
        document.body.appendChild(link);
        link.click();
        link.remove();
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

    const handleEditLoan = (loan: Loan) => {
        setShowModal(true);
        // TODO: Implement edit functionality
    };

    const handleDeleteLoan = (id: string) => {
        const updatedLoans = loans.filter(loan => loan.id !== id);
        setLoans(updatedLoans);
        saveLoans(updatedLoans);
    };

    return (
        <Container>
            <h1>Cronograma de Pagos</h1>
            
            <FileControls>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".txt"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                    Cargar Datos
                </Button>
                <Button onClick={handleDownload}>
                    Descargar Datos
                </Button>
                <Button onClick={() => setShowModal(true)}>
                    Agregar Préstamo
                </Button>
            </FileControls>

            <CardsContainer>
                {loans.map(loan => (
                    <LoanCard 
                        key={loan.id} 
                        loan={loan}
                        onEdit={handleEditLoan}
                        onDelete={handleDeleteLoan}
                    />
                ))}
            </CardsContainer>

            {showModal && (
                <AddLoanModal
                    onAdd={handleAddLoan}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Container>
    );
};
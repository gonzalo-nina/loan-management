import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Loan } from '../types/types';

const Overlay = styled.div`
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
`;

const Modal = styled.div`
  background: #1a1f2e;
  padding: 30px;
  border-radius: 16px;
  width: 500px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  color: #64ffda;
  margin-bottom: 25px;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #8892b0;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #2a3245;
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.1);
  }

  &::placeholder {
    color: #4a5568;
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: transparent;
    color: #64ffda;
    border: 1px solid #64ffda;

    &:hover {
      background: rgba(100, 255, 218, 0.1);
      transform: translateY(-2px);
    }
  }

  &.secondary {
    background: transparent;
    color: #8892b0;
    border: 1px solid #8892b0;

    &:hover {
      background: rgba(136, 146, 176, 0.1);
      transform: translateY(-2px);
    }
  }
`;

interface AddLoanModalProps {
  onAdd: (loan: Omit<Loan, 'id'>) => void;
  onUpdate: (loan: Loan) => void;
  editingLoan?: Loan | null;
  onClose: () => void;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({
  onAdd,
  onUpdate,
  editingLoan,
  onClose
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (editingLoan) {
      setName(editingLoan.name);
      setDescription(editingLoan.description || '');
      setAmount(String(editingLoan.amount));
      setInstallments(String(editingLoan.installments));
      setInstallmentAmount(String(editingLoan.installmentAmount));
      setStartDate(editingLoan.startDate);
    }
  }, [editingLoan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoan) {
      // Editar
      onUpdate({
        ...editingLoan,
        name,
        description,
        amount: Number(amount),
        installments: Number(installments),
        installmentAmount: Number(installmentAmount),
        startDate
      });
    } else {
      // Agregar
      onAdd({
              name: name.trim(),
              description: description.trim(),
              amount: Number(amount),
              installments: Number(installments),
              installmentAmount: Number(installmentAmount),
              startDate,
              paidInstallments: []
            });
    }
    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <form onSubmit={handleSubmit}>
          <Title>{editingLoan ? 'Editar Préstamo' : 'Agregar Nuevo Préstamo'}</Title>

          <FormGroup>
            <Label>Nombre (opcional):</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dejar en blanco para nombre automático"
            />
          </FormGroup>

          <FormGroup>
            <Label>Descripción (opcional):</Label>
            <Input
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agregar una descripción"
            />
          </FormGroup>

          <FormGroup>
            <Label>Monto prestado:</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Cantidad de cuotas:</Label>
            <Input
              type="number"
              value={installments}
              onChange={(e) => setInstallments(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Monto por cuota:</Label>
            <Input
              type="number"
              value={installmentAmount}
              onChange={(e) => setInstallmentAmount(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Fecha de inicio:</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="submit" className="primary">
              {editingLoan ? 'Guardar Cambios' : 'Agregar'}
            </Button>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
};
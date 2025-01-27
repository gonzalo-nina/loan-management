import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Loan } from '../types/types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  width: 500px;
  color: #2d3748;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c5282;
  margin-bottom: 25px;
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #2d3748;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
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

  &.secondary {
    background: #f7fafc;
    color: #4a5568;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #edf2f7;
      transform: translateY(-1px);
    }
  }

  &:active {
    transform: translateY(0);
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
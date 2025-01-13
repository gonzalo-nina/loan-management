import React, { useState } from 'react';
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
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 400px;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &.primary {
    background: #007bff;
    color: white;
    &:hover {
      background: #0056b3;
    }
  }

  &.secondary {
    background: #6c757d;
    color: white;
    &:hover {
      background: #5a6268;
    }
  }
`;

interface AddLoanModalProps {
  onAdd: (loan: Omit<Loan, 'id'>) => void;
  onClose: () => void;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [installments, setInstallments] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [startDate, setStartDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: name.trim(),
      description: description.trim(),
      amount: Number(amount),
      installments: Number(installments),
      installmentAmount: Number(installmentAmount),
      startDate: startDate
    });
    onClose();
  };

  return (
    <Overlay>
      <Modal>
        <form onSubmit={handleSubmit}>
          <Title>Agregar Nuevo Préstamo</Title>

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
            <Button type="submit" className="primary">Agregar</Button>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancelar
            </Button>
          </ButtonGroup>
        </form>
      </Modal>
    </Overlay>
  );
};
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders title, body and both action labels', () => {
    render(
      <ConfirmDialog
        title="Título"
        body="Cuerpo del mensaje"
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Cuerpo del mensaje')).toBeInTheDocument();
    expect(screen.getByText('Confirmar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={onConfirm} onCancel={() => {}} />,
    );
    fireEvent.click(screen.getByText('Sí'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={onCancel} />,
    );
    fireEvent.click(screen.getByText('No'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when clicking the backdrop (outside the dialog box)', () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={onCancel} />,
    );
    fireEvent.click(document.getElementById('custom-confirm')!);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AteneoModal } from './AteneoModal';

describe('AteneoModal', () => {
  it('renders only the comments for the selected philosopher ids', () => {
    render(
      <AteneoModal
        dilemmaId={1}
        selection={['kant', 'mill']}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText('Immanuel Kant')).toBeInTheDocument();
    expect(screen.getByText('John Stuart Mill')).toBeInTheDocument();
    expect(screen.queryByText('Séneca')).not.toBeInTheDocument();
  });

  it('shows each philosopher\'s comment text for that dilemma', () => {
    render(
      <AteneoModal
        dilemmaId={1}
        selection={['kant']}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText(/imperativo categórico|universalizar/)).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(<AteneoModal dilemmaId={1} selection={['kant']} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cerrar'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay background', () => {
    const onClose = vi.fn();
    render(<AteneoModal dilemmaId={1} selection={['kant']} onClose={onClose} />);
    fireEvent.click(document.getElementById('ateneo-modal')!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe('lectura liviana cuando el Ateneo es grande', () => {
    const tres = ['kant', 'mill', 'buda'];
    const seis = [...tres, 'nietzsche', 'locke', 'seneca'];

    it('con 3 pensadores o menos se muestra cada comentario completo, sin «Leer más»', () => {
      render(<AteneoModal dilemmaId={1} selection={tres} onClose={() => {}} />);
      expect(screen.queryByText('Leer más')).not.toBeInTheDocument();
    });

    it('con mas de 3 se muestra la primera frase, y «Leer más» abre el comentario entero', () => {
      render(<AteneoModal dilemmaId={1} selection={seis} onClose={() => {}} />);
      const botones = screen.getAllByText('Leer más');
      expect(botones.length).toBeGreaterThan(0);
      const entrada = botones[0].closest('.ateneo-modal-entry') as HTMLElement;
      const antes = entrada.querySelector('.ateneo-modal-comment')!.textContent!.length;
      fireEvent.click(botones[0]);
      const despues = entrada.querySelector('.ateneo-modal-comment')!.textContent!.length;
      expect(despues).toBeGreaterThan(antes);
      expect(screen.getAllByText('Leer menos').length).toBe(1);
    });
  });

  describe('que pensadores leyo el alumno', () => {
    const tres = ['kant', 'mill', 'buda'];
    const seis = [...tres, 'nietzsche', 'locke', 'seneca'];

    it('con 3 o menos, todos estan a la vista: cerrar informa a todos como leidos', () => {
      const onClose = vi.fn();
      render(<AteneoModal dilemmaId={1} selection={tres} onClose={onClose} />);
      fireEvent.click(screen.getByText('Cerrar'));
      expect(onClose).toHaveBeenCalledWith(expect.arrayContaining(tres));
      expect(onClose.mock.calls[0][0]).toHaveLength(3);
    });

    it('con mas de 3, solo cuentan los que abrio con «Leer más»', () => {
      const onClose = vi.fn();
      render(<AteneoModal dilemmaId={1} selection={seis} onClose={onClose} />);
      fireEvent.click(screen.getByText('Cerrar'));
      expect(onClose).toHaveBeenLastCalledWith([]);

      fireEvent.click(screen.getAllByText('Leer más')[0]);
      fireEvent.click(screen.getByText('Cerrar'));
      expect(onClose.mock.calls[1][0]).toHaveLength(1);
    });
  });
});

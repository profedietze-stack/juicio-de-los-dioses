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
});

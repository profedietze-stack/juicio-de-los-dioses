import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('renders the main menu on load', () => {
    render(<App />);
    expect(screen.getByText('El Juicio de los Dioses')).toBeInTheDocument();
    expect(screen.getByText('Nueva Partida')).toBeInTheDocument();
  });

  it('navigates Menú -> Guía Pedagógica -> Corrientes -> back to Menú', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Guía Pedagógica'));
    expect(document.getElementById('screen-info')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Corrientes' }));
    expect(screen.getAllByText('Budismo').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Volver al Menú'));
    expect(document.getElementById('screen-menu')).toBeInTheDocument();
  });

  it('navigates Menú -> Nueva Partida -> Intro -> Comenzar el Juicio -> event screen', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nueva Partida'));
    expect(document.getElementById('screen-intro')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(document.getElementById('screen-event')).toBeInTheDocument();
    expect(document.getElementById('ev-title')?.textContent).toBeTruthy();
  });

  it('opens Galería de Logros without a saved game', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Galería de Logros'));
    expect(document.getElementById('screen-achievements')).toBeInTheDocument();
  });
});

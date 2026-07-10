import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

async function renderPastSplash() {
  render(<App />);
  await waitFor(() => screen.getByText('Continuar'));
  fireEvent.click(screen.getByText('Continuar'));
}

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('shows the splashscreen before the menu, and Continuar advances to it', async () => {
    render(<App />);
    expect(document.getElementById('screen-splash')).toBeInTheDocument();
    await waitFor(() => screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Continuar'));
    expect(document.getElementById('screen-splash')).not.toBeInTheDocument();
    expect(screen.getByText('Nueva Partida')).toBeInTheDocument();
  });

  it('renders the main menu on load', async () => {
    await renderPastSplash();
    expect(document.querySelector('.menu-title')?.textContent).toBe('El Juiciode los Dioses');
    expect(screen.getByText('Nueva Partida')).toBeInTheDocument();
  });

  it('navigates Menú -> Guía Pedagógica -> Corrientes -> back to Menú', async () => {
    await renderPastSplash();
    fireEvent.click(screen.getByText('Guía Pedagógica'));
    expect(document.getElementById('screen-info')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Corrientes' }));
    expect(screen.getAllByText('Budismo').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Volver al Menú'));
    expect(document.getElementById('screen-menu')).toBeInTheDocument();
  });

  it('navigates Menú -> Nueva Partida -> Intro -> Comenzar el Juicio -> event screen', async () => {
    await renderPastSplash();
    fireEvent.click(screen.getByText('Nueva Partida'));
    expect(document.getElementById('screen-intro')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Comenzar el Juicio'));
    expect(document.getElementById('screen-event')).toBeInTheDocument();
    expect(document.getElementById('ev-title')?.textContent).toBeTruthy();
  });

  it('opens Galería de Logros without a saved game', async () => {
    await renderPastSplash();
    fireEvent.click(screen.getByText('Galería de Logros'));
    expect(document.getElementById('screen-achievements')).toBeInTheDocument();
  });
});

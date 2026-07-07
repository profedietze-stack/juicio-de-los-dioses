import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { GameProvider } from '../../state/GameContext';
import { InfoScreen } from './InfoScreen';

const ALL_PHILOSOPHIES = [
  'Utilitarismo', 'Deontología', 'Nihilismo', 'Virtuosismo',
  'Existencialismo', 'Estoicismo', 'Pragmatismo', 'Contractualismo',
  'Feminismo Ético', 'Budismo',
];

function renderInfoScreen() {
  return render(
    <GameProvider>
      <InfoScreen />
    </GameProvider>,
  );
}

describe('InfoScreen', () => {
  beforeEach(() => localStorage.clear());

  it('shows the "El Juego" tab by default', () => {
    renderInfoScreen();
    expect(screen.getByText('¿Qué es El Juicio de los Dioses?')).toBeInTheDocument();
  });

  it('lists all 10 philosophical currents on the "Corrientes" tab (regression: originally only 4 were shown)', () => {
    renderInfoScreen();
    fireEvent.click(screen.getByRole('button', { name: 'Corrientes' }));

    const panel = document.getElementById('tab-filosof')!;
    const chips = within(panel).getAllByText((_, el) => el?.classList.contains('chip') ?? false);
    expect(chips.map(c => c.textContent)).toEqual(ALL_PHILOSOPHIES);

    const headings = within(panel).getAllByRole('heading', { level: 4 }).map(h => h.textContent);
    for (const name of ALL_PHILOSOPHIES) {
      expect(headings.some(h => h?.startsWith(name))).toBe(true);
    }
  });

  it('switches tabs without showing multiple panels at once', () => {
    renderInfoScreen();
    fireEvent.click(screen.getByRole('button', { name: 'En el Aula' }));
    expect(screen.getByText('Implementación en el Aula')).toBeInTheDocument();
    expect(screen.queryByText('¿Qué es El Juicio de los Dioses?')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Evaluación' }));
    expect(screen.getByText('Criterios de Evaluación')).toBeInTheDocument();
    expect(screen.queryByText('Implementación en el Aula')).not.toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GameProvider } from '../../state/GameContext';
import { AchievementsScreen } from './AchievementsScreen';
import { saveHistory, getHistory } from '../../engine/persistence';
import type { HistoryRecord } from '../../types';

function record(overrides: Partial<HistoryRecord> = {}): HistoryRecord {
  return {
    score: 50, time: 100, ending: 'X', endingKey: 'purgatory', dominant: 'utilitarismo',
    pcts: {}, counts: {}, diversity: 1, date: '01 ene 2026', dateISO: '2026-01-01',
    ...overrides,
  };
}

function renderScreen() {
  render(
    <GameProvider>
      <AchievementsScreen />
    </GameProvider>,
  );
}

function fileWithText(text: string): File {
  return new File([text], 'progreso.json', { type: 'application/json' });
}

describe('AchievementsScreen export/import', () => {
  beforeEach(() => localStorage.clear());

  it('exports progress by creating a downloadable blob URL', () => {
    // jsdom doesn't implement these; stub them before spying.
    if (!URL.createObjectURL) URL.createObjectURL = () => '';
    if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};
    const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    const revokeUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    renderScreen();
    fireEvent.click(screen.getByText('⬇ Exportar Progreso'));

    expect(createUrlSpy).toHaveBeenCalledTimes(1);
    expect(revokeUrlSpy).toHaveBeenCalledWith('blob:mock-url');

    createUrlSpy.mockRestore();
    revokeUrlSpy.mockRestore();
  });

  it('shows an error and keeps existing progress when the imported file is not valid JSON', async () => {
    saveHistory(record({ score: 7 }));
    renderScreen();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fileWithText('{not json')] } });

    await waitFor(() => expect(screen.getByText('El archivo no es un JSON válido.')).toBeInTheDocument());
    expect(getHistory().map(r => r.score)).toEqual([7]);
  });

  it('asks for confirmation and replaces progress when a valid file is imported', async () => {
    saveHistory(record({ score: 7 }));
    renderScreen();

    const payload = { exportedAt: '2026-01-01', keys: { gameHistory: { version: 1, data: [record({ score: 99 })] } } };
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fileWithText(JSON.stringify(payload))] } });

    await waitFor(() => expect(screen.getByText('Importar progreso')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Reemplazar'));

    await waitFor(() => expect(getHistory().map(r => r.score)).toEqual([99]));
  });

  it('cancelling the import confirmation leaves existing progress untouched', async () => {
    saveHistory(record({ score: 7 }));
    renderScreen();

    const payload = { exportedAt: '2026-01-01', keys: { gameHistory: { version: 1, data: [record({ score: 99 })] } } };
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [fileWithText(JSON.stringify(payload))] } });

    await waitFor(() => expect(screen.getByText('Importar progreso')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Cancelar'));

    expect(screen.queryByText('Importar progreso')).not.toBeInTheDocument();
    expect(getHistory().map(r => r.score)).toEqual([7]);
  });
});

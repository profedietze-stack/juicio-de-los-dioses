import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SplashScreen } from './SplashScreen';

describe('SplashScreen', () => {
  let fontsReady: Promise<unknown>;
  let resolveFonts: () => void;

  beforeEach(() => {
    fontsReady = new Promise(resolve => { resolveFonts = () => resolve(undefined); });
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { ready: fontsReady },
    });
  });

  it('shows a loading state before fonts are ready', () => {
    render(<SplashScreen onDone={() => {}} />);
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    expect(screen.queryByText('Continuar')).not.toBeInTheDocument();
  });

  it('shows the Continuar button once fonts resolve', async () => {
    render(<SplashScreen onDone={() => {}} />);
    resolveFonts();
    await waitFor(() => expect(screen.getByText('Continuar')).toBeInTheDocument());
  });

  it('calls onDone when Continuar is clicked', async () => {
    const onDone = vi.fn();
    render(<SplashScreen onDone={onDone} />);
    resolveFonts();
    await waitFor(() => screen.getByText('Continuar'));
    fireEvent.click(screen.getByText('Continuar'));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('does not throw when document.fonts is unavailable (older browsers)', () => {
    Object.defineProperty(document, 'fonts', { configurable: true, value: undefined });
    expect(() => render(<SplashScreen onDone={() => {}} />)).not.toThrow();
  });
});

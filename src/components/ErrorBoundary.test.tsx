import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function Boom(): never {
  throw new Error('boom');
}

describe('ErrorBoundary', () => {
  it('renders children normally when there is no error', () => {
    render(<ErrorBoundary><div>all good</div></ErrorBoundary>);
    expect(screen.getByText('all good')).toBeInTheDocument();
  });

  it('renders a themed fallback with a reload button when a child throws', () => {
    // React (and jsdom) log the thrown error to console.error; silence it for this test only.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    expect(screen.getByText('Algo salió mal en el Juicio')).toBeInTheDocument();
    expect(screen.getByText('Recargar')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('reloads the page when "Recargar" is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    const originalLocation = window.location;
    // @ts-expect-error -- narrowing window.location so it can be replaced with a stub for this test
    delete window.location;
    window.location = { ...originalLocation, reload: reloadSpy };

    render(<ErrorBoundary><Boom /></ErrorBoundary>);
    fireEvent.click(screen.getByText('Recargar'));
    expect(reloadSpy).toHaveBeenCalledTimes(1);

    window.location = originalLocation;
    spy.mockRestore();
  });
});

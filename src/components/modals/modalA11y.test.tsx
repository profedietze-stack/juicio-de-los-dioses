import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';
import { AteneoModal } from './AteneoModal';
import { OptionsModal } from './OptionsModal';

describe('dialogos modales accesibles', () => {
  it('ConfirmDialog: es un dialogo modal, toma el foco y Escape cancela', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={onCancel} />);
    const d = screen.getByRole('dialog');
    expect(d.getAttribute('aria-modal')).toBe('true');
    expect(d.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('Tab no se escapa del dialogo: del ultimo boton vuelve al primero', () => {
    render(<ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={() => {}} />);
    const si = screen.getByText('Sí'), no = screen.getByText('No');
    no.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(si);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(no);
  });

  it('al cerrar, el foco vuelve al boton que lo abrio', () => {
    const abre = document.createElement('button');
    document.body.appendChild(abre);
    abre.focus();
    const { unmount } = render(<ConfirmDialog title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={() => {}} />);
    expect(document.activeElement).not.toBe(abre);
    unmount();
    expect(document.activeElement).toBe(abre);
    abre.remove();
  });

  it('Ateneo y Opciones tambien son dialogos y se cierran con Escape', () => {
    const a = vi.fn(), o = vi.fn();
    const r1 = render(<AteneoModal dilemmaId={1} selection={[]} onClose={a} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(a).toHaveBeenCalled();
    r1.unmount();
    render(<OptionsModal onClose={o} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(o).toHaveBeenCalled();
  });

  // Las pantallas llevan `animation: fadeUp ... both`, que deja un transform puesto: dentro de
  // ellas, `position: fixed` deja de ser relativo a la ventana y el modal se corre con el scroll
  // (con el dilema leido hasta abajo, el modal quedaba cortado arriba y sin fondo oscuro).
  it('los modales se montan en <body>, fuera de la pantalla con transform', () => {
    const pantalla = document.createElement('div');
    pantalla.style.transform = 'translateY(0)';
    document.body.appendChild(pantalla);
    const casos: [string, JSX.Element][] = [
      ['confirm', <ConfirmDialog key="c" title="T" body="B" confirmLabel="Sí" cancelLabel="No" onConfirm={() => {}} onCancel={() => {}} />],
      ['ateneo', <AteneoModal key="a" dilemmaId={1} selection={['kant']} onClose={() => {}} />],
      ['opciones', <OptionsModal key="o" onClose={() => {}} />],
    ];
    for (const [nombre, ui] of casos) {
      const hueco = document.createElement('div');
      pantalla.appendChild(hueco);
      const { unmount } = render(ui, { container: hueco });
      const dlg = screen.getByRole('dialog');
      expect(pantalla.contains(dlg), nombre).toBe(false);
      expect(document.body.contains(dlg), nombre).toBe(true);
      unmount();
    }
    pantalla.remove();
  });
});

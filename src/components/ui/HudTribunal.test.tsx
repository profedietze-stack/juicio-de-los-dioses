import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HudTribunal } from './HudTribunal';
import { ChipsEfectos } from './ChipsEfectos';
import { tribunalVacio, aplicarEfectos } from '../../engine/tribunal';

describe('HudTribunal', () => {
  it('muestra las tres balanzas con sus seis platillos y los cuatro vicios', () => {
    render(<HudTribunal current={6} total={40} tribunal={tribunalVacio()} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Ver el Tribunal/ }));
    for (const n of ['Felicidad', 'Justicia', 'Libertad', 'Bien común', 'Corazón', 'Razón', 'Soberbia', 'Corrupción', 'Crueldad', 'Indiferencia']) {
      expect(screen.getAllByText(new RegExp(n)).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('resalta el platillo que pesa y enciende el vicio alimentado', () => {
    const t = aplicarEfectos(tribunalVacio(), { pans: { Jus: 3 }, vices: { Cru: 2 } });
    const { container } = render(<HudTribunal current={0} total={40} tribunal={t} onExit={() => {}} />);
    expect(container.querySelector('[data-pan="Jus"]')?.className).toContain('hi');
    expect(container.querySelector('[data-pan="Fel"]')?.className).toContain('lo');
    expect(container.querySelector('[data-vicio="Cru"]')?.className).toContain('on');
    expect(container.querySelector('[data-vicio="Ind"]')?.className).not.toContain('on');
  });

  it('la «i» explica el concepto con definicion y ejemplo, y se cierra con Escape', () => {
    render(<HudTribunal current={0} total={40} tribunal={tribunalVacio()} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Qué es Justicia' }));
    const tip = screen.getByRole('tooltip');
    expect(tip.textContent).toContain('Que cada uno reciba lo que le corresponde');
    expect(tip.textContent).toContain('Ejemplo:');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('llama a onExit', () => {
    let salio = false;
    render(<HudTribunal current={0} total={40} tribunal={tribunalVacio()} onExit={() => { salio = true; }} />);
    fireEvent.click(screen.getByText(/Salir/));
    expect(salio).toBe(true);
  });
});

describe('HudTribunal plegable', () => {
  it('en el primer dilema el Tribunal se ve entero, para que el alumno lo conozca', () => {
    const { container } = render(<HudTribunal current={0} total={15} tribunal={tribunalVacio()} onExit={() => {}} />);
    expect(container.querySelectorAll('.tr-card')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Ocultar el Tribunal/ }).getAttribute('aria-expanded')).toBe('true');
  });

  it('desde el segundo dilema queda una barra compacta: tres balanzas y la Sombra', () => {
    const t = aplicarEfectos(tribunalVacio(), { pans: { Jus: 3 }, vices: { Cru: 2 } });
    const { container } = render(<HudTribunal current={1} total={15} tribunal={t} onExit={() => {}} />);
    expect(container.querySelectorAll('.tr-card')).toHaveLength(0);
    expect(container.querySelectorAll('.tr-mini')).toHaveLength(3);
    expect(container.querySelector('.tr-mini-sombra')?.textContent).toContain('Sombra 2/');
    expect(screen.getByRole('img', { name: /Felicidad y Justicia: pesa más Justicia/ })).toBeInTheDocument();
  });

  it('se pliega solo al pasar del primer al segundo dilema, y despues respeta lo que el alumno elija', () => {
    const props = { total: 15, tribunal: tribunalVacio(), onExit: () => {} };
    const { container, rerender } = render(<HudTribunal current={0} {...props} />);
    expect(container.querySelectorAll('.tr-card')).toHaveLength(4);
    rerender(<HudTribunal current={1} {...props} />);
    expect(container.querySelectorAll('.tr-card')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /Ver el Tribunal/ }));
    rerender(<HudTribunal current={2} {...props} />);
    expect(container.querySelectorAll('.tr-card')).toHaveLength(4);
  });

  it('la barra compacta sigue en pantalla al abrir el Tribunal, y se vuelve a plegar', () => {
    const { container } = render(<HudTribunal current={1} total={15} tribunal={tribunalVacio()} onExit={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Ver el Tribunal/ }));
    expect(container.querySelectorAll('.tr-card')).toHaveLength(4);
    expect(container.querySelectorAll('.tr-mini')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /Ocultar el Tribunal/ }));
    expect(container.querySelectorAll('.tr-card')).toHaveLength(0);
  });
});

describe('ChipsEfectos', () => {
  it('separa lo que sube, lo que baja y la Sombra', () => {
    render(<ChipsEfectos option={{ text: 'x', impact: 0, philosophy: 'utilitarismo', effects: { pans: { Fel: 3, Jus: -4 }, vices: { Sob: 2 } } }} />);
    expect(screen.getByText('▲ Felicidad +3')).toBeInTheDocument();
    expect(screen.getByText('▼ Justicia −4')).toBeInTheDocument();
    expect(screen.getByText('✦ Sombra +2 · Soberbia')).toBeInTheDocument();
  });
});

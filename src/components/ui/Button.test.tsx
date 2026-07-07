import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and fires onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies ghost/small/danger modifier classes', () => {
    render(<Button onClick={() => {}} ghost small danger>X</Button>);
    const btn = screen.getByText('X');
    expect(btn.className).toContain('btn-ghost');
    expect(btn.className).toContain('btn-sm');
    expect(btn.className).toContain('btn-danger');
  });

  it('does not throw when AudioContext is unavailable (jsdom)', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick} sound="start">Go</Button>);
    expect(() => fireEvent.click(screen.getByText('Go'))).not.toThrow();
  });
});

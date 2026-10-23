import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
// @ts-expect-error modulo .mjs sin tipos, compartido con el sellador
import { leerSw, huella } from '../scripts/huella-sw.mjs';

const raiz = process.cwd();

describe('service worker', () => {
  it('todo lo que precachea existe en public/', () => {
    const { fijos } = leerSw(raiz) as { fijos: string[] };
    expect(fijos.length).toBeGreaterThan(0);
    const faltan = fijos.filter(f => f !== '' && !existsSync(join(raiz, 'public', f)));
    expect(faltan).toEqual([]);
  });

  it('no nombra archivos con hash del build', () => {
    const { fijos } = leerSw(raiz) as { fijos: string[] };
    expect(fijos.filter(f => /-[A-Za-z0-9_]{8,}\.(js|css)$/.test(f))).toEqual([]);
  });

  it('si cambio su contenido, subio el nombre de la cache (y corrio scripts/sellar-cache.mjs)', () => {
    const sello = JSON.parse(readFileSync(join(raiz, 'sw-precache.json'), 'utf8'));
    const { nombre } = leerSw(raiz) as { nombre: string };
    expect(nombre).toBe(sello.cacheName);
    expect(huella(raiz)).toBe(sello.huella);
  });

  it('nunca guarda errores ni respuestas parciales, y respondWith no rechaza', () => {
    const sw = readFileSync(join(raiz, 'public', 'sw.js'), 'utf8');
    expect(sw).toMatch(/res\.status === 200 && res\.type === 'basic'/);
    expect(sw).toMatch(/\.catch\(\(\) => SIN_CONEXION\(\)\)/);
    expect(sw).not.toMatch(/cache\.addAll/);
  });
});

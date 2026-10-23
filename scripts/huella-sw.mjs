// Huella del contenido que el service worker maneja: su propio codigo (sin la
// linea del nombre de cache) y los archivos fijos que precachea. La usan el test
// y el sellador, para que cambiar algo sin subir la version de cache no pase.
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function leerSw(raiz) {
  const sw = readFileSync(join(raiz, 'public', 'sw.js'), 'utf8').replace(/\r\n/g, '\n');
  const nombre = /const CACHE_NAME = '([^']+)'/.exec(sw)?.[1];
  const fijos = [...sw.matchAll(/\$\{BASE\}([^`]+)`/g)].map(m => m[1]);
  return { sw, nombre, fijos };
}

export function huella(raiz) {
  const { sw, fijos } = leerSw(raiz);
  const h = createHash('sha256');
  h.update(sw.replace(/const CACHE_NAME = '[^']+'/, 'const CACHE_NAME = ""'));
  for (const f of [...fijos].sort()) {
    const ruta = join(raiz, 'public', f);
    h.update(f);
    if (existsSync(ruta)) h.update(readFileSync(ruta));
  }
  return h.digest('hex');
}

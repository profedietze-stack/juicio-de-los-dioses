// Despues de subir CACHE_NAME en public/sw.js:  node scripts/sellar-cache.mjs
import { writeFileSync } from 'node:fs';
import { leerSw, huella } from './huella-sw.mjs';
const raiz = process.cwd();
const sello = { cacheName: leerSw(raiz).nombre, huella: huella(raiz) };
writeFileSync('sw-precache.json', JSON.stringify(sello, null, 2) + '\n');
console.log('sellado', sello);

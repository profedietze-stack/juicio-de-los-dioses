import { PHILO_LABELS } from './philosophyDisplay';
import type { PhilosophyKey } from '../types';

export interface ShareCardData {
  icon: string;
  title: string;
  score: number;
  top: [PhilosophyKey, number][];
}

const W = 800;
const H = 1000;

function drawCard(ctx: CanvasRenderingContext2D, data: ShareCardData) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#12101c');
  grad.addColorStop(1, '#1c1830');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(212,175,55,.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#d4af37';
  ctx.font = '48px serif';
  ctx.fillText('El Juicio de los Dioses', W / 2, 110);

  ctx.font = '120px serif';
  ctx.fillText(data.icon, W / 2, 280);

  ctx.fillStyle = '#f4f0e6';
  ctx.font = 'bold 44px serif';
  wrapCenteredText(ctx, data.title, W / 2, 360, W - 160, 52);

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#a89bd8';
  ctx.fillText('Veredicto', W / 2, 500);
  ctx.font = 'bold 90px serif';
  ctx.fillStyle = '#d4af37';
  ctx.fillText(String(data.score), W / 2, 590);

  let y = 680;
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#f4f0e6';
  ctx.fillText('Corrientes dominantes', W / 2, y);
  y += 50;
  for (const [key, pct] of data.top) {
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#f4f0e6';
    ctx.fillText(`${PHILO_LABELS[key] || key} — ${pct}%`, W / 2, y);
    y += 46;
  }

  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#8a809e';
  ctx.fillText('juiciodelosdioses', W / 2, H - 50);
}

function wrapCenteredText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, cx, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, cx, cy);
}

export function buildShareCardDataUrl(data: ShareCardData): string {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  drawCard(ctx, data);
  return canvas.toDataURL('image/png');
}

export function downloadShareCard(data: ShareCardData, filename = 'juicio-de-los-dioses.png') {
  const url = buildShareCardDataUrl(data);
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

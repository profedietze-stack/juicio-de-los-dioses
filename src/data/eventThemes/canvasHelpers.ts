export function _bg(ctx: CanvasRenderingContext2D, W: number, H: number, c1: string, c2: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

export function _stars(ctx: CanvasRenderingContext2D, W: number, H: number, n = 60) {
  for (let i = 0; i < n; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = Math.random();
    const colors = ['255,255,255', '200,210,255', '255,220,200', '200,255,220'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = `rgba(${c},${0.2 + Math.random() * 0.7})`;
    ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, Math.PI * 2); ctx.fill();
    if (r > 0.8) {
      ctx.strokeStyle = `rgba(${c},0.3)`; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke();
    }
  }
}

export function _glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

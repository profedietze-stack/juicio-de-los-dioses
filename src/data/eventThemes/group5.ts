import type { EventTheme } from '../../types';
import { _bg, _stars, _glow } from './canvasHelpers';

export const group5: EventTheme[] = [

// 31 — Vigilia Íntima / Ventana con vela
{label:'Vigilia Íntima', fn:(ctx,W,H)=>{
  _bg(ctx,W,H,'#0a0710','#050308');
  _stars(ctx,W,H,20);
  const winW=210,winH=150,wx=W/2-winW/2,wy=H*0.28;
  const glass=ctx.createLinearGradient(wx,wy,wx,wy+winH);
  glass.addColorStop(0,'rgba(255,190,110,0.22)');glass.addColorStop(1,'rgba(120,70,30,0.08)');
  ctx.fillStyle=glass;ctx.fillRect(wx,wy,winW,winH);
  ctx.strokeStyle='rgba(90,60,40,0.7)';ctx.lineWidth=6;ctx.strokeRect(wx,wy,winW,winH);
  ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(wx+winW/2,wy);ctx.lineTo(wx+winW/2,wy+winH);ctx.stroke();
  ctx.beginPath();ctx.moveTo(wx,wy+winH/2);ctx.lineTo(wx+winW,wy+winH/2);ctx.stroke();
  _glow(ctx,W/2,wy+winH*0.6,140,'rgba(255,180,90,0.18)');
  const cx=W/2,cy=wy+winH+70;
  ctx.fillStyle='rgba(210,190,160,0.35)';
  ctx.beginPath();ctx.moveTo(cx-5,cy+40);ctx.lineTo(cx-4,cy-10);ctx.lineTo(cx+4,cy-10);ctx.lineTo(cx+5,cy+40);ctx.closePath();ctx.fill();
  const flameG=ctx.createRadialGradient(cx,cy-22,0,cx,cy-22,20);
  flameG.addColorStop(0,'rgba(255,240,200,0.95)');flameG.addColorStop(0.5,'rgba(255,160,60,0.6)');flameG.addColorStop(1,'transparent');
  ctx.fillStyle=flameG;ctx.beginPath();ctx.ellipse(cx,cy-22,9,16,0,0,Math.PI*2);ctx.fill();
  _glow(ctx,cx,cy-22,60,'rgba(255,170,80,0.25)');
  for(let d=0;d<25;d++){
    const dx=Math.random()*W,dy=H*0.7+Math.random()*H*0.3;
    ctx.fillStyle=`rgba(255,210,160,${0.03+Math.random()*0.05})`;
    ctx.beginPath();ctx.arc(dx,dy,1+Math.random()*2,0,Math.PI*2);ctx.fill();
  }
  const vig=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.8);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
}},

// 32 — Río Turbio / Contaminación
{label:'Río Turbio', fn:(ctx,W,H)=>{
  const sky=ctx.createLinearGradient(0,0,0,H*0.55);
  sky.addColorStop(0,'#0a0e0a');sky.addColorStop(1,'#141a12');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H*0.55);
  const water=ctx.createLinearGradient(0,H*0.5,0,H);
  water.addColorStop(0,'#1c2418');water.addColorStop(0.5,'#2a3320');water.addColorStop(1,'#171f12');
  ctx.fillStyle=water;ctx.fillRect(0,H*0.5,W,H*0.5);
  for(let i=0;i<9;i++){
    const y=H*0.52+i*9;
    ctx.strokeStyle=`rgba(140,150,90,${0.08+Math.random()*0.1})`;ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(0,y);
    for(let x=0;x<=W;x+=40) ctx.lineTo(x,y+Math.sin(x*0.02+i)*5);
    ctx.stroke();
  }
  ctx.fillStyle='rgba(20,26,14,0.9)';
  ctx.beginPath();ctx.moveTo(0,H*0.5);
  for(let x=0;x<=W;x+=50) ctx.lineTo(x,H*0.44+Math.sin(x*0.01)*14);
  ctx.lineTo(W,0);ctx.lineTo(0,0);ctx.closePath();ctx.fill();
  for(let i=0;i<4;i++){
    const fx=W*0.15+i*W*0.22,fh=40+Math.random()*40;
    ctx.fillStyle='rgba(10,10,10,0.75)';
    ctx.fillRect(fx,H*0.4-fh,14,fh);
    ctx.fillStyle='rgba(255,140,60,0.35)';
    ctx.beginPath();ctx.arc(fx+7,H*0.4-fh-6,4,0,Math.PI*2);ctx.fill();
    _glow(ctx,fx+7,H*0.4-fh-6,18,'rgba(255,120,50,0.25)');
  }
  for(let s=0;s<14;s++){
    const sx=Math.random()*W,sy=H*0.6+Math.random()*H*0.35,sr=3+Math.random()*10;
    const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,sr);
    sg.addColorStop(0,'rgba(90,100,50,0.35)');sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();
  }
  const vig=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.85);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
}},

// 33 — El Cuidador / Mano robot y mano humana
{label:'El Cuidador', fn:(ctx,W,H)=>{
  _bg(ctx,W,H,'#050810','#0a0612');
  _stars(ctx,W,H,30);
  const cy=H*0.52;
  const drawHumanHand=(x:number)=>{
    ctx.save();ctx.translate(x,cy);
    const g=ctx.createRadialGradient(0,0,0,0,0,30);
    g.addColorStop(0,'rgba(230,190,160,0.55)');g.addColorStop(1,'rgba(180,130,100,0.2)');
    ctx.fillStyle=g;
    ctx.beginPath();ctx.ellipse(0,0,20,26,0,0,Math.PI*2);ctx.fill();
    const fingers:[number,number][]=[[-11,-26],[-4,-30],[4,-30],[11,-26]];
    fingers.forEach(([fx,fy])=>{
      ctx.fillStyle='rgba(220,180,150,0.45)';
      ctx.beginPath();ctx.ellipse(fx,fy,4,9,0,0,Math.PI*2);ctx.fill();
    });
    ctx.restore();
  };
  const drawRobotHand=(x:number)=>{
    ctx.save();ctx.translate(x,cy);ctx.scale(-1,1);
    ctx.strokeStyle='rgba(120,200,230,0.7)';ctx.fillStyle='rgba(60,90,110,0.5)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(-18,-4);ctx.lineTo(-18,20);ctx.lineTo(18,20);ctx.lineTo(18,-4);ctx.closePath();ctx.fill();ctx.stroke();
    const joints:[number,number][]=[[-11,-24],[-4,-30],[4,-30],[11,-24]];
    joints.forEach(([fx,fy])=>{
      ctx.beginPath();ctx.rect(fx-3,fy,6,20);ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(150,230,255,0.7)';
      ctx.beginPath();ctx.arc(fx,fy,2.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(60,90,110,0.5)';
    });
    ctx.restore();
  };
  drawHumanHand(W/2-40);
  drawRobotHand(W/2+40);
  _glow(ctx,W/2,cy-20,50,'rgba(180,210,255,0.15)');
  const vig=ctx.createRadialGradient(W/2,H/2,H*0.2,W/2,H/2,H*0.8);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
}},

];

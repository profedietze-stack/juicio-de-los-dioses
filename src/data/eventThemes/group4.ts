import type { EventTheme } from '../../types';
import { _stars, _glow } from './canvasHelpers';

export const group4: EventTheme[] = [

// 24 — El Contrato / Pacto
{label:'El Contrato', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#040406');bg.addColorStop(1,'#080a0e');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,40);
  _glow(ctx,W/2,H/2,160,'rgba(107,91,62,0.12)');
  const cx=W/2,cy=H/2;
  const scrollG=ctx.createLinearGradient(cx-90,cy-90,cx+90,cy+90);
  scrollG.addColorStop(0,'rgba(140,115,65,0.15)');
  scrollG.addColorStop(0.5,'rgba(160,130,75,0.2)');
  scrollG.addColorStop(1,'rgba(120,100,55,0.12)');
  ctx.fillStyle=scrollG;ctx.fillRect(cx-90,cy-80,180,160);
  for(let ac=0;ac<10;ac++){
    ctx.strokeStyle=`rgba(160,130,70,${0.04+Math.random()*0.05})`;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(cx+(Math.random()-0.5)*140,cy+(Math.random()-0.5)*120);
    ctx.lineTo(cx+(Math.random()-0.5)*140,cy+(Math.random()-0.5)*120);ctx.stroke();
  }
  [cy-80,cy+80].forEach((ey)=>{
    const rig=ctx.createRadialGradient(cx,ey,2,cx,ey,20);
    rig.addColorStop(0,'rgba(180,150,80,0.5)');
    rig.addColorStop(0.5,'rgba(150,120,60,0.35)');rig.addColorStop(1,'rgba(120,95,45,0.15)');
    ctx.fillStyle=rig;ctx.beginPath();ctx.ellipse(cx,ey,90,18,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(180,150,80,0.5)';ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(cx,ey,90,18,0,0,Math.PI*2);ctx.stroke();
    [10,5].forEach(r=>{
      ctx.strokeStyle=`rgba(160,130,65,0.25)`;ctx.lineWidth=0.8;
      ctx.beginPath();ctx.ellipse(cx,ey,90-r,18-r/2,0,0,Math.PI*2);ctx.stroke();
    });
  });
  const lineXs=[cx-65,cx-65,cx-65,cx-65,cx-65,cx-65];
  lineXs.forEach((lx,li)=>{
    const ly=cy-52+li*20;
    const lw=li===2?80:li===4?60:100;
    ctx.fillStyle=`rgba(160,130,70,${0.06+li*0.01})`;
    ctx.fillRect(lx,ly,lw,2.5);
  });
  ctx.fillStyle='rgba(180,150,70,0.15)';ctx.font='bold 60px serif';
  ctx.textAlign='center';ctx.fillText('§',cx,cy+22);ctx.textAlign='left';
  _glow(ctx,cx+55,cy+55,25,'rgba(160,30,30,0.4)');
  const sealG=ctx.createRadialGradient(cx+52,cy+52,2,cx+55,cy+55,20);
  sealG.addColorStop(0,'rgba(200,60,60,0.9)');sealG.addColorStop(0.5,'rgba(160,30,30,0.8)');
  sealG.addColorStop(1,'rgba(120,20,20,0.6)');
  ctx.fillStyle=sealG;ctx.beginPath();ctx.arc(cx+55,cy+55,20,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,100,100,0.4)';ctx.lineWidth=1;
  for(let sr=0;sr<8;sr++){
    const sa=sr/8*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx+55,cy+55);ctx.lineTo(cx+55+Math.cos(sa)*14,cy+55+Math.sin(sa)*14);ctx.stroke();
  }
  ctx.strokeStyle='rgba(255,130,130,0.5)';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(cx+55,cy+55,8,0,Math.PI*2);ctx.stroke();
  (['rgba(180,150,80,0.35)','rgba(160,130,70,0.3)']).forEach((qc,qi)=>{
    const qx=cx+(qi===0?-50:30),qy=cy+(qi===0?-20:10);
    ctx.strokeStyle=qc;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(qx,qy+25);ctx.quadraticCurveTo(qx+10,qy,qx+22,qy-35);ctx.stroke();
    ctx.strokeStyle=qc;ctx.lineWidth=0.8;
    for(let fv=0;fv<5;fv++){
      ctx.beginPath();ctx.moveTo(qx+fv*3,qy+15-fv*10);ctx.lineTo(qx+fv*3+10,qy+8-fv*10);ctx.stroke();
    }
  });
}},

// 25 — Cambio / Fluir
{label:'Cambio', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#010408');bg.addColorStop(0.5,'#020810');bg.addColorStop(1,'#030c16');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.35,40);
  _glow(ctx,W*0.75,H*0.12,80,'rgba(140,160,220,0.12)');
  ctx.fillStyle='rgba(200,210,240,0.7)';ctx.beginPath();ctx.arc(W*0.75,H*0.12,12,0,Math.PI*2);ctx.fill();
  const waveData=[
    {y:H*0.48,amp:10,wl:0.012,alpha:0.08,col:'58,110,168'},
    {y:H*0.52,amp:13,wl:0.010,alpha:0.12,col:'70,130,190'},
    {y:H*0.56,amp:16,wl:0.008,alpha:0.18,col:'50,100,160'},
    {y:H*0.62,amp:18,wl:0.007,alpha:0.28,col:'40,90,150'},
    {y:H*0.68,amp:20,wl:0.006,alpha:0.4,col:'30,75,130'},
    {y:H*0.75,amp:14,wl:0.009,alpha:0.6,col:'20,55,100'},
    {y:H*0.82,amp:10,wl:0.011,alpha:0.8,col:'15,40,80'},
    {y:H*0.9,amp:6,wl:0.013,alpha:0.95,col:'10,25,55'},
  ];
  waveData.forEach(({y,amp,wl,alpha,col})=>{
    ctx.fillStyle=`rgba(${col},${alpha})`;
    ctx.beginPath();ctx.moveTo(0,H);
    for(let x=0;x<=W;x+=3){
      const wy=y+Math.sin(x*wl*Math.PI*2)*amp+Math.sin(x*wl*Math.PI*1.3+1)*amp*0.4;
      x===0?ctx.lineTo(0,wy):ctx.lineTo(x,wy);
    }
    ctx.lineTo(W,H);ctx.closePath();ctx.fill();
    ctx.strokeStyle=`rgba(180,210,255,${alpha*0.3})`;ctx.lineWidth=1;
    ctx.beginPath();
    for(let x=0;x<=W;x+=3){
      const wy=y+Math.sin(x*wl*Math.PI*2)*amp+Math.sin(x*wl*Math.PI*1.3+1)*amp*0.4;
      x===0?ctx.moveTo(0,wy):ctx.lineTo(x,wy);
    }
    ctx.stroke();
  });
  const reflY=H*0.55;
  for(let r=0;r<12;r++){
    const ry=reflY+r*7;
    const rw=(12-r)*20+10;
    const ralpha=0.08-r*0.006;
    if(ralpha<=0)continue;
    ctx.fillStyle=`rgba(200,210,240,${ralpha})`;
    ctx.beginPath();ctx.ellipse(W*0.75,ry,rw,2,0,0,Math.PI*2);ctx.fill();
  }
  for(let f=0;f<15;f++){
    const fx=Math.random()*W,fy=H*0.48+Math.random()*H*0.15;
    ctx.fillStyle=`rgba(200,220,255,${0.05+Math.random()*0.1})`;
    ctx.beginPath();ctx.ellipse(fx,fy,8+Math.random()*15,2+Math.random()*3,Math.random()-0.5,0,Math.PI*2);ctx.fill();
  }
  const horizG=ctx.createLinearGradient(0,H*0.4,0,H*0.55);
  horizG.addColorStop(0,'transparent');horizG.addColorStop(1,'rgba(80,120,200,0.08)');
  ctx.fillStyle=horizG;ctx.fillRect(0,H*0.4,W,H*0.15);
}},

{label:'Iluminación', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#050300');bg.addColorStop(0.6,'#120800');bg.addColorStop(1,'#1e0f00');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.55,50);
  const cx=W/2,cy=H*0.42;
  ([220,160,110,70,40]).forEach((r,i)=>{
    const alpha=[0.06,0.1,0.15,0.25,0.35][i];
    const g=ctx.createRadialGradient(cx,cy,r*0.3,cx,cy,r);
    g.addColorStop(0,`rgba(255,${180-i*20},${60-i*10},${alpha})`);
    g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();
  });
  for(let cr=0;cr<36;cr++){
    const a=cr/36*Math.PI*2;
    const isMain=cr%3===0;
    const r1=55,r2=isMain?130+Math.sin(cr)*20:90+Math.cos(cr*1.3)*15;
    const rayG=ctx.createLinearGradient(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);
    rayG.addColorStop(0,`rgba(255,${200-cr%5*10},60,${isMain?0.7:0.3})`);
    rayG.addColorStop(1,'transparent');
    ctx.strokeStyle=rayG;ctx.lineWidth=isMain?2.5:1;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke();
  }
  ctx.strokeStyle='rgba(255,140,30,0.5)';ctx.lineWidth=4;
  ctx.beginPath();ctx.arc(cx,cy,55,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,100,20,0.3)';ctx.lineWidth=8;
  ctx.beginPath();ctx.arc(cx,cy,55,0,Math.PI*2);ctx.stroke();
  const surfG=ctx.createRadialGradient(cx-12,cy-12,4,cx,cy,52);
  surfG.addColorStop(0,'rgba(255,255,200,0.98)');
  surfG.addColorStop(0.3,'rgba(255,240,100,0.95)');
  surfG.addColorStop(0.7,'rgba(255,180,40,0.9)');
  surfG.addColorStop(1,'rgba(220,120,20,0.85)');
  ctx.fillStyle=surfG;ctx.beginPath();ctx.arc(cx,cy,52,0,Math.PI*2);ctx.fill();
  ([[cx-18,cy+8,8],[cx+20,cy-14,6],[cx+5,cy+22,5]] as [number,number,number][]).forEach(([spx,spy,spr])=>{
    ctx.fillStyle=`rgba(200,100,10,0.5)`;ctx.beginPath();ctx.arc(spx,spy,spr,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(150,60,5,0.7)`;ctx.beginPath();ctx.arc(spx,spy,spr*0.5,0,Math.PI*2);ctx.fill();
  });
  ctx.strokeStyle='rgba(255,100,30,0.6)';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(cx+45,cy+28);
  ctx.bezierCurveTo(cx+70,cy+15,cx+80,cy-20,cx+60,cy-40);
  ctx.bezierCurveTo(cx+40,cy-55,cx+15,cy-60,cx+20,cy-50);ctx.stroke();
  ctx.fillStyle='rgba(8,4,0,0.95)';ctx.fillRect(0,H*0.82,W,H*0.18);
  const groundG=ctx.createLinearGradient(cx-80,H*0.82,cx+80,H*0.82);
  groundG.addColorStop(0,'transparent');groundG.addColorStop(0.5,'rgba(255,200,60,0.12)');
  groundG.addColorStop(1,'transparent');
  ctx.fillStyle=groundG;ctx.fillRect(cx-80,H*0.82,160,H*0.18);
}},

// 27 — Opresión / Cárcel
{label:'Opresión', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#030303');bg.addColorStop(1,'#060608');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  for(let sr=0;sr<8;sr++){
    for(let sc=0;sc<16;sc++){
      const offset=sr%2*30;
      const sx=(sc*60+offset)%(W+60)-30,sy=sr*28;
      ctx.fillStyle=`rgba(${25+sc%3*4},${22+sr%3*3},${25+sc%2*5},${0.4+sr%3*0.05})`;
      ctx.fillRect(sx,sy,55,24);
      ctx.strokeStyle='rgba(15,13,15,0.8)';ctx.lineWidth=2;
      ctx.strokeRect(sx,sy,55,24);
      ctx.fillStyle='rgba(18,16,18,0.9)';
      ctx.fillRect(sx,sy+22,55,2);ctx.fillRect(sx+55,sy,2,24);
    }
  }
  ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(0,0,W,H);
  const barGap=W/9;
  for(let b=0;b<9;b++){
    const bx=barGap*b+barGap*0.5;
    const barG=ctx.createLinearGradient(bx-8,0,bx+8,0);
    barG.addColorStop(0,'rgba(30,28,35,0.9)');
    barG.addColorStop(0.3,'rgba(70,65,80,0.95)');
    barG.addColorStop(0.6,'rgba(80,75,90,0.95)');
    barG.addColorStop(1,'rgba(25,22,30,0.9)');
    ctx.fillStyle=barG;ctx.fillRect(bx-9,0,18,H);
    ([H*0.15,H*0.5,H*0.85]).forEach(ry=>{
      ctx.fillStyle='rgba(50,45,60,0.9)';ctx.beginPath();ctx.arc(bx,ry,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(90,85,100,0.8)';ctx.beginPath();ctx.arc(bx-1,ry-1,2,0,Math.PI*2);ctx.fill();
    });
  }
  ([H*0.15,H*0.5,H*0.85]).forEach(hy=>{
    const hbarG=ctx.createLinearGradient(0,hy-5,0,hy+5);
    hbarG.addColorStop(0,'rgba(40,38,48,0.9)');
    hbarG.addColorStop(0.5,'rgba(65,62,75,0.95)');
    hbarG.addColorStop(1,'rgba(35,33,42,0.9)');
    ctx.fillStyle=hbarG;ctx.fillRect(0,hy-5,W,10);
  });
  const lightG=ctx.createLinearGradient(0,0,W*0.6,H*0.7);
  lightG.addColorStop(0,'rgba(180,170,130,0.12)');
  lightG.addColorStop(0.5,'rgba(160,150,110,0.06)');
  lightG.addColorStop(1,'transparent');
  ctx.fillStyle=lightG;ctx.fillRect(0,0,W,H);
  for(let dm=0;dm<20;dm++){
    const dmx=Math.random()*W*0.4,dmy=Math.random()*H;
    ctx.fillStyle=`rgba(200,190,160,${0.08+Math.random()*0.1})`;
    ctx.beginPath();ctx.arc(dmx,dmy,0.8,0,Math.PI*2);ctx.fill();
  }
  const hx=W*0.7,hy=H*0.45;
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath();ctx.ellipse(hx,hy,22,12,Math.PI/6,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(hx+15,hy,18,10,Math.PI/5,0,Math.PI*2);ctx.fill();
}},

// 28 — Historia / Pergamino
{label:'Historia', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#050400');bg.addColorStop(1,'#0f0b00');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _glow(ctx,W/2,H/2,250,'rgba(140,100,20,0.1)');
  const cx=W/2,cy=H/2;
  const parchB=ctx.createLinearGradient(cx-W*0.38,cy-H*0.38,cx+W*0.38,cy+H*0.38);
  parchB.addColorStop(0,'rgba(160,125,60,0.25)');parchB.addColorStop(0.3,'rgba(180,140,70,0.3)');
  parchB.addColorStop(0.7,'rgba(170,130,65,0.28)');parchB.addColorStop(1,'rgba(150,115,55,0.22)');
  ctx.fillStyle=parchB;ctx.fillRect(cx-W*0.38,cy-H*0.38,W*0.76,H*0.76);
  ctx.strokeStyle='rgba(160,120,50,0.08)';ctx.lineWidth=0.8;
  for(let mg=0;mg<10;mg++){
    ctx.beginPath();ctx.moveTo(cx-W*0.38,cy-H*0.38+mg*H*0.76/9);ctx.lineTo(cx+W*0.38,cy-H*0.38+mg*H*0.76/9);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-W*0.38+mg*W*0.76/9,cy-H*0.38);ctx.lineTo(cx-W*0.38+mg*W*0.76/9,cy+H*0.38);ctx.stroke();
  }
  ctx.strokeStyle='rgba(160,120,50,0.2)';ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(cx-W*0.3,cy+H*0.1);ctx.bezierCurveTo(cx-W*0.1,cy-H*0.2,cx+W*0.1,cy-H*0.15,cx+W*0.25,cy+H*0.05);
  ctx.bezierCurveTo(cx+W*0.35,cy+H*0.2,cx+W*0.2,cy+H*0.3,cx,cy+H*0.28);
  ctx.bezierCurveTo(cx-W*0.2,cy+H*0.32,cx-W*0.35,cy+H*0.25,cx-W*0.3,cy+H*0.1);ctx.stroke();
  ([[cx-W*0.12,cy-H*0.08],[cx+W*0.15,cy-H*0.04],[cx+W*0.02,cy+H*0.12]] as [number,number][]).forEach(([mx,my])=>{
    ctx.strokeStyle='rgba(140,100,40,0.25)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(mx,my-8);ctx.lineTo(mx-10,my+6);ctx.lineTo(mx+10,my+6);ctx.closePath();ctx.stroke();
    ctx.beginPath();ctx.moveTo(mx+6,my-4);ctx.lineTo(mx-2,my+6);ctx.lineTo(mx+14,my+6);ctx.closePath();ctx.stroke();
  });
  const compX=cx+W*0.28,compY=cy-H*0.25;
  ctx.strokeStyle='rgba(180,140,60,0.35)';ctx.lineWidth=1.5;
  for(let cd=0;cd<8;cd++){
    const ca=cd/8*Math.PI*2;
    const cLen=cd%2===0?14:8;
    ctx.beginPath();ctx.moveTo(compX,compY);ctx.lineTo(compX+Math.cos(ca)*cLen,compY+Math.sin(ca)*cLen);ctx.stroke();
  }
  ctx.strokeStyle='rgba(180,140,60,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(compX,compY,5,0,Math.PI*2);ctx.stroke();
  ([cy-H*0.38,cy+H*0.38]).forEach(ey=>{
    const endG=ctx.createRadialGradient(cx,ey,5,cx,ey,24);
    endG.addColorStop(0,'rgba(180,145,70,0.6)');endG.addColorStop(0.5,'rgba(150,115,55,0.4)');endG.addColorStop(1,'transparent');
    ctx.fillStyle=endG;ctx.beginPath();ctx.ellipse(cx,ey,W*0.38,22,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(170,135,65,0.5)';ctx.lineWidth=2;
    ctx.beginPath();ctx.ellipse(cx,ey,W*0.38,22,0,0,Math.PI*2);ctx.stroke();
    ([18,12,6]).forEach(er=>{
      ctx.strokeStyle=`rgba(165,130,60,${0.15+er*0.01})`;ctx.lineWidth=0.8;
      ctx.beginPath();ctx.ellipse(cx,ey,W*0.38-er,22-er*0.4,0,0,Math.PI*2);ctx.stroke();
    });
  });
  ctx.fillStyle='rgba(120,30,20,0.12)';ctx.beginPath();ctx.ellipse(cx-W*0.2,cy+H*0.2,15,10,Math.PI/4,0,Math.PI*2);ctx.fill();
  _stars(ctx,W,H,10);
}},

// 29 — Ciencia / Átomo
{label:'Ciencia', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#020508');bg.addColorStop(1,'#030810');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(14,138,138,0.05)';ctx.lineWidth=1;
  for(let gl=0;gl<20;gl++){
    ctx.beginPath();ctx.moveTo(gl*W/19,0);ctx.lineTo(gl*W/19,H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,gl*H/19);ctx.lineTo(W,gl*H/19);ctx.stroke();
  }
  _stars(ctx,W,H,40);
  const cx=W/2,cy=H/2;
  ([[W*0.15,H*0.25,20,'rgba(14,138,138,0.15)'],[W*0.82,H*0.65,16,'rgba(80,160,220,0.12)'],[W*0.7,H*0.2,14,'rgba(14,200,180,0.1)']] as [number,number,number,string][]).forEach(([ax,ay,ar,ac])=>{
    _glow(ctx,ax,ay,ar*3,ac);
    ctx.fillStyle=ac.replace('0.1','0.5').replace('0.15','0.6').replace('0.12','0.55');
    ctx.beginPath();ctx.arc(ax,ay,ar*0.35,0,Math.PI*2);ctx.fill();
    for(let oe=0;oe<3;oe++){
      ctx.strokeStyle=ac.replace(/[\d.]+\)$/,`${0.25+oe*0.05})`);ctx.lineWidth=1;
      ctx.save();ctx.translate(ax,ay);ctx.rotate(oe*Math.PI/3);
      ctx.beginPath();ctx.ellipse(0,0,ar,ar*0.38,0,0,Math.PI*2);ctx.stroke();
      ctx.restore();
    }
  });
  _glow(ctx,cx,cy,130,'rgba(14,138,138,0.2)');
  _glow(ctx,cx,cy,60,'rgba(14,200,200,0.3)');
  const orbitals=[
    {rx:100,ry:38,angle:0,color:'rgba(14,180,180,0.6)',eColor:'rgba(14,220,220,0.95)',ePos:0.2},
    {rx:85,ry:34,angle:Math.PI/3,color:'rgba(80,160,220,0.5)',eColor:'rgba(100,180,255,0.95)',ePos:0.65},
    {rx:95,ry:36,angle:-Math.PI/3,color:'rgba(14,160,160,0.55)',eColor:'rgba(20,200,200,0.9)',ePos:0.8},
    {rx:80,ry:30,angle:Math.PI/2,color:'rgba(100,200,220,0.45)',eColor:'rgba(120,220,240,0.9)',ePos:0.4},
  ];
  orbitals.forEach(({rx,ry,angle,color,eColor,ePos})=>{
    ctx.save();ctx.translate(cx,cy);ctx.rotate(angle);
    ctx.strokeStyle=color;ctx.lineWidth=1.5;
    ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2);ctx.stroke();
    const ea=ePos*Math.PI*2;
    const ex=Math.cos(ea)*rx,ey=Math.sin(ea)*ry;
    _glow(ctx,ex,ey,12,color);
    ctx.fillStyle=eColor;ctx.beginPath();ctx.arc(ex,ey,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.8)';ctx.beginPath();ctx.arc(ex-1,ey-1,2,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });
  const nucleonColors=['rgba(255,80,60,0.9)','rgba(200,200,200,0.85)'];
  ([[0,0],[5,-4],[-5,4],[0,7],[0,-7],[5,4],[-5,-4]] as [number,number][]).forEach(([nx,ny],ni)=>{
    const nucG=ctx.createRadialGradient(cx+nx-2,cy+ny-2,1,cx+nx,cy+ny,6);
    nucG.addColorStop(0,'rgba(255,255,255,0.8)');
    nucG.addColorStop(0.3,nucleonColors[ni%2]);
    nucG.addColorStop(1,nucleonColors[ni%2].replace('0.9','0.4').replace('0.85','0.35'));
    ctx.fillStyle=nucG;ctx.beginPath();ctx.arc(cx+nx,cy+ny,6,0,Math.PI*2);ctx.fill();
  });
  _glow(ctx,cx,cy,20,'rgba(255,200,100,0.4)');
  ctx.fillStyle='rgba(14,180,180,0.2)';ctx.font='italic 14px serif';
  ctx.fillText('E = mc²',cx+120,cy-60);
  ctx.fillText('∫ψdV = 1',cx-180,cy+70);
}},

// 30 — Eternidad / Lemniscata
{label:'Eternidad', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#030208');bg.addColorStop(0.5,'#060412');bg.addColorStop(1,'#040210');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  for(let s=0;s<200;s++){
    const sz=Math.random(),x=Math.random()*W,y=Math.random()*H;
    ctx.fillStyle=`rgba(${180+Math.random()*75},${160+Math.random()*75},255,${0.15+sz*0.7})`;
    ctx.beginPath();ctx.arc(x,y,sz*1.3,0,Math.PI*2);ctx.fill();
  }
  ([[W*0.2,H*0.3,80,'rgba(120,60,220,0.12)'],[W*0.75,H*0.6,70,'rgba(60,100,220,0.1)'],
   [W*0.5,H*0.15,60,'rgba(180,60,200,0.09)'],[W*0.3,H*0.8,50,'rgba(80,160,220,0.08)']] as [number,number,number,string][]).forEach(([x,y,r,c])=>_glow(ctx,x,y,r,c));
  const cx=W/2,cy=H/2,sc=85;
  ([6,5,4,3,2]).forEach((lw,li)=>{
    const alpha=[0.08,0.12,0.18,0.3,0.7][li];
    const hue=240+li*15;
    ctx.strokeStyle=`hsla(${hue},70%,75%,${alpha})`;ctx.lineWidth=lw;
    ctx.beginPath();
    for(let t=0;t<=Math.PI*2+0.05;t+=0.02){
      const denom=1+Math.sin(t)*Math.sin(t);
      const lx=cx+sc*Math.cos(t)*1.9/denom;
      const ly=cy+sc*Math.sin(t)*Math.cos(t)/denom;
      t<0.02?ctx.moveTo(lx,ly):ctx.lineTo(lx,ly);
    }
    ctx.stroke();
  });
  for(let ef=0;ef<30;ef++){
    const t=ef/30*Math.PI*2;
    const denom=1+Math.sin(t)*Math.sin(t);
    const efx=cx+sc*Math.cos(t)*1.9/denom;
    const efy=cy+sc*Math.sin(t)*Math.cos(t)/denom;
    const efAlpha=0.2+Math.sin(ef*0.7)*0.3;
    _glow(ctx,efx,efy,8,`rgba(200,160,255,${efAlpha*0.4})`);
    ctx.fillStyle=`rgba(220,180,255,${efAlpha})`;
    ctx.beginPath();ctx.arc(efx,efy,2.5,0,Math.PI*2);ctx.fill();
  }
  _glow(ctx,cx,cy,40,'rgba(220,180,255,0.5)');
  _glow(ctx,cx,cy,20,'rgba(255,220,255,0.7)');
  ctx.fillStyle='rgba(255,255,255,0.95)';ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fill();
  _glow(ctx,cx-sc*1.2,cy,30,'rgba(160,120,255,0.35)');
  _glow(ctx,cx+sc*1.2,cy,30,'rgba(160,120,255,0.35)');
  ([cx-sc*1.2,cx+sc*1.2]).forEach(lox=>{
    ctx.fillStyle='rgba(200,170,255,0.8)';ctx.beginPath();ctx.arc(lox,cy,4,0,Math.PI*2);ctx.fill();
  });
  const gx=W*0.84,gy=H*0.2;
  for(let gs=0;gs<80;gs++){
    const gt=gs/80*Math.PI*6,gr=gs/80*25;
    const gsx=gx+Math.cos(gt)*gr,gsy=gy+Math.sin(gt)*gr*0.55;
    ctx.fillStyle=`rgba(200,190,255,${0.05+gs/80*0.4})`;
    ctx.beginPath();ctx.arc(gsx,gsy,0.8,0,Math.PI*2);ctx.fill();
  }
  _glow(ctx,gx,gy,15,'rgba(200,190,255,0.2)');
  (['∞','∮','∂','Ω']).forEach((sym,si)=>{
    const sx=W*0.08+si*W*0.27,sy=H*0.14+Math.sin(si*1.2)*H*0.06;
    ctx.fillStyle=`rgba(180,150,255,${0.08+si*0.02})`;
    ctx.font=`${16+si%3*4}px serif`;ctx.fillText(sym,sx,sy);
  });
}},

];

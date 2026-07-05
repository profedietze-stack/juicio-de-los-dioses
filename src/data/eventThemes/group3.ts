import type { EventTheme } from '../../types';
import { _stars, _glow } from './canvasHelpers';

export const group3: EventTheme[] = [

{label:'Vacío', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#010103');bg.addColorStop(0.45,'#040310');bg.addColorStop(0.7,'#0a0610');bg.addColorStop(1,'#140c00');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.65,100);
  for(let bs=0;bs<5;bs++){
    const bsx=Math.random()*W,bsy=Math.random()*H*0.5;
    _glow(ctx,bsx,bsy,8,`rgba(255,255,255,0.2)`);
    ctx.fillStyle='rgba(255,255,255,0.9)';ctx.beginPath();ctx.arc(bsx,bsy,1.5,0,Math.PI*2);ctx.fill();
  }
  const mwG=ctx.createLinearGradient(0,H*0.1,W,H*0.6);
  mwG.addColorStop(0,'transparent');mwG.addColorStop(0.3,'rgba(200,190,255,0.03)');
  mwG.addColorStop(0.7,'rgba(200,190,255,0.05)');mwG.addColorStop(1,'transparent');
  ctx.fillStyle=mwG;ctx.fillRect(0,0,W,H*0.65);
  _glow(ctx,W*0.75,H*0.12,40,'rgba(220,215,200,0.15)');
  const moonG=ctx.createRadialGradient(W*0.75-4,H*0.12-4,1,W*0.75,H*0.12,18);
  moonG.addColorStop(0,'rgba(240,235,220,0.95)');moonG.addColorStop(0.7,'rgba(200,195,175,0.8)');moonG.addColorStop(1,'rgba(160,155,130,0.5)');
  ctx.fillStyle=moonG;ctx.beginPath();ctx.arc(W*0.75,H*0.12,18,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(4,3,16,0.7)';ctx.beginPath();ctx.arc(W*0.75+6,H*0.12,18,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(60,45,20,0.6)';
  ctx.beginPath();ctx.moveTo(0,H);
  let px2=0;
  while(px2<=W){const peakH=H*(0.46+Math.sin(px2*0.008)*0.06+Math.random()*0.04);ctx.lineTo(px2,peakH);px2+=12;}
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(50,35,12,0.8)';
  ctx.beginPath();ctx.moveTo(0,H);
  let px3=0;
  while(px3<=W){const peakH=H*(0.58+Math.sin(px3*0.012+1)*0.07+Math.cos(px3*0.007)*0.04);ctx.lineTo(px3,peakH);px3+=10;}
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(30,20,5,0.95)';
  ctx.beginPath();ctx.moveTo(0,H);
  let px4=0;
  while(px4<=W){const peakH=H*(0.72+Math.sin(px4*0.015+2.5)*0.05+Math.cos(px4*0.01)*0.03);ctx.lineTo(px4,peakH);px4+=8;}
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  const figX=W*0.35,figY=H*0.7;
  ctx.fillStyle='rgba(10,7,2,0.98)';
  ctx.beginPath();ctx.arc(figX,figY-22,6,0,Math.PI*2);ctx.fill();
  ctx.fillRect(figX-3,figY-16,6,20);
  ctx.fillRect(figX-10,figY-12,7,2);
  ctx.fillRect(figX+3,figY-12,7,2);
  ctx.fillRect(figX-4,figY+4,5,12);ctx.fillRect(figX-1,figY+4,5,12);
  const refl=ctx.createLinearGradient(W*0.75-30,H*0.72,W*0.75+30,H);
  refl.addColorStop(0,'rgba(200,190,150,0.08)');refl.addColorStop(1,'transparent');
  ctx.fillStyle=refl;ctx.fillRect(W*0.75-30,H*0.72,60,H*0.28);
}},

// 18 — Deber / Escudo
{label:'Deber', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#060205');bg.addColorStop(1,'#100408');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,50);
  const cx=W/2,cy=H/2+5;
  _glow(ctx,cx,cy,140,'rgba(140,30,30,0.12)');
  ctx.fillStyle='rgba(0,0,0,0.4)';
  ctx.beginPath();ctx.ellipse(cx+8,cy+75,52,12,0,0,Math.PI*2);ctx.fill();
  const shieldPath=()=>{
    ctx.beginPath();
    ctx.moveTo(cx,cy-75);
    ctx.bezierCurveTo(cx+60,cy-75,cx+65,cy-30,cx+65,cy);
    ctx.bezierCurveTo(cx+65,cy+30,cx+45,cy+55,cx,cy+80);
    ctx.bezierCurveTo(cx-45,cy+55,cx-65,cy+30,cx-65,cy);
    ctx.bezierCurveTo(cx-65,cy-30,cx-60,cy-75,cx,cy-75);
    ctx.closePath();
  };
  ctx.save();ctx.translate(3,4);shieldPath();ctx.fillStyle='rgba(80,20,20,0.5)';ctx.fill();ctx.restore();
  shieldPath();
  const shieldFill=ctx.createRadialGradient(cx-20,cy-20,5,cx,cy,70);
  shieldFill.addColorStop(0,'rgba(140,30,30,0.9)');
  shieldFill.addColorStop(0.5,'rgba(100,20,20,0.85)');
  shieldFill.addColorStop(1,'rgba(60,10,10,0.9)');
  ctx.fillStyle=shieldFill;ctx.fill();
  shieldPath();
  const borderG=ctx.createLinearGradient(cx-65,cy-75,cx+65,cy+80);
  borderG.addColorStop(0,'rgba(212,175,55,0.9)');
  borderG.addColorStop(0.3,'rgba(255,210,80,1)');
  borderG.addColorStop(0.7,'rgba(180,140,30,0.7)');
  borderG.addColorStop(1,'rgba(212,175,55,0.8)');
  ctx.strokeStyle=borderG;ctx.lineWidth=4;ctx.stroke();
  ctx.save();ctx.scale(0.82,0.82);ctx.translate(cx*0.18,cy*0.18+cy*0.02);shieldPath();
  ctx.strokeStyle='rgba(212,175,55,0.3)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  const crossW=8,crossH=55;
  ctx.fillStyle='rgba(212,175,55,0.85)';
  ctx.fillRect(cx-crossW/2,cy-crossH/2,crossW,crossH);
  ctx.fillRect(cx-crossH*0.4,cy-crossW/2,crossH*0.8,crossW);
  ctx.fillStyle='rgba(255,240,150,0.4)';
  ctx.fillRect(cx-crossW/2,cy-crossH/2,2,crossH);
  ctx.fillRect(cx-crossH*0.4,cy-crossW/2,crossH*0.8,2);
  _glow(ctx,cx,cy,22,'rgba(255,200,60,0.4)');
  ctx.fillStyle='rgba(212,175,55,0.9)';ctx.beginPath();ctx.arc(cx,cy,10,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,240,150,0.6)';ctx.beginPath();ctx.arc(cx-2,cy-2,4,0,Math.PI*2);ctx.fill();
  for(let sc=0;sc<8;sc++){
    const scx=cx+(Math.random()-0.5)*90,scy=cy+(Math.random()-0.5)*100;
    const scA=Math.random()*Math.PI;
    ctx.strokeStyle=`rgba(212,175,55,${0.08+Math.random()*0.1})`;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(scx,scy);ctx.lineTo(scx+Math.cos(scA)*15,scy+Math.sin(scA)*15);ctx.stroke();
  }
}},

// 19 — Bifurcación / La Decisión
{label:'La Decisión', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#030308');bg.addColorStop(1,'#080810');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,70);
  const bx=W/2,by=H*0.62;
  for(let m=0;m<5;m++){
    const mg=ctx.createLinearGradient(0,H*0.5+m*12,W,H*0.5+m*12+20);
    mg.addColorStop(0,'transparent');mg.addColorStop(0.3,'rgba(100,100,140,0.04)');
    mg.addColorStop(0.7,'rgba(100,100,140,0.06)');mg.addColorStop(1,'transparent');
    ctx.fillStyle=mg;ctx.fillRect(0,H*0.5+m*12,W,20);
  }
  ctx.strokeStyle='rgba(80,80,100,0.12)';ctx.lineWidth=1;
  for(let gl=0;gl<8;gl++){
    const gy=by+gl*15;
    ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.stroke();
  }
  const roadG=ctx.createLinearGradient(bx,H,bx,by);
  roadG.addColorStop(0,'rgba(80,75,100,0.5)');roadG.addColorStop(1,'rgba(60,55,80,0.2)');
  ctx.fillStyle=roadG;
  ctx.beginPath();ctx.moveTo(bx-35,H);ctx.lineTo(bx-4,by);ctx.lineTo(bx+4,by);ctx.lineTo(bx+35,H);ctx.closePath();ctx.fill();
  for(let d=0;d<6;d++){
    const dy=by+30+d*28;
    ctx.fillStyle=`rgba(212,175,55,${0.3-d*0.04})`;
    ctx.fillRect(bx-1.5,dy,3,12);
  }
  const leftG=ctx.createLinearGradient(bx,by,bx-W*0.4,H*0.08);
  leftG.addColorStop(0,'rgba(58,110,168,0.4)');leftG.addColorStop(1,'rgba(30,60,120,0.15)');
  ctx.fillStyle=leftG;
  ctx.beginPath();ctx.moveTo(bx-4,by);ctx.quadraticCurveTo(bx-W*0.25,by-40,bx-W*0.42,H*0.06);
  ctx.lineTo(bx-W*0.42+18,H*0.06);ctx.quadraticCurveTo(bx-W*0.23,by-24,bx+4,by);ctx.closePath();ctx.fill();
  _glow(ctx,bx-W*0.42,H*0.06,30,'rgba(58,110,168,0.4)');
  ctx.fillStyle='rgba(100,160,255,0.8)';ctx.beginPath();ctx.arc(bx-W*0.42,H*0.06,8,0,Math.PI*2);ctx.fill();
  const rightG=ctx.createLinearGradient(bx,by,bx+W*0.4,H*0.08);
  rightG.addColorStop(0,'rgba(176,50,50,0.4)');rightG.addColorStop(1,'rgba(120,20,20,0.15)');
  ctx.fillStyle=rightG;
  ctx.beginPath();ctx.moveTo(bx+4,by);ctx.quadraticCurveTo(bx+W*0.25,by-40,bx+W*0.42,H*0.06);
  ctx.lineTo(bx+W*0.42-18,H*0.06);ctx.quadraticCurveTo(bx+W*0.23,by-24,bx-4,by);ctx.closePath();ctx.fill();
  _glow(ctx,bx+W*0.42,H*0.06,30,'rgba(176,50,50,0.4)');
  ctx.fillStyle='rgba(255,80,80,0.8)';ctx.beginPath();ctx.arc(bx+W*0.42,H*0.06,8,0,Math.PI*2);ctx.fill();
  _glow(ctx,bx,by,40,'rgba(212,175,55,0.5)');
  _glow(ctx,bx,by,15,'rgba(255,230,100,0.7)');
  ctx.fillStyle='rgba(255,220,60,0.95)';ctx.beginPath();ctx.arc(bx,by,7,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(150,130,100,0.5)';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(bx,by-5);ctx.lineTo(bx,by-45);ctx.stroke();
  ctx.fillStyle='rgba(80,70,50,0.5)';ctx.fillRect(bx-25,by-55,50,14);
  ctx.fillStyle='rgba(212,175,55,0.5)';ctx.font='bold 8px serif';
  ctx.textAlign='center';ctx.fillText('?',bx,by-44);ctx.textAlign='left';
}},

// 20 — Naturaleza / Bosque
{label:'Naturaleza', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#010803');bg.addColorStop(0.6,'#020f05');bg.addColorStop(1,'#030d04');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.38,55);
  _glow(ctx,W*0.8,H*0.1,50,'rgba(200,220,200,0.1)');
  ctx.fillStyle='rgba(230,240,220,0.6)';ctx.beginPath();ctx.arc(W*0.8,H*0.1,12,0,Math.PI*2);ctx.fill();
  for(let t=0;t<15;t++){
    const tx=t*W/14,th=H*(0.35+Math.sin(t*0.8)*0.08);
    const tg=ctx.createLinearGradient(0,H-th,0,H);
    tg.addColorStop(0,'rgba(15,45,18,0.3)');tg.addColorStop(1,'rgba(5,20,7,0.5)');
    ctx.fillStyle=tg;
    ctx.beginPath();ctx.moveTo(tx,H-th);ctx.lineTo(tx-12,H-th+th*0.3);ctx.lineTo(tx-7,H-th+th*0.3);
    ctx.lineTo(tx-14,H-th+th*0.55);ctx.lineTo(tx-8,H-th+th*0.55);
    ctx.lineTo(tx-16,H-th+th*0.8);ctx.lineTo(tx+16,H-th+th*0.8);
    ctx.lineTo(tx+8,H-th+th*0.55);ctx.lineTo(tx+14,H-th+th*0.55);
    ctx.lineTo(tx+7,H-th+th*0.3);ctx.lineTo(tx+12,H-th+th*0.3);ctx.closePath();ctx.fill();
  }
  for(let t=0;t<10;t++){
    const tx=t*W/9+W*0.05,th=H*(0.45+Math.cos(t*1.2)*0.1);
    const tg=ctx.createLinearGradient(tx,H-th,tx,H);
    tg.addColorStop(0,'rgba(20,65,22,0.7)');tg.addColorStop(1,'rgba(8,30,10,0.9)');
    ctx.fillStyle=tg;
    ctx.beginPath();ctx.moveTo(tx,H-th);
    for(let l=0;l<4;l++){
      const ly=H-th+l*(th*0.22),lw=10+l*8;
      ctx.lineTo(tx-lw*0.8,ly+10);ctx.lineTo(tx-lw*0.5,ly+10);
      ctx.lineTo(tx-lw,ly+th*0.22);ctx.lineTo(tx+lw,ly+th*0.22);
      ctx.lineTo(tx+lw*0.5,ly+10);ctx.lineTo(tx+lw*0.8,ly+10);
    }
    ctx.lineTo(tx+30,H);ctx.lineTo(tx-30,H);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(40,25,10,0.7)';ctx.fillRect(tx-4,H-th*0.25,8,th*0.25);
  }
  ctx.fillStyle='rgba(10,40,12,0.9)';ctx.fillRect(0,H*0.85,W,H*0.15);
  for(let ff=0;ff<20;ff++){
    const fx=Math.random()*W,fy=H*0.4+Math.random()*H*0.45;
    const fa=0.3+Math.random()*0.6;
    _glow(ctx,fx,fy,6,`rgba(180,255,100,${fa*0.5})`);
    ctx.fillStyle=`rgba(200,255,120,${fa})`;ctx.beginPath();ctx.arc(fx,fy,1.5,0,Math.PI*2);ctx.fill();
  }
  const mist=ctx.createLinearGradient(0,H*0.8,0,H);
  mist.addColorStop(0,'transparent');mist.addColorStop(0.5,'rgba(60,120,65,0.08)');
  mist.addColorStop(1,'rgba(30,60,32,0.2)');
  ctx.fillStyle=mist;ctx.fillRect(0,H*0.8,W,H*0.2);
  const rayG=ctx.createLinearGradient(W*0.5,0,W*0.45,H*0.8);
  rayG.addColorStop(0,'rgba(220,240,220,0.08)');rayG.addColorStop(1,'transparent');
  ctx.fillStyle=rayG;
  ctx.beginPath();ctx.moveTo(W*0.48,0);ctx.lineTo(W*0.52,0);ctx.lineTo(W*0.56,H*0.7);ctx.lineTo(W*0.44,H*0.7);ctx.closePath();ctx.fill();
}},

// 21 — Conocimiento / Manuscrito
{label:'Conocimiento', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#060400');bg.addColorStop(1,'#110900');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _glow(ctx,W/2,H/2,200,'rgba(160,120,40,0.08)');
  const parchG=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,W*0.6);
  parchG.addColorStop(0,'rgba(160,120,50,0.12)');parchG.addColorStop(0.5,'rgba(130,95,35,0.08)');
  parchG.addColorStop(1,'transparent');
  ctx.fillStyle=parchG;ctx.fillRect(0,0,W,H);
  const lineGroups:[number,number,number][]=[[W*0.1,W*0.5,H*0.12],[W*0.1,W*0.45,H*0.21],[W*0.1,W*0.55,H*0.3],
    [W*0.1,W*0.38,H*0.39],[W*0.1,W*0.48,H*0.48],[W*0.1,W*0.52,H*0.57],
    [W*0.1,W*0.42,H*0.66],[W*0.1,W*0.5,H*0.75],[W*0.1,W*0.35,H*0.84]];
  lineGroups.forEach(([x,len,y],li)=>{
    const alpha=0.06+li*0.01;
    ctx.fillStyle=`rgba(180,140,60,${alpha})`;
    ctx.fillRect(x,y,len,3+li%3*0.5);
    if(li%2===0){
      ctx.fillStyle=`rgba(170,130,55,${alpha*0.8})`;
      ctx.fillRect(W*0.62,y,len*0.65,2.5);
    }
  });
  const ilx=W*0.08,ily=H*0.09;
  const ilG=ctx.createLinearGradient(ilx,ily,ilx+50,ily+65);
  ilG.addColorStop(0,'rgba(212,175,55,0.6)');ilG.addColorStop(1,'rgba(180,140,30,0.3)');
  ctx.fillStyle=ilG;ctx.fillRect(ilx,ily,50,65);
  ctx.strokeStyle='rgba(212,175,55,0.5)';ctx.lineWidth=1;ctx.strokeRect(ilx,ily,50,65);
  ctx.fillStyle='rgba(212,175,55,0.8)';ctx.font='bold 42px serif';ctx.fillText('Φ',ilx+8,ily+50);
  ctx.strokeStyle='rgba(180,140,50,0.2)';ctx.lineWidth=2;
  ctx.strokeRect(W*0.07,H*0.08,W*0.85,H*0.84);
  [[W*0.07,H*0.08],[W*0.92,H*0.08],[W*0.07,H*0.92],[W*0.92,H*0.92]].forEach(([fx,fy])=>{
    ctx.strokeStyle='rgba(212,175,55,0.3)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.arc(fx,fy,12,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(fx,fy,6,0,Math.PI*2);ctx.stroke();
  });
  const qx=W*0.78,qy=H*0.28;
  const quillG=ctx.createLinearGradient(qx,qy,qx+30,qy-60);
  quillG.addColorStop(0,'rgba(212,175,55,0.2)');quillG.addColorStop(1,'rgba(240,220,180,0.6)');
  ctx.strokeStyle=quillG;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(qx,qy+30);ctx.quadraticCurveTo(qx+8,qy,qx+20,qy-45);ctx.stroke();
  for(let v=0;v<6;v++){
    const vy=qy+20-v*12;
    ctx.strokeStyle=`rgba(212,175,55,${0.1+v*0.03})`;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(qx+v*2,vy);ctx.lineTo(qx+v*2+15,vy-8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(qx+v*2,vy);ctx.lineTo(qx+v*2-8,vy-5);ctx.stroke();
  }
  ctx.fillStyle='rgba(40,30,10,0.6)';ctx.beginPath();ctx.arc(qx+2,qy+32,5,0,Math.PI*2);ctx.fill();
  _stars(ctx,W,H,8);
}},

// 22 — Cuidado / Manos
{label:'Cuidado', fn:(ctx,W,H)=>{
  const bg=ctx.createRadialGradient(W/2,H*0.4,0,W/2,H/2,W*0.7);
  bg.addColorStop(0,'#100616');bg.addColorStop(0.5,'#08040e');bg.addColorStop(1,'#030208');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,35);
  const cx=W/2,cy=H/2;
  _glow(ctx,cx,cy,200,'rgba(192,82,138,0.07)');
  _glow(ctx,cx,cy,140,'rgba(200,100,150,0.1)');
  _glow(ctx,cx,cy,80,'rgba(220,120,160,0.15)');
  const drawHand=(flip:boolean)=>{
    const hx=cx+(flip?28:-28),hy=cy+18;
    const sc=flip?-1:1;
    ctx.save();ctx.translate(hx,hy);ctx.scale(sc,1);
    const palmG=ctx.createRadialGradient(0,0,0,0,0,30);
    palmG.addColorStop(0,'rgba(220,160,180,0.5)');palmG.addColorStop(1,'rgba(180,100,140,0.2)');
    ctx.fillStyle=palmG;
    ctx.beginPath();ctx.ellipse(0,0,22,28,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(220,140,170,0.5)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.ellipse(0,0,22,28,0,0,Math.PI*2);ctx.stroke();
    const fingers:[number,number][]=[[-12,-28],[-4,-32],[5,-32],[13,-28]];
    fingers.forEach(([fx,fy],i)=>{
      ctx.fillStyle=`rgba(210,150,175,${0.4-i*0.03})`;
      ctx.beginPath();ctx.ellipse(fx,fy,4.5,9,i*0.1-0.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(220,140,170,0.4)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(fx,fy,4.5,9,i*0.1-0.2,0,Math.PI*2);ctx.stroke();
    });
    ctx.fillStyle='rgba(210,150,175,0.4)';
    ctx.beginPath();ctx.ellipse(-20,-8,4,10,-0.4,0,Math.PI*2);ctx.fill();
    ctx.restore();
  };
  drawHand(false);drawHand(true);
  _glow(ctx,cx,cy-10,35,'rgba(255,200,220,0.25)');
  const drawHeart=(hcx:number,hcy:number,hs:number,alpha:number)=>{
    ctx.save();ctx.translate(hcx,hcy);
    const hg=ctx.createRadialGradient(0,-hs*0.1,0,0,0,hs*1.4);
    hg.addColorStop(0,`rgba(255,240,245,${alpha})`);
    hg.addColorStop(0.3,`rgba(255,120,160,${alpha*0.9})`);
    hg.addColorStop(0.7,`rgba(200,60,100,${alpha*0.7})`);
    hg.addColorStop(1,`rgba(150,30,70,${alpha*0.3})`);
    ctx.fillStyle=hg;
    ctx.beginPath();
    ctx.moveTo(0,hs*0.5);
    ctx.bezierCurveTo(-hs*0.05,-hs*0.15,-hs*1.1,-hs*0.7,-hs,hs*0.05);
    ctx.bezierCurveTo(-hs*1.1,hs*0.55,-hs*0.05,hs*1.0,0,hs*1.3);
    ctx.bezierCurveTo(hs*0.05,hs*1.0,hs*1.1,hs*0.55,hs,hs*0.05);
    ctx.bezierCurveTo(hs*1.1,-hs*0.7,hs*0.05,-hs*0.15,0,hs*0.5);
    ctx.fill();
    ctx.restore();
  };
  drawHeart(cx,cy-32,14,0.9);
  _glow(ctx,cx,cy-30,28,'rgba(255,100,150,0.5)');
  ([[cx-55,cy-18,6,0.35],[cx+55,cy-18,6,0.35],[cx,cy-68,5,0.25]] as [number,number,number,number][]).forEach(([hx,hy,hs,a])=>drawHeart(hx,hy,hs,a));
  for(let p=0;p<18;p++){
    const px=cx+(Math.random()-0.5)*80,py=cy-40-Math.random()*70;
    const pg=ctx.createRadialGradient(px,py,0,px,py,3);
    pg.addColorStop(0,'rgba(255,200,220,0.8)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();
  }
  const vig=ctx.createRadialGradient(cx,cy,H*0.15,cx,cy,H*0.75);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.4)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
}},

{label:'Futuro', fn:(ctx,W,H)=>{
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  for(let s=0;s<180;s++){
    const sz=Math.random();
    ctx.fillStyle=`rgba(255,255,255,${0.1+sz*0.8})`;
    ctx.beginPath();ctx.arc(Math.random()*W,Math.random()*H,sz*1.4,0,Math.PI*2);ctx.fill();
  }
  for(let sl=0;sl<25;sl++){
    const slx=Math.random()*W,sly=Math.random()*H;
    const slLen=20+Math.random()*80;
    const slG=ctx.createLinearGradient(slx,sly,slx+slLen,sly);
    slG.addColorStop(0,'rgba(180,200,255,0.35)');slG.addColorStop(1,'transparent');
    ctx.strokeStyle=slG;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(slx,sly);ctx.lineTo(slx+slLen,sly);ctx.stroke();
  }
  _glow(ctx,W*0.15,H*0.25,55,'rgba(80,40,180,0.3)');
  const planG=ctx.createRadialGradient(W*0.13,H*0.23,3,W*0.15,H*0.25,38);
  planG.addColorStop(0,'rgba(120,80,220,0.8)');planG.addColorStop(0.6,'rgba(80,40,160,0.7)');
  planG.addColorStop(1,'rgba(40,20,100,0.5)');
  ctx.fillStyle=planG;ctx.beginPath();ctx.arc(W*0.15,H*0.25,38,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(140,100,220,0.4)';ctx.lineWidth=3;
  ctx.beginPath();ctx.ellipse(W*0.15,H*0.25,60,12,Math.PI/6,0,Math.PI*2);ctx.stroke();
  const rx=W/2,ry=H/2;
  const plume1=ctx.createRadialGradient(rx,ry+60,3,rx,ry+90,55);
  plume1.addColorStop(0,'rgba(255,255,200,0.9)');
  plume1.addColorStop(0.2,'rgba(255,160,40,0.7)');
  plume1.addColorStop(0.5,'rgba(255,80,20,0.4)');plume1.addColorStop(1,'transparent');
  ctx.fillStyle=plume1;ctx.beginPath();ctx.ellipse(rx,ry+90,30,55,0,0,Math.PI*2);ctx.fill();
  const plume2=ctx.createRadialGradient(rx,ry+70,2,rx,ry+110,30);
  plume2.addColorStop(0,'rgba(200,240,255,0.8)');plume2.addColorStop(1,'transparent');
  ctx.fillStyle=plume2;ctx.beginPath();ctx.ellipse(rx,ry+110,12,30,0,0,Math.PI*2);ctx.fill();
  const bodyG=ctx.createLinearGradient(rx-22,0,rx+22,0);
  bodyG.addColorStop(0,'rgba(150,155,180,0.6)');
  bodyG.addColorStop(0.3,'rgba(210,215,240,0.85)');
  bodyG.addColorStop(0.7,'rgba(220,225,250,0.85)');
  bodyG.addColorStop(1,'rgba(140,145,170,0.5)');
  ctx.fillStyle=bodyG;
  ctx.beginPath();ctx.moveTo(rx,ry-65);ctx.bezierCurveTo(rx-10,ry-40,rx-22,ry-20,rx-22,ry+40);
  ctx.lineTo(rx+22,ry+40);ctx.bezierCurveTo(rx+22,ry-20,rx+10,ry-40,rx,ry-65);ctx.fill();
  ctx.strokeStyle='rgba(200,210,240,0.4)';ctx.lineWidth=1;ctx.stroke();
  _glow(ctx,rx,ry-65,20,'rgba(200,220,255,0.3)');
  ([[-1,1],[1,-1]] as [number,number][]).forEach(([sx,sy])=>{
    ctx.fillStyle='rgba(160,165,190,0.6)';
    ctx.beginPath();ctx.moveTo(rx+sx*22,ry+20);ctx.lineTo(rx+sx*45,ry+55);ctx.lineTo(rx+sx*22,ry+40);ctx.closePath();ctx.fill();
  });
  _glow(ctx,rx,ry-20,16,'rgba(100,200,255,0.4)');
  const winG=ctx.createRadialGradient(rx-3,ry-23,2,rx,ry-20,12);
  winG.addColorStop(0,'rgba(200,240,255,0.9)');winG.addColorStop(0.4,'rgba(80,180,255,0.6)');winG.addColorStop(1,'rgba(20,80,180,0.3)');
  ctx.fillStyle=winG;ctx.beginPath();ctx.arc(rx,ry-20,12,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(180,220,255,0.6)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(rx,ry-20,12,0,Math.PI*2);ctx.stroke();
}},

];

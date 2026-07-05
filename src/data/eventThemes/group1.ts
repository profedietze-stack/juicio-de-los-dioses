import type { EventTheme } from '../../types';
import { _stars, _glow } from './canvasHelpers';

export const group1: EventTheme[] = [

// 1 — La Balanza / Justicia
{label:'La Balanza', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#060412');bg.addColorStop(0.5,'#0d0820');bg.addColorStop(1,'#0a0614');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  for(let i=0;i<6;i++){
    const g=ctx.createRadialGradient(W*0.3+i*60,H*0.4,0,W*0.3+i*60,H*0.4,80+i*30);
    g.addColorStop(0,`rgba(120,80,200,${0.04+i*0.01})`);g.addColorStop(1,'transparent');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  _stars(ctx,W,H,120);
  for(let i=0;i<8;i++){
    const x=Math.random()*W,y=Math.random()*H*0.7;
    _glow(ctx,x,y,6,`rgba(255,255,255,0.25)`);
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,1.2,0,Math.PI*2);ctx.fill();
  }
  const cx=W/2,cy=H/2+5;
  ctx.fillStyle='rgba(180,150,80,0.3)';
  ctx.fillRect(cx-6,cy+38,12,28);
  ctx.fillRect(cx-22,cy+62,44,8);
  ctx.fillRect(cx-30,cy+68,60,5);
  _glow(ctx,cx,cy,120,'rgba(212,175,55,0.08)');
  const beamY=cy-5;
  const beamGrad=ctx.createLinearGradient(cx-110,0,cx+110,0);
  beamGrad.addColorStop(0,'rgba(212,175,55,0.3)');
  beamGrad.addColorStop(0.5,'rgba(255,220,100,0.95)');
  beamGrad.addColorStop(1,'rgba(212,175,55,0.3)');
  ctx.strokeStyle=beamGrad;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(cx-100,beamY);ctx.lineTo(cx+100,beamY);ctx.stroke();
  [cx-100,cx+100].forEach(x=>{
    ctx.fillStyle='rgba(212,175,55,0.9)';
    ctx.beginPath();ctx.arc(x,beamY,5,0,Math.PI*2);ctx.fill();
    _glow(ctx,x,beamY,15,'rgba(212,175,55,0.4)');
  });
  ctx.strokeStyle='rgba(212,175,55,0.8)';ctx.lineWidth=2.5;
  ctx.beginPath();ctx.moveTo(cx,beamY);ctx.lineTo(cx,cy+40);ctx.stroke();
  ctx.fillStyle='rgba(212,175,55,0.9)';
  ctx.beginPath();ctx.moveTo(cx,beamY-18);ctx.lineTo(cx-6,beamY-5);ctx.lineTo(cx+6,beamY-5);ctx.closePath();ctx.fill();
  _glow(ctx,cx,beamY-14,20,'rgba(255,220,80,0.5)');
  [[-82,18],[82,18]].forEach(([dx,panDrop])=>{
    for(let s=0;s<5;s++){
      const chainY=beamY+s*6;
      ctx.strokeStyle=`rgba(212,175,55,${0.5+s*0.08})`;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.ellipse(cx+dx,chainY+3,2.5,3,0,0,Math.PI*2);ctx.stroke();
    }
    const panY=beamY+panDrop+30;
    const panGrad=ctx.createLinearGradient(cx+dx-28,panY-4,cx+dx+28,panY+8);
    panGrad.addColorStop(0,'rgba(212,175,55,0.5)');
    panGrad.addColorStop(1,'rgba(150,110,30,0.3)');
    ctx.fillStyle=panGrad;
    ctx.beginPath();ctx.ellipse(cx+dx,panY,28,7,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(212,175,55,0.8)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.ellipse(cx+dx,panY,28,7,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(cx+dx,panY+2,28,9,0,0,Math.PI);ctx.stroke();
    _glow(ctx,cx+dx,panY,30,'rgba(212,175,55,0.15)');
  });
  const fadeB=ctx.createLinearGradient(0,H*0.6,0,H);
  fadeB.addColorStop(0,'transparent');fadeB.addColorStop(1,'rgba(6,4,18,0.7)');
  ctx.fillStyle=fadeB;ctx.fillRect(0,H*0.6,W,H*0.4);
}},

// 2 — Amanecer / Horizonte
{label:'Horizonte', fn:(ctx,W,H)=>{
  const sky=ctx.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#030210');sky.addColorStop(0.35,'#120830');
  sky.addColorStop(0.6,'#2d0f00');sky.addColorStop(0.75,'#5c2200');
  sky.addColorStop(0.88,'#c45000');sky.addColorStop(1,'#e87000');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  for(let i=0;i<90;i++){
    const y=Math.random()*H*0.55;
    const alpha=(1-y/(H*0.55))*0.7*Math.random();
    ctx.fillStyle=`rgba(255,255,255,${alpha})`;
    ctx.beginPath();ctx.arc(Math.random()*W,y,Math.random()*1.1,0,Math.PI*2);ctx.fill();
  }
  const sunX=W*0.5,sunY=H*0.78;
  for(let i=0;i<12;i++){
    const a=-Math.PI*0.6+i*(Math.PI*1.2/11);
    const rayLen=H*0.9;
    const rayGrad=ctx.createLinearGradient(sunX,sunY,sunX+Math.cos(a)*rayLen,sunY+Math.sin(a)*rayLen);
    rayGrad.addColorStop(0,'rgba(255,180,60,0.18)');
    rayGrad.addColorStop(0.4,'rgba(255,140,40,0.07)');
    rayGrad.addColorStop(1,'transparent');
    ctx.strokeStyle=rayGrad;ctx.lineWidth=30+i%3*15;
    ctx.beginPath();ctx.moveTo(sunX,sunY);ctx.lineTo(sunX+Math.cos(a)*rayLen,sunY+Math.sin(a)*rayLen);ctx.stroke();
  }
  ctx.fillStyle='rgba(20,8,0,0.85)';
  ctx.beginPath();ctx.moveTo(0,H);
  const mpts=[[0,H*0.72],[W*0.08,H*0.55],[W*0.18,H*0.68],[W*0.28,H*0.5],[W*0.38,H*0.62],[W*0.5,H*0.45],[W*0.6,H*0.58],[W*0.72,H*0.48],[W*0.82,H*0.61],[W*0.92,H*0.52],[W,H*0.65],[W,H]];
  mpts.forEach(([x,y])=>ctx.lineTo(x,y));ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(10,4,0,0.95)';
  ctx.beginPath();ctx.moveTo(0,H);
  [[0,H*0.85],[W*0.15,H*0.75],[W*0.35,H*0.8],[W*0.55,H*0.72],[W*0.75,H*0.78],[W*0.9,H*0.7],[W,H*0.76],[W,H]].forEach(([x,y])=>ctx.lineTo(x,y));
  ctx.closePath();ctx.fill();
  _glow(ctx,sunX,sunY,180,'rgba(255,120,30,0.3)');
  _glow(ctx,sunX,sunY,90,'rgba(255,180,60,0.45)');
  _glow(ctx,sunX,sunY,35,'rgba(255,230,100,0.7)');
  ctx.fillStyle='rgba(255,240,140,0.95)';
  ctx.beginPath();ctx.arc(sunX,sunY,16,Math.PI,Math.PI*2);ctx.fill();
  const reflGrad=ctx.createLinearGradient(0,H*0.78,0,H);
  reflGrad.addColorStop(0,'rgba(200,100,30,0.4)');reflGrad.addColorStop(1,'rgba(100,40,0,0.15)');
  ctx.fillStyle=reflGrad;
  for(let r=0;r<8;r++){
    const ry=H*0.8+r*6;
    const rw=(8-r)*28+20;
    ctx.fillRect(sunX-rw/2,ry,rw,3);
  }
}},

// 3 — Ojo / Vigilancia
{label:'Vigilancia', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#020408');bg.addColorStop(1,'#040c18');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(40,100,180,0.08)';ctx.lineWidth=0.8;
  const hs=32;
  for(let row=0;row<Math.ceil(H/hs)+1;row++){
    for(let col=0;col<Math.ceil(W/hs)+1;col++){
      const hx=(col+row%2*0.5)*hs*1.73,hy=row*hs*1.5;
      ctx.beginPath();
      for(let s=0;s<6;s++){const a=s*Math.PI/3;ctx.lineTo(hx+hs*0.95*Math.cos(a),hy+hs*0.95*Math.sin(a));}
      ctx.closePath();ctx.stroke();
    }
  }
  _stars(ctx,W,H,30);
  const cx=W/2,cy=H/2+5;
  [180,130,90].forEach((r,i)=>{
    ctx.strokeStyle=`rgba(50,120,220,${0.04+i*0.03})`;ctx.lineWidth=i===2?1.5:1;
    ctx.beginPath();ctx.ellipse(cx,cy,r,r*0.52,0,0,Math.PI*2);ctx.stroke();
  });
  const eyeW=110,eyeH=48;
  ctx.save();
  ctx.beginPath();ctx.ellipse(cx,cy,eyeW,eyeH,0,0,Math.PI*2);ctx.clip();
  const irisG=ctx.createRadialGradient(cx,cy,2,cx,cy,eyeW*0.75);
  irisG.addColorStop(0,'#001030');irisG.addColorStop(0.25,'#0a2060');
  irisG.addColorStop(0.55,'#1040a0');irisG.addColorStop(0.8,'#0830c0');
  irisG.addColorStop(1,'#061840');
  ctx.fillStyle=irisG;ctx.fillRect(cx-eyeW,cy-eyeH,eyeW*2,eyeH*2);
  for(let i=0;i<32;i++){
    const a=i/32*Math.PI*2;
    ctx.strokeStyle=`rgba(80,140,255,${0.12+i%3*0.08})`;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*22,cy+Math.sin(a)*22);
    ctx.lineTo(cx+Math.cos(a)*eyeW*0.82,cy+Math.sin(a)*eyeH*0.82);ctx.stroke();
  }
  const pupG=ctx.createRadialGradient(cx,cy,0,cx,cy,20);
  pupG.addColorStop(0,'#000');pupG.addColorStop(0.7,'#050510');pupG.addColorStop(1,'rgba(5,5,20,0)');
  ctx.fillStyle=pupG;ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fill();
  ctx.restore();
  ctx.strokeStyle='rgba(80,150,255,0.7)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(cx-eyeW,cy);ctx.quadraticCurveTo(cx,cy-eyeH*1.4,cx+eyeW,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-eyeW,cy);ctx.quadraticCurveTo(cx,cy+eyeH*1.4,cx+eyeW,cy);ctx.stroke();
  ctx.fillStyle='rgba(200,230,255,0.7)';ctx.beginPath();ctx.ellipse(cx-14,cy-10,7,4,Math.PI/6,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.ellipse(cx-14,cy-10,3,2,Math.PI/6,0,Math.PI*2);ctx.fill();
  const scanG=ctx.createLinearGradient(cx,cy,cx+W*0.6,cy);
  scanG.addColorStop(0,'rgba(50,120,255,0.3)');scanG.addColorStop(1,'transparent');
  ctx.fillStyle=scanG;ctx.fillRect(cx,cy-2,W*0.6,4);
  for(let d=0;d<6;d++){
    const dy=H*0.12+d*H*0.13;
    ctx.fillStyle=`rgba(50,120,255,${0.06+d*0.02})`;
    ctx.fillRect(W*0.05,dy,Math.random()*W*0.15+W*0.05,2);
    ctx.fillRect(W*0.78,dy,Math.random()*W*0.1+W*0.04,2);
  }
  _glow(ctx,cx,cy,eyeW*0.6,'rgba(40,100,220,0.15)');
}},

// 4 — ADN / Genética
{label:'Genética', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#010a05');bg.addColorStop(0.5,'#021208');bg.addColorStop(1,'#010e0a');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  [[W*0.15,H*0.3,140,'rgba(0,220,120,0.05)'],[W*0.85,H*0.6,120,'rgba(0,160,220,0.06)'],
   [W*0.5,H*0.85,100,'rgba(40,220,100,0.04)'],[W*0.7,H*0.15,90,'rgba(0,200,180,0.05)']].forEach(([x,y,r,col])=>_glow(ctx,x,y,r,col));
  for(let p=0;p<60;p++){
    const px=Math.random()*W,py=Math.random()*H;
    const ps=0.8+Math.random()*2;
    const hue=140+Math.random()*60;
    ctx.fillStyle=`hsla(${hue},80%,60%,${0.1+Math.random()*0.3})`;
    ctx.beginPath();ctx.arc(px,py,ps,0,Math.PI*2);ctx.fill();
  }
  [W*0.18,W*0.5,W*0.82].forEach((cx,hi)=>{
    const palettes=[['#00ff88','#00cc66','#00ffcc'],['#00ddff','#0099cc','#00ffee'],['#88ff44','#66cc22','#aaff66']];
    const pal=palettes[hi];
    const period=H*0.55,amplitude=22,bpCount=18;
    for(let side=0;side<2;side++){
      const xSign=side===0?1:-1;
      ctx.strokeStyle=`rgba(0,0,0,0.4)`;ctx.lineWidth=5;
      ctx.beginPath();
      for(let y=H*0.05;y<=H*0.95;y+=2){
        const t=(y/period)*Math.PI*2;
        const x=cx+Math.cos(t)*amplitude*xSign+1;
        y===H*0.05?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    for(let side=0;side<2;side++){
      const xSign=side===0?1:-1;
      const sg=ctx.createLinearGradient(cx-amplitude,0,cx+amplitude,0);
      sg.addColorStop(0,pal[0]);sg.addColorStop(0.5,pal[1]);sg.addColorStop(1,pal[2]);
      ctx.strokeStyle=sg;ctx.lineWidth=3;ctx.shadowBlur=8;ctx.shadowColor=pal[0];
      ctx.beginPath();
      for(let y=H*0.05;y<=H*0.95;y+=2){
        const t=(y/period)*Math.PI*2;
        const x=cx+Math.cos(t)*amplitude*xSign;
        y===H*0.05?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.shadowBlur=0;
    }
    for(let bp=0;bp<bpCount;bp++){
      const y=H*0.07+bp*(H*0.86/bpCount);
      const t=(y/period)*Math.PI*2;
      const x1=cx+Math.cos(t)*amplitude,x2=cx-Math.cos(t)*amplitude;
      const progress=bp/bpCount;
      const rg=ctx.createLinearGradient(x1,y,x2,y);
      rg.addColorStop(0,`rgba(0,255,150,${0.5+progress*0.4})`);
      rg.addColorStop(0.5,`rgba(255,255,255,${0.15+progress*0.1})`);
      rg.addColorStop(1,`rgba(0,200,255,${0.5+progress*0.4})`);
      ctx.strokeStyle=rg;ctx.lineWidth=2;ctx.shadowBlur=4;ctx.shadowColor='rgba(0,255,150,0.5)';
      ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();ctx.shadowBlur=0;
      [[x1,pal[0]],[x2,pal[2]]].forEach(([nx,nc])=>{
        const ng=ctx.createRadialGradient(nx,y,0,nx,y,5);
        ng.addColorStop(0,'#ffffff');ng.addColorStop(0.4,nc);ng.addColorStop(1,'transparent');
        ctx.fillStyle=ng;ctx.beginPath();ctx.arc(nx,y,5,0,Math.PI*2);ctx.fill();
      });
    }
    _glow(ctx,cx,H/2,60,`rgba(0,200,120,0.08)`);
  });
  ctx.fillStyle='rgba(0,255,150,0.03)';
  for(let sl=0;sl<H;sl+=4){ctx.fillRect(0,sl,W,1);}
  _stars(ctx,W,H,15);
}},

{label:'Mente', fn:(ctx,W,H)=>{
  const bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.7);
  bg.addColorStop(0,'#0d0520');bg.addColorStop(0.5,'#07031a');bg.addColorStop(1,'#020108');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,40);
  const cx=W/2,cy=H/2;
  const nodes:{x:number;y:number;size:number;hue:number;active:boolean}[]=[];
  const nodeCount=28;
  for(let i=0;i<nodeCount;i++){
    const angle=(i/nodeCount)*Math.PI*2+(Math.random()-0.5)*0.4;
    const dist=30+Math.random()*160;
    const nx=cx+Math.cos(angle)*dist*(W/900);
    const ny=cy+Math.sin(angle)*dist*(H/220);
    const nsize=2+Math.random()*5;
    const hue=240+Math.random()*80;
    nodes.push({x:nx,y:ny,size:nsize,hue,active:Math.random()>0.3});
  }
  nodes.push({x:cx,y:cy,size:9,hue:280,active:true});
  nodes.forEach((a,i)=>{
    nodes.forEach((b,j)=>{
      if(i>=j)return;
      const dist=Math.hypot(a.x-b.x,a.y-b.y);
      if(dist>130)return;
      const strength=1-dist/130;
      const alpha=strength*(a.active&&b.active?0.5:0.15);
      const cg=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
      cg.addColorStop(0,`hsla(${a.hue},80%,70%,${alpha})`);
      cg.addColorStop(0.5,`hsla(${(a.hue+b.hue)/2},70%,80%,${alpha*0.5})`);
      cg.addColorStop(1,`hsla(${b.hue},80%,70%,${alpha})`);
      ctx.strokeStyle=cg;ctx.lineWidth=strength*2;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    });
  });
  for(let p=0;p<12;p++){
    const a=nodes[Math.floor(Math.random()*nodes.length)];
    const b=nodes[Math.floor(Math.random()*nodes.length)];
    if(a===b)continue;
    const t=Math.random();
    const px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t;
    const pg=ctx.createRadialGradient(px,py,0,px,py,4);
    pg.addColorStop(0,'rgba(255,255,255,0.9)');pg.addColorStop(1,'transparent');
    ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
  }
  nodes.forEach(n=>{
    if(n.active){
      ctx.shadowBlur=15;ctx.shadowColor=`hsla(${n.hue},80%,70%,0.8)`;
    }
    const ng=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.size*2);
    ng.addColorStop(0,'#ffffff');
    ng.addColorStop(0.3,`hsla(${n.hue},80%,70%,0.9)`);
    ng.addColorStop(1,'transparent');
    ctx.fillStyle=ng;ctx.beginPath();ctx.arc(n.x,n.y,n.size*2,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
  });
  _glow(ctx,cx,cy,90,'rgba(180,100,255,0.12)');
  _glow(ctx,cx,cy,40,'rgba(220,150,255,0.18)');
  const vig=ctx.createRadialGradient(cx,cy,H*0.2,cx,cy,H*0.8);
  vig.addColorStop(0,'transparent');vig.addColorStop(1,'rgba(0,0,0,0.5)');
  ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
}},

{label:'Planeta', fn:(ctx,W,H)=>{
  const sp=ctx.createLinearGradient(0,0,W,H);
  sp.addColorStop(0,'#000205');sp.addColorStop(1,'#000510');
  ctx.fillStyle=sp;ctx.fillRect(0,0,W,H);
  const mw=ctx.createLinearGradient(0,H*0.1,W,H*0.9);
  mw.addColorStop(0,'transparent');mw.addColorStop(0.3,'rgba(200,180,255,0.04)');
  mw.addColorStop(0.7,'rgba(200,180,255,0.06)');mw.addColorStop(1,'transparent');
  ctx.fillStyle=mw;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,160);
  for(let i=0;i<6;i++){
    const x=W*0.75+Math.random()*W*0.2,y=Math.random()*H*0.4;
    _glow(ctx,x,y,4,`rgba(200,200,255,0.3)`);
    ctx.fillStyle='rgba(255,255,255,0.9)';ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();
  }
  const cx=W*0.42,cy=H*0.5,er=78;
  const eg=ctx.createRadialGradient(cx-20,cy-22,4,cx,cy,er);
  eg.addColorStop(0,'#3a8fdf');eg.addColorStop(0.2,'#2060b0');
  eg.addColorStop(0.5,'#1840a0');eg.addColorStop(0.8,'#0c2860');eg.addColorStop(1,'#04102a');
  ctx.fillStyle=eg;ctx.beginPath();ctx.arc(cx,cy,er,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,er,0,Math.PI*2);ctx.clip();
  const continents=[
    {pts:[[cx-40,cy-30],[cx-52,cy-10],[cx-48,cy+15],[cx-38,cy+35],[cx-20,cy+40],[cx-15,cy+20],[cx-25,cy+5],[cx-18,cy-15],[cx-30,cy-28]],c:'rgba(50,140,60,0.75)'},
    {pts:[[cx+5,cy-35],[cx-5,cy-15],[cx+2,cy+5],[cx+10,cy+35],[cx+25,cy+40],[cx+30,cy+15],[cx+22,cy-5],[cx+18,cy-28]],c:'rgba(55,145,65,0.7)'},
    {pts:[[cx+28,cy-40],[cx+20,cy-25],[cx+35,cy-10],[cx+52,cy-20],[cx+58,cy-38],[cx+45,cy-45]],c:'rgba(60,150,70,0.65)'},
    {pts:[[cx+40,cy+18],[cx+48,cy+10],[cx+55,cy+22],[cx+50,cy+32],[cx+38,cy+30]],c:'rgba(55,130,60,0.6)'},
  ];
  continents.forEach(({pts,c})=>{
    ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
    pts.forEach(([x,y])=>ctx.lineTo(x,y));ctx.closePath();ctx.fill();
  });
  for(let cl=0;cl<8;cl++){
    const clx=cx+(Math.random()-0.5)*er*1.6,cly=cy+(Math.random()-0.5)*er*1.6;
    const clr=ctx.createRadialGradient(clx,cly,0,clx,cly,18+Math.random()*15);
    clr.addColorStop(0,'rgba(255,255,255,0.25)');clr.addColorStop(1,'transparent');
    ctx.fillStyle=clr;ctx.beginPath();ctx.arc(clx,cly,18+Math.random()*15,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
  [er+4,er+10,er+20].forEach((ar,i)=>{
    const ag=ctx.createRadialGradient(cx,cy,ar-3,cx,cy,ar);
    ag.addColorStop(0,`rgba(80,160,255,${0.18-i*0.05})`);ag.addColorStop(1,'transparent');
    ctx.fillStyle=ag;ctx.beginPath();ctx.arc(cx,cy,ar,0,Math.PI*2);ctx.fill();
  });
  const shad=ctx.createRadialGradient(cx+er*0.6,cy,0,cx+er*0.6,cy,er*1.5);
  shad.addColorStop(0,'transparent');shad.addColorStop(0.4,'transparent');
  shad.addColorStop(0.7,'rgba(0,0,20,0.5)');shad.addColorStop(1,'rgba(0,0,20,0.9)');
  ctx.fillStyle=shad;ctx.beginPath();ctx.arc(cx,cy,er,0,Math.PI*2);ctx.fill();
  const mx=cx+er+60,my=cy-40,mr=16;
  const moonG=ctx.createRadialGradient(mx-4,my-4,1,mx,my,mr);
  moonG.addColorStop(0,'#d8d0c0');moonG.addColorStop(0.7,'#a09080');moonG.addColorStop(1,'#504030');
  ctx.fillStyle=moonG;ctx.beginPath();ctx.arc(mx,my,mr,0,Math.PI*2);ctx.fill();
  [[mx-4,my-5,3],[mx+5,my+4,2],[mx-1,my+7,2.5]].forEach(([x,y,r])=>{
    ctx.strokeStyle='rgba(60,50,40,0.5)';ctx.lineWidth=0.8;
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
  });
}},

// 7 — Fuego / Destrucción
{label:'Fuego', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#050002');bg.addColorStop(0.5,'#120300');bg.addColorStop(1,'#1e0500');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.3,20);
  const emberG=ctx.createLinearGradient(0,H*0.75,0,H);
  emberG.addColorStop(0,'#1a0400');emberG.addColorStop(1,'#0a0200');
  ctx.fillStyle=emberG;ctx.fillRect(0,H*0.75,W,H*0.25);
  for(let e=0;e<40;e++){
    const ex=Math.random()*W,ey=H*0.8+Math.random()*H*0.18;
    const er=0.5+Math.random()*2.5;
    const hue=10+Math.random()*30;
    const eg=ctx.createRadialGradient(ex,ey,0,ex,ey,er*3);
    eg.addColorStop(0,`hsla(${hue},100%,80%,0.9)`);
    eg.addColorStop(0.5,`hsla(${hue},90%,50%,0.4)`);
    eg.addColorStop(1,'transparent');
    ctx.fillStyle=eg;ctx.beginPath();ctx.arc(ex,ey,er*3,0,Math.PI*2);ctx.fill();
  }
  const flameData=[
    {x:W*0.15,w:45,h:H*0.55,hue:18},{x:W*0.3,w:65,h:H*0.72,hue:22},
    {x:W*0.5,w:80,h:H*0.85,hue:20},{x:W*0.68,w:60,h:H*0.68,hue:25},
    {x:W*0.85,w:42,h:H*0.5,hue:16},{x:W*0.1,w:30,h:H*0.38,hue:15},
    {x:W*0.92,w:28,h:H*0.35,hue:28}
  ];
  flameData.forEach(({x,w,h,hue})=>{
    const fg1=ctx.createRadialGradient(x,H-5,3,x,H-h*0.5,w*1.2);
    fg1.addColorStop(0,`hsla(${hue+30},100%,90%,0.95)`);
    fg1.addColorStop(0.2,`hsla(${hue+15},100%,65%,0.8)`);
    fg1.addColorStop(0.5,`hsla(${hue},90%,45%,0.6)`);
    fg1.addColorStop(0.8,`hsla(${hue-5},80%,30%,0.3)`);
    fg1.addColorStop(1,'transparent');
    ctx.fillStyle=fg1;
    ctx.beginPath();
    ctx.moveTo(x-w*0.5,H);
    ctx.bezierCurveTo(x-w*0.7,H-h*0.3, x-w*0.3+(Math.random()-0.5)*15,H-h*0.6, x+(Math.random()-0.5)*8,H-h);
    ctx.bezierCurveTo(x+w*0.3+(Math.random()-0.5)*15,H-h*0.6, x+w*0.7,H-h*0.3, x+w*0.5,H);
    ctx.closePath();ctx.fill();
    const fg2=ctx.createRadialGradient(x,H-h*0.3,w*0.2,x,H-h*0.3,w*2);
    fg2.addColorStop(0,`hsla(${hue},80%,40%,0.15)`);fg2.addColorStop(1,'transparent');
    ctx.fillStyle=fg2;ctx.beginPath();ctx.ellipse(x,H-h*0.3,w*2,h*0.6,0,0,Math.PI*2);ctx.fill();
  });
  for(let s=0;s<6;s++){
    const sx=W*0.1+Math.random()*W*0.8,sy=H*0.2+Math.random()*H*0.15;
    const smokeG=ctx.createRadialGradient(sx,sy,0,sx,sy,25+Math.random()*20);
    smokeG.addColorStop(0,'rgba(80,60,50,0.12)');smokeG.addColorStop(1,'transparent');
    ctx.fillStyle=smokeG;ctx.beginPath();ctx.ellipse(sx,sy,25+Math.random()*20,15+Math.random()*10,Math.random()-0.5,0,Math.PI*2);ctx.fill();
  }
  for(let sp=0;sp<25;sp++){
    const spx=W*0.2+Math.random()*W*0.6, spy=H*0.1+Math.random()*H*0.65;
    const sg=ctx.createRadialGradient(spx,spy,0,spx,spy,2.5);
    sg.addColorStop(0,'rgba(255,240,180,0.9)');sg.addColorStop(1,'transparent');
    ctx.fillStyle=sg;ctx.beginPath();ctx.arc(spx,spy,2.5,0,Math.PI*2);ctx.fill();
  }
  _glow(ctx,W/2,H*0.6,180,'rgba(255,80,10,0.2)');
  _glow(ctx,W/2,H*0.8,120,'rgba(255,140,20,0.25)');
}},

{label:'Filosofía Clásica', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#04040e');bg.addColorStop(0.7,'#080820');bg.addColorStop(1,'#0e0e18');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,80);
  _glow(ctx,W*0.15,H*0.08,80,'rgba(200,210,255,0.12)');
  ctx.fillStyle='rgba(220,225,255,0.7)';ctx.beginPath();ctx.arc(W*0.15,H*0.08,14,0,Math.PI*2);ctx.fill();
  const groundG=ctx.createLinearGradient(0,H*0.82,0,H);
  groundG.addColorStop(0,'rgba(30,28,40,0.9)');groundG.addColorStop(1,'rgba(15,14,22,1)');
  ctx.fillStyle=groundG;ctx.fillRect(0,H*0.82,W,H*0.18);
  for(let m=0;m<6;m++){
    ctx.strokeStyle=`rgba(60,55,80,${0.2+m*0.05})`;ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(0,H*0.84+m*3);ctx.lineTo(W,H*0.84+m*3);ctx.stroke();
  }
  [[H*0.83,W],[H*0.86,W*0.88],[H*0.89,W*0.76]].forEach(([y,w],si)=>{
    const sw=(W-w)/2;
    ctx.fillStyle=`rgba(${30+si*8},${28+si*7},${42+si*8},0.9)`;
    ctx.fillRect(sw,y,w,H*0.04);
    ctx.strokeStyle=`rgba(80,75,110,0.4)`;ctx.lineWidth=0.5;
    ctx.strokeRect(sw,y,w,H*0.04);
  });
  const colXs=[W*0.1,W*0.25,W*0.42,W*0.6,W*0.78,W*0.92];
  colXs.forEach((cx)=>{
    const colH=H*0.68,colW=22,colBase=H*0.17;
    const grad=ctx.createLinearGradient(cx-colW,0,cx+colW,0);
    grad.addColorStop(0,'rgba(170,160,190,0.15)');
    grad.addColorStop(0.3,'rgba(210,200,230,0.35)');
    grad.addColorStop(0.6,'rgba(225,215,245,0.4)');
    grad.addColorStop(1,'rgba(160,150,180,0.12)');
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(cx-colW,colBase+colH);
    ctx.quadraticCurveTo(cx-colW-2,colBase+colH*0.5,cx-colW+2,colBase);
    ctx.lineTo(cx+colW-2,colBase);
    ctx.quadraticCurveTo(cx+colW+2,colBase+colH*0.5,cx+colW,colBase+colH);
    ctx.closePath();ctx.fill();
    for(let f=0;f<7;f++){
      const fx=cx-colW+3+f*(colW*2-6)/6;
      ctx.strokeStyle=`rgba(140,130,170,0.12)`;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(fx,colBase);ctx.lineTo(fx,colBase+colH);ctx.stroke();
    }
    ctx.fillStyle='rgba(200,190,220,0.4)';
    ctx.fillRect(cx-colW-3,colBase-8,colW*2+6,8);
    ctx.fillRect(cx-colW-6,colBase-14,colW*2+12,6);
    ctx.fillRect(cx-colW-3,colBase+colH,colW*2+6,6);
    ctx.fillRect(cx-colW-6,colBase+colH+6,colW*2+12,5);
    _glow(ctx,cx,colBase+colH*0.4,40,'rgba(200,210,255,0.04)');
  });
  const entG=ctx.createLinearGradient(0,H*0.14,0,H*0.2);
  entG.addColorStop(0,'rgba(190,180,215,0.35)');entG.addColorStop(1,'rgba(150,140,175,0.2)');
  ctx.fillStyle=entG;ctx.fillRect(W*0.07,H*0.14,W*0.88,H*0.06);
  ctx.strokeStyle='rgba(200,190,220,0.3)';ctx.lineWidth=1;
  ctx.strokeRect(W*0.07,H*0.14,W*0.88,H*0.06);
  ctx.strokeStyle='rgba(200,190,220,0.25)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(W*0.07,H*0.14);ctx.lineTo(W*0.5,H*0.04);ctx.lineTo(W*0.95,H*0.14);ctx.stroke();
  const ambient=ctx.createLinearGradient(0,0,0,H);
  ambient.addColorStop(0,'transparent');ambient.addColorStop(0.5,'transparent');
  ambient.addColorStop(1,'rgba(10,8,18,0.6)');
  ctx.fillStyle=ambient;ctx.fillRect(0,0,W,H);
}},

];

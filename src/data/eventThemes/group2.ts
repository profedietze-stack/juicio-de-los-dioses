import type { EventTheme } from '../../types';
import { _stars, _glow } from './canvasHelpers';

export const group2: EventTheme[] = [

// 9 — Antigüedad / Sol egipcio
{label:'Antigüedad', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#040300');bg.addColorStop(0.55,'#0e0900');bg.addColorStop(0.75,'#1a1000');bg.addColorStop(1,'#2a1800');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.65,90);
  const constel=[[W*0.1,H*0.1],[W*0.18,H*0.08],[W*0.25,H*0.12],[W*0.22,H*0.18],[W*0.15,H*0.2]];
  ctx.strokeStyle='rgba(200,180,140,0.15)';ctx.lineWidth=0.8;
  for(let i=0;i<constel.length-1;i++){ctx.beginPath();ctx.moveTo(constel[i][0],constel[i][1]);ctx.lineTo(constel[i+1][0],constel[i+1][1]);ctx.stroke();}
  [[W*0.18,H*0.78,W*0.22,'rgba(25,18,5,0.95)'],[W*0.42,H*0.72,W*0.3,'rgba(30,22,6,0.95)'],[W*0.72,H*0.76,W*0.18,'rgba(22,16,4,0.9)']].forEach(([px,py,pw,pc])=>{
    ctx.fillStyle=pc;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-pw/2,H*0.88);ctx.lineTo(px+pw/2,H*0.88);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(212,175,55,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-pw/2,H*0.88);ctx.moveTo(px,py);ctx.lineTo(px+pw/2,H*0.88);ctx.stroke();
  });
  const sand=ctx.createLinearGradient(0,H*0.85,0,H);
  sand.addColorStop(0,'rgba(80,55,15,0.8)');sand.addColorStop(1,'rgba(40,28,6,0.95)');
  ctx.fillStyle=sand;ctx.fillRect(0,H*0.85,W,H*0.15);
  ctx.fillStyle='rgba(40,60,80,0.5)';
  ctx.beginPath();ctx.ellipse(W*0.65,H*0.87,W*0.25,10,0,0,Math.PI*2);ctx.fill();
  _glow(ctx,W*0.65,H*0.87,60,'rgba(80,120,180,0.1)');
  const cx=W/2,cy=H*0.38;
  _glow(ctx,cx,cy,150,'rgba(212,175,55,0.12)');
  _glow(ctx,cx,cy,80,'rgba(255,200,60,0.22)');
  _glow(ctx,cx,cy,40,'rgba(255,220,80,0.4)');
  const sunG=ctx.createRadialGradient(cx,cy,0,cx,cy,30);
  sunG.addColorStop(0,'rgba(255,240,150,0.95)');sunG.addColorStop(0.5,'rgba(240,190,50,0.9)');sunG.addColorStop(1,'rgba(200,140,20,0.7)');
  ctx.fillStyle=sunG;ctx.beginPath();ctx.arc(cx,cy,30,0,Math.PI*2);ctx.fill();
  for(let r=0;r<24;r++){
    const a=r/24*Math.PI*2;
    const isLong=r%2===0;
    const r1=34,r2=isLong?68:50;
    ctx.strokeStyle=`rgba(212,175,55,${isLong?0.7:0.4})`;ctx.lineWidth=isLong?1.5:1;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);
    ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke();
  }
  ctx.strokeStyle='rgba(212,175,55,0.5)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(cx,cy+32);ctx.bezierCurveTo(cx-20,cy+50,cx-25,cy+65,cx-10,cy+70);ctx.stroke();
  for(let h=0;h<5;h++){
    const hx=W*0.1+h*W*0.18,hy=H*0.6;
    ctx.strokeStyle='rgba(212,175,55,0.08)';ctx.lineWidth=0.8;
    const shapes=['rect','circle','tri'];
    const s=shapes[h%3];
    if(s==='rect'){ctx.strokeRect(hx,hy,14,20);}
    else if(s==='circle'){ctx.beginPath();ctx.arc(hx+7,hy+10,7,0,Math.PI*2);ctx.stroke();}
    else{ctx.beginPath();ctx.moveTo(hx+7,hy);ctx.lineTo(hx,hy+20);ctx.lineTo(hx+14,hy+20);ctx.closePath();ctx.stroke();}
  }
}},

// 10 — Humanidad / Multitud
{label:'Humanidad', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#02020a');bg.addColorStop(0.6,'#06060f');bg.addColorStop(1,'#0a0810');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.45,55);
  ctx.fillStyle='rgba(20,15,35,0.9)';
  ctx.beginPath();ctx.moveTo(0,H);
  const buildings=[[0,H*0.72],[W*0.04,H*0.55],[W*0.06,H*0.68],[W*0.09,H*0.48],[W*0.11,H*0.6],
    [W*0.14,H*0.42],[W*0.17,H*0.65],[W*0.2,H*0.38],[W*0.22,H*0.5],[W*0.25,H*0.44],
    [W*0.28,H*0.6],[W*0.31,H*0.35],[W*0.34,H*0.52],[W*0.37,H*0.41],[W*0.4,H*0.56],
    [W*0.43,H*0.32],[W*0.46,H*0.48],[W*0.5,H*0.38],[W*0.54,H*0.52],[W*0.57,H*0.4],
    [W*0.6,H*0.55],[W*0.63,H*0.35],[W*0.66,H*0.48],[W*0.69,H*0.42],[W*0.72,H*0.6],
    [W*0.75,H*0.44],[W*0.78,H*0.38],[W*0.81,H*0.52],[W*0.84,H*0.45],[W*0.87,H*0.58],
    [W*0.9,H*0.42],[W*0.93,H*0.62],[W*0.96,H*0.5],[W,H*0.65],[W,H]];
  buildings.forEach(([x,y])=>ctx.lineTo(x,y));
  ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,220,100,0.4)';
  for(let w=0;w<80;w++){
    const wx=Math.random()*W,wy=H*0.4+Math.random()*H*0.32;
    ctx.fillRect(wx,wy,1.5,2.5);
  }
  const groundY=H*0.82;
  for(let i=0;i<50;i++){
    const px=W*0.01+i*(W*0.98/49);
    const height=18+Math.random()*22;
    const py=groundY-height+(Math.random()-0.5)*12;
    ctx.fillStyle=`rgba(${60+Math.random()*40},${50+Math.random()*30},${80+Math.random()*40},${0.25+Math.random()*0.45})`;
    ctx.beginPath();(ctx as any).roundRect?(ctx as any).roundRect(px-4,py,8,height,2):ctx.rect(px-4,py,8,height);ctx.fill();
    ctx.beginPath();ctx.arc(px,py-4,4.5,0,Math.PI*2);ctx.fill();
  }
  [[W*0.2,H*0.85,'rgba(100,60,200,0.1)'],[W*0.5,H*0.82,'rgba(60,120,200,0.1)'],
   [W*0.8,H*0.85,'rgba(200,80,100,0.08)']].forEach(([x,y,col])=>_glow(ctx,x,y,120,col));
  const horizG=ctx.createLinearGradient(0,H*0.5,0,H*0.72);
  horizG.addColorStop(0,'transparent');horizG.addColorStop(1,'rgba(80,60,160,0.15)');
  ctx.fillStyle=horizG;ctx.fillRect(0,H*0.5,W,H*0.22);
  ctx.fillStyle='rgba(8,6,12,0.95)';ctx.fillRect(0,groundY+8,W,H);
}},

{label:'Laberinto', fn:(ctx,W,H)=>{
  const bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W*0.7);
  bg.addColorStop(0,'#0c0c18');bg.addColorStop(0.6,'#080810');bg.addColorStop(1,'#030306');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  const cs=26;
  const cols=Math.floor(W/cs),rows=Math.floor(H/cs);
  const walls:{x1:number;y1:number;x2:number;y2:number}[]=[];
  for(let r=0;r<=rows;r++){
    for(let c=0;c<=cols;c++){
      if(r<rows&&Math.random()>0.38){walls.push({x1:c*cs,y1:r*cs,x2:(c+1)*cs,y2:r*cs});}
      if(c<cols&&Math.random()>0.38){walls.push({x1:c*cs,y1:r*cs,x2:c*cs,y2:(r+1)*cs});}
    }
  }
  walls.forEach(w=>{
    const distFromCenter=Math.hypot((w.x1+w.x2)/2-W/2,(w.y1+w.y2)/2-H/2);
    const maxDist=Math.hypot(W/2,H/2);
    const proximity=1-distFromCenter/maxDist;
    const alpha=0.08+proximity*0.25;
    const wallG=ctx.createLinearGradient(w.x1,w.y1,w.x2,w.y2);
    wallG.addColorStop(0,`rgba(180,160,255,${alpha*0.6})`);
    wallG.addColorStop(0.5,`rgba(200,180,255,${alpha})`);
    wallG.addColorStop(1,`rgba(180,160,255,${alpha*0.6})`);
    ctx.strokeStyle=wallG;ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(w.x1,w.y1);ctx.lineTo(w.x2,w.y2);ctx.stroke();
  });
  const path:[number,number][]=[];
  let px=cs*1.5,py=H/2;
  for(let i=0;i<22;i++){
    path.push([px,py]);
    const dir=Math.floor(Math.random()*4);
    px+=([cs,0,-cs,0])[dir];py+=([0,cs,0,-cs])[dir];
    px=Math.max(cs,Math.min(W-cs,px));py=Math.max(cs,Math.min(H-cs,py));
  }
  if(path.length>1){
    const pathG=ctx.createLinearGradient(path[0][0],path[0][1],path[path.length-1][0],path[path.length-1][1]);
    pathG.addColorStop(0,'rgba(212,175,55,0.1)');
    pathG.addColorStop(0.5,'rgba(212,175,55,0.6)');
    pathG.addColorStop(1,'rgba(255,220,100,0.8)');
    ctx.strokeStyle=pathG;ctx.lineWidth=2.5;ctx.setLineDash([5,4]);
    ctx.beginPath();path.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.stroke();ctx.setLineDash([]);
    const [ex,ey]=path[path.length-1];
    _glow(ctx,ex,ey,20,'rgba(212,175,55,0.5)');
    ctx.fillStyle='rgba(255,220,80,0.9)';ctx.beginPath();ctx.arc(ex,ey,4,0,Math.PI*2);ctx.fill();
  }
  _glow(ctx,W/2,H/2,90,'rgba(212,175,55,0.07)');
  _glow(ctx,cs*1.5,H/2,14,'rgba(180,180,255,0.6)');
  ctx.fillStyle='rgba(200,200,255,0.8)';ctx.beginPath();ctx.arc(cs*1.5,H/2,3.5,0,Math.PI*2);ctx.fill();
  [[12,12],[W-12,12],[12,H-12],[W-12,H-12]].forEach(([x,y])=>{
    ctx.strokeStyle='rgba(212,175,55,0.2)';ctx.lineWidth=1;
    ctx.strokeRect(x-8,y-8,16,16);
  });
  _stars(ctx,W,H,18);
}},

{label:'Cosmos', fn:(ctx,W,H)=>{
  ctx.fillStyle='#000005';ctx.fillRect(0,0,W,H);
  for(let s=0;s<280;s++){
    const sx=Math.random()*W,sy=Math.random()*H;
    const size=Math.random();
    const starType=Math.random();
    let color;
    if(starType>0.95) color=`rgba(180,200,255,${0.4+Math.random()*0.5})`;
    else if(starType>0.88) color=`rgba(255,220,150,${0.4+Math.random()*0.5})`;
    else if(starType>0.82) color=`rgba(255,160,100,${0.3+Math.random()*0.5})`;
    else color=`rgba(255,255,255,${0.1+Math.random()*0.7})`;
    ctx.fillStyle=color;
    const r=size>0.96?1.8:size>0.85?1.2:0.6;
    ctx.beginPath();ctx.arc(sx,sy,r,0,Math.PI*2);ctx.fill();
    if(size>0.92){
      const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,r*4);
      sg.addColorStop(0,color.replace(/[\d.]+\)$/,'0.3)'));sg.addColorStop(1,'transparent');
      ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,r*4,0,Math.PI*2);ctx.fill();
    }
  }
  const nebs:[number,number,number,string][]=[
    [W*0.18,H*0.28,100,'rgba(80,20,180,0.14)'],[W*0.18,H*0.28,60,'rgba(120,40,220,0.1)'],
    [W*0.72,H*0.42,110,'rgba(180,30,80,0.12)'],[W*0.72,H*0.42,65,'rgba(220,50,100,0.09)'],
    [W*0.45,H*0.68,90,'rgba(20,80,200,0.13)'],[W*0.45,H*0.68,50,'rgba(40,120,255,0.09)'],
    [W*0.62,H*0.18,75,'rgba(30,160,120,0.11)'],[W*0.3,H*0.75,80,'rgba(200,100,40,0.1)'],
  ];
  nebs.forEach(([x,y,r,col])=>{
    for(let l=0;l<3;l++){
      _glow(ctx,x+(Math.random()-0.5)*25,y+(Math.random()-0.5)*15,r-l*18,col);
    }
  });
  const mwG=ctx.createLinearGradient(0,H,W,0);
  mwG.addColorStop(0,'transparent');mwG.addColorStop(0.3,'rgba(200,180,255,0.04)');
  mwG.addColorStop(0.5,'rgba(220,200,255,0.07)');mwG.addColorStop(0.7,'rgba(200,180,255,0.04)');
  mwG.addColorStop(1,'transparent');
  ctx.fillStyle=mwG;ctx.fillRect(0,0,W,H);
  const bx=W*0.55,by=H*0.48;
  ctx.save();ctx.translate(bx,by);ctx.scale(1,0.3);
  const diskG=ctx.createRadialGradient(0,0,20,0,0,80);
  diskG.addColorStop(0,'rgba(255,140,40,0.0)');diskG.addColorStop(0.3,'rgba(255,180,60,0.5)');
  diskG.addColorStop(0.6,'rgba(255,100,20,0.35)');diskG.addColorStop(0.85,'rgba(200,50,0,0.2)');
  diskG.addColorStop(1,'transparent');
  ctx.fillStyle=diskG;ctx.beginPath();ctx.arc(0,0,80,0,Math.PI*2);ctx.fill();
  ctx.restore();
  const bhG=ctx.createRadialGradient(bx,by,0,bx,by,26);
  bhG.addColorStop(0,'#000000');bhG.addColorStop(0.7,'#000000');bhG.addColorStop(1,'rgba(0,0,0,0.8)');
  ctx.fillStyle=bhG;ctx.beginPath();ctx.arc(bx,by,26,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(255,160,50,0.3)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(bx,by,32,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,120,30,0.15)';ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(bx,by,40,0,Math.PI*2);ctx.stroke();
  for(let jet=0;jet<2;jet++){
    const sign=jet===0?-1:1;
    const jetG=ctx.createLinearGradient(bx,by,bx,by+sign*H*0.5);
    jetG.addColorStop(0,'rgba(100,180,255,0.4)');
    jetG.addColorStop(0.4,'rgba(80,140,255,0.15)');jetG.addColorStop(1,'transparent');
    ctx.strokeStyle=jetG;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+(Math.random()-0.5)*10,by+sign*H*0.5);ctx.stroke();
  }
}},

{label:'Identidad', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#060408');bg.addColorStop(1,'#0e0c14');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,40);
  const cx=W/2,cy=H/2;
  const frameW=110,frameH=140;
  const frameG=ctx.createLinearGradient(cx-frameW,cy-frameH,cx+frameW,cy+frameH);
  frameG.addColorStop(0,'rgba(180,160,220,0.4)');frameG.addColorStop(0.5,'rgba(220,200,255,0.6)');
  frameG.addColorStop(1,'rgba(150,130,190,0.3)');
  ctx.strokeStyle=frameG;ctx.lineWidth=8;
  ctx.beginPath();(ctx as any).roundRect?(ctx as any).roundRect(cx-frameW,cy-frameH,frameW*2,frameH*2,12):ctx.rect(cx-frameW,cy-frameH,frameW*2,frameH*2);ctx.stroke();
  const mirrorG=ctx.createLinearGradient(cx-frameW+8,cy-frameH+8,cx+frameW-8,cy+frameH-8);
  mirrorG.addColorStop(0,'rgba(180,160,220,0.06)');mirrorG.addColorStop(0.3,'rgba(200,180,240,0.1)');
  mirrorG.addColorStop(0.7,'rgba(150,130,200,0.08)');mirrorG.addColorStop(1,'rgba(120,100,170,0.05)');
  ctx.fillStyle=mirrorG;ctx.fillRect(cx-frameW+8,cy-frameH+8,frameW*2-16,frameH*2-16);
  for(let cr=0;cr<12;cr++){
    const a=cr/12*Math.PI*2+(Math.random()-0.5)*0.3;
    const segLen=30+Math.random()*80;
    const segs=3+Math.floor(Math.random()*3);
    let sx=cx,sy=cy;
    ctx.strokeStyle=`rgba(200,180,255,${0.08+Math.random()*0.12})`;ctx.lineWidth=0.8;
    ctx.beginPath();ctx.moveTo(sx,sy);
    for(let s=0;s<segs;s++){
      const nextA=a+(Math.random()-0.5)*0.4;
      sx+=Math.cos(nextA)*(segLen/segs);sy+=Math.sin(nextA)*(segLen/segs);
      ctx.lineTo(sx,sy);
    }
    ctx.stroke();
  }
  _glow(ctx,cx,cy-30,50,'rgba(200,180,255,0.1)');
  ctx.strokeStyle='rgba(200,180,255,0.2)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.arc(cx,cy-75,14,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-60);ctx.lineTo(cx,cy-10);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-45);ctx.lineTo(cx-18,cy-25);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-45);ctx.lineTo(cx+18,cy-25);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx-12,cy+30);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-10);ctx.lineTo(cx+12,cy+30);ctx.stroke();
  for(let sf=0;sf<16;sf++){
    const fAngle=sf/16*Math.PI*2,fDist=50+sf*8;
    const fx=cx+Math.cos(fAngle)*fDist,fy=cy+Math.sin(fAngle)*fDist*0.65;
    const fSize=4+Math.random()*8;
    ctx.save();ctx.translate(fx,fy);ctx.rotate(fAngle+Math.PI/4);
    ctx.strokeStyle=`rgba(200,180,255,${0.1+sf%4*0.05})`;ctx.lineWidth=0.8;
    ctx.strokeRect(-fSize/2,-fSize/2,fSize,fSize);
    ctx.restore();
  }
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.beginPath();ctx.moveTo(cx-frameW+10,cy-frameH+10);ctx.lineTo(cx-frameW+40,cy-frameH+10);ctx.lineTo(cx-frameW+10,cy-frameH+40);ctx.closePath();ctx.fill();
}},

// 14 — Tiempo / Reloj de Arena
{label:'Tiempo', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#040208');bg.addColorStop(1,'#090516');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H,80);
  _glow(ctx,W*0.3,H*0.3,100,'rgba(100,60,200,0.08)');
  _glow(ctx,W*0.7,H*0.7,80,'rgba(60,100,200,0.07)');
  const cx=W/2,cy=H/2;
  _glow(ctx,cx,cy,100,'rgba(180,160,255,0.08)');
  _glow(ctx,cx,cy+40,55,'rgba(212,175,55,0.15)');
  const frameH=96,frameW=52;
  [cx-frameW,cx+frameW].forEach(fx=>{
    const colG=ctx.createLinearGradient(fx-4,cy-frameH,fx+4,cy+frameH);
    colG.addColorStop(0,'rgba(212,175,55,0.3)');colG.addColorStop(0.5,'rgba(255,210,80,0.6)');
    colG.addColorStop(1,'rgba(212,175,55,0.3)');
    ctx.fillStyle=colG;ctx.fillRect(fx-4,cy-frameH,8,frameH*2);
    for(let ring=0;ring<5;ring++){
      ctx.strokeStyle='rgba(212,175,55,0.4)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(fx,cy-frameH+ring*(frameH*2/4),5,0,Math.PI*2);ctx.stroke();
    }
  });
  [cy-frameH,cy+frameH].forEach(capY=>{
    const capG=ctx.createLinearGradient(cx-frameW-8,capY-4,cx+frameW+8,capY+4);
    capG.addColorStop(0,'rgba(180,140,40,0.4)');capG.addColorStop(0.5,'rgba(255,210,80,0.7)');
    capG.addColorStop(1,'rgba(180,140,40,0.4)');
    ctx.fillStyle=capG;ctx.fillRect(cx-frameW-8,capY-5,frameW*2+16,10);
    ctx.fillStyle='rgba(212,175,55,0.7)';
    ctx.beginPath();ctx.arc(cx,capY,8,0,Math.PI*2);ctx.fill();
    _glow(ctx,cx,capY,20,'rgba(255,200,60,0.4)');
  });
  const glassG=ctx.createLinearGradient(cx-frameW,cy-frameH+5,cx+frameW,cy+frameH-5);
  glassG.addColorStop(0,'rgba(180,200,255,0.06)');
  glassG.addColorStop(0.3,'rgba(200,220,255,0.12)');
  glassG.addColorStop(0.7,'rgba(200,220,255,0.12)');
  glassG.addColorStop(1,'rgba(180,200,255,0.06)');
  ctx.fillStyle=glassG;
  ctx.beginPath();ctx.moveTo(cx-frameW+4,cy-frameH+5);
  ctx.quadraticCurveTo(cx-frameW,cy,cx-4,cy);
  ctx.lineTo(cx+4,cy);
  ctx.quadraticCurveTo(cx+frameW,cy,cx+frameW-4,cy-frameH+5);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(200,220,255,0.25)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle=glassG;
  ctx.beginPath();ctx.moveTo(cx-4,cy);
  ctx.quadraticCurveTo(cx-frameW,cy,cx-frameW+4,cy+frameH-5);
  ctx.lineTo(cx+frameW-4,cy+frameH-5);
  ctx.quadraticCurveTo(cx+frameW,cy,cx+4,cy);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(200,220,255,0.25)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(212,175,55,0.35)';
  ctx.beginPath();ctx.moveTo(cx-frameW*0.3,cy-frameH*0.75);
  ctx.lineTo(cx-frameW*0.3+frameW*0.6,cy-frameH*0.75);
  ctx.lineTo(cx+4,cy);ctx.lineTo(cx-4,cy);ctx.closePath();ctx.fill();
  const sandPileG=ctx.createRadialGradient(cx,cy+70,2,cx,cy+70,45);
  sandPileG.addColorStop(0,'rgba(255,220,80,0.6)');sandPileG.addColorStop(0.5,'rgba(212,175,55,0.4)');sandPileG.addColorStop(1,'rgba(180,140,30,0.1)');
  ctx.fillStyle=sandPileG;
  ctx.beginPath();ctx.ellipse(cx,cy+70,40,18,0,0,Math.PI*2);ctx.fill();
  for(let ss=0;ss<12;ss++){
    const sy=cy+ss*7,salpha=0.6-ss*0.04;
    ctx.fillStyle=`rgba(255,210,60,${salpha})`;
    ctx.beginPath();ctx.arc(cx+(Math.random()-0.5)*2,sy,1.2,0,Math.PI*2);ctx.fill();
  }
}},

// 15 — Cadenas / Libertad
{label:'Libertad', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#05030a');bg.addColorStop(0.5,'#0a0612');bg.addColorStop(1,'#0f0816');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  _stars(ctx,W,H*0.6,50);
  _glow(ctx,W*0.8,H*0.15,120,'rgba(200,210,255,0.12)');
  _glow(ctx,W*0.8,H*0.15,50,'rgba(220,230,255,0.2)');
  ctx.fillStyle='rgba(240,245,255,0.85)';
  ctx.beginPath();ctx.arc(W*0.8,H*0.15,18,0,Math.PI*2);ctx.fill();
  const chainY=H/2,linkW=24,linkH=14,spacing=22;
  const startX=W*0.05;
  let linkX=startX;
  while(linkX<W*0.95){
    const isBroken=Math.abs(linkX-W/2)<spacing;
    const alpha=isBroken?0.15:0.45;
    ctx.strokeStyle=`rgba(0,0,0,0.5)`;ctx.lineWidth=5;
    ctx.beginPath();ctx.ellipse(linkX+1,chainY+1,linkW/2,linkH/2,0,0,Math.PI*2);ctx.stroke();
    const linkG=ctx.createLinearGradient(linkX-linkW/2,chainY-linkH/2,linkX+linkW/2,chainY+linkH/2);
    linkG.addColorStop(0,`rgba(140,130,160,${alpha})`);
    linkG.addColorStop(0.5,`rgba(180,170,200,${alpha})`);
    linkG.addColorStop(1,`rgba(100,90,120,${alpha})`);
    ctx.strokeStyle=linkG;ctx.lineWidth=4;
    ctx.beginPath();ctx.ellipse(linkX,chainY,linkW/2,linkH/2,0,0,Math.PI*2);ctx.stroke();
    linkX+=spacing;
  }
  const bx=W/2,by=chainY;
  [[-18,-8,-22,5],[-15,10,-8,-16],[18,-6,24,4],[16,8,10,-14]].forEach(([x1,y1,x2,y2])=>{
    ctx.strokeStyle='rgba(212,175,55,0.7)';ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(bx+x1,by+y1);ctx.lineTo(bx+x2,by+y2);ctx.stroke();
  });
  _glow(ctx,bx,by,60,'rgba(212,175,55,0.45)');
  _glow(ctx,bx,by,30,'rgba(255,240,150,0.6)');
  for(let sp=0;sp<20;sp++){
    const angle=Math.random()*Math.PI*2;
    const dist=15+Math.random()*40;
    const sx=bx+Math.cos(angle)*dist,sy=by+Math.sin(angle)*dist;
    const sa=0.4+Math.random()*0.5;
    ctx.fillStyle=`rgba(255,220,80,${sa})`;
    ctx.beginPath();ctx.arc(sx,sy,0.8+Math.random()*1.5,0,Math.PI*2);ctx.fill();
  }
  const shaftG=ctx.createLinearGradient(W*0.8,H*0.15,bx,by);
  shaftG.addColorStop(0,'rgba(200,210,255,0.08)');shaftG.addColorStop(1,'rgba(212,175,55,0.05)');
  ctx.strokeStyle=shaftG;ctx.lineWidth=30;
  ctx.beginPath();ctx.moveTo(W*0.8,H*0.15);ctx.lineTo(bx,by);ctx.stroke();
  ctx.fillStyle='rgba(5,3,10,0.6)';ctx.fillRect(0,H*0.75,W,H*0.25);
}},

{label:'Inteligencia Artificial', fn:(ctx,W,H)=>{
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#010810');bg.addColorStop(0.5,'#020c14');bg.addColorStop(1,'#01080e');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  for(let tr=0;tr<22;tr++){
    const tx=Math.random()*W,ty=Math.random()*H;
    const len1=20+Math.random()*80,len2=15+Math.random()*60;
    const dir1=Math.random()>0.5;
    ctx.strokeStyle=`rgba(0,${140+Math.random()*80},${100+Math.random()*80},${0.08+Math.random()*0.1})`;
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(tx,ty);
    const midX=dir1?tx+len1:tx,midY=dir1?ty:ty+len1;
    ctx.lineTo(midX,midY);ctx.lineTo(midX+(dir1?0:len2),midY+(dir1?len2:0));ctx.stroke();
    ctx.fillStyle=`rgba(0,200,180,0.25)`;
    ctx.beginPath();ctx.arc(midX,midY,2,0,Math.PI*2);ctx.fill();
  }
  const cx=W/2,cy=H/2;
  const chipW=110,chipH=82;
  ctx.strokeStyle='rgba(0,200,180,0.6)';ctx.lineWidth=2;
  ctx.strokeRect(cx-chipW/2,cy-chipH/2,chipW,chipH);
  ctx.strokeStyle='rgba(0,160,150,0.35)';ctx.lineWidth=1;
  ctx.strokeRect(cx-chipW/2+8,cy-chipH/2+8,chipW-16,chipH-16);
  const gridS=12;
  for(let gx=cx-chipW/2+16;gx<cx+chipW/2-16;gx+=gridS){
    for(let gy=cy-chipH/2+16;gy<cy+chipH/2-16;gy+=gridS){
      const active=Math.random()>0.55;
      ctx.fillStyle=active?`rgba(0,220,180,0.35)`:`rgba(0,80,70,0.15)`;
      ctx.fillRect(gx,gy,gridS-2,gridS-2);
    }
  }
  [[-chipW/2,cy-chipH/4],[-chipW/2,cy],[-chipW/2,cy+chipH/4],
   [chipW/2,cy-chipH/4],[chipW/2,cy],[chipW/2,cy+chipH/4],
   [cx-chipW/4,-chipH/2],[cx,-chipH/2],[cx+chipW/4,-chipH/2],
   [cx-chipW/4,chipH/2],[cx,chipH/2],[cx+chipW/4,chipH/2]].forEach(([dx,py])=>{
    const px=typeof dx==='number'&&Math.abs(dx)===chipW/2?cx+dx:dx;
    const isTop=py<cy;
    let x1=px,y1=py,x2,y2;
    if(Math.abs(py-cy)<chipH/2*0.6){x2=px<cx?px-14:px+14;y2=py;}
    else{x2=px;y2=isTop?py-10:py+10;}
    ctx.strokeStyle='rgba(0,180,160,0.5)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    ctx.fillStyle='rgba(0,200,180,0.6)';ctx.beginPath();ctx.arc(x2,y2,2,0,Math.PI*2);ctx.fill();
  });
  _glow(ctx,cx,cy,55,'rgba(0,220,200,0.2)');
  _glow(ctx,cx,cy,25,'rgba(0,255,220,0.35)');
  const eyeG=ctx.createRadialGradient(cx,cy,0,cx,cy,18);
  eyeG.addColorStop(0,'rgba(200,255,250,0.9)');eyeG.addColorStop(0.4,'rgba(0,220,200,0.7)');
  eyeG.addColorStop(1,'transparent');
  ctx.fillStyle=eyeG;ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(0,200,180,0.4)';ctx.lineWidth=1;
  for(let ring=1;ring<=3;ring++){
    ctx.globalAlpha=0.4-ring*0.1;
    ctx.beginPath();ctx.arc(cx,cy,25+ring*15,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=1;
  const colors=['rgba(0,220,180,','rgba(0,160,220,'];
  for(let ds=0;ds<8;ds++){
    const angle=ds/8*Math.PI*2;
    const r1=chipW*0.55,r2=r1+30+Math.random()*40;
    const col=colors[ds%2];
    ctx.strokeStyle=`${col}0.3)`;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx+Math.cos(angle)*r1,cy+Math.sin(angle)*r1);
    ctx.lineTo(cx+Math.cos(angle)*r2,cy+Math.sin(angle)*r2);ctx.stroke();
  }
  _stars(ctx,W,H,10);
}},

];

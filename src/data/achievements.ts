import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {id:'defensor',icon:'⚔️',name:'Defensor de los Débiles',condition:'La Sombra no llegó a un cuarto de la condena'},
  {id:'tirano',icon:'👑',name:'El Tirano Sabio',condition:'La Sombra pasó los tres cuartos de la condena, pero no la cruzó'},
  {id:'equilibrio',icon:'⚖️',name:'Equilibrador Cósmico',condition:'La Sombra quedó a mitad de camino de la condena'},
  {id:'rapido',icon:'⚡',name:'Decisión Fulgurante',condition:'Juego < 15 minutos'},
  {id:'reflexivo',icon:'🧠',name:'Pensador Profundo',condition:'Juego > 1 hora'},
  {id:'etico',icon:'✨',name:'Virtuoso Puro',condition:'Solo virtuosismo'},
  {id:'pragmatico',icon:'💼',name:'Pragmático Total',condition:'Solo utilitarismo'},
  {id:'rebelde',icon:'🔥',name:'Rebelde Nihilista',condition:'Solo nihilismo'},
  {id:'consistente',icon:'📜',name:'Consistente Moral',condition:'Una sola filosofía'},
  {id:'cambio',icon:'🌊',name:'Mente Abierta',condition:'7 o más corrientes distintas en una partida'},
  {id:'ascendido',icon:'🌟',name:'Deificación Humana',condition:'Final: Deificación Humana'},
  {id:'extincion',icon:'💀',name:'Profeta del Fin',condition:'Final: Extinción Total (la humanidad fue condenada)'},
  {id:'guardian-digital',icon:'🤖',name:'Guardián Digital',condition:'Criterio propio ante la IA en ambos dilemas tecnológicos'},
  {id:'voz-del-rio',icon:'🌊',name:'Voz del Río',condition:'Priorizó a las comunidades vulnerables en el dilema del río'},
  {id:'mano-que-toca',icon:'🤝',name:'La Mano que Aún Toca',condition:'Eligió garantizar el contacto humano en el cuidado geriátrico'}
];

import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {id:'defensor',icon:'⚔️',name:'Defensor de los Débiles',condition:'Puntaje > 75'},
  {id:'tirano',icon:'👑',name:'El Tirano Sabio',condition:'Puntaje < 25'},
  {id:'equilibrio',icon:'⚖️',name:'Equilibrador Cósmico',condition:'Puntaje entre 45 y 55'},
  {id:'rapido',icon:'⚡',name:'Decisión Fulgurante',condition:'Juego < 15 minutos'},
  {id:'reflexivo',icon:'🧠',name:'Pensador Profundo',condition:'Juego > 1 hora'},
  {id:'etico',icon:'✨',name:'Virtuoso Puro',condition:'Solo virtuosismo'},
  {id:'pragmatico',icon:'💼',name:'Pragmático Total',condition:'Solo utilitarismo'},
  {id:'rebelde',icon:'🔥',name:'Rebelde Nihilista',condition:'Solo nihilismo'},
  {id:'consistente',icon:'📜',name:'Consistente Moral',condition:'Una sola filosofía'},
  {id:'cambio',icon:'🌊',name:'Mente Abierta',condition:'7 o más corrientes distintas en una partida'},
  {id:'ascendido',icon:'🌟',name:'Deificación Humana',condition:'Puntaje = 100'},
  {id:'extincion',icon:'💀',name:'Profeta del Fin',condition:'Puntaje = 0'},
  {id:'guardian-digital',icon:'🤖',name:'Guardián Digital',condition:'Criterio propio ante la IA en ambos dilemas tecnológicos'},
  {id:'voz-del-rio',icon:'🌊',name:'Voz del Río',condition:'Priorizó a las comunidades vulnerables en el dilema del río'},
  {id:'mano-que-toca',icon:'🤝',name:'La Mano que Aún Toca',condition:'Eligió garantizar el contacto humano en el cuidado geriátrico'}
];

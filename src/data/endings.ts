import type { Ending } from '../types';

export const endings: Record<'extinction' | 'purgatory' | 'enlightenment' | 'deification', Ending> = {
  extinction:{icon:'💀',title:'EXTINCIÓN TOTAL',narrative:'Los dioses contemplan vuestra especie con disgusto. Habéis sido pesados en la balanza cósmica y hallados deficientes. La humanidad es declarada un error biológico, un experimento fallido del universo. Vuestro linaje se extingue en silencio. De las cenizas, nuevas formas de vida florecerán, ignorantes de lo que alguna vez fuisteis.'},
  purgatory:{icon:'⛓️',title:'PURGATORIO ETERNO',narrative:'Los dioses pronuncian su sentencia: la humanidad ha fracasado en el autodominio. Se os arrebata el libre albedrío. Viviréis felices, pero como bestias civilizadas, guiados por algoritmos benévolos que nunca os preguntarán si estáis de acuerdo. Libertad por paz. Una elección que los dioses consideran, quizás, misericordiosa.'},
  enlightenment:{icon:'🌅',title:'ASCENSIÓN ILUSTRADA',narrative:'Los dioses sonríen con cautela. Habéis cometido errores, pero con intención. Vuestras contradicciones revelan una especie que aún lucha por comprender lo que es justo. Se os concede una oportunidad más. La humanidad recibirá guía ética eterna. No sois inmortales aún; pero quien sabe, con el tiempo, quizás lo seáis.'},
  deification:{icon:'⚡',title:'DEIFICACIÓN HUMANA',narrative:'Los dioses se inclinan. Habéis trascendido vuestra naturaleza. A través de dilemas imposibles, habéis forjado una brújula moral que ni el cosmos había anticipado. La humanidad es declarada digna de unirse a nosotros en los cielos. Ya no seréis gobernados. Seréis dioses.'}
};

// Rare-combo endings: override the score-bucket narrative above when the
// playthrough's philosophy profile is itself extraordinary, not just the
// final score. endingKey (the score bucket) is untouched so stats/history
// grouping keeps working — only the displayed ending object changes.
export const specialEndings: Record<'pureAscension' | 'pureVoid' | 'universalMediator', Ending> = {
  pureAscension:{icon:'✨',title:'LA VOZ ÚNICA',narrative:'Los dioses guardan un silencio distinto, no de desagrado sino de asombro. No juzgasteis con cuarenta voces distintas: hablasteis con una sola, sin fisuras, hasta el final. Esa clase de pureza no la habían visto en una especie mortal. No sois perfectos. Sois, algo más raro todavía: coherentes.'},
  pureVoid:{icon:'🕳️',title:'EL ABISMO CONSECUENTE',narrative:'Ni siquiera al final buscasteis otra salida. Cuarenta veces se os ofreció la posibilidad de contradeciros, de dudar, de ceder — y cuarenta veces elegisteis lo mismo, hasta el fondo. Los dioses no ven en vos un fracaso moral: ven algo peor, una convicción perfecta en la dirección equivocada.'},
  universalMediator:{icon:'🌊',title:'EL MEDIADOR UNIVERSAL',narrative:'Los dioses no pueden nombrar vuestra filosofía porque no tenéis una sola: tenéis todas, sostenidas a la vez, sin resolverlas nunca del todo. Otros linajes eligen un camino. El vuestro los contuvo todos, contradictorios entre sí, y siguió adelante. Ni condena ni gloria: los dioses os archivan como un caso irrepetible.'},
};

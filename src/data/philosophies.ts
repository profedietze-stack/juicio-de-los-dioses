import type { PhilosophyKey, PhilosophyInfo } from '../types';

export const PHILO_DATA: Record<PhilosophyKey, PhilosophyInfo> = {
  utilitarismo:{
    label:'Utilitarismo',cls:'util',
    founders:'Jeremy Bentham · John Stuart Mill · Peter Singer',
    short:'Maximizar el bienestar del mayor número posible.',
    long:'En esta corriente, una acción es correcta si produce la mayor felicidad para el mayor número de personas. Bentham diseñó el cálculo felicífico para medir el placer y el dolor; Mill refinó la idea distinguiendo placeres superiores (intelectuales) de inferiores (sensibles). Tu perfil muestra una tendencia a evaluar las situaciones por sus consecuencias agregadas: lo que importa es el resultado medible sobre el bienestar colectivo. El riesgo filosófico de esta posición es la instrumentalización del individuo: si el cálculo lo justifica, se puede sacrificar a uno en beneficio de muchos.',
    tension:'Tu pensamiento utilitarista puede entrar en conflicto con los derechos individuales cuando el bien colectivo exige sacrificar intereses particulares.'
  },
  deontologia:{
    label:'Deontología',cls:'deon',
    founders:'Immanuel Kant · W.D. Ross · Christine Korsgaard',
    short:'Actuar según el deber moral universal, independientemente de las consecuencias.',
    long:'La deontología kantiana sostiene que existen deberes morales absolutos que no pueden violarse sin importar el resultado. El imperativo categórico de Kant exige actuar solo según máximas que puedas querer universalizadas: tratar a las personas siempre como fines en sí mismas, nunca como meros medios. Tu perfil revela un pensamiento orientado por principios, por la consistencia moral y por la inviolabilidad de ciertos derechos. La fortaleza de esta posición es su coherencia; su tensión, la rigidez ante situaciones extremas donde el principio absoluto produce consecuencias desastrosas.',
    tension:'El rigor deontológico puede producir resultados paradójicos: a veces, no mentir o no violar un principio genera más daño que hacerlo.'
  },
  nihilismo:{
    label:'Nihilismo',cls:'nihi',
    founders:'Friedrich Nietzsche · Albert Camus · Emil Cioran',
    short:'Cuestionar o negar la existencia de valores morales objetivos.',
    long:'El nihilismo, en su forma filosófica más fértil, no es mera indiferencia sino un cuestionamiento radical de los fundamentos de la moral. Nietzsche proclamó la muerte de Dios como el colapso de los valores absolutos, y propuso la transvaloración: crear nuevos valores desde la voluntad de poder. Camus transformó el absurdo en una ética de la rebelión: si el mundo carece de sentido, debemos crear el nuestro con lucidez. Tu perfil sugiere una postura crítica ante los sistemas morales establecidos, una resistencia al dogmatismo y una conciencia aguda de la arbitrariedad de muchos valores que se presentan como universales.',
    tension:'El nihilismo como punto de partida es valioso; como punto de llegada, puede paralizar la acción moral precisamente cuando más se necesita.'
  },
  virtuosismo:{
    label:'Virtuosismo',cls:'virt',
    founders:'Aristóteles · Alasdair MacIntyre · Martha Nussbaum',
    short:'Cultivar el carácter excelente orientado hacia la eudaimonía.',
    long:'La ética aristotélica no pregunta "¿qué debo hacer?" sino "¿qué clase de persona debo ser?". La virtud es una disposición del carácter que se cultiva con la práctica: el valor, la prudencia (phronesis), la justicia y la templanza. La eudaimonía —el florecimiento humano— es el fin último de la vida bien vivida. Tu perfil indica una orientación hacia la excelencia personal, la coherencia entre valores y acción, y la importancia del contexto en la decisión moral. MacIntyre y Nussbaum actualizaron esta ética para la modernidad, insistiendo en que las virtudes son también respuestas a la fragilidad y la contingencia humana.',
    tension:'El virtuosismo puede volverse elitista si no reconoce las condiciones estructurales que dificultan el cultivo de virtudes en contextos de injusticia.'
  },
  existencialismo:{
    label:'Existencialismo',cls:'exis',
    founders:'Jean-Paul Sartre · Simone de Beauvoir · Albert Camus · Søren Kierkegaard',
    short:'La existencia precede a la esencia: el ser humano se define por sus elecciones.',
    long:'Para Sartre, no existe naturaleza humana previa ni esencia dada: somos lo que elegimos ser. Esta libertad radical es también una condena: no podemos no elegir, y cada elección implica una responsabilidad absoluta. De Beauvoir extendió el existencialismo al análisis del género, mostrando que "la mujer" es una construcción histórica, no un destino biológico. Tu perfil revela una profunda valoración de la autenticidad, la libertad individual y la responsabilidad personal. La angustia existencial —el peso de saber que somos libres— no es una debilidad sino el signo de una consciencia que no se engaña.',
    tension:'La libertad absoluta puede ignorar las estructuras sociales que condicionan las elecciones reales de las personas: no todos parten del mismo punto.'
  },
  estoicismo:{
    label:'Estoicismo',cls:'esto',
    founders:'Epicteto · Marco Aurelio · Séneca · Zenón de Citio',
    short:'Distinguir lo que depende de nosotros de lo que no, y cultivar la serenidad interior.',
    long:'El estoicismo enseña que el dominio sobre los juicios, los impulsos y los deseos —no sobre los eventos externos— es la única libertad real. Epicteto, exesclavizado y libre por dentro, y Marco Aurelio, emperador y austero por convicción, ilustran que la filosofía estoica se practica en cualquier condición. Tu perfil muestra una capacidad de aceptación ecuánime ante lo inevitable, una orientación hacia la acción donde es posible y hacia la serenidad donde no lo es. El estoicismo no es resignación pasiva: es la disciplina de no desperdiciar energía moral en lo que no podemos cambiar.',
    tension:'El riesgo del estoicismo es confundir la aceptación de lo inevitable con la justificación de injusticias que sí podrían y deberían modificarse.'
  },
  pragmatismo:{
    label:'Pragmatismo',cls:'prag',
    founders:'William James · John Dewey · Charles Sanders Peirce · Richard Rorty',
    short:'La verdad y la corrección moral se miden por sus consecuencias prácticas reales.',
    long:'El pragmatismo no pregunta si una idea es abstractamente verdadera sino si funciona: si produce resultados verificables, si mejora la experiencia. James aplicó esto a la ética: las creencias morales valen por sus efectos prácticos en la vida. Dewey fue más lejos: la educación y la democracia son instrumentos para el mejoramiento continuo de la experiencia colectiva. Tu perfil indica una mentalidad orientada a la resolución de problemas concretos, a la adaptabilidad y a la evaluación empírica de los resultados. La ética pragmatista es antidogmática: ningún principio es sagrado si sus consecuencias son dañinas.',
    tension:'Sin anclaje en principios, el pragmatismo puede deslizarse hacia el oportunismo: "lo que funciona" puede depender de quién define el éxito y para quién.'
  },
  contractualismo:{
    label:'Contractualismo',cls:'cont',
    founders:'Jean-Jacques Rousseau · John Locke · John Rawls · Thomas Scanlon',
    short:'La legitimidad moral y política nace del acuerdo entre personas libres e iguales.',
    long:'Para Rawls, los principios de justicia son los que personas racionales elegirían detrás del velo de la ignorancia: sin saber qué lugar ocuparán en la sociedad, tenderían a proteger a los más desfavorecidos. Scanlon propone que una acción es incorrecta si sus principios no pueden ser razonablemente rechazados por nadie afectado. Tu perfil muestra una orientación hacia los procedimientos justos, el acuerdo intersubjetivo y la legitimidad democrática. La fortaleza del contractualismo es su respeto por la autonomía y la igualdad; su límite, que el contrato real siempre está condicionado por las desigualdades de poder previas.',
    tension:'Un contrato entre desiguales reproduce la desigualdad. El velo de la ignorancia es un experimento mental valioso pero difícil de implementar en condiciones reales.'
  },
  feminismo:{
    label:'Feminismo Ético',cls:'femi',
    founders:'Carol Gilligan · Nel Noddings · bell hooks · Simone de Beauvoir · Virginia Held',
    short:'Ética del cuidado y crítica a los sesgos de género en la filosofía moral.',
    long:'Carol Gilligan demostró que las teorías éticas dominantes —basadas en principios abstractos y universales— reflejaban perspectivas masculinas e ignoraban una ética del cuidado orientada a las relaciones concretas de interdependencia. bell hooks amplió este enfoque integrando raza y clase: la opresión es interseccional. Tu perfil revela sensibilidad ante las desigualdades estructurales, valoración de las relaciones de cuidado mutuo, y crítica a los sistemas que naturalizan el privilegio. La ética feminista no es solo una ética para mujeres: es una relectura de toda la filosofía moral desde los márgenes del poder.',
    tension:'El énfasis en el cuidado y las relaciones puede recaer desproporcionadamente en quienes históricamente han sido asignados a ese rol: mujeres y cuidadores.'
  },
  budismo:{
    label:'Budismo',cls:'budi',
    founders:'Siddhartha Gautama · Nagarjuna · Thich Nhat Hanh · Dalai Lama XIV',
    short:'Compasión universal, reducción del apego y reconocimiento de la impermanencia.',
    long:'La ética budista parte de una premisa radical: el sufrimiento es universal y tiene una causa —el apego y el deseo— que puede ser comprendida y reducida. La compasión (karuna) no es un sentimiento sino una práctica activa de reconocer el sufrimiento ajeno y actuar para aliviarlo. La interdependencia (pratītyasamutpāda) enseña que nada existe de forma independiente: toda acción tiene consecuencias en una red de relaciones. Tu perfil muestra una orientación hacia la ecuanimidad, la reducción del daño y una ética que trasciende las fronteras de la especie. El budismo no postula derechos sino responsabilidades nacidas de la comprensión.',
    tension:'La aceptación budista de la impermanencia puede desincentivar la resistencia ante injusticias estructurales que sí son modificables con acción colectiva.'
  }
};

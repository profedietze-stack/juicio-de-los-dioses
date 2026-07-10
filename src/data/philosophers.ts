import type { PhilosophyKey } from '../types';

export interface Philosopher {
  id: string;
  name: string;
  philosophy: PhilosophyKey;
  years: string;
  civilization: string;
  bio: string;
  portrait: string;
}

export const philosophers: Philosopher[] = [
  {
    id: 'aristoteles',
    name: 'Aristóteles',
    philosophy: 'virtuosismo',
    years: '384–322 a.C.',
    civilization: 'Grecia antigua',
    bio: 'Discípulo de Platón y maestro de Alejandro Magno, fundó el Liceo de Atenas. Sostuvo que la vida buena consiste en cultivar el carácter virtuoso a través del hábito y la razón práctica.',
    portrait: '/philosophers/aristoteles.jpg',
  },
  {
    id: 'buda',
    name: 'Buda (Siddhartha Gautama)',
    philosophy: 'budismo',
    years: 's. VI a.C.',
    civilization: 'India/Nepal antiguos',
    bio: 'Príncipe que renunció a su vida de privilegios para buscar el fin del sufrimiento. Enseñó que el apego y el deseo son la raíz del dolor, y que la liberación llega por el desapego y la compasión.',
    portrait: '/philosophers/buda.jpg',
  },
  {
    id: 'seneca',
    name: 'Séneca',
    philosophy: 'estoicismo',
    years: '4 a.C.–65 d.C.',
    civilization: 'Roma (Hispania)',
    bio: 'Filósofo, dramaturgo y consejero del emperador Nerón, nacido en Córdoba. Defendió que la virtud y la serenidad interior son lo único verdaderamente nuestro, ajeno a la fortuna.',
    portrait: '/philosophers/seneca.jpg',
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    philosophy: 'deontologia',
    years: '1724–1804',
    civilization: 'Prusia (Alemania)',
    bio: 'Filósofo de Königsberg que nunca salió de su ciudad natal. Formuló el imperativo categórico: actuar solo según máximas que puedan convertirse en ley universal, sin importar las consecuencias.',
    portrait: '/philosophers/kant.jpg',
  },
  {
    id: 'mill',
    name: 'John Stuart Mill',
    philosophy: 'utilitarismo',
    years: '1806–1873',
    civilization: 'Inglaterra',
    bio: 'Filósofo y economista educado por su padre desde la infancia. Refinó el utilitarismo de Bentham distinguiendo placeres superiores e inferiores, y defendió la libertad individual como condición del progreso.',
    portrait: '/philosophers/mill.jpg',
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    philosophy: 'nihilismo',
    years: '1844–1900',
    civilization: 'Alemania',
    bio: 'Filólogo y filósofo que proclamó la muerte de Dios y el vacío de los valores heredados. Propuso la voluntad de poder y la creación de valores propios frente al nihilismo que él mismo diagnosticó.',
    portrait: '/philosophers/nietzsche.jpg',
  },
  {
    id: 'korn',
    name: 'Alejandro Korn',
    philosophy: 'pragmatismo',
    years: '1860–1936',
    civilization: 'Argentina',
    bio: 'Médico psiquiatra y filósofo argentino, referente del Reformismo Universitario de 1918. Defendió la libertad como creación histórica concreta, no como abstracción, ligada a la experiencia y la acción.',
    portrait: '/philosophers/korn.jpg',
  },
  {
    id: 'locke',
    name: 'John Locke',
    philosophy: 'contractualismo',
    years: '1632–1704',
    civilization: 'Inglaterra',
    bio: 'Médico y filósofo, padre del liberalismo político. Sostuvo que los individuos poseen derechos naturales a la vida, la libertad y la propiedad, y que el gobierno legítimo nace del consentimiento de los gobernados.',
    portrait: '/philosophers/locke.jpg',
  },
  {
    id: 'beauvoir',
    name: 'Simone de Beauvoir',
    philosophy: 'existencialismo',
    years: '1908–1986',
    civilization: 'Francia',
    bio: "Filósofa, escritora y referente del existencialismo francés junto a Sartre. En 'El segundo sexo' analizó cómo la libertad y la identidad se construyen en situación, no en abstracto.",
    portrait: '/philosophers/beauvoir.jpg',
  },
  {
    id: 'arendt',
    name: 'Hannah Arendt',
    philosophy: 'feminismo',
    years: '1906–1975',
    civilization: 'Alemania / Estados Unidos',
    bio: "Filósofa política judeoalemana que huyó del nazismo. Acuñó la idea de la 'banalidad del mal' y sostuvo que la acción colectiva y el juicio propio son la base de la responsabilidad moral.",
    portrait: '/philosophers/arendt.jpg',
  },
];

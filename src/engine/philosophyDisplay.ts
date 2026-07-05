import type { PhilosophyKey } from '../types';

export const PHILO_LABELS: Record<PhilosophyKey, string> = {
  utilitarismo: 'Utilitarismo', deontologia: 'Deontología', nihilismo: 'Nihilismo',
  virtuosismo: 'Virtuosismo', existencialismo: 'Existencialismo', estoicismo: 'Estoicismo',
  pragmatismo: 'Pragmatismo', contractualismo: 'Contractualismo', feminismo: 'Feminismo Ético', budismo: 'Budismo',
};

export const PHILO_CLS: Record<PhilosophyKey, string> = {
  utilitarismo: 'util', deontologia: 'deon', nihilismo: 'nihi', virtuosismo: 'virt',
  existencialismo: 'exis', estoicismo: 'esto', pragmatismo: 'prag', contractualismo: 'cont',
  feminismo: 'femi', budismo: 'budi',
};

export const BORDER_COLOR_VARS: Record<string, string> = {
  util: 'var(--util)', deon: 'var(--deon)', nihi: 'var(--nihi)', virt: 'var(--virt)',
  exis: 'var(--exis)', esto: 'var(--esto)', prag: 'var(--prag)', cont: 'var(--cont)',
  femi: 'var(--femi)', budi: 'var(--budi)',
};

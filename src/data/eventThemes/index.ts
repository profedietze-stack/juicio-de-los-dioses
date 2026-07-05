import type { EventTheme } from '../../types';
import { group1 } from './group1';
import { group2 } from './group2';
import { group3 } from './group3';
import { group4 } from './group4';

export const EV_THEMES: EventTheme[] = [...group1, ...group2, ...group3, ...group4];

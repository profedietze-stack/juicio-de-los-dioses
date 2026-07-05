import type { Dilemma } from '../../types';
import { block1 } from './block1';
import { block2 } from './block2';
import { block3 } from './block3';
import { finale } from './finale';

export const eventPool: Dilemma[] = [...block1, ...block2, ...block3, finale];

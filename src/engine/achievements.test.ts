import { describe, it, expect } from 'vitest';
import { checkAchievements } from './achievements';
import type { DilemmaOption } from '../types';

function decisions(philosophy: DilemmaOption['philosophy'], n = 40): DilemmaOption[] {
  return Array.from({ length: n }, () => ({ text: 'x', impact: 1, philosophy }));
}

describe('checkAchievements', () => {
  it('unlocks defensor when score > 75', () => {
    expect(checkAchievements({ score: 80, time: 1000, decisions: decisions('utilitarismo') })).toContain('defensor');
  });

  it('unlocks tirano when score < 25', () => {
    expect(checkAchievements({ score: 10, time: 1000, decisions: decisions('utilitarismo') })).toContain('tirano');
  });

  it('unlocks equilibrio when score is between 45 and 55', () => {
    expect(checkAchievements({ score: 50, time: 1000, decisions: decisions('utilitarismo') })).toContain('equilibrio');
  });

  it('unlocks rapido when time < 900s and reflexivo when time > 3600s', () => {
    expect(checkAchievements({ score: 50, time: 500, decisions: decisions('utilitarismo') })).toContain('rapido');
    expect(checkAchievements({ score: 50, time: 3700, decisions: decisions('utilitarismo') })).toContain('reflexivo');
  });

  it('unlocks etico/pragmatico/rebelde only when every choice matches that philosophy', () => {
    expect(checkAchievements({ score: 50, time: 1000, decisions: decisions('virtuosismo') })).toContain('etico');
    expect(checkAchievements({ score: 50, time: 1000, decisions: decisions('utilitarismo') })).toContain('pragmatico');
    expect(checkAchievements({ score: 50, time: 1000, decisions: decisions('nihilismo') })).toContain('rebelde');
  });

  it('unlocks consistente when only one distinct philosophy was used', () => {
    expect(checkAchievements({ score: 50, time: 1000, decisions: decisions('budismo') })).toContain('consistente');
  });

  it('unlocks cambio when 7+ distinct philosophies were used', () => {
    const mixed: DilemmaOption[] = ['utilitarismo', 'deontologia', 'nihilismo', 'virtuosismo', 'existencialismo', 'estoicismo', 'pragmatismo']
      .map(philosophy => ({ text: 'x', impact: 1, philosophy: philosophy as DilemmaOption['philosophy'] }));
    expect(checkAchievements({ score: 50, time: 1000, decisions: mixed })).toContain('cambio');
  });

  it('unlocks ascendido at score 100 and extincion at score 0', () => {
    expect(checkAchievements({ score: 100, time: 1000, decisions: decisions('utilitarismo') })).toContain('ascendido');
    expect(checkAchievements({ score: 0, time: 1000, decisions: decisions('utilitarismo') })).toContain('extincion');
  });

  describe('block4-themed achievements', () => {
    function opt(philosophy: DilemmaOption['philosophy'], impact = 1): DilemmaOption {
      return { text: 'x', impact, philosophy };
    }

    it('unlocks guardian-digital when avoiding the passive-acceptance option on both AI dilemmas (81, 82)', () => {
      const decisions = [opt('pragmatismo'), opt('contractualismo')];
      const eventIds = [81, 82];
      expect(checkAchievements({ score: 50, time: 1000, decisions, eventIds })).toContain('guardian-digital');
    });

    it('does not unlock guardian-digital when the utilitarismo pass-through option was picked on either AI dilemma', () => {
      const decisions = [opt('utilitarismo', 2), opt('contractualismo')];
      const eventIds = [81, 82];
      expect(checkAchievements({ score: 50, time: 1000, decisions, eventIds })).not.toContain('guardian-digital');
    });

    it('does not unlock guardian-digital when the AI dilemmas were not played', () => {
      expect(checkAchievements({ score: 50, time: 1000, decisions: decisions_arr(), eventIds: [] })).not.toContain('guardian-digital');
    });

    it('unlocks voz-del-rio when choosing the feminismo option on dilemma 84', () => {
      expect(checkAchievements({ score: 50, time: 1000, decisions: [opt('feminismo')], eventIds: [84] })).toContain('voz-del-rio');
    });

    it('does not unlock voz-del-rio when a different option was chosen on dilemma 84', () => {
      expect(checkAchievements({ score: 50, time: 1000, decisions: [opt('deontologia')], eventIds: [84] })).not.toContain('voz-del-rio');
    });

    it('unlocks mano-que-toca when choosing the feminismo option on dilemma 85', () => {
      expect(checkAchievements({ score: 50, time: 1000, decisions: [opt('feminismo')], eventIds: [85] })).toContain('mano-que-toca');
    });

    it('does not unlock mano-que-toca when dilemma 85 was not played', () => {
      expect(checkAchievements({ score: 50, time: 1000, decisions: [], eventIds: [] })).not.toContain('mano-que-toca');
    });

    function decisions_arr(): DilemmaOption[] {
      return [opt('utilitarismo')];
    }
  });
});

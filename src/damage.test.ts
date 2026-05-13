import { describe, it, expect } from 'vitest';
import { dmg, sum, compare, ZERO, type Stats } from './damage';

const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

describe('dmg()', () => {
  it('returns 0 when weaponDmg is 0', () => {
    expect(dmg({ ...ZERO, mainStat: 1000 }).total).toBe(0);
  });

  it('returns 0 when mainStat is 0', () => {
    expect(dmg({ ...ZERO, weaponDmg: 1000 }).total).toBe(0);
  });

  it('applies base multipliers when all %-fields are 0', () => {
    const r = dmg({ weaponDmg: 100, mainStat: 1000, critDmg: 0, vulnDmg: 0, elemDmg: 0 });
    expect(r.critMult).toBe(1.5);
    expect(r.vulnMult).toBe(1.2);
    expect(r.elemMult).toBe(1.0);
    expect(r.total).toBe(100 * 1000 * 1.5 * 1.2 * 1.0);
  });

  it('adds percentages on top of bases', () => {
    const r = dmg({ weaponDmg: 1, mainStat: 1, critDmg: 100, vulnDmg: 50, elemDmg: 25 });
    expect(close(r.critMult, 2.5)).toBe(true);
    expect(close(r.vulnMult, 1.7)).toBe(true);
    expect(close(r.elemMult, 1.25)).toBe(true);
  });
});

describe('sum()', () => {
  it('returns ZERO for empty input', () => {
    expect(sum()).toEqual(ZERO);
  });

  it('adds fields across multiple sources', () => {
    const a: Stats = { weaponDmg: 100, mainStat: 200, critDmg: 10, vulnDmg: 5, elemDmg: 1 };
    const b: Stats = { weaponDmg: 50, mainStat: 30, critDmg: 20, vulnDmg: 15, elemDmg: 3 };
    expect(sum(a, b)).toEqual({
      weaponDmg: 150,
      mainStat: 230,
      critDmg: 30,
      vulnDmg: 20,
      elemDmg: 4,
    });
  });
});

describe('compare()', () => {
  it('returns Δ = 0 when old and new items are identical', () => {
    const other: Stats = { weaponDmg: 1000, mainStat: 2500, critDmg: 150, vulnDmg: 30, elemDmg: 60 };
    const item: Stats = { weaponDmg: 0, mainStat: 100, critDmg: 50, vulnDmg: 10, elemDmg: 5 };
    const { delta } = compare(other, item, item);
    expect(close(delta, 0)).toBe(true);
  });

  it('returns positive Δ when new item strictly improves', () => {
    const other: Stats = { weaponDmg: 1000, mainStat: 2500, critDmg: 150, vulnDmg: 30, elemDmg: 60 };
    const oldItem: Stats = { weaponDmg: 0, mainStat: 100, critDmg: 50, vulnDmg: 10, elemDmg: 5 };
    const newItem: Stats = { weaponDmg: 0, mainStat: 120, critDmg: 50, vulnDmg: 10, elemDmg: 5 };
    const { delta } = compare(other, oldItem, newItem);
    expect(delta).toBeGreaterThan(0);
  });

  it('matches a hand-calculated example (pure mainStat upgrade)', () => {
    const other: Stats = { weaponDmg: 1, mainStat: 2500, critDmg: 0, vulnDmg: 0, elemDmg: 0 };
    const oldItem: Stats = { weaponDmg: 0, mainStat: 100, critDmg: 0, vulnDmg: 0, elemDmg: 0 };
    const newItem: Stats = { weaponDmg: 0, mainStat: 200, critDmg: 0, vulnDmg: 0, elemDmg: 0 };
    // dmg ∝ mainStat → Δ = (2500+200)/(2500+100) - 1 = 2700/2600 - 1
    const { delta } = compare(other, oldItem, newItem);
    expect(close(delta, 2700 / 2600 - 1, 1e-12)).toBe(true);
  });

  it('weapon-slot swap: only weapon item carries weaponDmg', () => {
    const other: Stats = { weaponDmg: 0, mainStat: 2500, critDmg: 100, vulnDmg: 20, elemDmg: 50 };
    const oldWpn: Stats = { weaponDmg: 850, mainStat: 0, critDmg: 0, vulnDmg: 0, elemDmg: 0 };
    const newWpn: Stats = { weaponDmg: 900, mainStat: 0, critDmg: 0, vulnDmg: 0, elemDmg: 0 };
    const { delta } = compare(other, oldWpn, newWpn);
    // weaponDmg is linear → 900/850 - 1
    expect(close(delta, 900 / 850 - 1, 1e-12)).toBe(true);
  });
});

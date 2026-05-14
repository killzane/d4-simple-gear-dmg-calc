import { describe, it, expect } from 'vitest';
import {
  dmg,
  sum,
  compare,
  ZERO,
  DEFAULT_OPTIONS,
  type Stats,
  type CalcOptions,
} from './damage';

const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

const ASSUME: CalcOptions = { critMode: 'assume' };
const EXPECTED: CalcOptions = { critMode: 'expected' };

describe('dmg() — assume crit mode', () => {
  it('returns 0 when weaponDmg is 0', () => {
    expect(dmg({ ...ZERO, mainStat: 1000 }, ASSUME).total).toBe(0);
  });

  it('returns 0 when mainStat is 0', () => {
    expect(dmg({ ...ZERO, weaponDmg: 1000 }, ASSUME).total).toBe(0);
  });

  it('applies base multipliers when all %-fields are 0', () => {
    const r = dmg({ ...ZERO, weaponDmg: 100, mainStat: 1000 }, ASSUME);
    expect(r.critMult).toBe(1.5);
    expect(r.vulnMult).toBe(1.2);
    expect(r.elemMult).toBe(1.0);
    expect(r.total).toBe(100 * 1000 * 1.5 * 1.2 * 1.0);
  });

  it('adds percentages on top of bases', () => {
    const r = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1, critDmg: 100, vulnDmg: 50, elemDmg: 25 }, ASSUME);
    expect(close(r.critMult, 2.5)).toBe(true);
    expect(close(r.vulnMult, 1.7)).toBe(true);
    expect(close(r.elemMult, 1.25)).toBe(true);
  });

  it('ignores critChance in assume mode', () => {
    const a = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1, critChance: 0 }, ASSUME);
    const b = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1, critChance: 80 }, ASSUME);
    expect(a.total).toBe(b.total);
  });

  it('DEFAULT_OPTIONS behaves as assume mode', () => {
    const r = dmg({ ...ZERO, weaponDmg: 100, mainStat: 1000 }, DEFAULT_OPTIONS);
    expect(r.critMult).toBe(1.5);
  });
});

describe('dmg() — expected crit mode', () => {
  it('uses base 5% crit chance when critChance is 0', () => {
    // critChanceEff = 0.05; critMult = 1 + 0.05 * (0.5 + 0) = 1.025
    const r = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1 }, EXPECTED);
    expect(close(r.critChanceEff, 0.05)).toBe(true);
    expect(close(r.critMult, 1.025)).toBe(true);
  });

  it('matches hand-calculated example', () => {
    // critChance 45 -> eff 0.05 + 0.45 = 0.5; critDmg 100 -> critMult = 1 + 0.5 * 1.5 = 1.75
    const r = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1, critChance: 45, critDmg: 100 }, EXPECTED);
    expect(close(r.critChanceEff, 0.5)).toBe(true);
    expect(close(r.critMult, 1.75)).toBe(true);
  });

  it('caps effective crit chance at 100%', () => {
    const r = dmg({ ...ZERO, weaponDmg: 1, mainStat: 1, critChance: 200, critDmg: 100 }, EXPECTED);
    expect(r.critChanceEff).toBe(1);
    expect(close(r.critMult, 1 + 1 * 1.5)).toBe(true);
  });
});

describe('sum()', () => {
  it('returns ZERO for empty input', () => {
    expect(sum()).toEqual(ZERO);
  });

  it('adds all fields across multiple sources', () => {
    const a: Stats = {
      weaponDmg: 100,
      mainStat: 200,
      critDmg: 10,
      vulnDmg: 5,
      elemDmg: 1,
      critChance: 8,
    };
    const b: Stats = {
      weaponDmg: 50,
      mainStat: 30,
      critDmg: 20,
      vulnDmg: 15,
      elemDmg: 3,
      critChance: 12,
    };
    expect(sum(a, b)).toEqual({
      weaponDmg: 150,
      mainStat: 230,
      critDmg: 30,
      vulnDmg: 20,
      elemDmg: 4,
      critChance: 20,
    });
  });
});

describe('compare()', () => {
  it('returns Δ = 0 and ratio = 1 when old and new items are identical', () => {
    const other: Stats = { ...ZERO, weaponDmg: 1000, mainStat: 2500, critDmg: 150 };
    const item: Stats = { ...ZERO, mainStat: 100, critDmg: 50 };
    const { delta, ratio } = compare(other, item, item, ASSUME);
    expect(close(delta, 0)).toBe(true);
    expect(close(ratio, 1)).toBe(true);
  });

  it('ratio equals 1 + delta', () => {
    const other: Stats = { ...ZERO, weaponDmg: 1000, mainStat: 2500, critDmg: 150 };
    const oldItem: Stats = { ...ZERO, mainStat: 100 };
    const newItem: Stats = { ...ZERO, mainStat: 180, vulnDmg: 12 };
    const { delta, ratio } = compare(other, oldItem, newItem, ASSUME);
    expect(close(ratio, 1 + delta)).toBe(true);
  });

  it('returns positive Δ when new item strictly improves', () => {
    const other: Stats = { ...ZERO, weaponDmg: 1000, mainStat: 2500, critDmg: 150 };
    const oldItem: Stats = { ...ZERO, mainStat: 100 };
    const newItem: Stats = { ...ZERO, mainStat: 120 };
    expect(compare(other, oldItem, newItem, ASSUME).delta).toBeGreaterThan(0);
  });

  it('matches a hand-calculated example (pure mainStat upgrade)', () => {
    const other: Stats = { ...ZERO, weaponDmg: 1, mainStat: 2500 };
    const oldItem: Stats = { ...ZERO, mainStat: 100 };
    const newItem: Stats = { ...ZERO, mainStat: 200 };
    // dmg ∝ mainStat → Δ = (2500+200)/(2500+100) - 1 = 2700/2600 - 1
    const { delta } = compare(other, oldItem, newItem, ASSUME);
    expect(close(delta, 2700 / 2600 - 1, 1e-12)).toBe(true);
  });

  it('weapon-slot swap: only weapon item carries weaponDmg', () => {
    const other: Stats = { ...ZERO, mainStat: 2500, critDmg: 100, vulnDmg: 20, elemDmg: 50 };
    const oldWpn: Stats = { ...ZERO, weaponDmg: 850 };
    const newWpn: Stats = { ...ZERO, weaponDmg: 900 };
    const { delta } = compare(other, oldWpn, newWpn, ASSUME);
    expect(close(delta, 900 / 850 - 1, 1e-12)).toBe(true);
  });

  it('crit-chance swap only matters in expected mode', () => {
    const other: Stats = { ...ZERO, weaponDmg: 1, mainStat: 1, critDmg: 100 };
    const oldItem: Stats = { ...ZERO, critChance: 0 };
    const newItem: Stats = { ...ZERO, critChance: 20 };
    expect(compare(other, oldItem, newItem, ASSUME).delta).toBe(0);
    expect(compare(other, oldItem, newItem, EXPECTED).delta).toBeGreaterThan(0);
  });
});

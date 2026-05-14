export type Stats = {
  weaponDmg: number;
  mainStat: number;
  critDmg: number;
  vulnDmg: number;
  elemDmg: number;
  critChance: number;
};

export type StatKey = keyof Stats;

export const ZERO: Stats = {
  weaponDmg: 0,
  mainStat: 0,
  critDmg: 0,
  vulnDmg: 0,
  elemDmg: 0,
  critChance: 0,
};

export const STAT_KEYS = [
  'weaponDmg',
  'mainStat',
  'critDmg',
  'vulnDmg',
  'elemDmg',
  'critChance',
] as const;

export type CritMode = 'assume' | 'expected';

export type CalcOptions = {
  critMode: CritMode;
};

export const DEFAULT_OPTIONS: CalcOptions = {
  critMode: 'assume',
};

export function sum(...sources: Stats[]): Stats {
  return sources.reduce<Stats>(
    (acc, s) => ({
      weaponDmg: acc.weaponDmg + s.weaponDmg,
      mainStat: acc.mainStat + s.mainStat,
      critDmg: acc.critDmg + s.critDmg,
      vulnDmg: acc.vulnDmg + s.vulnDmg,
      elemDmg: acc.elemDmg + s.elemDmg,
      critChance: acc.critChance + s.critChance,
    }),
    { ...ZERO },
  );
}

export type Breakdown = {
  total: number;
  weaponDmg: number;
  mainStat: number;
  critMult: number;
  vulnMult: number;
  elemMult: number;
  critChanceEff: number;
};

export function dmg(s: Stats, opts: CalcOptions): Breakdown {
  const weaponDmg = Math.max(0, s.weaponDmg);
  const mainStat = Math.max(0, s.mainStat);

  const critChanceEff = Math.min(1, Math.max(0, 0.05 + s.critChance / 100));
  const critMult =
    opts.critMode === 'expected'
      ? 1 + critChanceEff * (0.5 + s.critDmg / 100)
      : 1.5 + s.critDmg / 100;

  const vulnMult = 1.2 + s.vulnDmg / 100;
  const elemMult = 1.0 + s.elemDmg / 100;

  const total = weaponDmg * mainStat * critMult * vulnMult * elemMult;
  return { total, weaponDmg, mainStat, critMult, vulnMult, elemMult, critChanceEff };
}

export function compare(other: Stats, oldItem: Stats, newItem: Stats, opts: CalcOptions) {
  const totalOld = sum(other, oldItem);
  const totalNew = sum(other, newItem);
  const dOld = dmg(totalOld, opts);
  const dNew = dmg(totalNew, opts);
  const ratio = dOld.total === 0 ? 0 : dNew.total / dOld.total;
  const delta = dOld.total === 0 ? 0 : ratio - 1;
  return { totalOld, totalNew, dOld, dNew, ratio, delta };
}

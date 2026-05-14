export type Stats = {
  weaponDmg: number;
  mainStat: number;
  critDmg: number;
  vulnDmg: number;
  elemDmg: number;
  critChance: number;
  skillRank: number;
};

export type StatKey = keyof Stats;

export const ZERO: Stats = {
  weaponDmg: 0,
  mainStat: 0,
  critDmg: 0,
  vulnDmg: 0,
  elemDmg: 0,
  critChance: 0,
  skillRank: 0,
};

export const STAT_KEYS = [
  'weaponDmg',
  'mainStat',
  'critDmg',
  'vulnDmg',
  'elemDmg',
  'critChance',
  'skillRank',
] as const;

export type CritMode = 'assume' | 'expected';

export type CalcOptions = {
  critMode: CritMode;
  skillScaling: boolean;
  skillGrowthPct: number;
};

export const DEFAULT_OPTIONS: CalcOptions = {
  critMode: 'assume',
  skillScaling: false,
  skillGrowthPct: 2,
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
      skillRank: acc.skillRank + s.skillRank,
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
  skillMult: number;
  critChanceEff: number;
  effectiveRank: number;
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

  const effectiveRank = s.skillRank;
  const skillMult = opts.skillScaling
    ? 1 + Math.max(0, effectiveRank - 1) * (opts.skillGrowthPct / 100)
    : 1;

  const total = weaponDmg * mainStat * critMult * vulnMult * elemMult * skillMult;
  return {
    total,
    weaponDmg,
    mainStat,
    critMult,
    vulnMult,
    elemMult,
    skillMult,
    critChanceEff,
    effectiveRank,
  };
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

export type Stats = {
  weaponDmg: number;
  mainStat: number;
  critDmg: number;
  vulnDmg: number;
  elemDmg: number;
};

export const ZERO: Stats = {
  weaponDmg: 0,
  mainStat: 0,
  critDmg: 0,
  vulnDmg: 0,
  elemDmg: 0,
};

export const STAT_KEYS = ['weaponDmg', 'mainStat', 'critDmg', 'vulnDmg', 'elemDmg'] as const;

export function sum(...sources: Stats[]): Stats {
  return sources.reduce<Stats>(
    (acc, s) => ({
      weaponDmg: acc.weaponDmg + s.weaponDmg,
      mainStat: acc.mainStat + s.mainStat,
      critDmg: acc.critDmg + s.critDmg,
      vulnDmg: acc.vulnDmg + s.vulnDmg,
      elemDmg: acc.elemDmg + s.elemDmg,
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
};

export function dmg(s: Stats): Breakdown {
  const weaponDmg = Math.max(0, s.weaponDmg);
  const mainStat = Math.max(0, s.mainStat);
  const critMult = 1.5 + s.critDmg / 100;
  const vulnMult = 1.2 + s.vulnDmg / 100;
  const elemMult = 1.0 + s.elemDmg / 100;
  const total = weaponDmg * mainStat * critMult * vulnMult * elemMult;
  return { total, weaponDmg, mainStat, critMult, vulnMult, elemMult };
}

export function compare(other: Stats, oldItem: Stats, newItem: Stats) {
  const totalOld = sum(other, oldItem);
  const totalNew = sum(other, newItem);
  const dOld = dmg(totalOld);
  const dNew = dmg(totalNew);
  const delta = dOld.total === 0 ? 0 : dNew.total / dOld.total - 1;
  return { totalOld, totalNew, dOld, dNew, delta };
}

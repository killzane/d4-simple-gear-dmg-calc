import { ZERO, DEFAULT_OPTIONS, type Stats, type CalcOptions } from './damage';

export type AppState = {
  other: Stats;
  oldItem: Stats;
  newItem: Stats;
  settings: CalcOptions;
};

export const DEFAULT_STATE: AppState = {
  other: { ...ZERO },
  oldItem: { ...ZERO },
  newItem: { ...ZERO },
  settings: { ...DEFAULT_OPTIONS },
};

const KEY = 'd4-swap-v2';

const isStats = (v: unknown): v is Stats => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.weaponDmg === 'number' &&
    typeof o.mainStat === 'number' &&
    typeof o.critDmg === 'number' &&
    typeof o.vulnDmg === 'number' &&
    typeof o.elemDmg === 'number' &&
    typeof o.critChance === 'number' &&
    typeof o.skillRank === 'number'
  );
};

const isCalcOptions = (v: unknown): v is CalcOptions => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    (o.critMode === 'assume' || o.critMode === 'expected') &&
    typeof o.skillScaling === 'boolean' &&
    typeof o.skillGrowthPct === 'number'
  );
};

export const isAppState = (v: unknown): v is AppState => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    isStats(o.other) &&
    isStats(o.oldItem) &&
    isStats(o.newItem) &&
    isCalcOptions(o.settings)
  );
};

export function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return isAppState(parsed) ? parsed : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function save(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota or disabled storage — silently ignore */
  }
}

import { ZERO, type Stats } from './damage';

export type AppState = {
  other: Stats;
  oldItem: Stats;
  newItem: Stats;
};

export const DEFAULT_STATE: AppState = {
  other: { ...ZERO },
  oldItem: { ...ZERO },
  newItem: { ...ZERO },
};

const KEY = 'd4-swap-v1';

const isStats = (v: unknown): v is Stats => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.weaponDmg === 'number' &&
    typeof o.mainStat === 'number' &&
    typeof o.critDmg === 'number' &&
    typeof o.vulnDmg === 'number' &&
    typeof o.elemDmg === 'number'
  );
};

export const isAppState = (v: unknown): v is AppState => {
  if (!v || typeof v !== 'object') return false;
  const o = v as Record<string, unknown>;
  return isStats(o.other) && isStats(o.oldItem) && isStats(o.newItem);
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

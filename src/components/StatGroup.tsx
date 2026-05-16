import type { ReactNode } from 'react';
import type { Stats, StatKey } from '../damage';
import { StatInput } from './StatInput';

type Props = {
  title: string;
  subtitle?: string;
  note?: ReactNode;
  accent?: 'default' | 'old' | 'new';
  keys: readonly StatKey[];
  value: Stats;
  onChange: (next: Stats) => void;
};

const LABELS: Record<StatKey, { label: string; unit: string; hint?: string }> = {
  weaponDmg: { label: '武器傷害', unit: '', hint: '武器面板 DPS；非武器槽請填 0' },
  mainStat: { label: '主屬性', unit: '' },
  critDmg: { label: '爆擊傷害', unit: '%' },
  vulnDmg: { label: '易傷', unit: '%' },
  elemDmg: { label: '屬性傷害', unit: '%', hint: '全傷% + 屬性傷% 相加' },
  critChance: { label: '爆擊機率', unit: '%', hint: '僅期望值模式生效；基礎 5% 已內建' },
};

const ACCENT: Record<NonNullable<Props['accent']>, string> = {
  default: 'border-d4border',
  old: 'border-stone-600',
  new: 'border-d4gold/70',
};

export function StatGroup({ title, subtitle, note, accent = 'default', keys, value, onChange }: Props) {
  return (
    <div className={`card ${ACCENT[accent]}`}>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-d4gold">{title}</h2>
        {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
        {note}
      </div>
      <div className="space-y-2">
        {keys.map((k) => {
          const meta = LABELS[k];
          return (
            <label key={k} className="block">
              <div className="flex items-center justify-between">
                <span className="stat-label">
                  {meta.label}
                  {meta.unit && <span className="ml-1 text-stone-500">({meta.unit})</span>}
                </span>
                {meta.hint && <span className="text-[10px] text-stone-500">{meta.hint}</span>}
              </div>
              <StatInput
                value={value[k]}
                onCommit={(n) => onChange({ ...value, [k]: n })}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

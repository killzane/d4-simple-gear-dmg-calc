import { STAT_KEYS, type Stats } from '../damage';

type Props = {
  title: string;
  subtitle?: string;
  accent?: 'default' | 'old' | 'new';
  value: Stats;
  onChange: (next: Stats) => void;
};

const LABELS: Record<(typeof STAT_KEYS)[number], { label: string; unit: string; hint?: string }> = {
  weaponDmg: { label: '武器傷害', unit: '', hint: '武器面板 DPS；非武器槽請填 0' },
  mainStat: { label: '主屬性', unit: '' },
  critDmg: { label: '爆擊傷害', unit: '%' },
  vulnDmg: { label: '易傷', unit: '%' },
  elemDmg: { label: '屬性傷害', unit: '%', hint: '含 all 傷' },
};

const ACCENT: Record<NonNullable<Props['accent']>, string> = {
  default: 'border-d4border',
  old: 'border-stone-600',
  new: 'border-d4gold/70',
};

export function StatGroup({ title, subtitle, accent = 'default', value, onChange }: Props) {
  const update = (key: keyof Stats, raw: string) => {
    const n = raw === '' || raw === '-' ? 0 : Number(raw);
    if (Number.isNaN(n)) return;
    onChange({ ...value, [key]: n });
  };

  return (
    <div className={`card ${ACCENT[accent]}`}>
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-d4gold">{title}</h2>
        {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="space-y-2">
        {STAT_KEYS.map((k) => {
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
              <input
                type="number"
                inputMode="decimal"
                className="stat-input"
                value={value[k] === 0 ? '' : value[k]}
                placeholder="0"
                onChange={(e) => update(k, e.target.value)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

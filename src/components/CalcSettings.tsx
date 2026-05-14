import type { CalcOptions, CritMode } from '../damage';

type Props = {
  value: CalcOptions;
  onChange: (next: CalcOptions) => void;
};

const CRIT_MODES: { mode: CritMode; label: string; hint: string }[] = [
  { mode: 'assume', label: '假設爆擊命中', hint: '每擊都爆擊（傷害上限）' },
  { mode: 'expected', label: '期望值', hint: '用爆擊機率算平均傷害' },
];

export function CalcSettings({ value, onChange }: Props) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-d4gold mb-3">計算設定</h2>

      <div className="stat-label">爆擊計算方式</div>
      <div className="flex gap-2 max-w-md">
        {CRIT_MODES.map(({ mode, label, hint }) => {
          const active = value.critMode === mode;
          return (
            <button
              key={mode}
              type="button"
              title={hint}
              className={`flex-1 text-xs px-3 py-2 rounded border transition-colors ${
                active
                  ? 'border-d4gold text-d4gold bg-d4gold/10'
                  : 'border-d4border text-stone-400 hover:border-stone-500'
              }`}
              onClick={() => onChange({ ...value, critMode: mode })}
            >
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-stone-500 mt-1">
        期望值模式下，請在各欄填入「爆擊機率」
      </p>
    </div>
  );
}

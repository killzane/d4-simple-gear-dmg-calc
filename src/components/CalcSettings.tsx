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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="stat-label">爆擊計算方式</div>
          <div className="flex gap-2">
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

        <div>
          <div className="stat-label">技能等級乘區</div>
          <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer py-1.5">
            <input
              type="checkbox"
              className="accent-d4gold"
              checked={value.skillScaling}
              onChange={(e) => onChange({ ...value, skillScaling: e.target.checked })}
            />
            計入技能等級造成的傷害差異
          </label>
          {value.skillScaling && (
            <label className="block mt-1">
              <div className="flex items-center justify-between">
                <span className="stat-label">技能每階傷害成長 (%)</span>
                <span className="text-[10px] text-stone-500">核心/主動約 10%、基礎約 1%</span>
              </div>
              <input
                type="number"
                inputMode="decimal"
                className="stat-input"
                value={value.skillGrowthPct}
                onChange={(e) => {
                  const n = e.target.value === '' ? 0 : Number(e.target.value);
                  if (!Number.isNaN(n)) onChange({ ...value, skillGrowthPct: n });
                }}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

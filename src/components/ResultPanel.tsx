import { compare, type Stats, type CalcOptions } from '../damage';

type Props = {
  other: Stats;
  oldItem: Stats;
  newItem: Stats;
  opts: CalcOptions;
};

const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;
const fmtMult = (n: number) => `×${n.toFixed(3)}`;
const fmtNum = (n: number) =>
  n === 0 ? '0' : n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export function ResultPanel({ other, oldItem, newItem, opts }: Props) {
  const { totalOld, totalNew, dOld, dNew, ratio, delta } = compare(other, oldItem, newItem, opts);

  const valid = dOld.total > 0;
  const deltaColor = !valid
    ? 'text-stone-500'
    : delta > 0
      ? 'text-emerald-400'
      : delta < 0
        ? 'text-rose-400'
        : 'text-stone-300';
  const sign = delta > 0 ? '+' : '';

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-d4gold mb-3">換裝結果</h2>

      <div className="text-center py-4">
        <div className="text-xs uppercase tracking-wide text-stone-400">傷害變化</div>
        <div className={`text-5xl font-bold mt-1 ${deltaColor}`}>
          {valid ? `${sign}${fmtPct(delta)}` : '—'}
        </div>
        {valid ? (
          <div className="text-sm text-stone-400 mt-2">
            新裝 / 舊裝 = <span className="text-stone-200 tabular-nums">{fmtMult(ratio)}</span>
          </div>
        ) : (
          <div className="text-xs text-stone-500 mt-2">需要至少有武器傷害與主屬性才能計算</div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-stone-400 border-b border-d4border">
              <th className="text-left py-1.5 font-normal">桶</th>
              <th className="text-right py-1.5 font-normal">舊裝合計</th>
              <th className="text-right py-1.5 font-normal">新裝合計</th>
            </tr>
          </thead>
          <tbody className="text-stone-200">
            <tr className="border-b border-d4border/50">
              <td className="py-1.5">武器傷害</td>
              <td className="text-right tabular-nums">{fmtNum(totalOld.weaponDmg)}</td>
              <td className="text-right tabular-nums">{fmtNum(totalNew.weaponDmg)}</td>
            </tr>
            <tr className="border-b border-d4border/50">
              <td className="py-1.5">主屬性</td>
              <td className="text-right tabular-nums">{fmtNum(totalOld.mainStat)}</td>
              <td className="text-right tabular-nums">{fmtNum(totalNew.mainStat)}</td>
            </tr>
            <tr className="border-b border-d4border/50">
              <td className="py-1.5">
                爆擊 桶
                {opts.critMode === 'expected' && (
                  <span className="text-stone-500 text-xs">
                    {' '}
                    （爆率 {fmtPct(dOld.critChanceEff)} → {fmtPct(dNew.critChanceEff)}）
                  </span>
                )}
              </td>
              <td className="text-right tabular-nums">{fmtMult(dOld.critMult)}</td>
              <td className="text-right tabular-nums">{fmtMult(dNew.critMult)}</td>
            </tr>
            <tr className="border-b border-d4border/50">
              <td className="py-1.5">易傷 桶</td>
              <td className="text-right tabular-nums">{fmtMult(dOld.vulnMult)}</td>
              <td className="text-right tabular-nums">{fmtMult(dNew.vulnMult)}</td>
            </tr>
            <tr className="border-b border-d4border/50">
              <td className="py-1.5">屬性傷害 桶</td>
              <td className="text-right tabular-nums">{fmtMult(dOld.elemMult)}</td>
              <td className="text-right tabular-nums">{fmtMult(dNew.elemMult)}</td>
            </tr>
            {opts.skillScaling && (
              <tr className="border-b border-d4border/50">
                <td className="py-1.5">
                  技能等級 桶
                  <span className="text-stone-500 text-xs">
                    {' '}
                    （rank {fmtNum(dOld.effectiveRank)} → {fmtNum(dNew.effectiveRank)}）
                  </span>
                </td>
                <td className="text-right tabular-nums">{fmtMult(dOld.skillMult)}</td>
                <td className="text-right tabular-nums">{fmtMult(dNew.skillMult)}</td>
              </tr>
            )}
            <tr className="font-semibold text-d4gold">
              <td className="py-1.5">相對傷害</td>
              <td className="text-right tabular-nums">{dOld.total.toExponential(3)}</td>
              <td className="text-right tabular-nums">{dNew.total.toExponential(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
        公式：傷害 ∝ 武器傷害 × 主屬性 ×{' '}
        {opts.critMode === 'expected'
          ? '(1 + 爆擊機率 × (0.5 + 爆擊傷害%))'
          : '(1.5 + 爆擊傷害%)'}{' '}
        × (1.2 + 易傷%) × (1.0 + 屬性傷害%)
        {opts.skillScaling && ' × (1 + (技能等級 − 1) × 每階成長%)'}。
        {opts.critMode === 'assume' && ' 目前假設爆擊命中。'}
        未計入職業專屬乘區、Overpower、Aspect [x] 全域倍率。
      </p>
    </div>
  );
}

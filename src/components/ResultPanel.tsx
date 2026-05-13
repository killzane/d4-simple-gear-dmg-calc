import { compare, type Stats } from '../damage';

type Props = {
  other: Stats;
  oldItem: Stats;
  newItem: Stats;
};

const fmtPct = (n: number) => `${(n * 100).toFixed(2)}%`;
const fmtMult = (n: number) => `×${n.toFixed(3)}`;
const fmtNum = (n: number) => (n === 0 ? '0' : n.toLocaleString(undefined, { maximumFractionDigits: 0 }));

export function ResultPanel({ other, oldItem, newItem }: Props) {
  const { totalOld, totalNew, dOld, dNew, delta } = compare(other, oldItem, newItem);

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
        {!valid && (
          <div className="text-xs text-stone-500 mt-2">
            需要至少有武器傷害與主屬性才能計算
          </div>
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
              <td className="py-1.5">爆擊傷害 桶</td>
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
            <tr className="font-semibold text-d4gold">
              <td className="py-1.5">相對傷害</td>
              <td className="text-right tabular-nums">{dOld.total.toExponential(3)}</td>
              <td className="text-right tabular-nums">{dNew.total.toExponential(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">
        公式：傷害 ∝ 武器傷害 × 主屬性 × (1.5 + 爆擊傷害%) × (1.2 + 易傷%) × (1.0 + 屬性傷害%)。
        假設爆擊命中，未計入職業專屬乘區、Overpower、Aspect [x] 全域倍率。
      </p>
    </div>
  );
}

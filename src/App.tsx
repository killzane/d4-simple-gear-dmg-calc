import { useEffect, useMemo, useState } from 'react';
import { StatGroup } from './components/StatGroup';
import { ResultPanel } from './components/ResultPanel';
import { CalcSettings } from './components/CalcSettings';
import { Settings } from './components/Settings';
import { load, save, type AppState } from './storage';
import type { StatKey } from './damage';

const BASE_KEYS: StatKey[] = ['weaponDmg', 'mainStat', 'critDmg', 'vulnDmg', 'elemDmg'];

export default function App() {
  const [state, setState] = useState<AppState>(() => load());

  useEffect(() => {
    save(state);
  }, [state]);

  const visibleKeys = useMemo<StatKey[]>(() => {
    const keys = [...BASE_KEYS];
    if (state.settings.critMode === 'expected') keys.push('critChance');
    if (state.settings.skillScaling) keys.push('skillRank');
    return keys;
  }, [state.settings.critMode, state.settings.skillScaling]);

  return (
    <div className="min-h-full">
      <header className="border-b border-d4border bg-d4card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-d4gold">D4 簡易換裝傷害計算機</h1>
            <p className="text-xs text-stone-400 mt-0.5">比較舊裝 → 新裝的相對傷害變化（%）</p>
          </div>
          <Settings state={state} onChange={setState} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <CalcSettings
          value={state.settings}
          onChange={(settings) => setState({ ...state, settings })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatGroup
            title="其他來源"
            subtitle="角色本身 + 未替換的其他裝備（= 卸下要換的那件後的數值）"
            keys={visibleKeys}
            value={state.other}
            onChange={(other) => setState({ ...state, other })}
          />
          <StatGroup
            title="舊裝"
            subtitle="要換下來的這件"
            accent="old"
            keys={visibleKeys}
            value={state.oldItem}
            onChange={(oldItem) => setState({ ...state, oldItem })}
          />
          <StatGroup
            title="新裝"
            subtitle="候選的這件"
            accent="new"
            keys={visibleKeys}
            value={state.newItem}
            onChange={(newItem) => setState({ ...state, newItem })}
          />
        </div>

        <ResultPanel
          other={state.other}
          oldItem={state.oldItem}
          newItem={state.newItem}
          opts={state.settings}
        />
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-stone-500">
        資料只存在你的瀏覽器 localStorage，沒有後端
      </footer>
    </div>
  );
}

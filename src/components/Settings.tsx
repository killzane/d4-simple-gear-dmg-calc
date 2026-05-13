import { useRef } from 'react';
import { DEFAULT_STATE, isAppState, type AppState } from '../storage';

type Props = {
  state: AppState;
  onChange: (next: AppState) => void;
};

export function Settings({ state, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `d4-swap-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (isAppState(parsed)) {
        onChange(parsed);
      } else {
        alert('檔案格式無效');
      }
    } catch {
      alert('無法解析 JSON 檔案');
    } finally {
      e.target.value = '';
    }
  };

  const onReset = () => {
    if (confirm('清空所有輸入？')) onChange(DEFAULT_STATE);
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <button
        type="button"
        className="text-xs px-3 py-1.5 rounded border border-d4border hover:border-d4gold text-stone-300 hover:text-d4gold transition-colors"
        onClick={onExport}
      >
        匯出 JSON
      </button>
      <button
        type="button"
        className="text-xs px-3 py-1.5 rounded border border-d4border hover:border-d4gold text-stone-300 hover:text-d4gold transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        匯入 JSON
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onImport}
      />
      <button
        type="button"
        className="text-xs px-3 py-1.5 rounded border border-d4border hover:border-rose-400 text-stone-300 hover:text-rose-400 transition-colors"
        onClick={onReset}
      >
        重設
      </button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { evalExpr } from '../expr';

type Props = {
  value: number;
  onCommit: (n: number) => void;
};

export function StatInput({ value, onCommit }: Props) {
  const [raw, setRaw] = useState(value === 0 ? '' : String(value));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setRaw(value === 0 ? '' : String(value));
    setInvalid(false);
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      className={`stat-input ${invalid ? 'border-rose-500 ring-1 ring-rose-500' : ''}`}
      value={raw}
      placeholder="0"
      title={invalid ? '無法解析運算式，請只用數字與 + - * / ( )' : undefined}
      onChange={(e) => {
        setRaw(e.target.value);
        if (invalid) setInvalid(false);
      }}
      onBlur={() => {
        const n = evalExpr(raw);
        if (n === null) {
          setInvalid(true);
          return;
        }
        setRaw(n === 0 ? '' : String(n));
        if (n !== value) onCommit(n);
      }}
    />
  );
}

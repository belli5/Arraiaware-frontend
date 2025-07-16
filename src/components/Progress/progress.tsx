// src/components/Progress/progress.tsx
interface ProgressProps {
  title: string;
  value: number;
  /** valor máximo da escala */
  max?: number;
}

export default function Progress({
  title,
  value,
  max = 5,            // ← muda pra 5 por padrão
}: ProgressProps) {
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent   = (safeValue / max) * 100;
  const display   = Math.round(safeValue * 10) / 10;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className="text-sm font-medium text-gray-700">
          {display}/{max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
        <div
          className="h-2 rounded bg-orange-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
import type { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  Icon: ElementType;
  borderColor?: string;
  valueColor?: string; 
  iconColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  Icon, 
  borderColor = 'border-transparent',
  valueColor = 'text-gray-900',
  iconColor = 'text-gray-400'
}: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col text-left">
          <span className="text-xl font-semibold text-gray-800">{title}</span>
          <span className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</span>
          <span className="text-sm font-semibold text-gray-600 mt-1">{subtitle}</span>
        </div>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );
}
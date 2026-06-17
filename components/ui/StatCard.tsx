import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgClassName?: string;
  iconTextClassName?: string;
  borderColorClassName?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  valueClassName?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBgClassName = "bg-blue-50",
  iconTextClassName = "text-blue-500",
  borderColorClassName,
  trend,
  valueClassName = "text-gray-900"
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col items-end justify-center min-h-[100px] ${borderColorClassName ? `border-r-4 ${borderColorClassName}` : ''}`}>
      {icon && (
         <div className={`flex items-start w-full mb-4 ${trend ? 'justify-between' : 'justify-end'}`}>
            {trend && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${trend.isPositive ? 'text-green-600 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                {trend.value}
              </span>
            )}
            <div className={`w-8 h-8 rounded-md ${iconBgClassName} flex items-center justify-center`}>
              <div className={iconTextClassName}>{icon}</div>
            </div>
         </div>
      )}
      <h3 className="text-gray-500 text-xs mb-1 text-right">{title}</h3>
      <span className={`text-2xl font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}

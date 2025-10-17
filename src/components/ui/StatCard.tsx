import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradientClass?: string;
  animationDelay?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, gradientClass = 'gradient-emerald', animationDelay }) => (
  <div className={`floating-animation rounded-2xl ${gradientClass} p-6 shadow-xl text-white hover-scale`} style={{ animationDelay }}>
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-medium opacity-90">{title}</h3>
        <p className="mt-2 text-3xl font-bold">{value}</p>
        {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 bg-white/20 rounded-xl"><Icon className="h-8 w-8" /></div>
    </div>
  </div>
);

export default StatCard;

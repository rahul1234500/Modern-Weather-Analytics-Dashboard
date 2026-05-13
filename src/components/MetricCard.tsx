import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subValue?: string;
  className?: string;
}

export function MetricCard({ label, value, unit, icon: Icon, subValue, className }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("sleek-card p-5 group h-full", className)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <label className="label-header block mb-1">{label}</label>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-light text-slate-800 tracking-tight">
              {value}
            </span>
            {unit && <span className="text-lg font-normal text-slate-400">{unit}</span>}
          </div>
        </div>
        <div className="p-2 bg-slate-50 rounded-xl transition-colors group-hover:bg-blue-50">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
      
      {subValue && (
        <div className={cn(
          "text-xs",
          subValue.toLowerCase().includes('verification') || subValue.toLowerCase().includes('cluster') || subValue.toLowerCase().includes('stability')
            ? "text-slate-500 italic" 
            : "text-green-600"
        )}>
          {subValue}
        </div>
      )}
    </motion.div>
  );
}

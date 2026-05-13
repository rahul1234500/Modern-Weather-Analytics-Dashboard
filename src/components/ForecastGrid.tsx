import React from 'react';
import { WeatherData, getCondition } from '../services/weatherService';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { Cloud, Sun, CloudRain, CloudLightning, Snowflake, CloudFog, CloudDrizzle } from 'lucide-react';

interface ForecastGridProps {
  data: WeatherData;
}

const WeatherIcon = ({ code, className }: { code: number, className?: string }) => {
  if (code === 0) return <Sun className={className} />;
  if (code <= 3) return <Cloud className={className} />;
  if (code <= 48) return <CloudFog className={className} />;
  if (code <= 55) return <CloudDrizzle className={className} />;
  if (code <= 65) return <CloudRain className={className} />;
  if (code <= 75) return <Snowflake className={className} />;
  if (code <= 82) return <CloudRain className={className} />;
  if (code <= 86) return <Snowflake className={className} />;
  if (code >= 95) return <CloudLightning className={className} />;
  return <Cloud className={className} />;
};

export function ForecastGrid({ data }: ForecastGridProps) {
  // Future 7 days (Open Meteo returns past + present + future if past_days used)
  // Indices 7 to 13 are usually the forecast
  const startIndex = data.daily.time.length - 7;
  const forecastDays = data.daily.time.slice(startIndex);

  return (
    <div className="grid grid-cols-7 divide-x divide-line">
      {forecastDays.map((time, i) => {
        const idx = i + startIndex;
        const isToday = i === 0;
        
        return (
          <motion.div 
            key={time} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 flex flex-col justify-between hover:bg-slate-50 group border-r border-line last:border-r-0 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 uppercase tracking-wider transition-colors">
                {isToday ? 'Today' : format(parseISO(time), 'EEEE')}
              </label>
              <div className="text-[9px] font-mono text-slate-300 font-bold uppercase">
                {format(parseISO(time), 'MMM dd')}
              </div>
            </div>

            <div className="py-8 flex justify-center">
              <WeatherIcon 
                code={data.daily.conditionCode[idx]} 
                className="w-10 h-10 text-slate-200 group-hover:text-blue-500 transition-all duration-500 group-hover:scale-110" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-slate-800">
                  {Math.round(data.daily.tempMax[idx])}°
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {Math.round(data.daily.tempMin[idx])}°
                </span>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                {getCondition(data.daily.conditionCode[idx])}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

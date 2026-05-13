import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { WeatherData } from '../services/weatherService';

interface TrendAnalyticsProps {
  data: WeatherData;
}

export function TrendAnalytics({ data }: TrendAnalyticsProps) {
  // Process 14 days of data (past 7 + future 7)
  const chartData = data.hourly.time.map((time, i) => ({
    time: format(parseISO(time), 'HH:00'),
    date: format(parseISO(time), 'MMM d'),
    temp: data.hourly.temp[i],
    precip: data.hourly.precipitation[i],
  }));

  // Sample every 3 hours for readability
  const sampledData = chartData.filter((_, i) => i % 3 === 0).slice(0, 56); // 7 days of 3h chunks

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Predictive Trend Analysis</h2>
          <p className="text-[10px] text-slate-400 font-medium">72H ATMOSPHERIC PROJECTION WINDOW</p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Forecast (°C)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-slate-300 bg-slate-100"></div>
            <span>Saturation (%)</span>
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-[300px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sampledData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval={8}
            />
            <YAxis 
              tick={{ fontSize: 9, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                color: '#1e293b',
                fontSize: '10px',
                fontWeight: 600
              }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#tempGradient)" 
              dot={false}
              animationDuration={2000}
            />
            <Area 
              type="monotone" 
              dataKey="precip" 
              stroke="#94a3b8" 
              strokeDasharray="4 4"
              strokeWidth={1}
              fill="transparent"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

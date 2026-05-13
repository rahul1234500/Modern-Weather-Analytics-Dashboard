import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { WeatherData } from '../services/weatherService';
import { getSmartSummary } from '../services/aiService';

interface SmartSummaryProps {
  data: WeatherData;
  locationName: string;
}

export function SmartSummary({ data, locationName }: SmartSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function generate() {
      setIsLoading(true);
      const text = await getSmartSummary(data, locationName);
      setSummary(text);
      setIsLoading(false);
    }
    generate();
  }, [data, locationName]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">AI Assessment</h2>
        </div>
        <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Intelligence</div>
      </div>

      <div className="min-h-[60px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center gap-2 text-slate-400 font-mono text-[10px] tracking-wider">
            <Loader2 className="w-3 h-3 animate-spin" />
            SYNTHESIZING ATMOSPHERIC MODELS...
          </div>
        ) : (
          <p className="text-xs leading-relaxed font-medium text-slate-600">
            {summary}
          </p>
        )}
      </div>
      
      {!isLoading && (
        <div className="pt-4 border-t border-line flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 p-1">
                <div className="w-full h-full rounded-full bg-slate-300" />
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Model Confidence: 98.4%</p>
        </div>
      )}
    </div>
  );
}

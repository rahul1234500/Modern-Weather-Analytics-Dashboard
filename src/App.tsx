import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Droplets, 
  Sun, 
  Tension, 
  Thermometer, 
  Zap, 
  LayoutDashboard, 
  History, 
  Settings,
  Info,
  Clock,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

import { WeatherData, Location, fetchWeather } from './services/weatherService';
import { MetricCard } from './components/MetricCard';
import { TrendAnalytics } from './components/TrendAnalytics';
import { ForecastGrid } from './components/ForecastGrid';
import { LocationSearch } from './components/LocationSearch';
import { SmartSummary } from './components/SmartSummary';
import { cn } from './lib/utils';

const DEFAULT_LOCATION: Location = {
  name: "San Francisco",
  latitude: 37.7749,
  longitude: -122.4194,
  country: "United States"
};

export default function App() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics'>('dashboard');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchWeather(location.latitude, location.longitude);
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [location]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Trends', icon: History },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row text-ink selection:bg-ink selection:text-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">W</div>
            <span className="font-semibold tracking-tight">SkySync</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left",
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-slate-400 hover:bg-slate-800 transition-colors"
              )}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                activeTab === item.id ? "bg-blue-400" : "bg-slate-600"
              )} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 text-slate-500 text-[10px]">
          <p className="uppercase tracking-widest font-bold text-slate-600 mb-1">Atmospheric Core</p>
          <p className="font-mono">v4.2.1-STABLE</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-line px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <div className="hidden lg:block shrink-0">
              <h1 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Environmental Observation</h1>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium whitespace-nowrap">
                <span>Station: {location.name}</span>
                <span className="opacity-30">•</span>
                <span>Last Sync: 2m ago</span>
              </div>
            </div>
            
            <div className="hidden lg:block h-6 w-px bg-line mx-2" />
            
            <div className="flex-1 max-w-sm">
              <LocationSearch 
                onSelect={setLocation} 
                currentLocation={location.name} 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-2">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">Live</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        </header>

        {isLoading || !weather ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-line shadow-sm flex items-center justify-center">
                <Waves className="w-6 h-6 text-blue-500 animate-pulse" />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Synchronizing...</div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-4 md:p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8">
              {/* Top Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <MetricCard 
                  label="Surface Temperature"
                  value={weather.current.temp}
                  unit="°C"
                  icon={Thermometer}
                  subValue={`Historical: +1.2% delta`}
                />
                <MetricCard 
                  label="Relative Humidity"
                  value={weather.current.humidity}
                  unit="%"
                  icon={Droplets}
                  subValue="Baseline verified"
                />
                <MetricCard 
                  label="Wind Velocity"
                  value={weather.current.windSpeed}
                  unit="km/h"
                  icon={Wind}
                  subValue={`Vector: North East`}
                />
                <MetricCard 
                  label="Surface Pressure"
                  value={Math.round(weather.current.pressure)}
                  unit="hPa"
                  icon={Waves}
                  subValue="Stability nominal"
                />
              </div>

              {/* Analytics Row */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 sleek-card bg-white p-4 md:p-6 flex flex-col h-[350px] md:h-[480px]">
                  <TrendAnalytics data={weather} />
                </div>
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <div className="sleek-card bg-white p-6 flex-1">
                    <SmartSummary data={weather} locationName={location.name} />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="bg-orange-50/50 p-4 rounded-xl border border-dashed border-orange-200 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">UV Advisory</p>
                        <p className="text-[10px] text-slate-500 leading-tight">Index at {weather.current.uvIndex}.</p>
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-dashed border-blue-200 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Waves className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Data Fidelity</p>
                        <p className="text-[10px] text-slate-500 leading-tight">Station reporting OK.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Forecast Grid */}
              <div className="sleek-card bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-line flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest leading-none">Prediction Horizon</h3>
                  <div className="px-2 py-1 bg-slate-50 rounded font-mono text-[9px] text-slate-400">7-DAY</div>
                </div>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="min-w-[800px] md:min-w-0">
                    <ForecastGrid data={weather} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-line flex lg:hidden items-center justify-around z-30 px-4 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              activeTab === item.id ? "text-blue-500" : "text-slate-400"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute top-0 w-8 h-0.5 bg-blue-500"
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}

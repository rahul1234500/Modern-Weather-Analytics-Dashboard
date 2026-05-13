import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { Location, searchLocations } from '../services/weatherService';
import { cn } from '../lib/utils';

interface LocationSearchProps {
  onSelect: (location: Location) => void;
  currentLocation?: string;
}

export function LocationSearch({ onSelect, currentLocation }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        try {
          const data = await searchLocations(query);
          setResults(data);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      <div className="relative flex items-center group">
        <Search className="absolute left-3 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder={currentLocation || "Search observation point..."}
          className="w-full bg-slate-100/50 border border-slate-200 rounded-xl py-2 pl-10 pr-10 focus:outline-none focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
        />
        {isSearching && <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-slate-400" />}
        {query && !isSearching && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-3 p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100">
          {results.map((loc, i) => (
            <button
              key={`${loc.latitude}-${loc.longitude}-${i}`}
              onClick={() => {
                onSelect(loc);
                setQuery('');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 text-left group transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <MapPin className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-700 truncate">
                  {loc.name}, {loc.admin1 && <span className="font-normal text-slate-400">{loc.admin1}, </span>}{loc.country}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  {loc.latitude.toFixed(2)}N, {loc.longitude.toFixed(2)}E
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

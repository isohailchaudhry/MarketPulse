import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MarketInputProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

export function MarketInput({ onSearch, isLoading }: MarketInputProps) {
  const [keyword, setKeyword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim());
    }
  };

  return (
    <section className="w-full py-12 flex flex-col space-y-12 pr-12">
      <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-left-4 duration-1000">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Analysis Portal</p>
          <h1 className="text-6xl font-light tracking-tighter sm:text-7xl lg:text-8xl serif-italic leading-[0.9]">
            Market <br /> Intelligence <br /> <span className="opacity-40">Systems.</span>
          </h1>
        </div>
        
        <p className="max-w-[500px] text-sm/relaxed tracking-tight font-medium opacity-60">
          Quantifying search momentum and regional demand patterns across the Pakistani consumer landscape. Data-driven strategy, refined for clarity.
        </p>

        <form onSubmit={handleSubmit} className="relative w-full max-w-xl pt-12">
          <div className="relative group">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm serif-italic opacity-40 group-focus-within:opacity-100 transition-opacity">Search</span>
            <input 
              className="w-full pl-16 pr-4 py-4 bg-transparent border-b border-ink/20 focus:border-ink focus:outline-none text-2xl serif-italic transition-all" 
              placeholder="e.g. Wall Lights, Frozen Food..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="mt-8">
            <Button 
              type="submit" 
              className="px-10 h-10 bg-ink text-paper rounded-none text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all"
              disabled={isLoading || !keyword.trim()}
            >
              {isLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
              Initialize Analysis
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

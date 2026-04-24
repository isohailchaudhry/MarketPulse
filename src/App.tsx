import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, LayoutDashboard, Database, RefreshCcw, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { MarketInput } from '@/src/components/MarketInput';
import { InsightCharts } from '@/src/components/InsightCharts';
import { StrategyReport } from '@/src/components/StrategyReport';

import { supabase } from '@/src/lib/supabaseClient';
import { generateMarketStrategy } from '@/src/lib/geminiApi';

type AppState = 'idle' | 'loading' | 'fetching' | 'processing' | 'error';

export default function App() {
  const [state, setState] = React.useState<AppState>('idle');
  const [keyword, setKeyword] = React.useState('');
  const [insights, setInsights] = React.useState<any[]>([]);
  const [strategy, setStrategy] = React.useState<any>(null);
  const [progress, setProgress] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSearch = async (newKeyword: string) => {
    setKeyword(newKeyword);
    setInsights([]);
    setStrategy(null);
    setState('loading');
    setErrorMessage('');
    
    try {
      // 1. Check if data exists in Supabase
      const { data, error } = await supabase
        .from('market_insights')
        .select('*')
        .ilike('product_name', `%${newKeyword}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        setInsights(data);
        setState('fetching');
        
        // Generate AI Strategy
        const aiStrategy = await generateMarketStrategy(newKeyword, data);
        setStrategy(aiStrategy);
        setState('idle');
      } else {
        // 2. Data missing, add to queue
        const { error: queueError } = await supabase
          .from('query_queue')
          .insert([{ keyword: newKeyword, is_processed: false }]);

        if (queueError) throw queueError;

        setState('processing');
        startSimulatedProgress();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred while connecting to MarketPulse network.');
      setState('error');
    }
  };

  const startSimulatedProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 2000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(22);
    doc.text('MarketPulse AI Intelligence Report', 20, 20);
    
    doc.setFontSize(16);
    doc.text(`Market Analysis: ${keyword}`, 20, 35);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 42);
    
    doc.line(20, 45, pageWidth - 20, 45);
    
    if (strategy) {
      doc.setFontSize(14);
      doc.text('AI Strategy Summary', 20, 55);
      
      doc.setFontSize(11);
      const targetText = doc.splitTextToSize(`Target Audience: ${strategy.target_audience}`, pageWidth - 40);
      doc.text(targetText, 20, 65);
      
      const platformsY = 65 + (targetText.length * 6);
      doc.text(`Suggested Platforms: ${strategy.suggested_platforms.join(', ')}`, 20, platformsY);
      
      const tacticY = platformsY + 10;
      doc.text('Entry Tactic:', 20, tacticY);
      const tacticText = doc.splitTextToSize(strategy.entry_tactic, pageWidth - 40);
      doc.text(tacticText, 20, tacticY + 7);
    }

    doc.save(`MarketPulse_Report_${keyword.replace(/\s+/g, '_')}.pdf`);
  };

  const reset = () => {
    setState('idle');
    setKeyword('');
    setInsights([]);
    setStrategy(null);
    setErrorMessage('');
  };

  return (
    <div className="flex h-screen w-full bg-paper overflow-hidden text-ink">
      {/* Editorial Sidebar */}
      <aside className="w-64 border-r editorial-divider flex flex-col p-8 space-y-12 bg-sidebar-bg">
        <div className="space-y-1 cursor-pointer" onClick={reset}>
          <h1 className="text-xl font-semibold tracking-tighter uppercase serif-italic">MarketPulse</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50">Intelligence System v.4.2</p>
        </div>
        
        <nav className="flex flex-col space-y-6 text-sm font-medium tracking-tight">
          <button onClick={() => setKeyword('')} className="sidebar-link w-fit opacity-100 text-left">Dashboard</button>
          <button className="sidebar-link w-fit opacity-40 text-left cursor-not-allowed">Query Queue</button>
          <button className="sidebar-link w-fit opacity-40 text-left cursor-not-allowed">Archived Reports</button>
          <button className="sidebar-link w-fit opacity-40 text-left cursor-not-allowed">AI Parameters</button>
          <button className="sidebar-link w-fit opacity-40 text-left cursor-not-allowed">Settings</button>
        </nav>

        <div className="mt-auto pt-8 border-t editorial-divider">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-stone-300 flex items-center justify-center text-[10px] font-bold">PK</div>
            <div>
              <p className="text-xs font-semibold">Pak Market Unit</p>
              <p className="text-[10px] opacity-50 uppercase tracking-tighter">Standard Tier</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Editorial Header */}
        <header className="h-20 border-b editorial-divider flex items-center justify-between px-10 bg-white/30 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            {keyword ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-sm italic serif-italic opacity-40">Active Analysis</span>
                <span className="text-lg serif-italic">{keyword}</span>
              </div>
            ) : (
              <span className="text-lg serif-italic opacity-30">Analytical Workspace</span>
            )}
          </div>
          
          <div className="flex items-center space-x-6">
            {state !== 'idle' && (
              <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AI Processing Active</span>
              </div>
            )}
            {insights.length > 0 && (
              <button 
                onClick={handleDownload}
                className="px-6 py-2 bg-ink text-paper text-[11px] uppercase tracking-widest font-bold hover:bg-stone-800 transition-colors"
              >
                Download PDF
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 py-8 scroll-smooth">
          <AnimatePresence mode="wait">
            {state === 'idle' && !keyword && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl pt-12"
              >
                <MarketInput onSearch={handleSearch} isLoading={state === 'loading'} />
              </motion.div>
            )}

            {state === 'error' && (
               <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-12 max-w-2xl"
              >
                <div className="p-6 border border-red-200 bg-red-50/30 rounded-sm">
                  <div className="flex items-center space-x-2 text-red-800 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">Protocol Error</span>
                  </div>
                  <p className="text-sm serif-italic text-red-900">{errorMessage}</p>
                </div>
                <button onClick={() => setState('idle')} className="mt-8 text-xs font-bold uppercase tracking-widest border-b border-ink">Retry Connection</button>
              </motion.div>
            )}

            {(state === 'processing' || state === 'loading' || state === 'fetching') && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-20 max-w-xl space-y-12"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl serif-italic font-light leading-none">
                    Establishing intelligence <br />baseline for {keyword}...
                  </h2>
                  <p className="text-sm opacity-50 tracking-tight">
                    Harvesting regional search volumes and sentiment metrics. This synchronous operation typically completes in 120 seconds.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="h-[1px] w-full bg-stone-200">
                    <motion.div 
                      className="h-full bg-ink" 
                      initial={{ width: 0 }}
                      animate={{ width: `${state === 'processing' ? progress : 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-40">
                    <span>Synchronizing Nodes</span>
                    <span>{state === 'processing' ? progress : 100}%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {keyword && insights.length > 0 && state === 'idle' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="flex items-end justify-between border-b editorial-divider pb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-40">Intelligence Report</p>
                    <h1 className="text-6xl serif-italic font-light tracking-tighter leading-none">{keyword}</h1>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase opacity-40 tracking-widest mb-1">Region Focus</p>
                    <p className="text-sm font-bold underline underline-offset-4 tracking-tight">Pakistan / Urban Clusters</p>
                  </div>
                </div>

                <div className="space-y-16">
                  <InsightCharts data={insights} />
                  <StrategyReport strategy={strategy} isLoading={!strategy} />
                </div>

                <footer className="flex items-center justify-between pt-12 border-t editorial-divider opacity-50 pb-8">
                  <div className="flex space-x-12">
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-widest font-bold">Protocol Sync</p>
                      <p className="text-[11px] font-medium">{new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} &bull; System Verified</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase tracking-widest font-bold">Primary Source</p>
                      <p className="text-[11px] font-medium">Regional Python Scraper v2.1</p>
                    </div>
                  </div>
                  <div className="text-[9px] tracking-[0.2em] uppercase max-w-xs text-right leading-relaxed font-bold">
                    Generated by MarketPulse AI exclusively for Pakistan market territory.
                  </div>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

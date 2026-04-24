import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Calendar, ShieldAlert, ArrowRight } from "lucide-react";

interface StrategyReportProps {
  strategy: {
    target_audience: string;
    suggested_platforms: string[];
    seasonal_advice: string;
    risk_assessment: string;
    entry_tactic: string;
  } | null;
  isLoading: boolean;
}

export function StrategyReport({ strategy, isLoading }: StrategyReportProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-48 bg-muted animate-pulse rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted animate-pulse rounded-xl" />
          <div className="h-32 bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!strategy) return null;

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="flex items-center justify-between border-b editorial-divider pb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-ink h-5 w-5 opacity-40" />
          <h2 className="text-3xl serif-italic font-light tracking-wide">AI Market Strategy</h2>
        </div>
        <span className="text-[9px] bg-ink text-paper px-3 py-1 uppercase tracking-widest font-bold">Gemini Analysis</span>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Target Population</p>
            <p className="text-base serif-italic leading-relaxed text-ink/90">
              {strategy.target_audience}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Tactical Platforms</p>
            <div className="flex flex-wrap gap-3">
              {strategy.suggested_platforms.map((platform, idx) => (
                <span key={idx} className="text-[10px] font-bold uppercase tracking-widest border border-ink/10 px-3 py-1.5 transition-colors hover:bg-stone-50">
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-sm space-y-8 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 opacity-50">
              <Calendar className="h-3 w-3" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Seasonal Vectors</p>
            </div>
            <p className="text-sm italic leading-relaxed serif-italic font-medium">
              {strategy.seasonal_advice}
            </p>
          </div>

          <div className="p-5 bg-sidebar-bg border editorial-divider rounded-sm">
            <div className="flex items-center space-x-2 opacity-60 mb-2">
              <ShieldAlert className="h-3 w-3" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Critical Risk Data</p>
            </div>
            <p className="text-[11px] leading-relaxed font-medium text-stone-700">
              {strategy.risk_assessment}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 border-t editorial-divider mt-8">
        <div className="space-y-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-30">Executive Summary</p>
          <div className="p-10 relative">
            <span className="absolute top-0 left-0 text-6xl serif-italic opacity-10">"</span>
            <p className="text-2xl serif-italic font-light leading-relaxed italic text-ink/80 px-8">
              {strategy.entry_tactic}
            </p>
            <span className="absolute bottom-0 right-0 text-6xl serif-italic opacity-10 rotate-180">"</span>
          </div>
        </div>
      </div>
    </div>
  );
}

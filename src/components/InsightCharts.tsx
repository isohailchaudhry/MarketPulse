import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InsightChartsProps {
  data: any[];
}

const COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];

export function InsightCharts({ data }: InsightChartsProps) {
  // Aggregate data by region/city for the bar chart
  const regionalData = data.reduce((acc: any[], current: any) => {
    const existing = acc.find(item => item.name === current.region);
    if (existing) {
      existing.score += current.trend_score;
      existing.count += 1;
    } else {
      acc.push({ name: current.region, score: current.trend_score, count: 1 });
    }
    return acc;
  }, []).map(item => ({
    name: item.name,
    avgScore: Math.round(item.score / item.count)
  })).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="grid gap-10 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <div className="space-y-1 border-b editorial-divider pb-4">
          <h3 className="text-2xl serif-italic font-light">Interest by City</h3>
          <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Distribution across Pakistan metropolitan clusters</p>
        </div>
        <div className="h-[300px] pt-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(26,26,26,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(26,26,26,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(26,26,26,0.4)', fontSize: 9, fontWeight: 700 }} 
              />
              <Tooltip 
                cursor={{ fill: 'rgba(26,26,26,0.02)' }}
                contentStyle={{ 
                  borderRadius: '0', 
                  border: '1px solid rgba(26,26,26,0.1)', 
                  backgroundColor: '#F9F8F6',
                  boxShadow: 'none',
                  fontSize: '11px',
                  fontFamily: 'Inter'
                }}
              />
              <Bar dataKey="avgScore" radius={[0, 0, 0, 0]} barSize={40}>
                {regionalData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#1A1A1A' : `rgba(26,26,26, ${0.4 - (index * 0.1)})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex flex-col space-y-10">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Weighted Momentum</p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-7xl serif-italic font-light">
                {data.length > 0 ? Math.round(data.reduce((a, b) => a + b.trend_score, 0) / data.length) : 0}
              </h2>
              <span className="text-emerald-700 text-sm font-semibold tracking-tighter">+12.4%</span>
            </div>
            <p className="text-[11px] opacity-60 leading-tight">Projected growth index based on seasonal Ramadan benchmarks.</p>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30">Confidence Indicator</p>
            <div className="h-[2px] w-full bg-stone-200">
              <div className="h-full bg-ink w-[92%]" />
            </div>
            <div className="flex justify-between text-[10px] font-bold tracking-tight">
              <span className="opacity-50 uppercase">Reliability Index</span>
              <span>92%</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t editorial-divider">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-30 mb-2">Primary Node</p>
          {(() => {
             const sources = data.reduce((acc: any, cur: any) => {
               acc[cur.source] = (acc[cur.source] || 0) + 1;
               return acc;
             }, {});
             const topSource = Object.entries(sources).sort((a: any, b: any) => b[1] - a[1])[0];
             return (
               <div className="space-y-1">
                <div className="text-2xl serif-italic opacity-80">
                  {topSource ? topSource[0] : "N/A"}
                </div>
                <p className="text-[10px] opacity-40 font-medium">Aggregated across {topSource ? topSource[1] : 0} validated data points.</p>
               </div>
             )
           })()}
        </div>
      </div>
    </div>
  );
}

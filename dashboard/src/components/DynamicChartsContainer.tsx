"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Importação dinâmica do componente de gráficos, sem SSR
const ChartsContainer = dynamic(() => import('./ChartsContainer'), {
  ssr: false,
  loading: () => (
    <div className="space-y-10">
      {/* Loading placeholder similar ao design final */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl animate-pulse">
        <div className="text-center mb-8">
          <div className="h-8 bg-slate-700 rounded w-96 mx-auto mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-64 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-700 p-6 rounded-xl h-24"></div>
          ))}
        </div>

        <div className="mt-8 bg-slate-700 rounded-xl p-6 h-32"></div>
      </div>

      {/* Loading placeholders para os gráficos */}
      {[...Array(3)].map((_, sectionIndex) => (
        <div key={sectionIndex} className="space-y-6">
          <div className="text-center">
            <div className="h-6 bg-slate-300 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, chartIndex) => (
              <div key={chartIndex} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 animate-pulse">
                <div className="text-center mb-6">
                  <div className="h-5 bg-slate-300 rounded w-48 mx-auto mb-2"></div>
                  <div className="w-16 h-1 bg-slate-300 rounded-full mx-auto"></div>
                </div>
                <div className="h-80 bg-slate-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
});

export default function DynamicChartsContainer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-800 border-t-transparent"></div>
      </div>
    );
  }

  return <ChartsContainer />;
} 

import React from 'react';

export const ScoreDots = ({ points, total = 15, colorClass }: { points: number, total?: number, colorClass: string }) => (
  <div className="flex flex-wrap gap-1 mt-2 max-w-[120px]">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={`w-2 h-2 rounded-full border border-white/10 transition-colors duration-500 ${i < points ? colorClass : 'bg-black/20'}`}
      />
    ))}
  </div>
);

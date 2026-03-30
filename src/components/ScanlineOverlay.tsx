
import React from 'react';

export const ScanlineOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-secondary/10 to-transparent h-20 w-full"></div>
  </div>
);

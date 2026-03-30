
import React from 'react';
import { motion } from 'motion/react';

export const SystemLoader = ({ message = "INICIALIZANDO SISTEMA..." }: { message?: string }) => (
  <div className="fixed inset-0 z-[10000] bg-[#0a1f14] flex flex-col items-center justify-center p-6">
    <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mb-4 relative">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-full bg-secondary shadow-[0_0_15px_rgba(255,182,144,0.8)]"
      />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <p className="font-headline text-secondary text-[10px] tracking-[0.5em] uppercase animate-hud-pulse">{message}</p>
    </div>
    <div className="absolute bottom-12 left-12 font-mono text-[8px] text-white/20 space-y-1">
      <p>CORE_OS v1.0.4</p>
      <p>ENCRYPTION: AES-256</p>
      <p>STATUS: SECURE_LINK_ESTABLISHED</p>
    </div>
  </div>
);

/**
 * PREVEN-EHS GAMES PLATFORM
 * VERSION: 1.0.0 - STABLE
 * STATUS: LISTO
 * DATE: 2026-03-22
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Shield, AlertTriangle, Info, RotateCcw, Share2, Play, Square, X, 
  ChevronRight, LayoutGrid, Trophy, Settings, LogOut, Search, 
  FileText, AlertCircle, Clock, HelpCircle, CheckCircle2, Lock, 
  Unlock, ArrowRight, Camera, User, Zap, ClipboardList, Users,
  BarChart3, Calendar, Delete, CornerDownLeft, ShieldCheck,
  Printer, Monitor, Layers, Filter, Download, ChevronLeft, XCircle
} from 'lucide-react';

// --- CONSTANTS & TYPES ---
type View = 'START' | 'MENU' | 'GAME_TRUCO' | 'GAME_OCA' | 'GAME_CARRERA' | 'GAME_MATCH' | 'GAME_ESCAPE' | 'GAME_MEMORY' | 'GAME_WORDLE' | 'GAME_JENGA';

const GAMES = [
  { id: 'truco', title: 'TRUCO SEGURO', subtitle: 'MISIÓN_01', icon: 'precision_manufacturing', active: true, color: 'bg-emerald-500', level: 'EXPERTO', stats: '42 VIC / 12 RGO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFyWdmqGgLm09P0nrEri9rQj9rUdzXLhtVM31ipTm7VOKZOWxB6txm2h9aWiqy7WvrgmSJqpV2OtJHUDXairfRYw2J04cczBXyhgHOAm0VuGgwo-EXemfE1DXUw1MpCNvqNPIFmHlsgQcDjf4jZhie798s_SKc7OjX-xemrBca064zqk8NoqQ2sBm4zaIN12mwlNchtx-493Z4dgEs-d3hd1KzMjiWLSO5nJV88klqmSVBGQihNl6WTSACnAWP5-zOOdbCmKWlj3dE' },
  { id: 'match', title: 'CAZA DE RIESGOS', subtitle: 'MISIÓN_02', icon: 'visibility', active: true, color: 'bg-rose-500', level: 'PRINCIPIANTE', stats: '8 VIC / 5 RGO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMqWqY3Hvc-BFTirXRJli6CWPQd33OJkkNhntX3xx0E3HNsCORb7qynxkVta3lscF9EfUWwymH9p47GU2_RzBgX5k4rOwzmLTrYaR8Exno5gMES6XC6FE0Q0JriABhTxbgyU-ST_2-KHjqB7BKlsyUO8DEYjwatYAI0-RlR4csgBTbZ3sTFRnqQKh6Kf6jAkl8WpT6Zqq0P3qi9n9zxNQnb-GgfznbAHdiPdi0lyL9Yr6p0SwQjTXjAHhoR-FJkzahY2jca6Ub3PPo' },
  { id: 'oca', title: 'LA OCA', subtitle: 'MISIÓN_03', icon: 'grid_view', active: true, color: 'bg-orange-500', level: 'INTERMEDIO', stats: '15 VIC / 3 RGO', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIl1LqCHXlGdDpXB_MY7Acn97uoeKwsDRMxplLM8pIF8--L1f9C50NxF0xm5QIGYo8jOJsglrDftIA9f4L6K4kEmxatPzBSPj9jUVtFw45tLdF6w99QFPzyCnoTSQd6fgzedvnRbc37E4kxKGGC-vTfIO3b3C88A_PZdqo8gn18Vw3iigHSqRs6LbD_BTcmNkAWQVlbKJ1oWhEP-YXkzs64B3YhPKMwtjOpRqq_4aQr_sl_cSG0P_dFlUpD6-ln0pYmFwcmvZK7dRV' },
  { id: 'carrera', title: 'CARRERA MENTE', subtitle: 'MISIÓN_04', icon: 'psychology', active: true, color: 'bg-blue-500', level: 'EXPERTO', stats: '22 VIC / 8 RGO', img: 'https://picsum.photos/seed/trivia/800/600' },
  { id: 'escape', title: 'ESCAPE ROOM', subtitle: 'MISIÓN_05', icon: 'lock_open', active: true, color: 'bg-amber-500', level: 'INTERMEDIO', stats: '10 VIC / 2 RGO', img: 'https://picsum.photos/seed/escape/800/600' },
  { id: 'memoria', title: 'MEMORY PREVENTIVO', subtitle: 'MISIÓN_06', icon: 'brain', active: true, color: 'bg-yellow-500', level: 'PRINCIPIANTE', stats: '30 VIC / 1 RGO', img: 'https://picsum.photos/seed/memory/800/600' },
  { id: 'wordle', title: 'PREVENWORDLE', subtitle: 'MISIÓN_07', icon: 'spellcheck', active: true, color: 'bg-emerald-600', level: 'INTERMEDIO', stats: '12 VIC / 4 RGO', img: 'https://picsum.photos/seed/wordle/800/600' },
  { id: 'jenga', title: 'JENGA SEGURO', subtitle: 'MISIÓN_08', icon: 'view_in_ar', active: true, color: 'bg-amber-600', level: 'EXPERTO', stats: '5 VIC / 0 RGO', img: 'https://picsum.photos/seed/jenga/800/600' },
];

// --- JERARQUÍA DE PODER TRUCO ---
const DECK_BASE = [
  { id: 1, n: 1, s: 'Espadas', p: 14, l: 'Paro y\nPido Ayuda', e: '🛑', icon: 'electric_bolt', iconColor: 'text-blue-500' },
  { id: 2, n: 1, s: 'Bastos', p: 13, l: 'Reporto Cond.\nInseguras', e: '📢', icon: 'campaign', iconColor: 'text-emerald-500' },
  { id: 3, n: 7, s: 'Espadas', p: 12, l: 'Equipamiento\nSeguro', e: '🚧', icon: 'construction', iconColor: 'text-yellow-500' },
  { id: 4, n: 7, s: 'Oros', p: 11, l: 'Engranaje de\nPrecisión', e: '⚙️', icon: 'settings_suggest', iconColor: 'text-yellow-600' },
  { id: 5, n: 3, s: 'Espadas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'assignment', iconColor: 'text-blue-600' },
  { id: 6, n: 3, s: 'Bastos', p: 10, l: 'Madera\nLOTO-Locked', e: '🪵', icon: 'lock_reset', iconColor: 'text-emerald-800' },
  { id: 7, n: 3, s: 'Oros', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'assignment', iconColor: 'text-yellow-600' },
  { id: 8, n: 3, s: 'Copas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'assignment', iconColor: 'text-orange-600' },
  { id: 9, n: 2, s: 'Espadas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'check_circle', iconColor: 'text-blue-500' },
  { id: 10, n: 2, s: 'Bastos', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'check_circle', iconColor: 'text-emerald-500' },
  { id: 11, n: 2, s: 'Oros', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'check_circle', iconColor: 'text-yellow-500' },
  { id: 12, n: 2, s: 'Copas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'check_circle', iconColor: 'text-orange-500' },
  { id: 13, n: 1, s: 'Copas', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'search', iconColor: 'text-orange-500' },
  { id: 14, n: 1, s: 'Oros', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'search', iconColor: 'text-yellow-500' },
  { id: 15, n: 12, s: 'Espadas', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-blue-400' },
  { id: 16, n: 12, s: 'Bastos', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-emerald-400' },
  { id: 17, n: 12, s: 'Oros', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-yellow-400' },
  { id: 18, n: 12, s: 'Copas', p: 7, l: 'Chaleco\nAlta-Vis', e: '🚨', icon: 'vest', iconColor: 'text-orange-600' },
  { id: 19, n: 11, s: 'Espadas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-blue-400' },
  { id: 20, n: 11, s: 'Bastos', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-emerald-400' },
  { id: 21, n: 11, s: 'Oros', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-yellow-400' },
  { id: 22, n: 11, s: 'Copas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-orange-400' },
  { id: 23, n: 10, s: 'Espadas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-blue-400' },
  { id: 24, n: 10, s: 'Bastos', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-emerald-400' },
  { id: 25, n: 10, s: 'Oros', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-yellow-400' },
  { id: 26, n: 10, s: 'Copas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-orange-400' },
  { id: 27, n: 7, s: 'Copas', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-orange-400' },
  { id: 28, n: 7, s: 'Bastos', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'warning', iconColor: 'text-emerald-400' },
  { id: 29, n: 6, s: 'Espadas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-blue-500' },
  { id: 30, n: 6, s: 'Bastos', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-emerald-500' },
  { id: 31, n: 6, s: 'Oros', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-yellow-500' },
  { id: 32, n: 6, s: 'Copas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-orange-500' },
  { id: 33, n: 5, s: 'Espadas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-blue-500' },
  { id: 34, n: 5, s: 'Bastos', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-emerald-500' },
  { id: 35, n: 5, s: 'Oros', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-yellow-500' },
  { id: 36, n: 5, s: 'Copas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-orange-500' },
  { id: 37, n: 4, s: 'Espadas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-blue-500' },
  { id: 38, n: 4, s: 'Bastos', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-emerald-500' },
  { id: 39, n: 4, s: 'Oros', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'error', iconColor: 'text-yellow-500' },
  { id: 40, n: 4, s: 'Copas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'safety_check', iconColor: 'text-orange-500' },
];

const shuffle = (array: any[]) => {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

// --- SHARED COMPONENTS ---

const Card = ({ card, hidden, onClick, styleClass = "" }: any) => {
  if (!card && !hidden) return <div className="w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed border-white/10 rounded-lg"></div>;
  
  return (
    <motion.div 
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!hidden && onClick ? { y: -10, scale: 1.05 } : {}}
      onClick={onClick}
      className={`relative w-32 h-48 tactile-card p-3 flex flex-col items-center justify-between cursor-pointer transition-all ${styleClass} ${hidden ? 'bg-on-primary-fixed!' : ''}`}
    >
      {!hidden ? (
        <>
          <div className="w-full flex justify-between items-start">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-on-primary-fixed">{card.n}</span>
              <span className={`material-symbols-outlined text-xs symbol-3d ${card.iconColor || 'text-on-primary-fixed'}`}>{card.icon || 'star'}</span>
            </div>
            <div className="text-[8px] font-black text-black/20 uppercase tracking-tighter">{card.s}</div>
          </div>
          
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),0_2px_4px_rgba(255,255,255,0.8)] border border-black/5">
            <span className="text-3xl symbol-3d">{card.e}</span>
          </div>
          
          <div className="w-full text-center">
            <p className="font-headline text-[8px] font-black text-on-primary-fixed mb-1 uppercase tracking-widest leading-tight">
              {card.l}
            </p>
            <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full bg-secondary transition-all duration-500`} style={{ width: `${(card.p / 14) * 100}%` }}></div>
            </div>
            <p className="text-[6px] font-bold text-black/40 mt-1 uppercase">Poder: {card.p}</p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-on-primary-fixed rounded-lg">
          <div className="w-20 h-32 border-2 border-white/5 rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined text-white/10 text-4xl">security</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ScoreDots = ({ points, colorClass }: { points: number, colorClass: string }) => (
  <div className="flex flex-wrap gap-1 mt-2 max-w-[120px]">
    {Array.from({ length: 15 }).map((_, i) => (
      <div 
        key={i} 
        className={`w-2 h-2 rounded-full border border-white/10 transition-colors duration-500 ${i < points ? colorClass : 'bg-black/20'}`}
      />
    ))}
  </div>
);

// --- VIEW COMPONENTS ---

const StartScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="obsidian-table text-on-surface font-body min-h-screen flex flex-col overflow-x-hidden relative">
    {/* Animated Background Elements */}
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute top-24 left-6 hidden xl:block w-48 opacity-20">
        <div className="border-l-4 border-t-4 border-primary/30 p-4 space-y-4 bg-primary/5">
          <div className="h-1.5 w-full bg-primary/20"></div>
          <div className="h-1.5 w-2/3 bg-primary/20"></div>
          <div className="h-1.5 w-1/2 bg-primary/20"></div>
          <div className="font-headline text-[11px] text-primary/60 font-bold uppercase tracking-widest">MODO_ESCÁNER: PASIVO</div>
        </div>
      </div>
      <div className="fixed bottom-24 right-6 hidden xl:block w-48 pointer-events-none opacity-20">
        <div className="border-r-4 border-b-4 border-secondary/30 p-4 space-y-4 text-right bg-secondary/5">
          <div className="font-headline text-[11px] text-secondary/60 font-bold uppercase tracking-widest">ZONA: RESTRINGIDA</div>
          <div className="h-1.5 w-1/2 bg-secondary/20 ml-auto"></div>
          <div className="h-1.5 w-2/3 bg-secondary/20 ml-auto"></div>
          <div className="h-1.5 w-full bg-secondary/20 ml-auto"></div>
        </div>
      </div>
    </div>

    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#0a1f14]/90 backdrop-blur-md border-b-2 border-primary/20">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-secondary symbol-3d">precision_manufacturing</span>
        <h1 className="font-headline tracking-tighter uppercase text-xl font-bold text-secondary">TRUCO SEGURO</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-surface-container-highest shadow-[0_0_10px_rgba(255,182,144,0.3)]">
          <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBms8h7JRRd_1PoJqBQej2uHp7MnIt_Fhj0r8pZUYeAN2R1Z7Jdc1Cbr3Gijm8fON7bWwwtpniWZ1LDe5ErDZVExLx1YktRuc7Vy7tjA_YbZOvz0liUWbZFjkd_MPVXb__p_peJcRjFTpksFLKXoY6sJKkXnpd7aM_TxO0iN2UOurXHpplKlitL6bccYEjQcdSBehQ-7yb2VEEyCMBP-3zD14sgqUTETyVp-S1lwZFe_n6wOkFjL8PQ-BmdQXzGfm-lm_8XIdSv_1n3" />
        </div>
      </div>
    </header>

    <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-12 relative z-10">
      <div className="relative mb-12 flex flex-col items-center">
        <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full scale-150"></div>
        <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[8px] border-[#0a1f14] bg-black/40 animate-hud-pulse flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(255,182,144,0.2)]">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-12"></div>
            <div className="w-[90%] h-[90%] rounded-full border-2 border-secondary/40 flex items-center justify-center bg-gradient-to-b from-secondary/10 to-transparent">
              <span className="material-symbols-outlined text-secondary text-[8rem] md:text-[10rem] symbol-3d" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-secondary rounded-full border-4 border-[#0a1f14] shadow-[0_0_15px_rgba(255,182,144,0.5)]"></div>
          <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-primary rounded-full border-2 border-[#0a1f14] animate-pulse"></div>
        </div>
        <div className="mt-12 text-center">
          <div className="inline-block px-3 py-1 bg-secondary/10 border border-secondary/30 mb-2 rounded-sm">
            <p className="font-label text-[10px] text-secondary tracking-[0.3em] uppercase font-bold">Acceso Restringido</p>
          </div>
          <h2 className="font-headline text-3xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-md">
            SEGURIDAD TOTAL
          </h2>
          <p className="font-label text-secondary tracking-[0.2em] uppercase text-xs mt-3 opacity-80">Protocolo de Operaciones Activo</p>
        </div>
      </div>

      <div className="w-full max-w-md glass-panel-heavy p-8 rounded-xl border-t border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-3 bg-secondary/80 transform translate-x-12 translate-y-3 rotate-45 shadow-sm"></div>
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-base">verified_user</span>
            <span className="font-label text-[11px] uppercase font-bold text-secondary/70 tracking-widest">Autorización de Nivel Alfa</span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-white border-b-2 border-white/10 pb-2 uppercase tracking-tighter">Ingreso de Operador</h3>
        </header>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onStart(); }}>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold text-secondary uppercase tracking-wider block">ID de Operador</label>
            <div className="relative">
              <input autoComplete="off" className="w-full bg-black/40 border-2 border-white/10 p-4 font-headline text-white placeholder:text-white/20 focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all rounded-sm" placeholder="EMP-000-000" type="text" defaultValue="OP-7742" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">badge</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-xs font-bold text-secondary uppercase tracking-wider block">Sector de Planta</label>
            <div className="relative">
              <select className="w-full bg-black/40 border-2 border-white/10 p-4 font-headline text-white appearance-none focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all rounded-sm cursor-pointer">
                <option>FUNDICIÓN PRINCIPAL</option>
                <option>LOGÍSTICA NORTE</option>
                <option>MANTENIMIENTO MECÁNICO</option>
                <option>CONTROL DE CALIDAD</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 pointer-events-none">expand_more</span>
            </div>
          </div>
          <button className="btn-industrial-orange w-full text-white font-headline font-black py-5 text-xl uppercase tracking-tighter flex items-center justify-center gap-4 mt-6 group" type="submit">
            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">login</span>
            INICIAR SESIÓN
          </button>
        </form>
        <footer className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <a className="font-label text-[10px] text-white/40 hover:text-secondary uppercase transition-colors font-bold underline decoration-dotted" href="#">¿Olvidó su identificación?</a>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
              <span className="font-label text-[10px] text-error font-extrabold uppercase tracking-tighter">SISTEMA ENCRIPTADO</span>
            </div>
          </div>
        </footer>
      </div>

      <div className="mt-12 w-full max-w-md flex flex-col gap-4 opacity-60">
        <div className="flex justify-between items-end">
          <div className="text-left font-label text-[10px] text-secondary leading-tight font-bold">
            ESTADO_TERM: EN LÍNEA<br/>
            NIVEL_SEC: ALFA-01<br/>
            ID_NODO: CMD-PRIME
          </div>
          <div className="flex-grow mx-4 h-px bg-secondary/20 self-center"></div>
          <div className="text-right font-label text-[10px] text-secondary leading-tight font-bold">
            V. 1.0.4<br/>
            CONEXIÓN SEGURA ESTABLECIDA
          </div>
        </div>
        <div className="w-full bg-secondary/10 h-1 overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '300%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="bg-secondary h-full w-1/3"
          />
        </div>
      </div>
    </main>
  </div>
);

const GameMenu = ({ onSelectGame }: { onSelectGame: (id: string) => void }) => (
  <div className="obsidian-table font-body text-on-surface selection:bg-secondary selection:text-on-secondary-container min-h-screen">
    <header className="fixed top-0 z-50 w-full bg-[#0a1f14]/90 backdrop-blur-md border-b-2 border-primary/20 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-surface-container-highest shadow-[0_0_10px_rgba(255,182,144,0.3)]">
          <img alt="Avatar" className="w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97HFamk2dkPWFqH2voXcNZYCHKHsgGDJteNhDpifbYHwZez2ceoid2C8Vxeaq8vPOVPGsbmUR56C7z4y7qIUOjY884ZqGD5VO425mmpZffjMNcdPSTKoP3HmEk4_RU-h0GvvHrd_zFlmI2vKZlMicNe3oNGRzNP_g0EhPkF2khl0-0L3VVyKwyAP5wfvTzdWYHK9OXjDf6XwcuGGl5hMJNLL-oKXh0hxLoyOQAFYLqDHjrMPNwI3ewg8HSvtChosPz4S-NiVtKxx0" />
        </div>
        <h1 className="font-headline tracking-tighter text-xl font-black text-secondary uppercase">OPERATOR_DASHBOARD</h1>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
          <span className="font-headline text-primary font-bold tracking-tighter uppercase text-sm cursor-pointer border-b-2 border-primary">ENTRENAMIENTO</span>
          <span className="font-headline text-white/50 hover:text-white font-bold tracking-tighter uppercase text-sm cursor-pointer transition-colors">OPERACIONES</span>
          <span className="font-headline text-white/50 hover:text-white font-bold tracking-tighter uppercase text-sm cursor-pointer transition-colors">REPORTES</span>
        </nav>
        <span className="material-symbols-outlined text-secondary cursor-pointer hover:bg-white/10 p-2 rounded transition-colors active:translate-y-0.5">settings</span>
      </div>
    </header>

    <main className="pt-28 pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-secondary pl-6">
          <div>
            <p className="font-label text-secondary text-xs tracking-[0.2em] mb-2 animate-hud-pulse uppercase">SISTEMA DE DESPLIEGUE ACTIVO</p>
            <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">CENTRO DE ENTRENAMIENTO</h2>
          </div>
          <div className="glass-panel-heavy p-4 rounded-lg border border-white/10">
            <p className="font-label text-white/40 text-[10px] uppercase tracking-widest mb-1">Estado del Servidor</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(189,202,192,0.8)]"></div>
              <span className="text-xs font-mono text-primary uppercase">En Línea // Sector_07</span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMES.map((game) => (
              <motion.div 
                key={game.id}
                whileHover={{ y: -4 }}
                onClick={() => onSelectGame(game.id)}
                className="group relative glass-panel-heavy p-6 rounded-xl border-t border-white/20 shadow-xl cursor-pointer overflow-hidden transition-all hover:border-secondary/50"
              >
                <div className="absolute top-0 right-0 bg-secondary text-black px-3 py-1 font-headline text-[10px] font-black tracking-widest uppercase">
                  {game.subtitle}
                </div>
                <div className="h-40 mb-6 bg-black/40 rounded-lg border border-white/10 overflow-hidden relative group-hover:border-secondary/30 transition-colors">
                  <img alt={game.title} className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-opacity" src={game.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="font-headline text-white font-black text-2xl tracking-tighter uppercase group-hover:text-secondary transition-colors">{game.title}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="font-label text-[10px] text-white/40 uppercase tracking-widest">Historial</span>
                    <div className="flex gap-4">
                      <span className="text-xs font-bold text-primary uppercase">{game.stats.split(' / ')[0]}</span>
                      <span className="text-xs font-bold text-error uppercase">{game.stats.split(' / ')[1]}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary symbol-3d" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                      <span className="font-label text-xs font-bold text-white/80 uppercase tracking-tighter">Nivel: {game.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="glass-panel-heavy p-6 rounded-xl border-t border-white/20 shadow-xl">
            <h3 className="font-headline text-lg font-black text-white mb-6 uppercase tracking-tighter border-b border-white/10 pb-2">PERFIL DEL OPERADOR</h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full border-2 border-secondary overflow-hidden shadow-[0_0_15px_rgba(255,182,144,0.3)]">
                <img alt="Operator" className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97HFamk2dkPWFqH2voXcNZYCHKHsgGDJteNhDpifbYHwZez2ceoid2C8Vxeaq8vPOVPGsbmUR56C7z4y7qIUOjY884ZqGD5VO425mmpZffjMNcdPSTKoP3HmEk4_RU-h0GvvHrd_zFlmI2vKZlMicNe3oNGRzNP_g0EhPkF2khl0-0L3VVyKwyAP5wfvTzdWYHK9OXjDf6XwcuGGl5hMJNLL-oKXh0hxLoyOQAFYLqDHjrMPNwI3ewg8HSvtChosPz4S-NiVtKxx0" />
              </div>
              <div>
                <p className="font-headline font-black text-white text-xl tracking-tighter">OP-7742</p>
                <p className="font-label text-secondary text-[10px] uppercase tracking-widest">Rango: Supervisor Alfa</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/40 p-3 rounded border-l-2 border-primary">
                <p className="text-[9px] text-white/40 uppercase mb-1">Efectividad Total</p>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-headline font-black text-primary">94.2%</span>
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-primary w-[94%]"></div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 p-3 rounded border-l-2 border-secondary">
                <p className="text-[9px] text-white/40 uppercase mb-1">Misiones Completadas</p>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-headline font-black text-secondary">156</span>
                  <span className="text-[10px] text-secondary/60 font-bold uppercase mb-1">+12 ESTA SEMANA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel-heavy p-6 rounded-xl border-t border-white/20 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <span className="material-symbols-outlined text-9xl">shield</span>
            </div>
            <h3 className="font-headline text-lg font-black text-white mb-4 uppercase tracking-tighter">AVISO DE SEGURIDAD</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">
              Recuerde que todos los protocolos de seguridad deben ser validados antes de iniciar cualquier operación en planta. El incumplimiento de las normas LEY 19587 conlleva sanciones administrativas.
            </p>
            <button className="w-full btn-industrial-orange text-white font-headline font-black py-3 rounded-sm uppercase tracking-tighter text-sm">
              VER REGLAMENTO
            </button>
          </div>
        </aside>
      </div>
    </main>

    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a1f14]/90 backdrop-blur-md border-t-2 border-primary/20 rounded-t-lg flex justify-around items-center px-4 py-3 pb-safe">
      <a className="flex flex-col items-center justify-center text-secondary p-2 active:scale-95 duration-100 ease-out" href="#">
        <span className="material-symbols-outlined">grid_view</span>
        <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Floor</span>
      </a>
      <a className="flex flex-col items-center justify-center text-white/40 p-2 hover:text-secondary transition-all active:scale-95 duration-100 ease-out" href="#">
        <span className="material-symbols-outlined">payments</span>
        <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Stakes</span>
      </a>
      <a className="flex flex-col items-center justify-center text-white/40 p-2 hover:text-secondary transition-all active:scale-95 duration-100 ease-out" href="#">
        <span className="material-symbols-outlined">gavel</span>
        <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Safety</span>
      </a>
      <a className="flex flex-col items-center justify-center text-white/40 p-2 hover:text-secondary transition-all active:scale-95 duration-100 ease-out" href="#">
        <span className="material-symbols-outlined">receipt_long</span>
        <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Logs</span>
      </a>
    </nav>
  </div>
);

// --- COMPONENTES DE LA OCA ---

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=0&single=true&output=csv';

const FALLBACK_DATA = {
  riesgos: [6, 12, 19, 25, 31, 38, 44, 50, 56],
  barreras: [9, 15, 22, 29, 35, 42, 48, 55],
  trivias: [4, 10, 17, 24, 33, 40, 47, 53, 59],
  preguntas: [
    { q: "¿Cuál es el color de seguridad para prohibición?", a: "Rojo", o: ["Rojo", "Azul", "Amarillo", "Verde"] },
    { q: "¿Qué significa LOTO?", a: "Bloqueo y Etiquetado", o: ["Luz y Todo", "Bloqueo y Etiquetado", "Logística Total", "Lote de Obra"] },
    { q: "¿Cada cuánto se debe revisar un extintor?", a: "Mensualmente", o: ["Cada 2 años", "Nunca", "Mensualmente", "Semanalmente"] },
    { q: "¿Qué EPP es vital para ruidos mayores a 85dB?", a: "Protección Auditiva", o: ["Casco", "Guantes", "Protección Auditiva", "Lentes"] },
    { q: "¿Qué ley regula la HyS en Argentina?", a: "Ley 19.587", o: ["Ley 24.557", "Ley 19.587", "Ley de Contrato de Trabajo", "Ley 20.744"] }
  ]
};

const OcaGame = ({ onExit }: { onExit: () => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [players, setPlayers] = useState<any[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [dice, setDice] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [modal, setModal] = useState<any>(null);
  const [gameData, setGameData] = useState(FALLBACK_DATA);

  useEffect(() => {
    fetch(SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = { riesgos: [], barreras: [], trivias: [], preguntas: [] as any[] };
        
        lines.forEach(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) return;
          
          const [tipo, pregunta, respuesta, opciones, nivel, casilla] = cols;
          const squareNum = parseInt(casilla);
          const typeLower = tipo.toLowerCase();
          
          if (typeLower === 'riesgo') {
            if (!isNaN(squareNum)) parsed.riesgos.push(squareNum as never);
            parsed.preguntas.push({ q: pregunta, a: respuesta, sq: squareNum, tipo: 'riesgo' });
          } else if (typeLower === 'barrera') {
            if (!isNaN(squareNum)) parsed.barreras.push(squareNum as never);
            parsed.preguntas.push({ q: pregunta, a: respuesta, sq: squareNum, tipo: 'barrera' });
          } else if (typeLower === 'trivia') {
            if (!isNaN(squareNum)) parsed.trivias.push(squareNum as never);
            parsed.preguntas.push({
              q: pregunta,
              a: respuesta,
              o: opciones.split('|').map(o => o.trim()),
              sq: squareNum,
              tipo: 'trivia'
            });
          }
        });

        // Asignar trivias por defecto si no tienen casilla en el Excel
        if (parsed.trivias.length === 0 && parsed.preguntas.some(p => p.tipo === 'trivia')) {
          parsed.trivias = [4, 10, 17, 24, 33, 40, 47, 53, 59].filter(s => 
            !parsed.riesgos.includes(s as never) && !parsed.barreras.includes(s as never)
          );
        }

        if (parsed.preguntas.length > 0) {
          setGameData(parsed as any);
        }
      })
      .catch(err => console.warn("Usando fallback data:", err));
  }, []);

  const board = useMemo(() => {
    const b = [];
    for (let i = 1; i <= 63; i++) {
      let type = 'normal';
      let icon = null;
      if (gameData.riesgos.includes(i)) { type = 'riesgo'; icon = '⚠️'; }
      else if (gameData.barreras.includes(i)) { type = 'barrera'; icon = '🛡️'; }
      else if (gameData.trivias.includes(i)) { type = 'trivia'; icon = '❓'; }
      b.push({ id: i, type, icon });
    }
    return b;
  }, [gameData]);

  const handleStart = (pData: any[]) => {
    setPlayers(pData.map((p, i) => ({ 
      ...p, 
      pos: 1, 
      color: ['#ec6a06', '#f7be1d', '#3b82f6', '#10b981', '#a855f7', '#f43f5e'][i] 
    })));
    setGameState('PLAYING');
  };

  const rollDice = () => {
    if (isRolling || modal) return;
    setIsRolling(true);
    setTimeout(() => {
      const res = Math.floor(Math.random() * 6) + 1;
      setDice(res);
      setIsRolling(false);
      movePlayer(res);
    }, 1200);
  };

  const movePlayer = (steps: number) => {
    setPlayers(prev => {
      const next = [...prev];
      let newPos = next[currentPlayer].pos + steps;
      if (newPos > 63) newPos = 63 - (newPos - 63);
      next[currentPlayer].pos = newPos;
      setTimeout(() => checkSquare(newPos), 600);
      return next;
    });
  };

  const checkSquare = (pos: number) => {
    const sq = board[pos - 1];
    if (pos === 63) { setGameState('WINNER'); return; }

    if (sq.type === 'riesgo') {
      const riskData = gameData.preguntas.find(p => p.sq === pos && p.tipo === 'riesgo');
      const backMatch = riskData?.a.match(/\d+/);
      const back = backMatch ? parseInt(backMatch[0]) : Math.floor(Math.random() * 4) + 3;
      
      setModal({
        title: '¡RIESGO DETECTADO!',
        text: riskData ? `${riskData.q}. Retrocedés ${back} casillas.` : `Condición insegura. Retrocedés ${back} casillas.`,
        icon: '⚠️',
        color: 'text-error-rose',
        onConfirm: () => {
          setPlayers(prev => {
            const next = [...prev];
            next[currentPlayer].pos = Math.max(1, pos - back);
            return next;
          });
          setModal(null);
          nextTurn();
        }
      });
    } else if (sq.type === 'barrera') {
      const barrierData = gameData.preguntas.find(p => p.sq === pos && p.tipo === 'barrera');
      const fwdMatch = barrierData?.a.match(/\d+/);
      const fwd = fwdMatch ? parseInt(fwdMatch[0]) : Math.floor(Math.random() * 3) + 3;
      
      setModal({
        title: '¡BARRERA ACTIVA!',
        text: barrierData ? `${barrierData.q}. Avanzás ${fwd} casillas.` : `Control efectivo. Avanzás ${fwd} casillas.`,
        icon: '🛡️',
        color: 'text-emerald-400',
        onConfirm: () => {
          setPlayers(prev => {
            const next = [...prev];
            next[currentPlayer].pos = Math.min(63, pos + fwd);
            return next;
          });
          setModal(null);
          nextTurn();
        }
      });
    } else if (sq.type === 'trivia') {
      const triviaQuestions = gameData.preguntas.filter(p => p.tipo === 'trivia');
      const questionData = triviaQuestions.find(p => p.sq === pos) || 
                          triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      
      setModal({
        type: 'TRIVIA',
        title: 'DESAFÍO TÉCNICO',
        text: questionData.q,
        options: questionData.o,
        answer: questionData.a,
        icon: '❓',
        color: 'text-tertiary',
        onConfirm: (sel: string) => {
          if (sel === questionData.a) {
            setPlayers(prev => {
              const next = [...prev];
              next[currentPlayer].pos = Math.min(63, pos + 2);
              return next;
            });
            setModal({ title: '¡CORRECTO!', text: 'Avanzás 2 casillas extra.', icon: '✅', color: 'text-emerald-400', onConfirm: () => { setModal(null); nextTurn(); } });
          } else {
            setModal({ title: 'INCORRECTO', text: `La respuesta era: ${questionData.a}. Te quedás en esta posición.`, icon: '❌', color: 'text-error-rose', onConfirm: () => { setModal(null); nextTurn(); } });
          }
        }
      });
    } else {
      nextTurn();
    }
  };

  const nextTurn = () => setCurrentPlayer((currentPlayer + 1) % players.length);

  if (gameState === 'SETUP') return <OcaSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <OcaWinner player={players[currentPlayer]} onRestart={() => window.location.reload()} />;

  return (
    <div className="h-screen flex flex-col lg:flex-row p-4 gap-4 overflow-hidden obsidian-table relative">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <aside className="w-full lg:w-80 glass-panel-heavy p-6 rounded-xl hard-shadow flex flex-col gap-4 relative z-10">
        <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2 mb-4 transition-opacity">
          <LogOut size={12} /> Volver al Menú
        </button>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-secondary flex items-center justify-center rounded-sm hard-shadow-sm">
            <LayoutGrid className="text-black" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-headline font-black tracking-tighter leading-none">LA <span className="text-secondary">OCA</span></h2>
            <p className="text-[10px] font-headline uppercase tracking-widest opacity-50">Logística de Seguridad</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
          {players.map((p, i) => (
            <div key={i} className={`p-3 rounded-sm border-l-4 flex items-center gap-3 transition-all ${currentPlayer === i ? 'bg-secondary/10 border-secondary hard-shadow-sm' : 'bg-white/5 border-transparent opacity-50'}`}>
              <div className="w-8 h-8 rounded-sm flex items-center justify-center text-black font-black hard-shadow-sm" style={{ backgroundColor: p.color }}>{p.name[0]}</div>
              <div className="flex-1">
                <p className="text-xs font-headline font-black uppercase truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${(p.pos / 63) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-mono opacity-60">{p.pos}/63</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-center gap-4 p-6 bg-black/40 rounded-xl border border-white/5 hard-shadow">
          <div className="relative">
            <div className={`w-20 h-20 bg-white rounded-xl flex items-center justify-center text-4xl text-black font-black hard-shadow transition-transform ${isRolling ? 'animate-spin' : ''}`}>
              {dice}
            </div>
            {isRolling && (
              <div className="absolute -inset-4 border-2 border-secondary/30 rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          
          <button 
            onClick={rollDice} 
            disabled={isRolling || !!modal} 
            className="btn-industrial-orange w-full py-4 disabled:opacity-30 text-black font-headline font-black uppercase tracking-widest text-xs"
          >
            {isRolling ? 'PROCESANDO...' : 'LANZAR DADO'}
          </button>
        </div>
      </aside>

      <main className="flex-1 glass-panel-heavy rounded-xl p-6 overflow-hidden flex items-center justify-center border border-white/10 relative z-10">
        <div className="absolute top-4 right-4 flex items-center gap-4 text-[10px] font-headline uppercase tracking-widest opacity-30">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-error-rose rounded-full" /> Riesgo</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full" /> Barrera</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-full" /> Trivia</div>
        </div>

        <div className="grid grid-cols-9 gap-1 w-full max-w-4xl aspect-[9/7] p-2 bg-black/20 rounded-lg border border-white/5">
          {Array.from({ length: 7 }).map((_, r) => {
            const rowIdx = 6 - r;
            let rowSquares = board.slice(rowIdx * 9, (rowIdx + 1) * 9);
            if (rowIdx % 2 !== 0) rowSquares = [...rowSquares].reverse();
            return rowSquares.map(sq => (
              <div key={sq.id} className={`relative border border-white/5 flex flex-col items-center justify-center rounded-sm text-center transition-colors
                ${sq.type === 'riesgo' ? 'bg-error-rose/10 border-error-rose/20' : 
                  sq.type === 'barrera' ? 'bg-emerald-500/10 border-emerald-500/20' : 
                  sq.type === 'trivia' ? 'bg-amber-500/10 border-amber-500/20' : 
                  'bg-white/5'}
                ${sq.id === 63 ? 'bg-secondary/20 border-secondary/40' : ''}
              `}>
                <span className="absolute top-0.5 left-1 text-[8px] font-mono opacity-30">{sq.id}</span>
                <span className={`text-lg filter drop-shadow-md ${isRolling ? 'blur-[1px]' : ''}`}>{sq.icon}</span>
                
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 p-1">
                  {players.map((p, pi) => p.pos === sq.id && (
                    <motion.div 
                      layoutId={`player-${pi}`} 
                      key={pi} 
                      className="w-5 h-5 rounded-sm border-2 border-white/50 shadow-lg flex items-center justify-center text-[10px] font-black text-black hard-shadow-sm" 
                      style={{ backgroundColor: p.color }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      {p.name[0]}
                    </motion.div>
                  ))}
                </div>
                
                {sq.id === 63 && <Trophy className="absolute bottom-1 right-1 text-secondary opacity-20" size={12} />}
              </div>
            ));
          })}
        </div>
      </main>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-panel-heavy w-full max-w-md p-8 rounded-2xl border-2 border-secondary text-center">
              <div className="text-5xl mb-4">{modal.icon}</div>
              <h3 className={`text-2xl font-headline font-black mb-2 uppercase tracking-tighter ${modal.color}`}>{modal.title}</h3>
              <p className="text-sm text-on-surface-variant mb-6 font-body">{modal.text}</p>
              {modal.type === 'TRIVIA' ? (
                <div className="flex flex-col gap-2">
                  {modal.options.map((o: string, i: number) => (
                    <button key={i} onClick={() => modal.onConfirm(o)} className="w-full bg-white/5 hover:bg-white/10 text-white p-3 rounded-lg text-xs font-headline font-bold transition-all border border-white/10">{o}</button>
                  ))}
                </div>
              ) : (
                <button onClick={modal.onConfirm} className="btn-industrial-orange text-black font-headline font-black px-8 py-3 rounded-sm hard-shadow uppercase text-xs tracking-widest">Continuar</button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const OcaSetup = ({ onStart, onBack }: { onStart: (p: any[]) => void, onBack: () => void }) => {
  const [count, setCount] = useState(2);
  const [names, setNames] = useState(['Operador 1', 'Operador 2', 'Operador 3', 'Operador 4']);
  return (
    <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-heavy w-full max-w-lg p-10 rounded-2xl border border-secondary/30 hard-shadow relative z-10"
      >
        <button onClick={onBack} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
          <ArrowRight className="rotate-180" size={12} /> Volver
        </button>
        
        <div className="text-center mb-10">
          <h2 className="text-5xl font-headline font-black mb-2 tracking-tighter">LA <span className="text-secondary">OCA</span></h2>
          <p className="text-[10px] font-headline uppercase tracking-[0.3em] text-secondary opacity-70">Logística de Prevención</p>
        </div>

        <div className="mb-10">
          <p className="text-[10px] font-headline uppercase font-black mb-4 opacity-50 text-center tracking-widest">Configuración de Escuadrón</p>
          <div className="flex gap-4 justify-center">
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => setCount(n)} 
                className={`w-14 h-14 rounded-sm font-headline font-black transition-all border-2 ${count === n ? 'bg-secondary text-black border-secondary hard-shadow-sm scale-110' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-10">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-sm flex items-center justify-center text-[10px] font-headline font-black bg-white/10 text-secondary group-focus-within:bg-secondary group-focus-within:text-black transition-colors">
                {i + 1}
              </div>
              <input 
                type="text" 
                value={names[i]} 
                onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }} 
                className="w-full bg-black/40 border border-white/10 focus:border-secondary/50 outline-none py-4 pl-12 pr-4 uppercase font-headline font-black text-xs tracking-widest transition-all rounded-sm" 
                placeholder={`Identificación Op ${i+1}`} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => onStart(names.slice(0, count).map(n => ({ name: n })))} 
          className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-widest text-sm"
        >
          INICIAR OPERACIÓN
        </button>
      </motion.div>
    </div>
  );
};

// --- COMPONENTES DE UNE EL RIESGO ---

const MATCH_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1194527809&single=true&output=csv';

const MATCH_FALLBACK = [
  { riesgo: "Trabajo en Altura", medida: "Arnés de Seguridad", nivel: "easy", emoji_r: "🏗️", emoji_m: "🦺", exp: "El arnés previene caídas a distinto nivel." },
  { riesgo: "Riesgo Eléctrico", medida: "Bloqueo y Etiquetado", nivel: "easy", emoji_r: "⚡", emoji_m: "🔒", exp: "LOTO asegura que la energía esté controlada." },
  { riesgo: "Ruido Excesivo", medida: "Protectores Auditivos", nivel: "easy", emoji_r: "🔊", emoji_m: "🎧", exp: "La protección auditiva previene la hipoacusia." },
  { riesgo: "Sustancias Químicas", medida: "Ducha de Emergencia", nivel: "easy", emoji_r: "🧪", emoji_m: "🚿", exp: "Actuación inmediata ante salpicaduras." },
  { riesgo: "Espacio Confinado", medida: "Medición de Gases", nivel: "easy", emoji_r: "🕳️", emoji_m: "📊", exp: "Verificar atmósfera segura antes de entrar." },
  { riesgo: "Cargas Suspendidas", medida: "Delimitación de Área", nivel: "easy", emoji_r: "🏗️", emoji_m: "🚧", exp: "Mantener distancia de seguridad bajo la carga." },
  { riesgo: "Proyección de Partículas", medida: "Gafas de Seguridad", nivel: "medium", emoji_r: "💥", emoji_m: "🥽", exp: "Protección ocular contra impactos." },
  { riesgo: "Atrapamiento", medida: "Guardas de Seguridad", nivel: "medium", emoji_r: "⚙️", emoji_m: "🛡️", exp: "Barreras físicas en partes móviles." },
  { riesgo: "Vibraciones", medida: "Guantes Antivibración", nivel: "medium", emoji_r: "📳", emoji_m: "🧤", exp: "Reduce el impacto en articulaciones." },
  { riesgo: "Radiación UV", medida: "Protector Solar", nivel: "medium", emoji_r: "☀️", emoji_m: "🧴", exp: "Protección de la piel en trabajos al exterior." },
  { riesgo: "Incendio", medida: "Extintor PQS", nivel: "expert", emoji_r: "🔥", emoji_m: "🧯", exp: "Control inicial de focos ígneos." },
  { riesgo: "Estrés Térmico", medida: "Hidratación y Pausas", nivel: "expert", emoji_r: "🌡️", emoji_m: "💧", exp: "Evita el golpe de calor en ambientes extremos." }
];

const MatchGame = ({ onExit }: { onExit: () => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [level, setLevel] = useState<'easy' | 'medium' | 'expert'>('easy');
  const [pairs, setPairs] = useState<any[]>([]);
  const [shuffledMeasures, setShuffledMeasures] = useState<any[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [gameData, setGameData] = useState<any[]>(MATCH_FALLBACK);

  useEffect(() => {
    fetch(MATCH_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 6) return null;
          return {
            riesgo: cols[0],
            medida: cols[1],
            nivel: cols[2].toLowerCase(),
            emoji_r: cols[3],
            emoji_m: cols[4],
            exp: cols[5]
          };
        }).filter(d => d !== null);
        if (parsed.length > 0) setGameData(parsed);
      })
      .catch(err => console.warn("Error loading Match data:", err));
  }, []);

  useEffect(() => {
    let interval: any;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (gameState === 'PLAYING' && timeLeft === 0) {
      setGameState('WINNER');
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const handleStart = (selectedLevel: 'easy' | 'medium' | 'expert') => {
    const config = {
      easy: { pairs: 6, time: 90 },
      medium: { pairs: 9, time: 75 },
      expert: { pairs: 12, time: 60 }
    };
    
    const pairsCount = config[selectedLevel].pairs;
    let filtered = gameData.filter(d => d.nivel === selectedLevel);
    if (filtered.length < pairsCount) {
      filtered = [...filtered, ...gameData.filter(d => d.nivel !== selectedLevel)].slice(0, pairsCount);
    } else {
      filtered = shuffle([...filtered]).slice(0, pairsCount);
    }

    const gamePairs = filtered.map((p, i) => ({ ...p, id: i }));
    setPairs(gamePairs);
    setShuffledMeasures(shuffle(gamePairs.map(p => ({ ...p }))));
    setLevel(selectedLevel);
    setTotalTime(config[selectedLevel].time);
    setTimeLeft(config[selectedLevel].time);
    setMatchedIds([]);
    setScore(0);
    setGameState('PLAYING');
  };

  const handleDrop = (measureId: number, riskId: number) => {
    if (measureId === riskId) {
      if (matchedIds.includes(riskId)) return;
      
      const newMatched = [...matchedIds, riskId];
      setMatchedIds(newMatched);
      
      const pair = pairs.find(p => p.id === riskId);
      setExplanation(pair.exp);
      setTimeout(() => setExplanation(null), 2500);

      const currentScore = Math.max(0, 1000 - ((totalTime - timeLeft) * 10));
      setScore(prev => prev + currentScore);

      if (newMatched.length === pairs.length) {
        setTimeout(() => setGameState('WINNER'), 1000);
      }
    } else {
      // Animation handled by motion.div returning to original position
    }
  };

  if (gameState === 'SETUP') return <MatchSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <MatchWinner score={score} level={level} onRestart={() => setGameState('SETUP')} onExit={onExit} />;

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex flex-col font-sans text-white">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
      
      {/* Header HUD - STITCH STYLE */}
      <header className="glass-panel-heavy p-4 flex items-center justify-between border-b border-white/10 relative z-20 hard-shadow">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit} 
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all group"
            title="Abortar Misión"
          >
            <ArrowRight className="rotate-180 text-secondary group-hover:scale-110 transition-transform" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-headline font-black tracking-tighter leading-none flex items-center gap-2">
              <span className="w-2 h-6 bg-secondary animate-pulse" />
              CAZA DE <span className="text-secondary">RIESGOS</span>
            </h1>
            <p className="text-[10px] font-headline font-bold uppercase tracking-[0.3em] text-primary opacity-70">Protocolo de Identificación de Peligros</p>
          </div>
        </div>
        
        <div className="flex items-center gap-12">
          <div className="text-right">
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary opacity-50">Rendimiento</p>
            <p className="text-3xl font-mono font-black text-secondary leading-none tabular-nums">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
            </p>
          </div>
          <div className="text-right min-w-[120px]">
            <p className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary opacity-50">Tiempo Restante</p>
            <p className={`text-3xl font-mono font-black leading-none tabular-nums ${timeLeft < 20 ? 'text-error animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex gap-8 p-8 relative z-10 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Risks Column */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-l-4 border-secondary">
            <h3 className="text-sm font-headline font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-3">
              <AlertTriangle size={18} className="animate-hud-pulse" /> Amenazas Detectadas
            </h3>
            <span className="text-xs font-mono font-bold text-white/40 bg-black/40 px-3 py-1 rounded-full">
              {matchedIds.length} / {pairs.length}
            </span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pr-4 custom-scrollbar">
            {pairs.map((p) => (
              <motion.div
                key={p.id}
                layout
                className={`glass-panel-heavy p-5 rounded-sm border-2 transition-all flex items-center gap-6 relative overflow-hidden hard-shadow-sm
                  ${matchedIds.includes(p.id) ? 'border-emerald-500/30 bg-emerald-500/5 opacity-40' : 'border-white/10 hover:border-secondary/40 cursor-default group'}
                `}
              >
                {matchedIds.includes(p.id) && (
                  <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-black">
                    <CheckCircle2 size={16} />
                  </div>
                )}
                <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">{p.emoji_r}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-headline font-black uppercase tracking-tight text-white mb-1">{p.riesgo}</p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                    <p className="text-[10px] font-headline font-bold text-primary/60 uppercase tracking-widest">Zona: {p.nivel}</p>
                  </div>
                </div>
                {!matchedIds.includes(p.id) && (
                  <div className="flex flex-col gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-1 h-1 bg-secondary rounded-full" />
                    <div className="w-1 h-4 bg-secondary rounded-full" />
                    <div className="w-1 h-1 bg-secondary rounded-full" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tactical Scanner Divider */}
        <div className="w-1 bg-white/5 relative overflow-hidden rounded-full">
          <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-secondary to-transparent"
          />
        </div>

        {/* Measures Column */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-l-4 border-emerald-500">
            <h3 className="text-sm font-headline font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-3">
              <Shield size={18} className="animate-hud-pulse" /> Contramedidas EHS
            </h3>
          </div>
          
          <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pr-4 custom-scrollbar">
            {shuffledMeasures.map((m) => (
              <motion.button
                key={m.id}
                whileHover={!matchedIds.includes(m.id) ? { x: 8 } : {}}
                whileTap={!matchedIds.includes(m.id) ? { scale: 0.98 } : {}}
                onClick={() => {
                  const selRisk = pairs.find(p => !matchedIds.includes(p.id));
                  if (selRisk) handleDrop(m.id, selRisk.id);
                }}
                disabled={matchedIds.includes(m.id)}
                className={`glass-panel-heavy p-5 rounded-sm border-2 text-left transition-all flex items-center gap-6 relative group hard-shadow-sm
                  ${matchedIds.includes(m.id) ? 'border-emerald-500/20 bg-emerald-500/5 opacity-0 pointer-events-none' : 'border-white/10 hover:border-secondary active:bg-secondary/10'}
                `}
              >
                <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:rotate-12 transition-transform duration-500">{m.emoji_m}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-headline font-black uppercase tracking-tight text-white mb-1">{m.medida}</p>
                  <p className="text-[10px] text-secondary font-headline font-black tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    EJECUTAR CONTROL
                  </p>
                </div>
                <div className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/50 transition-colors">
                  <ArrowRight size={14} className="text-white/20 group-hover:text-secondary transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {explanation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="glass-panel-heavy w-full max-w-xl p-12 rounded-sm border-2 border-secondary/30 hard-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary animate-pulse" />
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/30 relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" />
                <CheckCircle2 className="text-emerald-500 relative z-10" size={48} />
              </div>
              <h3 className="text-4xl font-headline font-black mb-6 tracking-tighter uppercase text-secondary text-center">Control Validado</h3>
              <div className="bg-white/5 p-6 rounded-sm border border-white/10 mb-10">
                <p className="text-xl text-white leading-relaxed font-body font-medium italic text-center">"{explanation}"</p>
              </div>
              <button 
                onClick={() => setExplanation(null)} 
                className="btn-industrial-orange w-full py-5 text-black font-headline font-black uppercase tracking-[0.3em] text-sm"
              >
                SIGUIENTE RIESGO
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MatchSetup = ({ onStart, onBack }: { onStart: (l: any) => void, onBack: () => void }) => (
  <div className="h-screen flex items-center justify-center p-6 obsidian-table relative overflow-hidden">
    <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
    
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="w-full max-w-3xl glass-panel-heavy p-16 rounded-sm border-2 border-secondary/30 hard-shadow text-center relative z-10"
    >
      <div className="mb-10 inline-block p-6 bg-secondary/10 rounded-sm border-2 border-secondary/50 hard-shadow-sm relative">
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-secondary" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-secondary" />
        <Shield className="w-16 h-16 text-secondary animate-hud-pulse" />
      </div>
      
      <h1 className="text-6xl font-headline font-black text-white mb-4 tracking-tighter uppercase">
        CAZA DE <span className="text-secondary">RIESGOS</span>
      </h1>
      <div className="flex items-center justify-center gap-4 mb-16">
        <div className="h-px w-12 bg-secondary/30" />
        <p className="text-secondary font-headline font-black uppercase tracking-[0.5em] text-xs opacity-80">Misión de Mitigación Industrial</p>
        <div className="h-px w-12 bg-secondary/30" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { id: 'easy', label: 'Nivel 01', title: 'Básico', pairs: 6, time: 90, color: 'text-emerald-500', border: 'hover:border-emerald-500/50' },
          { id: 'medium', label: 'Nivel 02', title: 'Avanzado', pairs: 9, time: 75, color: 'text-amber-500', border: 'hover:border-amber-500/50' },
          { id: 'expert', label: 'Nivel 03', title: 'Crítico', pairs: 12, time: 60, color: 'text-error', border: 'hover:border-error/50' }
        ].map((lvl) => (
          <button 
            key={lvl.id}
            onClick={() => onStart(lvl.id as any)} 
            className={`group p-8 bg-white/5 border-2 border-white/10 ${lvl.border} rounded-sm transition-all text-left hard-shadow-sm hover:-translate-y-2 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rotate-45 translate-x-6 -translate-y-6" />
            <p className={`${lvl.color} font-headline font-black text-[10px] uppercase mb-2 tracking-widest`}>{lvl.label}</p>
            <p className="text-white font-headline font-black text-3xl tracking-tighter mb-1">{lvl.title}</p>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">{lvl.pairs} Riesgos • {lvl.time}s</p>
          </button>
        ))}
      </div>

      <button 
        onClick={onBack} 
        className="group flex items-center gap-3 mx-auto text-white/40 hover:text-secondary font-headline uppercase tracking-[0.4em] text-[10px] font-black transition-all"
      >
        <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={16} />
        VOLVER AL CENTRO DE OPERACIONES
      </button>
    </motion.div>
  </div>
);

const MatchWinner = ({ score, level, onRestart, onExit }: { score: number, level: string, onRestart: () => void, onExit: () => void }) => (
  <div className="h-screen flex items-center justify-center p-6 obsidian-table relative overflow-hidden">
    <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
    
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, scaleY: 0.5 }}
      animate={{ scale: 1, opacity: 1, scaleY: 1 }}
      className="w-full max-w-2xl glass-panel-heavy p-16 rounded-sm border-2 border-secondary/30 hard-shadow text-center relative z-10"
    >
      <div className="text-8xl mb-8 filter drop-shadow-[0_0_25px_rgba(247,190,29,0.4)] animate-bounce">
        {score > 0 ? '🏆' : '⚠️'}
      </div>
      
      <h2 className={`text-6xl font-headline font-black mb-4 tracking-tighter uppercase ${score > 0 ? 'text-emerald-500' : 'text-error'}`}>
        {score > 0 ? '¡MISIÓN CUMPLIDA!' : 'OPERACIÓN FALLIDA'}
      </h2>
      <p className="text-primary font-headline font-black uppercase tracking-[0.5em] text-xs mb-16 opacity-70">
        {score > 0 ? 'Protocolo de Seguridad Validado al 100%' : 'Se requiere re-entrenamiento inmediato'}
      </p>
      
      <div className="bg-black/60 p-10 rounded-sm border border-white/10 mb-16 hard-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
        <p className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-secondary mb-4">Puntaje de Eficiencia ({level})</p>
        <p className="text-8xl font-headline font-black text-white tracking-tighter tabular-nums">
          {score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
        </p>
      </div>

      <div className="flex gap-6">
        <button 
          onClick={onExit} 
          className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-headline font-black rounded-sm uppercase tracking-[0.2em] text-xs transition-all border border-white/10"
        >
          Finalizar
        </button>
        <button 
          onClick={onRestart} 
          className="btn-industrial-orange flex-[2] py-5 text-black font-headline font-black rounded-sm uppercase tracking-[0.2em] text-xs"
        >
          Nueva Misión
        </button>
      </div>
    </motion.div>
  </div>
);

const OcaWinner = ({ player, onRestart }: { player: any, onRestart: () => void }) => (
  <div className="h-screen flex items-center justify-center p-4 obsidian-table relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
    
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-panel-heavy p-12 rounded-2xl border border-secondary/30 text-center hard-shadow relative z-10"
    >
      <div className="text-8xl mb-6 filter drop-shadow-[0_0_20px_rgba(247,190,29,0.5)]">🏆</div>
      <h2 className="text-5xl font-headline font-black mb-2 tracking-tighter uppercase">¡OPERADOR EXPERTO!</h2>
      <p className="text-xl text-secondary font-headline font-black uppercase mb-10 tracking-widest">{player.name} ha llegado a la meta</p>
      <button onClick={onRestart} className="btn-industrial-orange px-16 py-5 text-black font-headline font-black uppercase tracking-widest text-sm">NUEVA JORNADA</button>
    </motion.div>
  </div>
);

// --- COMPONENTES DE CARRERA MENTE ---

const CARRERA_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=373988263&single=true&output=csv';

const CARRERA_CATEGORIES: any = {
  epp: { id: 'epp', label: 'EPP', icon: '🦺', color: '#3b82f6', bg: 'bg-blue-500' },
  legislacion: { id: 'legislacion', label: 'Legislación', icon: '⚖️', color: '#10b981', bg: 'bg-emerald-500' },
  senaletica: { id: 'senaletica', label: 'Señalética', icon: '🔴', color: '#f43f5e', bg: 'bg-rose-500' },
  emergencias: { id: 'emergencias', label: 'Emergencias', icon: '🚨', color: '#f59e0b', bg: 'bg-orange-500' },
  gestion: { id: 'gestion', label: 'Gestión EHS', icon: '📋', color: '#a855f7', bg: 'bg-purple-500' }
};

const CARRERA_FALLBACK = [
  { cat: 'epp', q: "¿Qué EPP es obligatorio para trabajos en altura?", a: "Arnés de seguridad", o: ["Casco", "Arnés de seguridad", "Guantes", "Lentes"], exp: "El arnés previene caídas a distinto nivel." },
  { cat: 'epp', q: "¿Cuándo se deben usar protectores auditivos?", a: "Sobre los 85 dB", o: ["Siempre", "Sobre los 85 dB", "Solo en obras", "Nunca"], exp: "El ruido excesivo causa daño irreversible." },
  { cat: 'legislacion', q: "¿Cuál es la ley de Higiene y Seguridad en Argentina?", a: "19.587", o: ["24.557", "19.587", "20.744", "26.773"], exp: "Es la ley base de la prevención en el país." },
  { cat: 'senaletica', q: "¿Qué indica el color azul en seguridad?", a: "Obligación", o: ["Prohibición", "Advertencia", "Obligación", "Información"], exp: "El azul indica una acción obligatoria (ej. usar casco)." },
  { cat: 'emergencias', q: "¿Qué es lo primero que se debe hacer ante un incendio?", a: "Dar la voz de alarma", o: ["Correr", "Dar la voz de alarma", "Esconderse", "Abrir ventanas"], exp: "Alertar a los demás es vital para la evacuación." },
  { cat: 'gestion', q: "¿Qué es un 'incidente'?", a: "Suceso que pudo ser un accidente", o: ["Un accidente grave", "Suceso que pudo ser un accidente", "Una multa", "Una reunión"], exp: "Es un aviso de que algo anda mal antes de que alguien se lastime." }
];

const CarreraGame = ({ onExit }: { onExit: () => void }) => {
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'WINNER'>('SETUP');
  const [players, setPlayers] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>(CARRERA_FALLBACK);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [playState, setPlayState] = useState<'IDLE' | 'SPINNING' | 'QUESTION' | 'FEEDBACK'>('IDLE');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [timer, setTimer] = useState(20);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    fetch(CARRERA_SHEETS_URL)
      .then(r => r.text())
      .then(csv => {
        const lines = csv.split('\n').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 4) return null;
          return {
            cat: cols[0].toLowerCase(),
            q: cols[1],
            a: cols[2],
            o: cols[3].split('|').map(o => o.trim()),
            diff: cols[4],
            exp: cols[5]
          };
        }).filter(q => q && CARRERA_CATEGORIES[q.cat]);
        
        if (parsed.length > 0) setQuestions(parsed);
      })
      .catch(err => console.warn("Error loading Carrera data:", err));
  }, []);

  useEffect(() => {
    let interval: any;
    if (playState === 'QUESTION' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (playState === 'QUESTION' && timer === 0) {
      handleAnswer(null);
    }
    return () => clearInterval(interval);
  }, [playState, timer]);

  const handleStart = (newPlayers: any[]) => {
    setPlayers(newPlayers.map(p => ({ ...p, score: 0 })));
    setGameState('PLAYING');
  };

  const spinRoulette = () => {
    if (playState !== 'IDLE') return;
    setPlayState('SPINNING');
    const extraRots = 5 + Math.random() * 5;
    const newRot = rotation + extraRots * 360;
    setRotation(newRot);

    setTimeout(() => {
      const finalAngle = newRot % 360;
      const catKeys = Object.keys(CARRERA_CATEGORIES);
      const idx = Math.floor(((360 - (finalAngle % 360)) % 360) / 72);
      const cat = CARRERA_CATEGORIES[catKeys[idx]];
      setSelectedCategory(cat);
      
      const catQuestions = questions.filter(q => q.cat === cat.id);
      const q = catQuestions.length > 0 
        ? catQuestions[Math.floor(Math.random() * catQuestions.length)]
        : questions[Math.floor(Math.random() * questions.length)];
      
      setCurrentQuestion(q);
      setPlayState('QUESTION');
      setTimer(20);
    }, 3000);
  };

  const handleAnswer = (option: string | null) => {
    if (playState !== 'QUESTION') return;
    
    let points = 0;
    if (option === currentQuestion.a) {
      points = timer > 10 ? 3 : 1;
    }
    
    setScoreEarned(points);
    setPlayers(prev => {
      const next = [...prev];
      next[currentPlayerIdx].score += points;
      return next;
    });
    
    setPlayState('FEEDBACK');
    
    setTimeout(() => {
      if (currentPlayerIdx < players.length - 1) {
        setCurrentPlayerIdx(currentPlayerIdx + 1);
        setPlayState('IDLE');
      } else {
        if (currentRound < 5) {
          setCurrentRound(currentRound + 1);
          setCurrentPlayerIdx(0);
          setPlayState('IDLE');
        } else {
          setGameState('WINNER');
        }
      }
      setSelectedCategory(null);
      setCurrentQuestion(null);
    }, 3500);
  };

  if (gameState === 'SETUP') return <CarreraSetup onStart={handleStart} onBack={onExit} />;
  if (gameState === 'WINNER') return <CarreraWinner players={players} onRestart={() => window.location.reload()} />;

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex flex-col font-sans text-white">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header HUD - STITCH STYLE */}
        <header className="glass-panel-heavy p-4 flex items-center justify-between border-b border-white/10 relative z-20 hard-shadow mb-8">
          <div className="flex items-center gap-6">
            <button 
              onClick={onExit} 
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all group"
              title="Abortar Misión"
            >
              <ArrowRight className="rotate-180 text-secondary group-hover:scale-110 transition-transform" size={24} />
            </button>
            <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-1">
              {players.map((p, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-sm border transition-all min-w-[140px] hard-shadow-sm
                  ${i === currentPlayerIdx ? 'bg-secondary/10 border-secondary ring-1 ring-secondary/50' : 'bg-white/5 border-white/10 opacity-40'}
                `}>
                  <span className="text-3xl filter drop-shadow-md">{p.emoji}</span>
                  <div>
                    <p className={`text-[10px] font-headline font-black uppercase tracking-widest ${i === currentPlayerIdx ? 'text-secondary' : 'text-primary'}`}>{p.name}</p>
                    <p className="text-xl font-mono font-black text-white leading-none">{p.score} <span className="text-[10px] opacity-50 uppercase">PTS</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-right pl-8 border-l border-white/10">
            <p className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-secondary opacity-70">Ronda de Operación</p>
            <p className="text-4xl font-mono font-black text-white leading-none tracking-tighter">
              {currentRound}<span className="text-xl opacity-30">/5</span>
            </p>
          </div>
        </header>

        {/* Main Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {playState === 'IDLE' || playState === 'SPINNING' ? (
            <div className="flex flex-col items-center gap-12">
              <div className="text-center">
                <p className="text-secondary font-headline font-black uppercase tracking-[0.5em] text-xs mb-3 animate-hud-pulse">Protocolo de Turno Activo</p>
                <h2 className="text-5xl font-headline font-black text-white uppercase tracking-tighter">
                  {players[currentPlayerIdx]?.name} <span className="text-secondary">AL MANDO</span>
                </h2>
              </div>

              <div className="relative p-8 glass-panel-heavy rounded-full hard-shadow border-2 border-white/10">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 text-secondary drop-shadow-[0_0_20px_rgba(247,190,29,0.8)]">
                  <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-secondary" />
                </div>
                
                {/* Roulette Container */}
                <div className="relative p-4 rounded-full border-8 border-black/40 bg-black/60 shadow-inner">
                  <svg 
                    width="420" height="420" viewBox="0 0 400 400" 
                    className="transition-transform duration-[3000ms] ease-[cubic-bezier(0.15,0,0.15,1)]"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  >
                    {Object.keys(CARRERA_CATEGORIES).map((key, i) => {
                      const angle = 72;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;
                      const x1 = 200 + 190 * Math.cos((startAngle - 90) * Math.PI / 180);
                      const y1 = 200 + 190 * Math.sin((startAngle - 90) * Math.PI / 180);
                      const x2 = 200 + 190 * Math.cos((endAngle - 90) * Math.PI / 180);
                      const y2 = 200 + 190 * Math.sin((endAngle - 90) * Math.PI / 180);
                      
                      return (
                        <g key={key} className="group/wedge">
                          <path 
                            d={`M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`} 
                            fill={CARRERA_CATEGORIES[key].color}
                            className="opacity-80 group-hover/wedge:opacity-100 transition-opacity cursor-pointer"
                            stroke="#000"
                            strokeWidth="4"
                          />
                          <text 
                            x="200" y="70" 
                            transform={`rotate(${startAngle + 36}, 200, 200)`}
                            fill="white" textAnchor="middle" fontSize="36"
                            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] pointer-events-none"
                          >
                            {CARRERA_CATEGORIES[key].icon}
                          </text>
                        </g>
                      );
                    })}
                    {/* Center Hub */}
                    <circle cx="200" cy="200" r="50" fill="#000" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <circle cx="200" cy="200" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="200" y="208" textAnchor="middle" fill="white" className="text-[12px] font-headline font-black uppercase tracking-widest opacity-50">EHS</text>
                  </svg>
                </div>
              </div>

              <button 
                onClick={spinRoulette}
                disabled={playState === 'SPINNING'}
                className="btn-industrial-orange px-20 py-8 text-black font-headline font-black uppercase tracking-[0.3em] text-xl disabled:opacity-50 disabled:cursor-not-allowed hard-shadow hover:scale-105 transition-transform"
              >
                {playState === 'SPINNING' ? 'PROCESANDO...' : 'INICIAR GIRO'}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="w-full max-w-4xl glass-panel-heavy p-12 rounded-sm border-2 border-white/10 hard-shadow relative overflow-hidden"
            >
              {/* Timer Bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timer / 20) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className={`h-full transition-colors duration-500 ${timer > 10 ? 'bg-emerald-500' : timer > 5 ? 'bg-amber-500' : 'bg-error'}`}
                />
              </div>

              <div className="flex items-center gap-8 mb-12">
                <div className={`w-24 h-24 rounded-sm ${selectedCategory.bg} flex items-center justify-center text-6xl shadow-xl border-2 border-white/20 hard-shadow-sm`}>
                  {selectedCategory.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-secondary font-headline font-black uppercase tracking-[0.4em] text-sm mb-2">{selectedCategory.label}</h3>
                  <p className="text-white font-headline font-black text-4xl uppercase tracking-tighter">Evaluación de Riesgo</p>
                </div>
                <div className="text-right bg-black/40 p-4 rounded-sm border border-white/10 min-w-[120px]">
                  <p className="text-[10px] font-headline font-black uppercase tracking-widest text-white/40 mb-1">Tiempo</p>
                  <span className={`text-5xl font-mono font-black tabular-nums ${timer <= 5 ? 'text-error animate-pulse' : 'text-white'}`}>
                    {timer}s
                  </span>
                </div>
              </div>

              <div className="bg-white/5 p-10 rounded-sm border border-white/10 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
                <h2 className="text-3xl font-headline font-black text-white leading-tight uppercase tracking-tight">
                  {currentQuestion.q}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestion.o.map((opt: string, i: number) => {
                  let btnClass = "bg-white/5 hover:bg-white/10 text-white border-white/10";
                  if (playState === 'FEEDBACK') {
                    if (opt === currentQuestion.a) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                    else if (opt !== currentQuestion.a) btnClass = "bg-black/40 border-white/5 opacity-30";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      disabled={playState === 'FEEDBACK'}
                      className={`w-full p-6 text-left rounded-sm border-2 font-headline font-black flex items-center gap-6 transition-all group hard-shadow-sm ${btnClass}`}
                    >
                      <span className={`w-14 h-14 rounded-sm flex items-center justify-center text-lg font-black border-2 transition-all ${
                        playState === 'FEEDBACK' && opt === currentQuestion.a 
                        ? 'bg-emerald-500 border-emerald-400 text-black' 
                        : 'bg-white/10 border-white/10 text-white group-hover:bg-secondary group-hover:text-black'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-xl uppercase tracking-tight">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {playState === 'FEEDBACK' && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-12 p-8 bg-black/60 rounded-sm border border-white/10 shadow-inner relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-secondary/30" />
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${scoreEarned > 0 ? 'bg-emerald-500' : 'bg-error'} animate-pulse`} />
                        <span className={`font-headline font-black uppercase tracking-[0.3em] text-sm ${scoreEarned > 0 ? 'text-emerald-400' : 'text-error'}`}>
                          {scoreEarned > 0 ? 'Protocolo Validado' : 'Fallo en Operación'}
                        </span>
                      </div>
                      {scoreEarned > 0 && (
                        <span className="text-emerald-400 font-mono font-black text-2xl">+{scoreEarned} PTS</span>
                      )}
                    </div>
                    <p className="text-white/70 text-lg font-medium leading-relaxed italic border-l-4 border-secondary pl-6">
                      {currentQuestion.exp}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const CarreraSetup = ({ onStart, onBack }: { onStart: (p: any[]) => void, onBack: () => void }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [names, setNames] = useState(['Operador 1', 'Operador 2', 'Operador 3', 'Operador 4']);
  const [emojis, setEmojis] = useState(['👷', '👩‍🚒', '👨‍🔬', '👮']);
  const EMOJI_LIST = ['👷', '👩‍🚒', '👨‍🔬', '👮', '👷‍♀️', '🕵️', '👩‍🏭', '👨‍🔧'];

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex items-center justify-center p-6 font-sans">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      <motion.div 
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="w-full max-w-3xl glass-panel-heavy p-16 rounded-sm border-2 border-secondary/30 hard-shadow text-center relative z-10"
      >
        <div className="mb-12">
          <p className="text-secondary font-headline font-black uppercase tracking-[0.5em] text-xs mb-3 animate-hud-pulse">Desafío de Conocimiento EHS</p>
          <h1 className="text-6xl font-headline font-black text-white mb-4 tracking-tighter uppercase">
            CARRERA DE LA <span className="text-secondary">MENTE</span>
          </h1>
          <div className="w-32 h-1.5 bg-secondary mx-auto rounded-full shadow-[0_0_15px_rgba(247,190,29,0.4)]" />
        </div>
        
        <div className="mb-16">
          <p className="text-white/40 font-headline font-black uppercase tracking-[0.3em] text-[10px] mb-8">Configuración de Operadores</p>
          <div className="flex justify-center gap-6">
            {[1, 2, 3, 4].map(n => (
              <button 
                key={n}
                onClick={() => setPlayerCount(n)}
                className={`w-20 h-20 rounded-sm font-mono font-black text-3xl transition-all border-2 hard-shadow-sm ${
                  playerCount === n 
                  ? 'bg-secondary text-black border-secondary shadow-[0_0_25px_rgba(247,190,29,0.4)] scale-110' 
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {n.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 mb-16 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {Array.from({ length: playerCount }).map((_, i) => (
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex gap-6 items-center bg-white/5 p-6 rounded-sm border-2 border-white/10 hard-shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary/30 group-hover:bg-secondary transition-colors" />
              <button 
                onClick={() => {
                  const nextEmoji = EMOJI_LIST[(EMOJI_LIST.indexOf(emojis[i]) + 1) % EMOJI_LIST.length];
                  const next = [...emojis];
                  next[i] = nextEmoji;
                  setEmojis(next);
                }}
                className="w-20 h-20 rounded-sm bg-black/40 flex items-center justify-center text-4xl hover:bg-secondary transition-all border border-white/10 group/emoji"
              >
                <span className="group-hover/emoji:scale-125 transition-transform drop-shadow-md">{emojis[i]}</span>
              </button>
              <div className="flex-1 text-left">
                <p className="text-[10px] font-headline font-black uppercase tracking-[0.3em] text-secondary mb-2">Operador {i + 1}</p>
                <input 
                  type="text" 
                  value={names[i]}
                  onChange={(e) => {
                    const next = [...names];
                    next[i] = e.target.value;
                    setNames(next);
                  }}
                  className="bg-transparent border-b-2 border-white/10 focus:border-secondary outline-none text-white text-2xl font-headline font-black w-full px-1 py-2 uppercase tracking-tight transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-6">
          <button 
            onClick={onBack} 
            className="flex-1 py-6 bg-white/5 hover:bg-white/10 text-white font-headline font-black rounded-sm uppercase tracking-[0.2em] text-xs transition-all border border-white/10"
          >
            Abortar
          </button>
          <button 
            onClick={() => onStart(Array.from({ length: playerCount }).map((_, i) => ({ name: names[i], emoji: emojis[i] })))}
            className="btn-industrial-orange flex-[2] py-6 text-black font-headline font-black uppercase tracking-[0.3em] text-lg hard-shadow"
          >
            INICIAR OPERACIÓN
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CarreraWinner = ({ players, onRestart }: { players: any[], onRestart: () => void }) => {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex flex-col items-center justify-center p-6 font-sans text-white">
      {/* Industrial Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center w-full max-w-5xl"
      >
        <div className="text-center mb-20">
          <p className="text-secondary font-headline font-black uppercase tracking-[0.6em] text-sm mb-4 animate-hud-pulse">Operación Finalizada con Éxito</p>
          <h1 className="text-7xl font-headline font-black text-white tracking-tighter uppercase">
            PODIO DE <span className="text-tertiary">CAMPEONES</span>
          </h1>
          <div className="w-48 h-2 bg-tertiary mx-auto mt-6 rounded-full shadow-[0_0_25px_rgba(247,190,29,0.6)]" />
        </div>

        <div className="flex items-end justify-center gap-8 mb-24 w-full">
          {/* 2nd Place */}
          {sorted[1] && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-6xl filter drop-shadow-2xl relative z-10">{sorted[1].emoji}</span>
              </div>
              <p className="text-white/50 font-headline font-black uppercase text-[10px] tracking-[0.3em] mb-4">{sorted[1].name}</p>
              <div className="w-48 h-56 bg-white/5 rounded-sm flex flex-col items-center justify-center border-2 border-white/10 shadow-2xl relative group overflow-hidden hard-shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                <span className="text-6xl font-headline font-black text-white/10 mb-2 relative z-10">2°</span>
                <p className="text-2xl font-mono font-black text-white relative z-10">{sorted[1].score} <span className="text-xs opacity-50">PTS</span></p>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8 group">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 bg-tertiary/10 blur-3xl rounded-full"
              />
              <motion.span 
                animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-16 left-1/2 -translate-x-1/2 text-6xl filter drop-shadow-[0_0_20px_rgba(247,190,29,0.8)] z-20"
              >
                👑
              </motion.span>
              <span className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] relative z-10">{sorted[0].emoji}</span>
            </div>
            <p className="text-white font-headline font-black text-3xl uppercase tracking-tight mb-6">{sorted[0].name}</p>
            <div className="w-64 h-80 bg-tertiary rounded-sm flex flex-col items-center justify-center shadow-[0_0_80px_rgba(247,190,29,0.3)] border-t-8 border-white/30 relative overflow-hidden hard-shadow">
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rotate-45" />
              <span className="text-8xl font-headline font-black text-black mb-4 relative z-10">1°</span>
              <p className="text-4xl font-mono font-black text-black relative z-10">{sorted[0].score} <span className="text-sm opacity-60">PTS</span></p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          {sorted[2] && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-6xl filter drop-shadow-2xl relative z-10">{sorted[2].emoji}</span>
              </div>
              <p className="text-white/50 font-headline font-black uppercase text-[10px] tracking-[0.3em] mb-4">{sorted[2].name}</p>
              <div className="w-48 h-40 bg-white/5 rounded-sm flex flex-col items-center justify-center border-2 border-white/10 shadow-2xl relative group overflow-hidden hard-shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                <span className="text-6xl font-headline font-black text-white/5 mb-2 relative z-10">3°</span>
                <p className="text-2xl font-mono font-black text-white relative z-10">{sorted[2].score} <span className="text-xs opacity-50">PTS</span></p>
              </div>
            </motion.div>
          )}
        </div>

        <button 
          onClick={onRestart}
          className="btn-industrial-orange px-24 py-8 text-black font-headline font-black uppercase tracking-[0.4em] text-xl hard-shadow hover:scale-105 transition-transform"
        >
          NUEVA JORNADA
        </button>
      </motion.div>
    </div>
  );
};

// --- COMPONENTES DE ESCAPE ROOM EHS ---

const ESCAPE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=833467272&single=true&output=csv';

const ESCAPE_FALLBACK = [
  { etapa: 1, tipo: 'evidencia', texto: 'Arnés de seguridad con fecha de inspección vencida', es_correcto: 'SI', pista: 'Revisa las etiquetas de los equipos.', explicacion: 'El equipo no estaba apto para el uso.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Andamio sin barandas perimetrales completas', es_correcto: 'SI', pista: 'Mira la estructura de trabajo.', explicacion: 'Falta de protección colectiva básica.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Falta de permiso de trabajo en altura firmado', es_correcto: 'SI', pista: 'Busca la documentación administrativa.', explicacion: 'No se evaluaron los riesgos antes de iniciar.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Casco de seguridad con barbijo colocado', es_correcto: 'NO', pista: '¿Esto es un problema?', explicacion: 'El casco estaba bien utilizado, no es evidencia de falla.' },
  { etapa: 1, tipo: 'evidencia', texto: 'Botiquín de primeros auxilios completo', es_correcto: 'NO', pista: '¿Influye en la caída?', explicacion: 'Es una medida de respuesta, no causa del accidente.' },
  { etapa: 2, tipo: 'testigo', texto: '"El operario estaba usando su arnés enganchado a la línea de vida"', es_correcto: 'SI', pista: 'Compara con la evidencia del arnés roto.', explicacion: 'Inconsistencia: El arnés se encontró en el suelo sin rastros de tensión.' },
  { etapa: 2, tipo: 'testigo', texto: '"Habíamos realizado la charla de 5 minutos esa mañana"', es_correcto: 'SI', pista: 'Revisa el registro de firmas.', explicacion: 'Inconsistencia: No existe registro de charla para esa fecha.' },
  { etapa: 2, tipo: 'testigo', texto: '"La supervisión estuvo presente durante toda la maniobra"', es_correcto: 'SI', pista: '¿Dónde estaba el capataz?', explicacion: 'Inconsistencia: El capataz estaba en el obrador al momento del suceso.' },
  { etapa: 2, tipo: 'testigo', texto: '"El clima estaba despejado y sin viento"', es_correcto: 'NO', pista: '¿El clima fue factor?', explicacion: 'Esto coincide con el reporte meteorológico.' },
  { etapa: 3, tipo: 'causa_inmediata', texto: 'Uso de equipo defectuoso', es_correcto: 'SI', pista: 'Actos o condiciones inseguras.', explicacion: 'Causa Inmediata: Condición peligrosa directa.' },
  { etapa: 3, tipo: 'causa_basica', texto: 'Falta de programa de mantenimiento', es_correcto: 'SI', pista: 'Factores personales o de trabajo.', explicacion: 'Causa Básica: Falla en el sistema de gestión.' },
  { etapa: 4, tipo: 'porque', texto: '¿Por qué cayó? Porque falló el punto de anclaje.', es_correcto: 'SI', pista: 'Sigue la cadena lógica.', explicacion: 'Paso 1: La falla física.' },
  { etapa: 5, tipo: 'medida', texto: 'Implementar software de gestión de activos', es_correcto: 'SI', pista: 'Control administrativo y técnico.', explicacion: 'Asegura trazabilidad de inspecciones.' },
  { etapa: 5, tipo: 'medida', texto: 'Sancionar al operario accidentado', es_correcto: 'NO', pista: '¿Esto previene futuros casos?', explicacion: 'La sanción no ataca la causa raíz sistémica.' }
];

const EscapeRoomGame = ({ onExit }: { onExit: () => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [stage, setStage] = useState(1);
  const [gameData, setGameData] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [score, setScore] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  useEffect(() => {
    fetch(ESCAPE_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            etapa: parseInt(cols[0]),
            tipo: cols[1],
            texto: cols[2],
            es_correcto: cols[3],
            pista: cols[4],
            explicacion: cols[5]
          };
        }).filter(d => !isNaN(d.etapa));
        setGameData(data.length > 0 ? data : ESCAPE_FALLBACK);
      })
      .catch(() => setGameData(ESCAPE_FALLBACK));
  }, []);

  useEffect(() => {
    if (view === 'GAME') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleUseHint = () => {
    setShowHint(true);
    setTimeLeft(prev => Math.max(0, prev - 30));
  };

  const nextStage = () => {
    setExplanation(null);
    setShowHint(false);
    if (stage < 6) {
      setCompletedStages([...completedStages, stage]);
      setStage(prev => prev + 1);
    } else {
      setScore(timeLeft * 10);
      setView('END');
    }
  };

  if (view === 'INTRO') return <EscapeRoomIntro onStart={() => setView('GAME')} onExit={onExit} />;
  if (view === 'END') return <EscapeRoomEnd score={score} onRestart={() => onExit()} />;

  return (
    <div className="min-h-screen obsidian-table relative overflow-hidden flex flex-col font-sans text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 hex-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-6xl mx-auto w-full h-screen overflow-hidden">
        {/* HUD Superior */}
        <div className="glass-panel-heavy p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-8">
            <button 
              onClick={onExit}
              className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
              title="Salir al Menú"
            >
              <LogOut className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform rotate-180" />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-1">Investigación en curso</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Operación <span className="text-secondary">Causa Raíz</span></h2>
            </div>
            <div className="h-12 w-px bg-white/10 hidden md:block"></div>
            <div className="flex gap-3">
              {[1,2,3,4,5,6].map(s => (
                <div 
                  key={s} 
                  className={`w-10 h-2.5 rounded-full transition-all duration-700 relative overflow-hidden bg-white/5 border border-white/5 ${
                    stage === s ? 'ring-1 ring-secondary/50' : ''
                  }`}
                >
                  <motion.div 
                    initial={false}
                    animate={{ 
                      width: completedStages.includes(s) ? '100%' : stage === s ? '50%' : '0%',
                      backgroundColor: completedStages.includes(s) ? '#10b981' : stage === s ? '#f7be1d' : 'transparent'
                    }}
                    className="h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-secondary opacity-70 mb-1">Tiempo SRT</p>
              <div className="flex items-center gap-3 justify-end">
                <Clock className={`w-6 h-6 ${timeLeft < 300 ? 'text-error-rose animate-pulse' : 'text-white'}`} />
                <span className={`text-4xl font-black tabular-nums ${timeLeft < 300 ? 'text-error-rose' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <button 
              onClick={handleUseHint}
              className="w-14 h-14 bg-white/5 hover:bg-secondary hover:text-charcoal border border-white/10 rounded-xl transition-all flex items-center justify-center group"
              title="Pedir Pista (-30s)"
            >
              <HelpCircle className="w-8 h-8 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>

        {/* Área de Juego Principal */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
          {/* Panel de Información / Dossier */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-[#fdf6e3] text-charcoal font-mono p-8 rounded-sm rotate-[-0.5deg] flex-1 overflow-y-auto custom-scrollbar shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b-8 border-r-8 border-black/10">
              <div className="border-b-2 border-black/20 pb-6 mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Expediente #COR-2026-03</h3>
                  <div className="px-2 py-1 bg-charcoal text-white text-[8px] font-black uppercase tracking-widest">TOP SECRET</div>
                </div>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Protocolo EHS - Investigación de Accidentes</p>
              </div>
              
              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-charcoal/5 rounded flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <p className="leading-tight"><strong>EVENTO:</strong> Caída de altura (3 metros) durante montaje de vigas estructurales.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-charcoal/5 rounded flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4" />
                  </div>
                  <p className="leading-tight"><strong>UBICACIÓN:</strong> Obra Civil "Nuevos Horizontes", Sector B, Córdoba.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-charcoal/5 rounded flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="leading-tight"><strong>ESTADO:</strong> Operario estable, fractura de fémur. Bajo observación médica.</p>
                </div>
                
                <div className="pt-6 border-t border-black/10 mt-8">
                  <p className="font-black text-xs uppercase tracking-widest mb-3 text-charcoal/60">Objetivo Fase {stage}</p>
                  <p className="italic font-medium text-charcoal/80 leading-relaxed bg-black/5 p-4 rounded border-l-4 border-charcoal">
                    {stage === 1 && "Identifica las 3 evidencias físicas críticas que demuestren fallas en el sistema de seguridad."}
                    {stage === 2 && "Analiza los testimonios del personal y detecta las 3 inconsistencias o mentiras."}
                    {stage === 3 && "Clasifica técnicamente los hallazgos entre causas inmediatas y causas básicas."}
                    {stage === 4 && "Aplica la metodología de los '5 Por Qué' para profundizar hasta el origen sistémico."}
                    {stage === 5 && "Define el plan de acción preventivo para mitigar la recurrencia del evento."}
                    {stage === 6 && "Consolida los hallazgos en el reporte oficial de investigación."}
                  </p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="bg-secondary/20 border-l-4 border-secondary p-5 rounded-r-xl shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-secondary" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Pista del Analista</p>
                  </div>
                  <p className="text-sm text-white italic leading-relaxed">
                    {gameData.find(d => d.etapa === stage)?.pista || "Analiza los detalles técnicos con rigor."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panel de Interacción */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-panel-heavy flex-1 rounded-2xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {explanation ? (
                  <motion.div 
                    key="explanation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-emerald-500/30">
                      <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Fase {stage} Validada</h3>
                    <div className="w-16 h-1 bg-emerald-500 mb-8 rounded-full" />
                    <p className="text-white/70 max-w-lg mb-12 leading-relaxed text-lg italic">
                      "{explanation}"
                    </p>
                    <button 
                      onClick={nextStage}
                      className="btn-industrial-orange px-16 py-6 text-black font-headline font-black uppercase tracking-widest text-xl flex items-center gap-4"
                    >
                      SIGUIENTE FASE <ArrowRight className="w-6 h-6" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={`stage-${stage}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <EscapeRoomStageRenderer 
                      stage={stage} 
                      data={gameData.filter(d => d.etapa === stage)} 
                      onComplete={(exp: string) => setExplanation(exp)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EscapeRoomIntro = ({ onStart, onExit }: { onStart: () => void, onExit: () => void }) => (
  <div className="min-h-screen obsidian-table relative overflow-hidden flex items-center justify-center p-6 font-sans text-white">
    {/* Background Elements */}
    <div className="absolute inset-0 hex-grid opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl w-full glass-panel-heavy p-12 rounded-2xl border border-white/10 text-center shadow-2xl relative z-10"
    >
      <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
        <ArrowRight className="rotate-180" size={12} /> Volver al Menú
      </button>

      <div className="mb-10 inline-block p-6 bg-secondary/10 rounded-full border-2 border-secondary/30 shadow-[0_0_30px_rgba(247,190,29,0.2)]">
        <Lock className="w-16 h-16 text-secondary" />
      </div>
      <div className="mb-10">
        <p className="text-secondary font-black uppercase tracking-[0.5em] text-sm mb-2">Protocolo de Emergencia</p>
        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase leading-none">
          ESCAPE ROOM <span className="text-secondary">EHS</span>
        </h1>
        <div className="w-32 h-1.5 bg-secondary mx-auto rounded-full" />
      </div>
      
      <div className="bg-charcoal/60 p-8 rounded-xl border border-white/5 text-left mb-12 space-y-5 font-mono text-sm leading-relaxed relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
        <p className="text-secondary font-black">&gt; INICIANDO PROTOCOLO DE INVESTIGACIÓN...</p>
        <p className="text-white/70">ALERTA: Un operario ha caído desde 3 metros en la obra de Córdoba. La SRT llegará en 45 minutos para una auditoría sorpresa de alto impacto.</p>
        <p className="text-white/70">MISIÓN: Tu objetivo es identificar la causa raíz, analizar testimonios y proponer medidas preventivas antes de que el tiempo expire.</p>
        <p className="text-secondary font-black animate-pulse">&gt; ¿ESTÁS LISTO PARA EL DESAFÍO, OPERADOR?</p>
      </div>

      <button 
        onClick={onStart}
        className="btn-industrial-orange w-full py-8 text-black font-headline font-black uppercase tracking-widest text-2xl"
      >
        COMENZAR INVESTIGACIÓN
      </button>
    </motion.div>
  </div>
);

const EscapeRoomEnd = ({ score, onRestart }: { score: number, onRestart: () => void }) => (
  <div className="min-h-screen obsidian-table relative overflow-hidden flex items-center justify-center p-6 font-sans text-white">
    {/* Background Elements */}
    <div className="absolute inset-0 hex-grid opacity-20" />
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal/50 pointer-events-none" />

    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl w-full glass-panel-heavy p-12 rounded-2xl border border-emerald-500/20 text-center shadow-2xl relative z-10"
    >
      <div className="mb-10 inline-block p-6 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <Unlock className="w-16 h-16 text-emerald-500" />
      </div>
      <div className="mb-12">
        <p className="text-emerald-500 font-black uppercase tracking-[0.5em] text-sm mb-2">Análisis Completado</p>
        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter uppercase">¡CASO CERRADO!</h2>
        <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full" />
      </div>
      
      <div className="bg-charcoal/60 p-10 rounded-xl border border-white/5 mb-12 shadow-inner">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Puntaje de Eficiencia Operativa</p>
        <p className="text-7xl font-black text-secondary tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(247,190,29,0.3)]">
          {score.toString().padStart(4, '0')}
        </p>
      </div>

      <button 
        onClick={onRestart}
        className="btn-industrial-orange w-full py-8 text-black font-headline font-black uppercase tracking-widest text-2xl"
      >
        NUEVA INVESTIGACIÓN
      </button>
    </motion.div>
  </div>
);

const EscapeRoomStageRenderer = ({ stage, data, onComplete }: { stage: number, data: any[], onComplete: (exp: string) => void }) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [inputs, setInputs] = useState(['', '', '', '', '']);
  const [classified, setClassified] = useState<Record<number, string>>({});

  if (stage === 1 || stage === 2) {
    const handleToggle = (idx: number) => {
      if (selected.includes(idx)) {
        setSelected(selected.filter(i => i !== idx));
      } else if (selected.length < 3) {
        setSelected([...selected, idx]);
      }
    };

    const validate = () => {
      const correctIndices = data.map((d, i) => d.es_correcto === 'SI' ? i : null).filter(i => i !== null);
      const isAllCorrect = selected.length === 3 && selected.every(i => correctIndices.includes(i));
      if (isAllCorrect) {
        onComplete(data[0].explicacion);
      } else {
        alert("Algunos elementos seleccionados no son correctos o faltan evidencias.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter flex items-center gap-3">
            {stage === 1 ? <Camera className="w-7 h-7" /> : <User className="w-7 h-7" />}
            {stage === 1 ? "Evidencias del Sitio" : "Declaración del Testigo"}
          </h3>
          <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full">
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Selección: {selected.length}/3</span>
          </div>
        </div>
        
        <div className="flex-1 grid grid-cols-1 gap-4 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className={`p-6 rounded-xl border-2 text-left transition-all relative group overflow-hidden ${
                selected.includes(i) 
                ? 'bg-secondary/10 border-secondary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                  selected.includes(i) 
                  ? 'bg-secondary border-secondary text-charcoal' 
                  : 'border-white/20 bg-charcoal/50'
                }`}>
                  {selected.includes(i) && <CheckCircle2 className="w-5 h-5" />}
                </div>
                <p className="font-mono text-sm leading-relaxed uppercase tracking-tight">{item.texto}</p>
              </div>
              {selected.includes(i) && (
                <motion.div 
                  layoutId="active-bg"
                  className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>
        <button 
          disabled={selected.length < 3}
          onClick={validate}
          className="btn-industrial-orange mt-8 w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl disabled:opacity-30 disabled:cursor-not-allowed"
        >
          VALIDAR HALLAZGOS
        </button>
      </div>
    );
  }

  if (stage === 3) {
    const handleClassify = (idx: number, type: string) => {
      setClassified({ ...classified, [idx]: type });
    };

    const validate = () => {
      const allCorrect = data.every((d, i) => classified[i] === d.tipo);
      if (allCorrect && Object.keys(classified).length === data.length) {
        onComplete("Análisis técnico validado. Has separado correctamente los síntomas de las fallas sistémicas.");
      } else {
        alert("La clasificación técnica presenta errores. Revisa la lógica de causalidad.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <Zap className="w-7 h-7" /> Clasificación de Causas
        </h3>
        <div className="flex-1 space-y-6 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
              <p className="font-mono text-sm mb-6 text-white uppercase tracking-tight leading-relaxed border-l-2 border-secondary pl-4">{item.texto}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleClassify(i, 'causa_inmediata')}
                  className={`flex-1 py-4 rounded-lg border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                    classified[i] === 'causa_inmediata' 
                    ? 'bg-error-rose/20 border-error-rose text-error-rose shadow-[0_0_15px_rgba(244,63,94,0.2)]' 
                    : 'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  Causa Inmediata
                </button>
                <button 
                  onClick={() => handleClassify(i, 'causa_basica')}
                  className={`flex-1 py-4 rounded-lg border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                    classified[i] === 'causa_basica' 
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                    : 'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  Causa Básica
                </button>
              </div>
            </div>
          ))}
        </div>
        <button 
          disabled={Object.keys(classified).length < data.length}
          onClick={validate}
          className="btn-industrial-orange mt-8 w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl disabled:opacity-30 disabled:cursor-not-allowed"
        >
          CONFIRMAR CLASIFICACIÓN
        </button>
      </div>
    );
  }

  if (stage === 4) {
    const validate = () => {
      if (inputs.every(v => v.length > 5)) {
        onComplete("Análisis profundo completado. Has llegado a la falla en el sistema de mantenimiento.");
      } else {
        alert("Completa todos los niveles del análisis con respuestas detalladas.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <HelpCircle className="w-7 h-7" /> Técnica de los 5 Por Qué
        </h3>
        <div className="flex-1 space-y-5 overflow-y-auto pr-4 custom-scrollbar">
          {inputs.map((val, i) => (
            <div key={i} className="flex gap-6 items-start group">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary font-black flex-shrink-0 shadow-lg group-hover:bg-secondary group-hover:text-charcoal transition-all">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-white/40 mb-2 tracking-widest">Nivel de Causalidad {i + 1}</p>
                <input 
                  type="text"
                  placeholder="¿Por qué ocurrió esto?"
                  value={val}
                  onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[i] = e.target.value;
                    setInputs(newInputs);
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/20 focus:border-secondary focus:bg-white/10 outline-none transition-all font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={validate}
          className="btn-industrial-orange mt-8 w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl"
        >
          VALIDAR ANÁLISIS
        </button>
      </div>
    );
  }

  if (stage === 5) {
    const handleToggle = (idx: number) => {
      if (selected.includes(idx)) {
        setSelected(selected.filter(i => i !== idx));
      } else {
        setSelected([...selected, idx]);
      }
    };

    const validate = () => {
      const correctIndices = data.map((d, i) => d.es_correcto === 'SI' ? i : null).filter(i => i !== null);
      const hasCorrect = selected.every(i => correctIndices.includes(i));
      const hasTrap = selected.some(i => data[i].es_correcto === 'NO');
      
      if (hasCorrect && !hasTrap && selected.length > 0) {
        onComplete("Plan de acción validado. Estas medidas previenen la recurrencia.");
      } else if (hasTrap) {
        alert("Has seleccionado una medida 'trampa' que no ataca la causa raíz.");
      } else {
        alert("Selecciona las medidas preventivas correctas.");
      }
    };

    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <ShieldCheck className="w-7 h-7" /> Plan de Acción Preventivo
        </h3>
        <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
          {data.map((item, i) => (
            <button
              key={i}
              onClick={() => handleToggle(i)}
              className={`p-6 rounded-xl border-2 text-left transition-all w-full relative group overflow-hidden ${
                selected.includes(i) 
                ? 'bg-secondary/10 border-secondary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${selected.includes(i) ? 'bg-secondary border-secondary text-charcoal' : 'border-white/20'}`}>
                  {selected.includes(i) && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <p className="font-mono text-sm leading-relaxed uppercase tracking-tight">{item.texto}</p>
              </div>
            </button>
          ))}
        </div>
        <button 
          onClick={validate}
          className="btn-industrial-orange mt-8 w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl"
        >
          APROBAR PLAN
        </button>
      </div>
    );
  }

  if (stage === 6) {
    return (
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-black text-secondary uppercase tracking-tighter mb-8 flex items-center gap-3">
          <FileText className="w-7 h-7" /> Informe de Investigación Final
        </h3>
        <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-secondary tracking-widest">Resumen del Hallazgo</span>
              <textarea 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white font-mono text-sm h-32 focus:border-secondary focus:bg-white/10 outline-none transition-all resize-none"
                placeholder="Describe brevemente los hallazgos principales..."
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-secondary tracking-widest">Causa Raíz Identificada</span>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white font-mono text-sm focus:border-secondary focus:bg-white/10 outline-none transition-all"
                placeholder="Ej: Falla en el protocolo de mantenimiento preventivo..."
              />
            </div>
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-500/80 italic leading-relaxed">
                "Al firmar este informe, confirmo que la investigación se realizó bajo los estándares de la Ley 19587 y los protocolos internos de EHS."
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onComplete("Informe enviado con éxito. La SRT ha validado tu investigación.")}
          className="btn-industrial-orange mt-8 w-full py-6 text-black font-headline font-black uppercase tracking-widest text-xl"
        >
          FIRMAR Y ENVIAR INFORME
        </button>
      </div>
    );
  }

  return null;
};

// --- COMPONENTES DE MEMORY PREVENTIVO ---

const MEMORY_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1346735467&single=true&output=csv';

const MEMORY_FALLBACK = [
  { emoji: '🦺', descripcion: 'Uso obligatorio de chaleco', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M015', desc_larga: 'El chaleco de alta visibilidad es obligatorio para ser visto en zonas de tránsito vehicular o maquinaria.' },
  { emoji: '🥽', descripcion: 'Protección ocular obligatoria', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M004', desc_larga: 'Protege tus ojos de proyecciones, chispas o químicos mediante el uso de gafas certificadas.' },
  { emoji: '🎧', descripcion: 'Protección auditiva obligatoria', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M003', desc_larga: 'En zonas con ruido superior a 85dB, el uso de protectores es vital para evitar hipoacusia.' },
  { emoji: '🧤', descripcion: 'Uso de guantes de seguridad', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M009', desc_larga: 'Protege tus manos de cortes, abrasiones o contacto térmico según el riesgo específico.' },
  { emoji: '🥾', descripcion: 'Calzado de seguridad obligatorio', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M008', desc_larga: 'Botas con puntera de acero y suela antideslizante para evitar aplastamientos y caídas.' },
  { emoji: '😷', descripcion: 'Protección respiratoria obligatoria', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M016', desc_larga: 'Uso de mascarilla o respirador en ambientes con polvos, humos o vapores tóxicos.' },
  { emoji: '🚭', descripcion: 'Prohibido fumar', tipo_señal: 'Prohibición', color_fondo: '#d71920', norma: 'ISO 7010-P002', desc_larga: 'Prohibición absoluta de fumar para evitar incendios y proteger la salud en el ambiente laboral.' },
  { emoji: '🚫', descripcion: 'Prohibido el paso', tipo_señal: 'Prohibición', color_fondo: '#d71920', norma: 'ISO 7010-P001', desc_larga: 'Zona restringida. Solo personal autorizado puede ingresar a esta área de trabajo.' },
  { emoji: '🔥', descripcion: 'Riesgo de incendio', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W021', desc_larga: 'Presencia de materiales inflamables. Mantener alejado de fuentes de calor o chispas.' },
  { emoji: '⚡', descripcion: 'Riesgo eléctrico', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W012', desc_larga: 'Peligro de electrocución. No manipular tableros sin la debida capacitación y EPP.' },
  { emoji: '💀', descripcion: 'Sustancias tóxicas', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W016', desc_larga: 'Peligro de muerte por ingestión, inhalación o contacto con químicos altamente peligrosos.' },
  { emoji: '☢️', descripcion: 'Radiación ionizante', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W003', desc_larga: 'Zona con presencia de fuentes radiactivas. Seguir protocolos de tiempo, distancia y blindaje.' },
  { emoji: '🩹', descripcion: 'Primeros auxilios', tipo_señal: 'Salvamento', color_fondo: '#008a44', norma: 'ISO 7010-E003', desc_larga: 'Ubicación del botiquín o estación de primeros auxilios para atención inmediata.' },
  { emoji: '🏃', descripcion: 'Ruta de evacuación', tipo_señal: 'Salvamento', color_fondo: '#008a44', norma: 'ISO 7010-E001', desc_larga: 'Dirección de salida segura en caso de emergencia. Mantener siempre despejada.' },
  { emoji: '🧯', descripcion: 'Extintor de incendios', tipo_señal: 'Incendio', color_fondo: '#d71920', norma: 'ISO 7010-F001', desc_larga: 'Ubicación del equipo de extinción manual. Verificar carga y acceso libre.' },
  { emoji: '🪜', descripcion: 'Riesgo de caídas', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W008', desc_larga: 'Peligro de caída a distinto nivel. Uso obligatorio de arnés por encima de 1.8 metros.' },
  { emoji: '👷', descripcion: 'Casco obligatorio', tipo_señal: 'Obligación', color_fondo: '#0054a6', norma: 'ISO 7010-M001', desc_larga: 'Protección craneal contra impactos, caída de objetos y riesgos eléctricos.' },
  { emoji: '☣️', descripcion: 'Riesgo biológico', tipo_señal: 'Advertencia', color_fondo: '#ffcc00', norma: 'ISO 7010-W009', desc_larga: 'Presencia de agentes biológicos patógenos. Seguir protocolos de bioseguridad.' },
  { emoji: '🚿', descripcion: 'Ducha de emergencia', tipo_señal: 'Salvamento', color_fondo: '#008a44', norma: 'ISO 7010-E012', desc_larga: 'Uso inmediato en caso de salpicaduras químicas en el cuerpo o ropa.' },
  { emoji: '👁️', descripcion: 'Lavaojos de emergencia', tipo_señal: 'Salvamento', color_fondo: '#008a44', norma: 'ISO 7010-E011', desc_larga: 'Estación para lavado ocular rápido tras contacto con sustancias irritantes.' }
];

const MemoryGame = ({ onExit }: { onExit: () => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [players, setPlayers] = useState([{ id: 1, name: 'Operador 1', score: 0, turns: 0 }]);
  const [difficulty, setDifficulty] = useState(6);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [gameData, setGameData] = useState<any[]>([]);
  const [showMatchInfo, setShowMatchInfo] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch(MEMORY_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            emoji: cols[0],
            descripcion: cols[1],
            tipo_señal: cols[2],
            color_fondo: cols[3],
            norma: cols[4],
            desc_larga: cols[5]
          };
        }).filter(d => d.emoji);
        setGameData(data.length >= 6 ? data : MEMORY_FALLBACK);
      })
      .catch(() => setGameData(MEMORY_FALLBACK));
  }, []);

  const startGame = () => {
    const selectedData = shuffle([...gameData]).slice(0, difficulty);
    const gameCards: any[] = [];
    
    selectedData.forEach((item, idx) => {
      gameCards.push({
        id: `A-${idx}`,
        pairId: idx,
        type: 'visual',
        content: item.emoji,
        bgColor: item.color_fondo,
        signalType: item.tipo_señal,
        data: item
      });
      gameCards.push({
        id: `B-${idx}`,
        pairId: idx,
        type: 'text',
        content: item.descripcion,
        norm: item.norma,
        bgColor: '#ffffff',
        data: item
      });
    });

    setCards(shuffle(gameCards));
    setFlipped([]);
    setMatched([]);
    setCurrentPlayerIdx(0);
    setPlayers(players.map(p => ({ ...p, score: 0, turns: 0 })));
    setView('GAME');
  };

  const handleCardClick = (cardIdx: number) => {
    if (isProcessing || flipped.includes(cardIdx) || matched.includes(cardIdx)) return;

    const newFlipped = [...flipped, cardIdx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      const newPlayers = [...players];
      newPlayers[currentPlayerIdx].turns += 1;
      setPlayers(newPlayers);

      if (firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setMatched([...matched, firstIdx, secondIdx]);
          setFlipped([]);
          setShowMatchInfo(firstCard.data);
          
          const updatedPlayers = [...players];
          updatedPlayers[currentPlayerIdx].score += 1;
          setPlayers(updatedPlayers);

          setTimeout(() => {
            setShowMatchInfo(null);
            setIsProcessing(false);
            if (matched.length + 2 === cards.length) {
              setView('END');
            }
          }, 1500);
        }, 500);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setCurrentPlayerIdx((currentPlayerIdx + 1) % players.length);
          setIsProcessing(false);
        }, 1500);
      }
    }
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { id: players.length + 1, name: `Operador ${players.length + 1}`, score: 0, turns: 0 }]);
    }
  };

  const removePlayer = () => {
    if (players.length > 1) {
      setPlayers(players.slice(0, -1));
    }
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
  };

  if (view === 'INTRO') return (
    <MemoryIntro 
      players={players} 
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      addPlayer={addPlayer}
      removePlayer={removePlayer}
      updatePlayerName={updatePlayerName}
      onStart={startGame} 
      onExit={onExit}
    />
  );

  if (view === 'END') return (
    <MemoryEnd 
      players={players} 
      onRestart={() => setView('INTRO')} 
    />
  );

  return (
    <div className="flex-1 obsidian-table flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      
      {/* HUD Superior */}
      <div className="glass-panel-heavy p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-tertiary/30 relative z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
            title="Salir al Menú"
          >
            <LogOut className="w-5 h-5 text-tertiary group-hover:scale-110 transition-transform rotate-180" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-tertiary">Entrenamiento ISO 45001</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Memory Preventivo</h2>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block"></div>
          <div className="flex gap-4">
            {players.map((p, idx) => (
              <div 
                key={p.id} 
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  currentPlayerIdx === idx 
                  ? 'bg-tertiary/20 border-tertiary scale-105 shadow-[0_0_15px_rgba(247,190,29,0.2)]' 
                  : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <p className="text-[8px] font-black uppercase text-tertiary">{p.name}</p>
                <p className="text-xl font-black text-white">{p.score} <span className="text-[10px] opacity-50">PARES</span></p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-tertiary">Progreso</p>
            <p className="text-2xl font-mono font-bold text-white">
              {matched.length / 2} / {difficulty}
            </p>
          </div>
          <button 
            onClick={() => setView('INTRO')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group"
          >
            <RotateCcw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* Grilla de Cartas */}
      <div className={`flex-1 grid gap-4 ${
        difficulty === 6 ? 'grid-cols-3 md:grid-cols-4' : 
        difficulty === 12 ? 'grid-cols-4 md:grid-cols-6' : 
        'grid-cols-5 md:grid-cols-8'
      } content-center overflow-y-auto pr-2 custom-scrollbar relative z-10`}>
        {cards.map((card, idx) => (
          <MemoryCard 
            key={card.id}
            card={card}
            isFlipped={flipped.includes(idx)}
            isMatched={matched.includes(idx)}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>

      <AnimatePresence>
        {showMatchInfo && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
          >
            <div className="glass-panel-heavy p-6 rounded-3xl border-2 border-emerald-500 shadow-2xl flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-lg border-2 border-white/10"
                style={{ backgroundColor: showMatchInfo.color_fondo }}
              >
                {showMatchInfo.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">¡PAR ENCONTRADO!</span>
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 leading-none">{showMatchInfo.descripcion}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed italic opacity-80">
                  {showMatchInfo.desc_larga}
                </p>
                <div className="mt-3 flex gap-2">
                   <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-widest">{showMatchInfo.norma}</span>
                   <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-widest">{showMatchInfo.tipo_señal}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MemoryCard = ({ card, isFlipped, isMatched, onClick }: any) => {
  return (
    <div 
      className="relative aspect-[3/4] cursor-pointer group"
      onClick={onClick}
      style={{ perspective: '1000px' }}
    >
      <motion.div 
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (Hidden) */}
        <div 
          className="absolute inset-0 obsidian-table border-2 border-white/10 rounded-xl flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="absolute inset-0 bg-hex-grid opacity-20"></div>
          <Shield className="w-12 h-12 text-white/5 group-hover:text-tertiary/20 transition-colors" />
          <div className="absolute inset-2 border border-white/5 rounded-lg"></div>
          <div className="absolute bottom-2 right-2 opacity-20">
            <span className="text-[8px] font-black text-white uppercase tracking-widest">STITCH_OS</span>
          </div>
        </div>

        {/* Back (Revealed) */}
        <div 
          className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-4 border-4 ${
            isMatched ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/20'
          }`}
          style={{ 
            backfaceVisibility: 'hidden', 
            rotateY: '180deg',
            backgroundColor: card.bgColor 
          }}
        >
          {card.type === 'visual' ? (
            <>
              <span className="text-5xl md:text-6xl mb-4 drop-shadow-lg">{card.content}</span>
              <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap">
                  {card.signalType}
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
              <p className="text-charcoal font-black text-sm leading-tight mb-2 uppercase tracking-tighter relative z-10">
                {card.content}
              </p>
              <div className="h-px w-8 bg-charcoal/10 mb-2 relative z-10"></div>
              <p className="text-[10px] font-mono font-bold text-charcoal/60 relative z-10">
                {card.norm}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const MemoryIntro = ({ players, difficulty, setDifficulty, addPlayer, removePlayer, updatePlayerName, onStart, onExit }: any) => (
  <div className="h-screen obsidian-table flex items-center justify-center p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal pointer-events-none"></div>
    
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl w-full glass-panel-heavy p-12 rounded-[3rem] border border-tertiary/20 shadow-2xl relative z-10"
    >
      <button onClick={onExit} className="text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 transition-opacity">
        <ArrowRight className="rotate-180" size={12} /> Volver al Menú
      </button>
      <div className="text-center mb-12">
        <div className="mb-6 inline-block p-4 bg-tertiary/10 rounded-full border-2 border-tertiary/30">
          <LayoutGrid className="w-12 h-12 text-tertiary" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase leading-none">
          MEMORY <span className="text-tertiary">PREVENTIVO</span>
        </h1>
        <p className="text-tertiary font-black uppercase tracking-[0.4em] text-xs">Señalética ISO 45001 / 7010</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-tertiary" /> Operadores
            </h3>
            <div className="flex gap-2">
              <button onClick={removePlayer} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white font-black transition-colors">-</button>
              <button onClick={addPlayer} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white font-black transition-colors">+</button>
            </div>
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {players.map((p: any) => (
              <div key={p.id} className="flex gap-4 items-center bg-black/20 p-4 rounded-xl border border-white/5 group hover:border-tertiary/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-tertiary/20 flex items-center justify-center text-tertiary font-black text-xs">
                  {p.id}
                </div>
                <input 
                  type="text" 
                  value={p.name}
                  onChange={(e) => updatePlayerName(p.id, e.target.value)}
                  className="bg-transparent border-b border-white/10 focus:border-tertiary outline-none text-white font-bold flex-1 transition-colors"
                  placeholder="Nombre del Operador"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-tertiary" /> Nivel de Entrenamiento
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { val: 6, label: 'FÁCIL', desc: '6 Pares - Entrenamiento Básico' },
              { val: 12, label: 'MEDIO', desc: '12 Pares - Operador Calificado' },
              { val: 20, label: 'DIFÍCIL', desc: '20 Pares - Experto en Seguridad' }
            ].map(d => (
              <button 
                key={d.val}
                onClick={() => setDifficulty(d.val)}
                className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                  difficulty === d.val 
                  ? 'bg-tertiary/20 border-tertiary shadow-[0_0_15px_rgba(247,190,29,0.1)]' 
                  : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'
                }`}
              >
                <div className="relative z-10">
                  <p className="text-xs font-black text-tertiary mb-1 uppercase tracking-widest">{d.label}</p>
                  <p className="text-white font-bold tracking-tight">{d.desc}</p>
                </div>
                {difficulty === d.val && (
                  <motion.div 
                    layoutId="difficulty-active"
                    className="absolute inset-0 bg-tertiary/5"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="mt-12 w-full py-6 btn-industrial-orange text-charcoal font-headline font-black rounded-sm block-shadow hover:translate-y-[-4px] active:translate-y-0 transition-all uppercase tracking-widest text-2xl"
      >
        Iniciar Jornada
      </button>
    </motion.div>
  </div>
);

const MemoryEnd = ({ players, onRestart }: any) => {
  const sorted = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.turns - b.turns;
  });

  return (
    <div className="h-screen obsidian-table flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full glass-panel-heavy p-12 rounded-[3rem] border border-emerald-500/20 text-center shadow-2xl relative z-10"
      >
        <div className="mb-8 inline-block p-4 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30">
          <Trophy className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase leading-none">¡ENTRENAMIENTO COMPLETADO!</h2>
        <p className="text-on-surface-variant font-black uppercase tracking-[0.4em] text-[10px] mb-12 opacity-60">Resultados de la Auditoría</p>
        
        <div className="space-y-4 mb-12 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {sorted.map((p, idx) => (
            <div 
              key={p.id} 
              className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                idx === 0 
                ? 'bg-tertiary/20 border-tertiary scale-105 shadow-[0_0_20px_rgba(247,190,29,0.2)]' 
                : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-black ${idx === 0 ? 'text-tertiary' : 'text-white/40'}`}>{idx + 1}°</span>
                <div className="text-left">
                  <p className="text-white font-black uppercase tracking-tight">{p.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase opacity-60">{p.turns} turnos realizados</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white leading-none">{p.score}</p>
                <p className="text-[10px] text-tertiary font-black uppercase tracking-widest">PARES</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onRestart}
          className="w-full py-6 btn-industrial-orange text-charcoal font-headline font-black rounded-sm block-shadow hover:translate-y-[-4px] transition-all uppercase tracking-widest text-xl"
        >
          Nueva Partida
        </button>
      </motion.div>
    </div>
  );
};

// --- COMPONENTES DE PREVENWORDLE ---

const WORDLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=392450905&single=true&output=csv';

const WORDLE_FALLBACK = [
  { palabra: 'CASCO', definicion: 'Elemento de protección personal para la cabeza.', categoria: 'EPP', dificultad: 'Fácil', referencia: 'ISO 3873' },
  { palabra: 'ARNÉS', definicion: 'Sistema de sujeción para trabajos en altura.', categoria: 'Alturas', dificultad: 'Fácil', referencia: 'ANSI Z359' },
  { palabra: 'RIESGO', definicion: 'Combinación de probabilidad y severidad de un evento.', categoria: 'Gestión', dificultad: 'Fácil', referencia: 'ISO 45001' },
  { palabra: 'PELIGRO', definicion: 'Fuente con potencial de causar daño o deterioro.', categoria: 'Gestión', dificultad: 'Fácil', referencia: 'ISO 45001' },
  { palabra: 'GUANTE', definicion: 'Protección para las manos contra diversos riesgos.', categoria: 'EPP', dificultad: 'Fácil', referencia: 'EN 388' },
  { palabra: 'LENTES', definicion: 'Protección ocular contra impactos o salpicaduras.', categoria: 'EPP', dificultad: 'Fácil', referencia: 'ANSI Z87.1' },
  { palabra: 'BOTAS', definicion: 'Calzado de seguridad con puntera reforzada.', categoria: 'EPP', dificultad: 'Fácil', referencia: 'ISO 20345' },
  { palabra: 'RUIDO', definicion: 'Sonido no deseado que puede causar hipoacusia.', categoria: 'Higiene', dificultad: 'Fácil', referencia: 'ISO 1999' },
  { palabra: 'FUEGO', definicion: 'Reacción química de combustión con luz y calor.', categoria: 'Incendio', dificultad: 'Fácil', referencia: 'NFPA 10' },
  { palabra: 'SALUD', definicion: 'Estado de completo bienestar físico y mental.', categoria: 'Medicina', dificultad: 'Fácil', referencia: 'OMS' },
  { palabra: 'INCIDENTE', definicion: 'Suceso que surge del trabajo sin causar lesiones.', categoria: 'Gestión', dificultad: 'Medio', referencia: 'ISO 45001' },
  { palabra: 'ACCIDENTE', definicion: 'Suceso repentino que causa lesión o muerte.', categoria: 'Gestión', dificultad: 'Medio', referencia: 'Ley 19587' },
  { palabra: 'ERGONOMÍA', definicion: 'Adaptación del trabajo a las capacidades humanas.', categoria: 'Ergonomía', dificultad: 'Medio', referencia: 'ISO 6385' },
  { palabra: 'EXTINTOR', definicion: 'Equipo portátil para combatir fuegos incipientes.', categoria: 'Incendio', dificultad: 'Medio', referencia: 'NFPA 10' },
  { palabra: 'ANDAMIO', definicion: 'Estructura provisional para trabajos en altura.', categoria: 'Alturas', dificultad: 'Medio', referencia: 'OSHA 1926' },
  { palabra: 'QUÍMICO', definicion: 'Sustancia con propiedades que pueden ser nocivas.', categoria: 'SGA', dificultad: 'Medio', referencia: 'SGA/GHS' },
  { palabra: 'BRIGADA', definicion: 'Grupo de personas capacitadas para emergencias.', categoria: 'Emergencias', dificultad: 'Medio', referencia: 'NFPA 600' },
  { palabra: 'PERMISO', definicion: 'Autorización escrita para tareas de alto riesgo.', categoria: 'Gestión', dificultad: 'Medio', referencia: 'ISO 45001' },
  { palabra: 'BLOQUEO', definicion: 'Control de energías peligrosas (LOTO).', categoria: 'Mecánico', dificultad: 'Medio', referencia: 'OSHA 1910.147' },
  { palabra: 'DERRAME', definicion: 'Escape accidental de sustancias líquidas.', categoria: 'Ambiente', dificultad: 'Medio', referencia: 'ISO 14001' },
  { palabra: 'PREVENCIÓN', definicion: 'Acción de anticiparse para evitar un daño.', categoria: 'Gestión', dificultad: 'Difícil', referencia: 'ISO 45001' },
  { palabra: 'PROTECCIÓN', definicion: 'Medidas para reducir las consecuencias de un riesgo.', categoria: 'Gestión', dificultad: 'Difícil', referencia: 'ISO 45001' },
  { palabra: 'BIOSEGURIDAD', definicion: 'Control de riesgos por agentes biológicos.', categoria: 'Higiene', dificultad: 'Difícil', referencia: 'OMS' },
  { palabra: 'TOXICIDAD', definicion: 'Capacidad de una sustancia de causar daño.', categoria: 'SGA', dificultad: 'Difícil', referencia: 'SGA/GHS' },
  { palabra: 'AUDITORÍA', definicion: 'Proceso sistemático para evaluar cumplimiento.', categoria: 'Gestión', dificultad: 'Difícil', referencia: 'ISO 19011' },
  { palabra: 'ESTÁNDAR', definicion: 'Nivel de referencia para realizar una tarea.', categoria: 'Gestión', dificultad: 'Difícil', referencia: 'ISO 45001' },
  { palabra: 'CONFINADO', definicion: 'Espacio con entradas y salidas limitadas.', categoria: 'Espacios', dificultad: 'Difícil', referencia: 'OSHA 1910.146' },
  { palabra: 'RADIACIÓN', definicion: 'Emisión de energía en forma de ondas o partículas.', categoria: 'Higiene', dificultad: 'Difícil', referencia: 'IAEA' },
  { palabra: 'VIBRACIÓN', definicion: 'Movimiento oscilatorio que afecta al trabajador.', categoria: 'Higiene', dificultad: 'Difícil', referencia: 'ISO 5349' },
  { palabra: 'PSICOSOCIAL', definicion: 'Factores del trabajo que afectan la salud mental.', categoria: 'Psicología', dificultad: 'Difícil', referencia: 'ISO 45003' }
];

const WordleGame = ({ onExit }: { onExit: () => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME'>('INTRO');
  const [mode, setMode] = useState<'DAILY' | 'FREE'>('DAILY');
  const [wordData, setWordData] = useState<any>(null);
  const [allWords, setAllWords] = useState<any[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [shakeRow, setShakeRow] = useState(-1);
  const [stats, setStats] = useState({
    played: 0,
    won: 0,
    streak: 0,
    maxStreak: 0,
    distribution: [0, 0, 0, 0, 0, 0]
  });
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem('prevenwordle_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    fetch(WORDLE_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const data = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            palabra: cols[0]?.toUpperCase(),
            definicion: cols[1],
            categoria: cols[2],
            dificultad: cols[3],
            referencia: cols[4],
            fecha: cols[5]
          };
        }).filter(d => d.palabra);
        setAllWords(data.length > 0 ? data : WORDLE_FALLBACK);
      })
      .catch(() => setAllWords(WORDLE_FALLBACK));
  }, []);

  const selectWord = (selectedMode: 'DAILY' | 'FREE') => {
    if (allWords.length === 0) return;

    let target;
    if (selectedMode === 'DAILY') {
      const today = new Date().toISOString().split('T')[0];
      target = allWords.find(w => w.fecha === today);
      if (!target) {
        const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        target = allWords[hash % allWords.length];
      }
    } else {
      target = allWords[Math.floor(Math.random() * allWords.length)];
    }

    setWordData(target);
    setGuesses([]);
    setCurrentGuess('');
    setGameState('PLAYING');
    setMode(selectedMode);
    setView('GAME');
  };

  const onKeyPress = (key: string) => {
    if (gameState !== 'PLAYING') return;

    if (key === 'ENTER') {
      if (currentGuess.length !== wordData.palabra.length) {
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(-1), 500);
        return;
      }

      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      setCurrentGuess('');

      if (currentGuess === wordData.palabra) {
        setGameState('WON');
        updateStats(true, newGuesses.length);
      } else if (newGuesses.length === 6) {
        setGameState('LOST');
        updateStats(false, 0);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < wordData.palabra.length && /^[A-ZÑ]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') onKeyPress('ENTER');
      else if (key === 'BACKSPACE') onKeyPress('BACKSPACE');
      else if (/^[A-ZÑ]$/.test(key)) onKeyPress(key);
    };
    if (view === 'GAME') {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentGuess, guesses, gameState, wordData]);

  const updateStats = (won: boolean, attempts: number) => {
    setStats(prev => {
      const newStats = {
        played: prev.played + 1,
        won: prev.won + (won ? 1 : 0),
        streak: won ? prev.streak + 1 : 0,
        maxStreak: won ? Math.max(prev.maxStreak, prev.streak + 1) : prev.maxStreak,
        distribution: [...prev.distribution]
      };
      if (won) newStats.distribution[attempts - 1]++;
      localStorage.setItem('prevenwordle_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const getLetterStatus = (letter: string, pos: number, guess: string) => {
    const target = wordData.palabra;
    if (target[pos] === letter) return 'correct';
    if (target.includes(letter)) return 'present';
    return 'absent';
  };

  const getKeyStatuses = () => {
    const statuses: any = {};
    guesses.forEach(guess => {
      guess.split('').forEach((letter, i) => {
        const status = getLetterStatus(letter, i, guess);
        if (!statuses[letter] || status === 'correct' || (status === 'present' && statuses[letter] !== 'correct')) {
          statuses[letter] = status;
        }
      });
    });
    return statuses;
  };

  const shareResult = () => {
    const emojiGrid = guesses.map(guess => {
      return guess.split('').map((letter, i) => {
        const status = getLetterStatus(letter, i, guess);
        return status === 'correct' ? '🟩' : status === 'present' ? '🟨' : '⬛';
      }).join('');
    }).join('\n');

    const text = `PrevenWordle ${mode === 'DAILY' ? new Date().toLocaleDateString() : 'Libre'}\n${guesses.length}/6\n\n${emojiGrid}\n\nJuega en: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert('¡Resultado copiado al portapapeles!');
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const keyStatuses = getKeyStatuses();

  if (view === 'INTRO') return (
    <div className="h-screen obsidian-table flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-transparent to-charcoal pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border border-emerald-500/20 text-center space-y-8 relative z-10"
      >
        <div className="p-4 bg-emerald-500/10 rounded-full inline-block border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Shield className="w-12 h-12 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none mb-2">PREVEN<span className="text-emerald-500">WORDLE</span></h2>
          <p className="text-emerald-500/60 font-black uppercase tracking-[0.3em] text-[10px]">Seguridad en cada letra</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => selectWord('DAILY')}
            className="w-full py-6 btn-industrial-orange text-charcoal font-headline font-black rounded-sm block-shadow hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-lg"
          >
            <Calendar className="w-6 h-6" /> RETO DIARIO
          </button>
          <button 
            onClick={() => selectWord('FREE')}
            className="w-full py-6 bg-white/5 border-2 border-white/10 text-white font-headline font-black rounded-sm block-shadow hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-lg"
          >
            <Zap className="w-6 h-6 text-emerald-500" /> MODO LIBRE
          </button>
          <button 
            onClick={onExit}
            className="w-full py-4 text-white/40 font-black uppercase text-xs tracking-widest hover:text-white transition-all mt-4"
          >
            Volver al Menú Principal
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col obsidian-table text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-10 pointer-events-none"></div>
      
      <header className="glass-panel-heavy p-4 flex justify-between items-center border-b border-white/10 relative z-20">
        <div className="flex items-center gap-2">
          <button onClick={onExit} className="p-3 hover:bg-white/5 rounded-xl transition-all group" title="Salir al Menú">
            <LogOut className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform rotate-180" />
          </button>
          <button onClick={() => setShowHelp(true)} className="p-3 hover:bg-white/5 rounded-xl transition-all group">
            <HelpCircle className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
            PREVEN<span className="text-emerald-500">WORDLE</span>
          </h1>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500/60">Protocolo de Identificación</p>
        </div>
        <button onClick={() => setShowStats(true)} className="p-3 hover:bg-white/5 rounded-xl transition-all group">
          <BarChart3 className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div className="grid gap-3 mb-10" style={{ gridTemplateRows: 'repeat(6, 1fr)' }}>
          {[...Array(6)].map((_, rowIndex) => {
            const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : '');
            const isSubmitted = rowIndex < guesses.length;
            return (
              <div key={rowIndex} className={`flex gap-3 ${shakeRow === rowIndex ? 'animate-shake' : ''}`}>
                {[...Array(wordData.palabra.length)].map((_, colIndex) => {
                  const letter = guess[colIndex] || '';
                  const status = isSubmitted ? getLetterStatus(letter, colIndex, guess) : '';
                  return (
                    <motion.div 
                      key={colIndex}
                      initial={false}
                      animate={letter && !isSubmitted ? { scale: [1, 1.1, 1] } : {}}
                      className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-3xl font-black rounded-lg border-2 transition-all duration-500 relative overflow-hidden ${
                        isSubmitted 
                        ? (status === 'correct' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : status === 'present' ? 'bg-amber-500 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-zinc-800 border-zinc-700 opacity-40')
                        : (letter ? 'border-tertiary scale-105 shadow-[0_0_10px_rgba(247,190,29,0.2)]' : 'border-white/10 bg-white/5')
                      }`}
                      style={{ transitionDelay: isSubmitted ? `${colIndex * 150}ms` : '0ms' }}
                    >
                      {isSubmitted && <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>}
                      <span className="relative z-10 drop-shadow-md">{letter}</span>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-lg space-y-2">
          {keyboardRows.map((row, i) => (
            <div key={i} className="flex justify-center gap-1.5">
              {row.map(key => {
                const status = keyStatuses[key];
                const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
                return (
                  <button
                    key={key}
                    onClick={() => onKeyPress(key)}
                    className={`h-14 rounded-lg font-black text-[10px] md:text-xs flex items-center justify-center transition-all uppercase tracking-tighter ${
                      isSpecial ? 'px-4 bg-zinc-700 min-w-[60px]' : 'flex-1 bg-zinc-600'
                    } ${
                      status === 'correct' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : status === 'present' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : status === 'absent' ? 'bg-zinc-900 opacity-30' : 'hover:bg-zinc-500 active:scale-95'
                    }`}
                  >
                    {key === 'BACKSPACE' ? <Delete size={20} /> : key === 'ENTER' ? <CornerDownLeft size={20} /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {gameState !== 'PLAYING' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border-2 border-white/10 text-center relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-2 ${gameState === 'WON' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
                {gameState === 'WON' ? '¡MISIÓN ÉXITO!' : 'MISIÓN FALLIDA'}
              </h2>
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-8 text-left relative overflow-hidden">
                <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
                <p className="text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest">Protocolo Identificado</p>
                <h3 className="text-4xl font-black text-white mb-4 tracking-[0.2em] uppercase leading-none">{wordData.palabra}</h3>
                <div className="h-px w-full bg-white/10 mb-4"></div>
                <p className="text-sm text-white/80 italic mb-6 leading-relaxed">"{wordData.definicion}"</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">{wordData.categoria}</span>
                  <span className="text-[10px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">{wordData.referencia}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={shareResult} className="py-5 bg-white/5 border-2 border-white/10 rounded-sm font-headline font-black flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                  <Share2 size={18} /> COMPARTIR
                </button>
                <button onClick={() => setView('INTRO')} className="py-5 btn-industrial-orange text-charcoal rounded-sm font-headline font-black uppercase tracking-widest text-xs">
                  CONTINUAR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showStats && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border-2 border-white/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
              <button onClick={() => setShowStats(false)} className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-all z-20">
                <X size={24} className="text-white/60" />
              </button>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-10 text-center relative z-10 leading-none">ESTADÍSTICAS <span className="text-emerald-500">OPERATIVAS</span></h3>
              
              <div className="grid grid-cols-4 gap-4 mb-10 text-center relative z-10">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-3xl font-black text-white leading-none mb-1">{stats.played}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Jugadas</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-3xl font-black text-white leading-none mb-1">{stats.played ? Math.round((stats.won/stats.played)*100) : 0}%</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">% Éxito</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-3xl font-black text-white leading-none mb-1">{stats.streak}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Racha</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-3xl font-black text-white leading-none mb-1">{stats.maxStreak}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">Máxima</p>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 text-center">Distribución de Intentos</p>
                {stats.distribution.map((count, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[10px] font-black w-4 text-white/40">{i+1}</span>
                    <div className="flex-1 bg-white/5 h-5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.won ? (count/Math.max(...stats.distribution, 1))*100 : 0}%` }}
                        className="bg-emerald-500 h-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-black text-white">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showHelp && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border-2 border-white/10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
              <button onClick={() => setShowHelp(false)} className="absolute top-6 right-6 p-3 hover:bg-white/10 rounded-full transition-all z-20">
                <X size={24} className="text-white/60" />
              </button>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center relative z-10 leading-none">MANUAL DE <span className="text-emerald-500">OPERACIÓN</span></h3>
              <div className="space-y-6 text-sm text-white/80 relative z-10">
                <p className="leading-relaxed">Identifica la palabra clave de seguridad en 6 intentos. Cada intento debe ser una palabra válida del glosario EHS.</p>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">C</div>
                    <div>
                      <p className="font-black uppercase text-xs text-emerald-500">Posición Correcta</p>
                      <p className="text-xs opacity-60">La letra está en la palabra y en el lugar exacto.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">A</div>
                    <div>
                      <p className="font-black uppercase text-xs text-amber-500">Posición Incorrecta</p>
                      <p className="text-xs opacity-60">La letra está en la palabra pero en otro lugar.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg text-white/40">S</div>
                    <div>
                      <p className="font-black uppercase text-xs text-white/40">No Presente</p>
                      <p className="text-xs opacity-40">La letra no forma parte de la palabra clave.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTES DE JENGA SEGURO ---

const JENGA_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1277101713&single=true&output=csv';

const JENGA_FALLBACK = Array.from({ length: 54 }, (_, i) => {
  const level = i < 18 ? 'Básico' : i < 36 ? 'Medio' : 'Experto';
  const categories = ['EPP', 'Alturas', 'Incendio', 'Ergonomía', 'Gestión', 'Químicos'];
  return {
    numero: i + 1,
    pregunta: `Pregunta de seguridad nivel ${level} #${i + 1}: ¿Cuál es el procedimiento correcto ante un riesgo detectado?`,
    respuesta: `Respuesta para el nivel ${level}.`,
    nivel: level,
    categoria: categories[i % categories.length],
    explicacion: `Explicación técnica detallada sobre la normativa aplicable al nivel ${level}.`
  };
});

const JengaGame = ({ onExit }: { onExit: () => void }) => {
  const [mode, setMode] = useState<'START' | 'PRINT' | 'DIGITAL'>('START');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [answeredIds, setAnsweredIds] = useState(new Set());
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [printFilters, setPrintFilters] = useState({ niveles: ['Básico', 'Medio', 'Experto'], categorias: [] as string[] });

  useEffect(() => {
    fetch(JENGA_SHEETS_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.split('\n').slice(1);
        const parsed = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            numero: parseInt(cols[0]),
            pregunta: cols[1],
            respuesta: cols[2],
            nivel: cols[3],
            categoria: cols[4],
            explicacion: cols[5]
          };
        }).filter(d => !isNaN(d.numero));
        setData(parsed.length > 0 ? parsed : JENGA_FALLBACK);
        setLoading(false);
      })
      .catch(() => {
        setData(JENGA_FALLBACK);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => [...new Set(data.map(d => d.categoria))], [data]);
  const filteredData = useMemo(() => data.filter(d => printFilters.niveles.includes(d.nivel) && (printFilters.categorias.length === 0 || printFilters.categorias.includes(d.categoria))), [data, printFilters]);

  const getLevelColorClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'bg-emerald-500';
      case 'Medio': return 'bg-amber-500';
      case 'Experto': return 'bg-rose-500';
      default: return 'bg-zinc-500';
    }
  };

  const getLevelBorderClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'border-emerald-500/30';
      case 'Medio': return 'border-amber-500/30';
      case 'Experto': return 'border-rose-500/30';
      default: return 'border-white/10';
    }
  };

  const getLevelTextClass = (nivel: string) => {
    switch(nivel) {
      case 'Básico': return 'text-emerald-500';
      case 'Medio': return 'text-amber-500';
      case 'Experto': return 'text-rose-500';
      default: return 'text-white/40';
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-primary-container relative overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-20"></div>
      <div className="relative z-10 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-tertiary border-t-transparent rounded-full mb-6 mx-auto glowing-pulse"
        />
        <h2 className="text-xl font-headline tracking-widest text-tertiary animate-pulse">CARGANDO PROTOCOLOS</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-40 mt-2">Sincronizando Base de Datos Jenga</p>
      </div>
    </div>
  );

  if (mode === 'START') return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-primary-container relative overflow-hidden">
      <div className="absolute inset-0 hex-grid opacity-10"></div>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-7xl font-headline tracking-tighter mb-2">JENGA<span className="text-tertiary">SEGURO</span></h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-[1px] w-12 bg-white/20"></div>
          <p className="text-[10px] font-headline uppercase tracking-[0.5em] text-white/40">Industrial Safety Training System</p>
          <div className="h-[1px] w-12 bg-white/20"></div>
        </div>
      </motion.div>

      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 relative z-10">
        <motion.div 
          initial={{ x: -50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-8 group hover:border-emerald-500/30 transition-all duration-500"
        >
          <div className="p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
            <Printer className="w-12 h-12 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl font-headline mb-3">MODO IMPRESIÓN</h2>
            <p className="text-sm text-white/50 leading-relaxed font-body">Genera etiquetas físicas de alta visibilidad para tu torre Jenga de madera real.</p>
          </div>
          <button 
            onClick={() => setMode('PRINT')} 
            className="w-full py-5 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-xl hard-shadow-sm btn-industrial-orange uppercase tracking-widest text-sm"
          >
            CONFIGURAR ETIQUETAS
          </button>
        </motion.div>

        <motion.div 
          initial={{ x: 50, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-8 group hover:border-amber-500/30 transition-all duration-500"
        >
          <div className="p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
            <Monitor className="w-12 h-12 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-headline mb-3">MODO DIGITAL</h2>
            <p className="text-sm text-white/50 leading-relaxed font-body">Utiliza la interfaz digital proyectada para dinamizar tus talleres grupales.</p>
          </div>
          <button 
            onClick={() => setMode('DIGITAL')} 
            className="w-full py-5 bg-amber-500 text-on-secondary-fixed font-headline font-black rounded-xl hard-shadow-sm btn-industrial-orange uppercase tracking-widest text-sm"
          >
            INICIAR TALLER
          </button>
        </motion.div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onExit} 
        className="mt-16 px-8 py-3 glass-panel-heavy rounded-full text-white/40 font-headline font-black uppercase text-xs tracking-widest hover:text-tertiary hover:border-tertiary/30 transition-all flex items-center gap-3"
      >
        <LogOut size={14} /> Volver al Menú Principal
      </motion.button>
    </div>
  );

  if (mode === 'PRINT') return (
    <div className="min-h-screen bg-primary-container text-on-surface relative overflow-x-hidden">
      <div className="absolute inset-0 hex-grid opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto p-8 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 no-print">
          <button 
            onClick={() => setMode('START')} 
            className="flex items-center gap-3 text-white/40 hover:text-tertiary transition-all uppercase font-headline text-xs tracking-widest"
          >
            <ChevronLeft size={18} /> Volver al Inicio
          </button>
          
          <div className="text-center">
            <h2 className="text-4xl font-headline leading-none mb-2">GENERADOR DE <span className="text-tertiary">ETIQUETAS</span></h2>
            <p className="text-[10px] opacity-40 uppercase tracking-[0.4em] font-headline">Configuración de Activos Físicos</p>
          </div>

          <button 
            onClick={() => window.print()} 
            className="px-10 py-4 bg-tertiary text-on-tertiary font-headline font-black rounded-xl hard-shadow-sm btn-industrial-orange flex items-center gap-3 uppercase text-sm tracking-widest"
          >
            <Printer size={20} /> IMPRIMIR LOTE
          </button>
        </header>

        <div className="grid lg:grid-cols-4 gap-10">
          <aside className="space-y-6 no-print">
            <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xs font-headline uppercase tracking-widest text-tertiary mb-6 flex items-center gap-3">
                <Layers size={16} /> Filtrar Niveles
              </h3>
              <div className="space-y-4">
                {['Básico', 'Medio', 'Experto'].map(lvl => (
                  <label key={lvl} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={printFilters.niveles.includes(lvl)} 
                        onChange={(e) => {
                          const next = e.target.checked ? [...printFilters.niveles, lvl] : printFilters.niveles.filter(n => n !== lvl);
                          setPrintFilters(prev => ({ ...prev, niveles: next }));
                        }} 
                        className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 bg-white/5 checked:bg-tertiary checked:border-tertiary transition-all cursor-pointer" 
                      />
                      <CheckCircle2 size={14} className="absolute text-on-tertiary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm font-headline uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white/10">
              <h3 className="text-xs font-headline uppercase tracking-widest text-tertiary mb-6 flex items-center gap-3">
                <Filter size={16} /> Categorías EHS
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={printFilters.categorias.includes(cat)} 
                        onChange={(e) => {
                          const next = e.target.checked ? [...printFilters.categorias, cat] : printFilters.categorias.filter(c => c !== cat);
                          setPrintFilters(prev => ({ ...prev, categorias: next }));
                        }} 
                        className="peer appearance-none w-5 h-5 rounded-md border-2 border-white/10 bg-white/5 checked:bg-tertiary/60 checked:border-tertiary transition-all cursor-pointer" 
                      />
                      <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-xs font-body opacity-50 group-hover:opacity-100 transition-all">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-3">
              {filteredData.map(item => (
                <div 
                  key={item.numero} 
                  className="bg-white text-black p-6 border-2 border-dashed border-black/20 flex flex-col min-h-[160px] relative overflow-hidden print:break-inside-avoid rounded-sm"
                >
                  <div className="flex-1 border-b-2 border-dashed border-black/10 pb-4 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-4xl font-headline leading-none">#{item.numero}</span>
                      <span 
                        className="text-[9px] font-headline uppercase px-3 py-1 rounded-full border-2 border-black/10" 
                        style={{ backgroundColor: getLevelColorClass(item.nivel).replace('bg-', '') + '22', color: getLevelColorClass(item.nivel).replace('bg-', '') }}
                      >
                        {item.categoria}
                      </span>
                    </div>
                    <p className="text-xs font-bold leading-tight font-body">{item.pregunta}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[9px] font-headline uppercase opacity-40 mb-1">Respuesta Clave:</p>
                      <p className="text-xs font-bold leading-tight font-body">{item.respuesta}</p>
                    </div>
                    <p className="text-[8px] italic leading-tight opacity-60 font-body">{item.explicacion}</p>
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-2 ${getLevelColorClass(item.nivel)}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-primary-container text-on-surface overflow-hidden relative">
      <div className="absolute inset-0 hex-grid opacity-5 pointer-events-none"></div>
      
      <header className="glass-panel-heavy p-6 flex justify-between items-center border-b border-white/10 z-20 relative">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setMode('START')} 
            className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/10 group"
          >
            <ChevronLeft size={24} className="group-hover:text-tertiary transition-colors" />
          </button>
          <button 
            onClick={onExit} 
            className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-white/10 group"
            title="Volver al Menú Principal"
          >
            <LogOut size={24} className="group-hover:text-tertiary transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-headline tracking-tighter leading-none">JENGA<span className="text-tertiary">SEGURO</span></h1>
            <p className="text-[9px] font-headline uppercase tracking-[0.4em] opacity-40 mt-1">Taller Digital Interactivo</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[9px] font-headline uppercase text-emerald-500 tracking-widest mb-1">Correctas</p>
              <p className="text-3xl font-headline leading-none">{score.correct}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-headline uppercase text-rose-500 tracking-widest mb-1">Incorrectas</p>
              <p className="text-3xl font-headline leading-none">{score.incorrect}</p>
            </div>
          </div>
          <button 
            onClick={() => { setScore({ correct: 0, incorrect: 0 }); setAnsweredIds(new Set()); }} 
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 hover:border-tertiary/30 group"
          >
            <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-12 relative overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-3xl h-full flex flex-col-reverse gap-2 py-8">
          {Array.from({ length: 18 }).map((_, rowIdx) => (
            <motion.div 
              key={rowIdx} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIdx * 0.05 }}
              className="flex justify-center gap-2"
            >
              {Array.from({ length: 3 }).map((_, colIdx) => {
                const num = (rowIdx * 3) + colIdx + 1;
                const block = data.find(d => d.numero === num);
                if (!block) return null;
                const isAnswered = answeredIds.has(num);
                return (
                  <button 
                    key={colIdx} 
                    onClick={() => { if(!isAnswered) { setSelectedBlock(block); setRevealAnswer(false); } }}
                    className={`flex-1 h-12 rounded-xl font-headline text-sm transition-all flex items-center justify-center border-2 border-black/20 relative group ${isAnswered ? 'opacity-5 grayscale pointer-events-none' : 'hover:scale-105 hover:z-10 hover:brightness-110 active:scale-95'}`}
                    style={{ backgroundColor: isAnswered ? '#222' : undefined }}
                  >
                    {!isAnswered && (
                      <div className={`absolute inset-0 rounded-xl opacity-80 ${getLevelColorClass(block.nivel)}`}></div>
                    )}
                    <span className="relative z-10 text-on-primary-fixed drop-shadow-md">{num}</span>
                    {!isAnswered && (
                      <div className="absolute inset-0 rounded-xl border-t-2 border-white/30 pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedBlock && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-primary-container/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 40 }}
              className="max-w-4xl w-full glass-panel-heavy p-12 rounded-[4rem] border-2 border-white/10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 hex-grid opacity-10 pointer-events-none"></div>
              
              <button 
                onClick={() => setSelectedBlock(null)} 
                className="absolute top-10 right-10 p-3 hover:bg-white/10 rounded-full transition-all z-20"
              >
                <X size={32} className="text-white/40 hover:text-white" />
              </button>

              <div className="space-y-12 relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-7xl font-headline text-white/10 leading-none">#{selectedBlock.numero}</span>
                    <div className="space-y-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-headline uppercase tracking-[0.2em] border-2 ${getLevelBorderClass(selectedBlock.nivel)} ${getLevelTextClass(selectedBlock.nivel)}`}>
                        Nivel {selectedBlock.nivel}
                      </span>
                      <p className="text-xs font-headline uppercase tracking-widest text-white/40">{selectedBlock.categoria}</p>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-headline leading-[1.1] tracking-tighter normal-case">
                    {selectedBlock.pregunta}
                  </h2>
                </div>

                {revealAnswer ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-10"
                  >
                    <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2 h-full bg-tertiary"></div>
                      <p className="text-[10px] font-headline uppercase tracking-[0.5em] text-tertiary mb-6">Respuesta Técnica Validada</p>
                      <p className="text-2xl font-body font-bold text-white mb-6 leading-relaxed">{selectedBlock.respuesta}</p>
                      <div className="h-[1px] w-full bg-white/10 mb-6"></div>
                      <p className="text-sm italic text-white/50 font-body leading-relaxed">{selectedBlock.explicacion}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, correct: s.correct+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#f7be1d'] }); 
                        }} 
                        className="py-6 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-2xl hard-shadow-sm btn-industrial-orange flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <CheckCircle2 size={24} /> MARCACIÓN CORRECTA
                      </button>
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, incorrect: s.incorrect+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                        }} 
                        className="py-6 bg-rose-500 text-on-primary-fixed font-headline font-black rounded-2xl hard-shadow-sm btn-industrial-orange flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <XCircle size={24} /> MARCACIÓN INCORRECTA
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setRevealAnswer(true)} 
                    className="w-full py-12 bg-white/5 border-2 border-dashed border-white/20 rounded-[2.5rem] text-white/40 font-headline uppercase tracking-[0.5em] hover:bg-white/10 hover:border-tertiary/40 hover:text-tertiary transition-all flex items-center justify-center gap-6 group"
                  >
                    <Zap className="text-tertiary group-hover:scale-125 transition-transform duration-500" size={28} /> 
                    REVELAR PROTOCOLO DE RESPUESTA
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<View>('START');

  // --- TRUCO GAME STATE ---
  const [playerScore, setPlayerScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [playerHand, setPlayerHand] = useState<any[]>([]);
  const [botHand, setBotHand] = useState<any[]>([]);
  const [table, setTable] = useState<{ player: any, bot: any }>({ player: null, bot: null });
  const [message, setMessage] = useState("Iniciando Operación...");
  const [gameStatus, setGameStatus] = useState('dealing'); 
  const [trucoActive, setTrucoActive] = useState(false);
  const [rounds, setRounds] = useState<string[]>([]);
  const [handPoints, setHandPoints] = useState(1);

  useEffect(() => {
    if (view === 'GAME_TRUCO' && gameStatus === 'dealing') startNewHand();
  }, [view, gameStatus]);

  const startNewHand = () => {
    const deck = shuffle([...DECK_BASE]);
    setPlayerHand(deck.slice(0, 3));
    setBotHand(deck.slice(3, 6));
    setTable({ player: null, bot: null });
    setRounds([]);
    setTrucoActive(false);
    setHandPoints(1);
    setMessage("Tu turno, Operador. Evaluá la conducta.");
    setGameStatus('playerTurn');
  };

  const handleIntervenir = () => {
    if (gameStatus !== 'playerTurn') return;
    setMessage("Solicitando Intervención...");
    
    setTimeout(() => {
      const botBestPower = Math.max(...botHand.map(c => c.p));
      const accepts = botBestPower >= 8 || Math.random() > 0.5;

      if (accepts) {
        setTrucoActive(true);
        setHandPoints(2);
        setMessage("¡El Riesgo acepta el desafío! Vale 2 puntos.");
      } else {
        setMessage("El Riesgo evadió la intervención. Ganás la mano.");
        resolveHand('player', 1);
      }
    }, 1000);
  };

  const handleDetener = () => {
    setMessage("Operación Detenida. Te vas al mazo.");
    resolveHand('bot', trucoActive ? 2 : 1);
  };

  const playCard = (cardIndex: number) => {
    if (gameStatus !== 'playerTurn') return;
    
    const card = playerHand[cardIndex];
    const newHand = [...playerHand];
    newHand.splice(cardIndex, 1);
    
    setPlayerHand(newHand);
    setTable(prev => ({ ...prev, player: card }));
    setMessage(`Activaste: ${card.l.replace('\n', ' ')}`);
    setGameStatus('botTurn');

    setTimeout(() => {
      botResponse(card);
    }, 1500);
  };

  const botResponse = (playerCard: any) => {
    let chosenCard;
    const winners = botHand.filter(c => c.p > playerCard.p).sort((a, b) => a.p - b.p);
    
    if (winners.length > 0) {
      chosenCard = winners[0];
    } else {
      chosenCard = [...botHand].sort((a, b) => a.p - b.p)[0];
    }

    const cardIdx = botHand.findIndex(c => c.id === chosenCard.id);
    const newBotHand = [...botHand];
    newBotHand.splice(cardIdx, 1);

    setBotHand(newBotHand);
    setTable(prev => ({ ...prev, bot: chosenCard }));
    setMessage(`El Riesgo responde con: ${chosenCard.l.replace('\n', ' ')}`);
    setGameStatus('resolution');

    setTimeout(() => {
      resolveRound(playerCard, chosenCard);
    }, 1500);
  };

  const resolveRound = (pCard: any, bCard: any) => {
    let winner: string;
    if (pCard.p > bCard.p) winner = 'player';
    else if (bCard.p > pCard.p) winner = 'bot';
    else winner = 'tie';

    const newRounds = [...rounds, winner];
    setRounds(newRounds);

    if (winner === 'player') setMessage("¡Punto para Seguridad!");
    else if (winner === 'bot') setMessage("El Riesgo gana esta vuelta.");
    else setMessage("¡Parda! Empate técnico.");

    const pWins = newRounds.filter(r => r === 'player').length;
    const bWins = newRounds.filter(r => r === 'bot').length;

    setTimeout(() => {
      if (pWins === 2 || (pWins === 1 && newRounds.includes('tie') && newRounds[0] === 'player')) {
        resolveHand('player', handPoints);
      } else if (bWins === 2 || (bWins === 1 && newRounds.includes('tie') && newRounds[0] === 'bot')) {
        resolveHand('bot', handPoints);
      } else if (newRounds.length === 3) {
         if (pWins > bWins) resolveHand('player', handPoints);
         else if (bWins > pWins) resolveHand('bot', handPoints);
         else {
           setMessage("Mano empatada. Sin puntos.");
           setTimeout(() => setGameStatus('dealing'), 2000);
         }
      } else {
        setTable({ player: null, bot: null });
        setGameStatus('playerTurn');
        setMessage("Siguiente vuelta...");
      }
    }, 1500);
  };

  const resolveHand = (winner: string, points: number) => {
    if (winner === 'player') {
      const newScore = playerScore + points;
      setPlayerScore(newScore);
      setMessage(`¡Misión Cumplida! Sumás ${points} puntos.`);
      if (newScore >= 15) setGameStatus('gameOver');
      else setTimeout(() => setGameStatus('dealing'), 2500);
    } else {
      const newScore = botScore + points;
      setBotScore(newScore);
      setMessage(`Accidente Ocurrido. El Riesgo suma ${points} puntos.`);
      if (newScore >= 15) setGameStatus('gameOver');
      else setTimeout(() => setGameStatus('dealing'), 2500);
    }
  };

  const handleExitGame = () => {
    setView('MENU');
    setPlayerScore(0);
    setBotScore(0);
    setGameStatus('dealing');
  };

  // --- RENDER LOGIC ---

  return (
    <div className="bg-primary-container min-h-screen text-on-surface selection:bg-secondary selection:text-on-primary-fixed">
      <AnimatePresence mode="wait">
        {view === 'START' && (
          <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StartScreen onStart={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'MENU' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GameMenu onSelectGame={(id) => {
              if (id === 'truco') setView('GAME_TRUCO');
              if (id === 'oca') setView('GAME_OCA');
              if (id === 'carrera') setView('GAME_CARRERA');
              if (id === 'match') setView('GAME_MATCH');
              if (id === 'escape') setView('GAME_ESCAPE');
              if (id === 'memoria') setView('GAME_MEMORY');
              if (id === 'wordle') setView('GAME_WORDLE');
              if (id === 'jenga') setView('GAME_JENGA');
            }} />
          </motion.div>
        )}

        {view === 'GAME_JENGA' && (
          <motion.div key="jenga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <JengaGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_WORDLE' && (
          <motion.div key="wordle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WordleGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_MEMORY' && (
          <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemoryGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_ESCAPE' && (
          <motion.div key="escape" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EscapeRoomGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_MATCH' && (
          <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MatchGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_CARRERA' && (
          <motion.div key="carrera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CarreraGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_OCA' && (
          <motion.div key="oca" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OcaGame onExit={() => setView('MENU')} />
          </motion.div>
        )}

        {view === 'GAME_TRUCO' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="obsidian-table min-h-screen">
            {gameStatus === 'gameOver' ? (
              <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel-heavy p-12 rounded-2xl border-2 border-secondary shadow-2xl max-w-2xl">
                  <p className="font-headline text-secondary text-xs tracking-[0.4em] uppercase mb-3 animate-hud-pulse">Resultado de la Operación</p>
                  <h1 className="text-5xl font-black mb-4 tracking-tighter text-white uppercase">
                    {playerScore >= 15 ? "¡SEGURIDAD TOTAL!" : "PLANTA BLOQUEADA"}
                  </h1>
                  <p className="text-lg mb-8 text-on-surface-variant">
                    {playerScore >= 15 ? "Has mitigado todos los riesgos de la jornada." : "El riesgo ha superado los protocolos de control."}
                  </p>
                  <div className="flex gap-8 justify-center mb-12">
                    <div className="text-center bg-black/40 border-l-4 border-primary p-6 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Tu Score</p>
                      <p className="text-5xl font-black text-primary drop-shadow-[0_0_8px_rgba(189,202,192,0.5)]">{playerScore}</p>
                    </div>
                    <div className="text-center bg-black/40 border-r-4 border-error p-6 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-error font-bold">Riesgo</p>
                      <p className="text-5xl font-black text-error drop-shadow-[0_0_8px_rgba(255,180,171,0.5)]">{botScore}</p>
                    </div>
                  </div>
                  <button onClick={() => setView('MENU')} className="btn-industrial-orange text-white font-headline font-black text-xl px-12 py-5 rounded-sm flex items-center gap-4 tracking-tighter mx-auto">
                    <span className="material-symbols-outlined text-2xl">dashboard</span>
                    VOLVER AL PANEL
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col h-screen relative overflow-hidden">
                {/* TopAppBar */}
                <header className="fixed top-0 w-full z-50 bg-[#0a1f14]/90 backdrop-blur-md border-b-2 border-primary/20">
                  <div className="flex justify-between items-center px-6 h-16 w-full">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary symbol-3d">precision_manufacturing</span>
                      <h1 className="font-headline tracking-tighter uppercase text-xl font-bold text-secondary">TRUCO SEGURO</h1>
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                      <nav className="flex gap-6 font-headline text-xs tracking-widest uppercase">
                        <span className="text-secondary border-b-2 border-secondary px-2 py-1 cursor-pointer">PLANTA</span>
                        <span className="text-on-surface/50 hover:text-on-surface transition-colors px-2 py-1 cursor-pointer">APUESTAS</span>
                        <span className="text-on-surface/50 hover:text-on-surface transition-colors px-2 py-1 cursor-pointer">SEGURIDAD</span>
                        <span className="text-on-surface/50 hover:text-on-surface transition-colors px-2 py-1 cursor-pointer">BITÁCORA</span>
                      </nav>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={handleExitGame} className="glass-panel-heavy p-2 rounded-lg text-white/50 hover:text-white transition-colors">
                        <LogOut size={18} />
                      </button>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-headline uppercase text-primary tracking-widest leading-none">Operador</p>
                        <p className="font-headline font-bold text-sm text-secondary tracking-tighter">OP-7742</p>
                      </div>
                      <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-surface-container-highest shadow-[0_0_10px_rgba(255,182,144,0.3)]">
                        <img alt="Operator Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIsohKgIZM3xUKL7GlEjr_x_I6f19G5XaV7fEnXfspKlqKS-KaWr9eqnCRabiqVSx98qoChSS2a3Y6Rc_ZmHqH-Hat4T1NW-qiT3hOnw8EJ9skFON9B9zw5ahb99qADyiUs0rgtEyE1Eov6EGw14czxQXsB9mXnYKmB121qZt-o0W6b-n5iDr69gAPKm99q03wrdn53KLPkbfcAIAN8ZsaNRWRf2RWDFwYMB2bsPFaxNXGOKLkT19PIAidc7TfB9ssqPgWUOuDiI91"/>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="pt-24 pb-32 px-6 h-screen flex flex-col items-center justify-between relative">
                  {/* Scoreboard Header */}
                  <div className="w-full max-w-4xl flex justify-between items-stretch gap-4 mb-4">
                    <div className="flex-1 bg-black/40 border-l-4 border-primary p-4 shadow-inner relative group overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-primary mb-1 animate-hud-pulse">Tú (Seguridad)</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-headline font-black text-primary drop-shadow-[0_0_8px_rgba(189,202,192,0.5)]">{playerScore}</span>
                        <span className="text-xs font-label text-primary/60">PUNTOS</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center px-2">
                      <div className="w-[2px] h-12 bg-gradient-to-b from-transparent via-outline-variant to-transparent"></div>
                    </div>
                    <div className="flex-1 bg-black/40 border-r-4 border-error p-4 shadow-inner text-right relative group overflow-hidden">
                      <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-error mb-1 animate-hud-pulse">El Riesgo</p>
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-xs font-label text-error/60">PUNTOS</span>
                        <span className="text-4xl font-headline font-black text-error drop-shadow-[0_0_8px_rgba(255,180,171,0.5)]">{botScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Central Messaging Panel */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-40 w-full max-w-lg px-4 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={message}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="glass-panel-heavy rounded-xl py-10 px-8 text-center border-t border-white/20 shadow-2xl"
                      >
                        <p className="font-headline text-secondary text-xs tracking-[0.4em] uppercase mb-3 animate-hud-pulse">Estado del Proceso</p>
                        <h2 className="font-headline text-3xl font-black text-white tracking-tighter leading-tight drop-shadow-md uppercase">
                          {message}
                        </h2>
                        <div className="mt-6 flex justify-center gap-3">
                          <div className={`h-1.5 w-16 shadow-[0_0_10px_rgba(255,182,144,0.6)] ${trucoActive ? 'bg-secondary' : 'bg-white/20'}`}></div>
                          <div className={`h-1.5 w-6 ${gameStatus === 'playerTurn' ? 'bg-primary' : 'bg-white/20'}`}></div>
                          <div className={`h-1.5 w-6 ${gameStatus === 'botTurn' ? 'bg-error' : 'bg-white/20'}`}></div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Play Area (The Stage) */}
                  <div className="flex-1 w-full flex items-center justify-center gap-8 sm:gap-16">
                    <div className="flex flex-col items-center gap-4">
                      <p className="font-headline text-[10px] uppercase tracking-widest text-primary/40">Tu Jugada</p>
                      <Card card={table.player} styleClass="transform -rotate-3 card-glow" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <p className="font-headline text-[10px] uppercase tracking-widest text-error/40">Respuesta Bot</p>
                      <Card card={table.bot} styleClass="transform rotate-6" />
                    </div>
                  </div>

                  {/* Controls & Hand Area */}
                  <div className="w-full flex flex-col items-center gap-8 relative z-30">
                    {/* Buttons */}
                    <div className="flex gap-8">
                      <button 
                        onClick={handleIntervenir} 
                        disabled={gameStatus !== 'playerTurn' || trucoActive}
                        className="btn-industrial-orange text-white font-headline font-black text-xl px-12 py-5 rounded-sm flex items-center gap-4 tracking-tighter disabled:opacity-30 disabled:grayscale"
                      >
                        <span className="material-symbols-outlined text-2xl">bolt</span>
                        INTERVENIR
                      </button>
                      <button 
                        onClick={handleDetener} 
                        disabled={gameStatus !== 'playerTurn'}
                        className="btn-industrial-red text-white font-headline font-black text-xl px-12 py-5 rounded-sm flex items-center gap-4 tracking-tighter disabled:opacity-30 disabled:grayscale"
                      >
                        <span className="material-symbols-outlined text-2xl">block</span>
                        DETENER
                      </button>
                    </div>

                    {/* Player Hand */}
                    <div className="relative w-full max-w-2xl h-36 flex justify-center items-end">
                      <div className="absolute bottom-[-20%] w-full h-32 bg-secondary/10 blur-[80px] rounded-full"></div>
                      <div className="flex -space-x-10 translate-y-12">
                        {playerHand.map((card, i) => (
                          <Card 
                            key={card.id} 
                            card={card} 
                            onClick={() => playCard(i)} 
                            styleClass={`hover:-translate-y-12 transition-all ${gameStatus === 'playerTurn' ? 'cursor-pointer' : 'opacity-50 grayscale cursor-not-allowed'}`} 
                            style={{ 
                              transform: `rotate(${(i - 1) * 12}deg) translateY(${-Math.abs(i - 1) * 4}px)`,
                              zIndex: i === 1 ? 20 : 10
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </main>

                {/* Decoration HUD Elements */}
                <div className="fixed top-24 left-8 hidden lg:block pointer-events-none">
                  <div className="glass-panel-heavy p-4 rounded-lg border-l-4 border-secondary/50">
                    <p className="font-headline text-[9px] tracking-widest text-secondary uppercase mb-3 animate-hud-pulse">Estado del Sistema</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_5px_currentColor]"></div>
                        <span className="text-[9px] font-label text-primary/80">SECTOR 04: OPERATIVO</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-tertiary shadow-[0_0_5px_currentColor]"></div>
                        <span className="text-[9px] font-label text-primary/80">PRESIÓN: 442.8 PSI</span>
                      </div>
                      <div className="h-[1px] w-full bg-white/10 my-1"></div>
                      <p className="text-[8px] font-mono text-primary/40 leading-tight">SYS_LOG: VALIDATING_ENTITY<br/>STATUS: {gameStatus.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="fixed bottom-24 right-8 hidden lg:block pointer-events-none">
                  <div className="flex flex-col items-end gap-2 opacity-30">
                    <div className="w-32 h-[1px] bg-primary"></div>
                    <p className="font-mono text-[8px] text-primary">CONSOLE_VER: 4.2.0_INDUSTRIAL</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

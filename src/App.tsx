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
  BarChart3, Calendar, Delete, CornerDownLeft, ShieldCheck, Lightbulb,
  Printer, Monitor, Layers, Filter, Download, ChevronLeft, XCircle, ArrowLeft,
  Paperclip, ShieldAlert, Phone, DoorClosed, MapPin, Thermometer, Wind, Heart
} from 'lucide-react';

// --- CONSTANTS & TYPES ---
type View = 'START' | 'MENU' | 'GAME_TRUCO' | 'GAME_OCA' | 'GAME_CARRERA' | 'GAME_MATCH' | 'GAME_ESCAPE' | 'GAME_MEMORY' | 'GAME_MEMORY_V2' | 'GAME_MEMORY_V3' | 'GAME_WORDLE' | 'GAME_JENGA' | 'GAME_DECISIONES' | 'GAME_CAZADOR' | 'GAME_PARE' | 'GAME_PROTOCOLO';

// URLs de configuración (Pega aquí tus links CSV cuando los tengas)
const SITIOS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1753638195&single=true&output=csv'; 
const AREAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=980501442&single=true&output=csv'; 
const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv'; 

let MISSION_OF_THE_WEEK = 'memoria'; 

const GAMES = [
  { id: 'truco', title: 'TRUCO SEGURO', subtitle: 'MISIÓN_01', icon: 'precision_manufacturing', active: true, color: 'bg-emerald-500', level: 'EXPERTO', stats: '42 VIC / 12 RGO', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
  { id: 'match', title: 'CAZA DE RIESGOS', subtitle: 'MISIÓN_02', icon: 'visibility', active: true, color: 'bg-rose-500', level: 'PRINCIPIANTE', stats: '8 VIC / 5 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
  { id: 'oca', title: 'LA OCA', subtitle: 'MISIÓN_03', icon: 'grid_view', active: true, color: 'bg-orange-500', level: 'INTERMEDIO', stats: '15 VIC / 3 RGO', img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800' },
  { id: 'carrera', title: 'CARRERA MENTE', subtitle: 'MISIÓN_04', icon: 'psychology', active: true, color: 'bg-blue-500', level: 'EXPERTO', stats: '22 VIC / 8 RGO', img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800' },
  { id: 'escape', title: 'ESCAPE ROOM', subtitle: 'MISIÓN_05', icon: 'lock_open', active: true, color: 'bg-amber-500', level: 'INTERMEDIO', stats: '10 VIC / 2 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'memoria', title: 'MEMORY PREVENTIVO', subtitle: 'MISIÓN_06', icon: 'brain', active: true, color: 'bg-yellow-500', level: 'PRINCIPIANTE', stats: '30 VIC / 1 RGO', img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800' },
  { id: 'wordle', title: 'PREVENWORDLE', subtitle: 'MISIÓN_07', icon: 'spellcheck', active: true, color: 'bg-emerald-600', level: 'INTERMEDIO', stats: '12 VIC / 4 RGO', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800' },
  { id: 'jenga', title: 'JENGA SEGURO', subtitle: 'MISIÓN_08', icon: 'view_in_ar', active: true, color: 'bg-amber-600', level: 'EXPERTO', stats: '5 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800' },
  { id: 'decisiones', title: 'DECISIONES SEGURAS', subtitle: 'MISIÓN_09', icon: 'fact_check', active: true, color: 'bg-indigo-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
];

// --- JERARQUÍA DE PODER TRUCO ---
const DECK_BASE = [
  { id: 1, n: 1, s: 'Espadas', p: 14, l: 'Paro y\nPido Ayuda', e: '🛑', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 2, n: 1, s: 'Bastos', p: 13, l: 'Reporto Cond.\nInseguras', e: '📢', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 3, n: 7, s: 'Espadas', p: 12, l: 'Equipamiento\nSeguro', e: '🚧', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 4, n: 7, s: 'Oros', p: 11, l: 'Engranaje de\nPrecisión', e: '⚙️', icon: 'token', iconColor: 'text-yellow-600' },
  { id: 5, n: 3, s: 'Espadas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 6, n: 3, s: 'Bastos', p: 10, l: 'Madera\nLOTO-Locked', e: '🪵', icon: 'handyman', iconColor: 'text-emerald-800' },
  { id: 7, n: 3, s: 'Oros', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'token', iconColor: 'text-yellow-600' },
  { id: 8, n: 3, s: 'Copas', p: 10, l: 'Cumplo\nEstándares', e: '📋', icon: 'wine_bar', iconColor: 'text-orange-600' },
  { id: 9, n: 2, s: 'Espadas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 10, n: 2, s: 'Bastos', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 11, n: 2, s: 'Oros', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 12, n: 2, s: 'Copas', p: 9, l: 'Uso Correcto\nde EPP', e: '🦺', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 13, n: 1, s: 'Copas', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 14, n: 1, s: 'Oros', p: 8, l: 'Gemba y\nAuditorías', e: '🔍', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 15, n: 12, s: 'Espadas', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 16, n: 12, s: 'Bastos', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 17, n: 12, s: 'Oros', p: 7, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 18, n: 12, s: 'Copas', p: 7, l: 'Chaleco\nAlta-Vis', e: '🚨', icon: 'wine_bar', iconColor: 'text-orange-600' },
  { id: 19, n: 11, s: 'Espadas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 20, n: 11, s: 'Bastos', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 21, n: 11, s: 'Oros', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 22, n: 11, s: 'Copas', p: 6, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 23, n: 10, s: 'Espadas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'swords', iconColor: 'text-blue-400' },
  { id: 24, n: 10, s: 'Bastos', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 25, n: 10, s: 'Oros', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'token', iconColor: 'text-yellow-400' },
  { id: 26, n: 10, s: 'Copas', p: 5, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 27, n: 7, s: 'Copas', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'wine_bar', iconColor: 'text-orange-400' },
  { id: 28, n: 7, s: 'Bastos', p: 4, l: 'Estándares\na Medias', e: '⚠️', icon: 'handyman', iconColor: 'text-emerald-400' },
  { id: 29, n: 6, s: 'Espadas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 30, n: 6, s: 'Bastos', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 31, n: 6, s: 'Oros', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 32, n: 6, s: 'Copas', p: 3, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 33, n: 5, s: 'Espadas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 34, n: 5, s: 'Bastos', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 35, n: 5, s: 'Oros', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 36, n: 5, s: 'Copas', p: 2, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
  { id: 37, n: 4, s: 'Espadas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'swords', iconColor: 'text-blue-500' },
  { id: 38, n: 4, s: 'Bastos', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'handyman', iconColor: 'text-emerald-500' },
  { id: 39, n: 4, s: 'Oros', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'token', iconColor: 'text-yellow-500' },
  { id: 40, n: 4, s: 'Copas', p: 1, l: 'Acto\nInseguro', e: '❌', icon: 'wine_bar', iconColor: 'text-orange-500' },
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

const getDirectImageUrl = (url: string) => {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('drive.google.com')) {
    let fileId = '';
    const match = url.match(/\/d\/([^/]+)/i) || url.match(/id=([^&]+)/i);
    if (match) fileId = match[1];
    if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
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
              <span className="text-xl font-black text-on-primary-fixed leading-none">{card.n}</span>
              <span className={`material-symbols-outlined text-sm symbol-3d ${card.iconColor || 'text-on-primary-fixed'}`}>{card.icon || 'star'}</span>
            </div>
            <div className="text-[10px] font-black text-black/40 uppercase tracking-tighter">{card.s}</div>
          </div>
          
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* Background Suit Icon */}
            <span className={`absolute material-symbols-outlined text-6xl opacity-10 ${card.iconColor || 'text-black'}`}>{card.icon}</span>
            {/* Safety Emoji */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border border-black/5 z-10">
              <span className="text-3xl symbol-3d">{card.e}</span>
            </div>
          </div>
          
          <div className="w-full text-center">
            <p className="font-headline text-[9px] font-black text-on-primary-fixed mb-1 uppercase tracking-widest leading-tight">
              {card.l}
            </p>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full bg-secondary transition-all duration-500`} style={{ width: `${(card.p / 14) * 100}%` }}></div>
            </div>
            <p className="text-[7px] font-bold text-black/40 mt-1 uppercase">Poder: {card.p}</p>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-on-primary-fixed rounded-lg">
          <div className="w-20 h-32 border-2 border-white/5 rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined text-white/10 text-4xl animate-pulse">security</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

const IndustrialCard = ({ card, hidden, onClick, styleClass = "", style = {} }: any) => {
  if (!card && !hidden) return <div className="w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed border-white/10 rounded-lg"></div>;
  
  return (
    <motion.div 
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!hidden && onClick ? { y: -10, scale: 1.05 } : {}}
      onClick={onClick}
      style={style}
      className={`relative w-24 h-36 md:w-32 md:h-48 tactile-card p-2 md:p-3 flex flex-col items-center justify-between cursor-pointer transition-all shadow-2xl ${styleClass} ${hidden ? 'bg-on-primary-fixed!' : ''}`}
    >
      {!hidden ? (
        <>
          {/* Top Left: Number + Icon (Suit) */}
          <div className="w-full flex justify-start items-center gap-1">
            <span className="text-lg md:text-2xl font-black text-on-primary-fixed leading-none">{card.n}</span>
            <span className={`material-symbols-outlined text-sm md:text-lg symbol-3d ${card.iconColor || 'text-on-primary-fixed'}`}>{card.icon || 'star'}</span>
          </div>
          
          {/* Center Content: Large Emoji + Background Icon */}
          <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
            {/* Background Suit Icon - Subtle */}
            <span className={`absolute material-symbols-outlined text-5xl md:text-7xl opacity-[0.08] ${card.iconColor || 'text-black'}`}>{card.icon}</span>
            
            {/* Safety/Industrial Emoji */}
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/90 flex items-center justify-center shadow-xl border border-black/5 z-10 transform rotate-3">
              <span className="text-2xl md:text-4xl symbol-3d">{card.e}</span>
            </div>
          </div>
          
          {/* Bottom Section: Label + Power Bar */}
          <div className="w-full text-center">
            <p className="font-headline text-[8px] md:text-[10px] font-black text-on-primary-fixed mb-0.5 md:mb-1 uppercase tracking-tighter leading-tight truncate">
              {card.l}
            </p>
            <div className="h-1.5 md:h-2 w-full bg-slate-200/50 rounded-full overflow-hidden border border-black/5">
              <div 
                className={`h-full bg-secondary shadow-[0_0_8px_rgba(255,182,144,0.6)] transition-all duration-700`} 
                style={{ width: `${(card.p / 14) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-0.5 md:mt-1">
               <p className="text-[6px] md:text-[7px] font-bold text-black/40 uppercase tracking-tighter">Control: {card.p}</p>
               {/* Bottom Right: Number + Icon (Small/Inverted) */}
               <div className="flex items-center gap-0.5 opacity-30">
                  <span className="text-[8px] md:text-[10px] font-black">{card.n}</span>
                  <span className="material-symbols-outlined text-[8px] md:text-[10px]">{card.icon}</span>
               </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
           <div className="w-12 h-12 rounded-full border-2 border-secondary/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-secondary text-3xl">shield</span>
           </div>
           <p className="text-[8px] font-headline tracking-[0.3em] text-secondary/40 uppercase">Seguridad</p>
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

const StartScreen = ({ onStart }: { onStart: (data: any) => void }) => {
  const [sitios, setSitios] = useState<string[]>(['CARGANDO...']);
  const [sectores, setSectores] = useState<string[]>(['CARGANDO...']);
  const [loadingConfig, setLoadingConfig] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    sitio: '',
    sector: '',
    udn: '',
    edad: ''
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Carga de Misión de la Semana
        if (CONFIG_SHEET_URL) {
          const resC = await fetch(CONFIG_SHEET_URL);
          const textC = await resC.text();
          const rowsC = textC.split('\n').map(r => r.trim()).filter(r => r);
          
          if (rowsC.length >= 2) {
            const rawValue = rowsC[1].split(',')[0].trim().toLowerCase();
            const idMap: {[key: string]: string} = {
              'truco seguro': 'truco',
              'caza de riesgos': 'match',
              'la oca': 'oca',
              'carrera mente': 'carrera',
              'escape room': 'escape',
              'memory preventivo': 'memoria',
              'prevenwordle': 'wordle',
              'jenga seguro': 'jenga'
            };
            
            if (idMap[rawValue]) {
              MISSION_OF_THE_WEEK = idMap[rawValue];
            } else if (['truco', 'match', 'oca', 'carrera', 'escape', 'memoria', 'wordle', 'jenga'].includes(rawValue)) {
              MISSION_OF_THE_WEEK = rawValue;
            }
          }
        }

        // Carga de Sitios
        if (SITIOS_SHEET_URL) {
          const resS = await fetch(SITIOS_SHEET_URL);
          const textS = await resS.text();
          const rowsS = textS.split('\n').slice(1).map(r => r.trim()).filter(r => r);
          setSitios(rowsS);
          setFormData(prev => ({ ...prev, sitio: rowsS[0] }));
        } else {
          const defaultSitios = ['FUNDICIÓN PRINCIPAL', 'LOGÍSTICA NORTE', 'MANTENIMIENTO MECÁNICO', 'CONTROL DE CALIDAD'];
          setSitios(defaultSitios);
          setFormData(prev => ({ ...prev, sitio: defaultSitios[0] }));
        }

        // Carga de Sectores
        if (AREAS_SHEET_URL) {
          const resA = await fetch(AREAS_SHEET_URL);
          const textA = await resA.text();
          const rowsA = textA.split('\n').slice(1).map(r => r.trim()).filter(r => r);
          setSectores(rowsA);
          setFormData(prev => ({ ...prev, sector: rowsA[0] }));
        } else {
          const defaultSectores = ['LOGÍSTICA', 'PRODUCCIÓN', 'MANTENIMIENTO', 'CALIDAD', 'EHS / SEGURIDAD', 'ADMINISTRACIÓN', 'IT / SISTEMAS', 'OTRO'];
          setSectores(defaultSectores);
          setFormData(prev => ({ ...prev, sector: defaultSectores[0] }));
        }
        setLoadingConfig(false);
      } catch (error) {
        console.error("Error loading config sheets:", error);
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.udn || !formData.edad || !formData.sector || !formData.sitio) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }
    onStart(formData);
  };

  return (
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
        <h1 className="font-headline tracking-tighter uppercase text-xl font-bold text-secondary">PREVENEHS GAMES</h1>
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
        <div className="mt-6 text-center">
          <h2 className="font-headline text-2xl md:text-4xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-md">
            REGISTRO DE JUGADOR
          </h2>
          <p className="font-label text-secondary tracking-[0.2em] uppercase text-[10px] mt-2 opacity-80">Mes de la Seguridad 2025</p>
        </div>
      </div>

      <div className="w-full max-w-md glass-panel-heavy p-8 rounded-xl border-t border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-3 bg-secondary/80 transform translate-x-12 translate-y-3 rotate-45 shadow-sm"></div>
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-secondary text-base">person_add</span>
            <span className="font-label text-[11px] uppercase font-bold text-secondary/70 tracking-widest">Identificación del Personal</span>
          </div>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">Nombre y Apellido</label>
            <div className="relative">
              <input 
                autoComplete="off" 
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all rounded-sm" 
                placeholder="Ej: Juan Pérez" 
                type="text" 
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">person</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">Sitio</label>
              <div className="relative">
                <select 
                  className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white appearance-none focus:outline-none focus:border-secondary transition-all rounded-sm cursor-pointer"
                  value={formData.sitio}
                  onChange={(e) => setFormData({ ...formData, sitio: e.target.value })}
                  disabled={loadingConfig}
                >
                  {sitios.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">Sector / Área</label>
              <div className="relative">
                <select 
                  className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white appearance-none focus:outline-none focus:border-secondary transition-all rounded-sm cursor-pointer"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  disabled={loadingConfig}
                >
                  {sectores.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">UDN / Legajo</label>
            <div className="relative">
              <input 
                autoComplete="off" 
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all rounded-sm" 
                placeholder="Ej: 12345" 
                type="text" 
                value={formData.udn}
                onChange={(e) => setFormData({ ...formData, udn: e.target.value })}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">badge</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">Edad</label>
            <div className="relative">
              <input 
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all rounded-sm" 
                placeholder="Ej: 35" 
                type="number" 
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">event</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider block">UDN</label>
            <div className="relative">
              <input 
                autoComplete="off" 
                className="w-full bg-black/40 border-2 border-white/10 p-3 font-headline text-white placeholder:text-white/20 focus:outline-none focus:border-secondary transition-all rounded-sm" 
                placeholder="Unidad de Negocio" 
                type="text" 
                value={formData.udn}
                onChange={(e) => setFormData({ ...formData, udn: e.target.value })}
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20">business</span>
            </div>
          </div>

          <button className="btn-industrial-orange w-full text-white font-headline font-black py-4 text-lg uppercase tracking-tighter flex items-center justify-center gap-4 mt-4 group" type="submit">
            <span className="material-symbols-outlined font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
            ACCEDER A MISIONES
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
};

const GameMenu = ({ onSelectGame, playerData }: { onSelectGame: (id: string) => void, playerData: any }) => {
  const [activeModule, setActiveModule] = useState<'FLOOR' | 'LOGS'>('FLOOR');

  const renderContent = () => {
    if (activeModule === 'LOGS') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel-heavy p-8 rounded-2xl border-t border-white/20 shadow-2xl">
            <h3 className="font-headline text-3xl font-black text-white mb-6 uppercase tracking-tighter">RANKING DE SEGURIDAD</h3>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 font-headline text-[10px] text-secondary uppercase tracking-widest">
                    <th className="p-4 border-b border-white/10">Jugador</th>
                    <th className="p-4 border-b border-white/10">Juego</th>
                    <th className="p-4 border-b border-white/10">Puntaje</th>
                    <th className="p-4 border-b border-white/10">Fecha</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px] text-white/80">
                  <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="p-4 font-bold">Demo Player</td>
                    <td className="p-4">Truco Seguro</td>
                    <td className="p-4 text-secondary">1500</td>
                    <td className="p-4 text-white/40">23/03/2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES.map((game, idx) => (
          <motion.div 
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => game.active && onSelectGame(game.id)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer ${game.active ? 'border-white/10 hover:border-secondary hover:scale-[1.02] hover:shadow-2xl' : 'opacity-40 grayscale cursor-not-allowed border-transparent'}`}
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={game.img} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${game.color}`}>
                {game.subtitle}
              </div>
            </div>
            <div className="p-5 bg-black/40 backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-headline text-lg font-black text-white leading-none tracking-tighter uppercase">{game.title}</h3>
                <span className="material-symbols-outlined text-secondary text-xl">{game.icon}</span>
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
    );
  };

  return (
    <div className="obsidian-table font-body text-on-surface selection:bg-secondary selection:text-on-secondary-container min-h-screen">
      <header className="fixed top-0 z-50 w-full bg-[#0a1f14]/90 backdrop-blur-md border-b-2 border-primary/20 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-secondary overflow-hidden bg-surface-container-highest shadow-[0_0_10px_rgba(255,182,144,0.3)]">
            <img alt="Avatar" className="w-full h-full object-cover grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC97HFamk2dkPWFqH2voXcNZYCHKHsgGDJteNhDpifbYHwZez2ceoid2C8Vxeaq8vPOVPGsbmUR56C7z4y7qIUOjY884ZqGD5VO425mmpZffjMNcdPSTKoP3HmEk4_RU-h0GvvHrd_zFlmI2vKZlMicNe3oNGRzNP_g0EhPkF2khl0-0L3VVyKwyAP5wfvTzdWYHK9OXjDf6XwcuGGl5hMJNLL-oKXh0hxLoyOQAFYLqDHjrMPNwI3ewg8HSvtChosPz4S-NiVtKxx0" />
          </div>
          <div>
            <h1 className="font-headline tracking-tighter text-xl font-black text-secondary uppercase leading-none">PREVENEHS_GAMES</h1>
            <p className="font-label text-[10px] text-white/60 uppercase tracking-widest mt-1">{playerData?.nombre || 'OPERADOR'}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-headline uppercase text-primary tracking-widest leading-none">{playerData?.sitio || 'PLANTA'}</p>
            <p className="font-headline font-bold text-sm text-secondary tracking-tighter">{playerData?.udn || 'MES DE LA SEGURIDAD'}</p>
          </div>
          <span className="material-symbols-outlined text-secondary cursor-pointer hover:bg-white/10 p-2 rounded transition-colors active:translate-y-0.5">settings</span>
        </div>
      </header>

      <main className="pt-28 pb-32 px-4 md:px-12 max-w-7xl mx-auto min-h-screen">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a1f14]/90 backdrop-blur-md border-t-2 border-primary/20 rounded-t-lg flex justify-around items-center px-4 py-3 pb-safe">
        <button 
          onClick={() => setActiveModule('FLOOR')}
          className={`flex flex-col items-center justify-center p-2 active:scale-95 duration-100 ease-out transition-all ${activeModule === 'FLOOR' ? 'text-secondary' : 'text-white/40 hover:text-secondary'}`}
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Misiones</span>
        </button>
        <button 
          onClick={() => setActiveModule('LOGS')}
          className={`flex flex-col items-center justify-center p-2 active:scale-95 duration-100 ease-out transition-all ${activeModule === 'LOGS' ? 'text-secondary' : 'text-white/40 hover:text-secondary'}`}
        >
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="font-headline text-[10px] tracking-tighter font-bold uppercase mt-1">Ranking</span>
        </button>
      </nav>
    </div>
  );
};

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

const OcaGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
      // Pequeña pausa para que el usuario vea el dado antes de mover
      setTimeout(() => movePlayer(res), 600);
    }, 1200);
  };

  const movePlayer = (steps: number) => {
    const currentPos = players[currentPlayer].pos;
    let newPos = currentPos + steps;
    
    // Bounce back logic if exceeding 63
    if (newPos > 63) {
      newPos = 63 - (newPos - 63);
    }
    
    setPlayers(prev => {
      const next = [...prev];
      next[currentPlayer].pos = newPos;
      return next;
    });

    // Wait for the movement animation to finish before checking the square
    setTimeout(() => checkSquare(newPos), 800);
  };

  const checkSquare = (pos: number) => {
    const sq = board[pos - 1];
    if (pos === 63) { 
      setGameState('WINNER'); 
      onGameOver(100);
      return; 
    }

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
      let questionData = triviaQuestions.find(p => p.sq === pos) || 
                         triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      
      if (!questionData) {
        const fallback = FALLBACK_DATA.preguntas[Math.floor(Math.random() * FALLBACK_DATA.preguntas.length)];
        questionData = { ...fallback, sq: pos, tipo: 'trivia' };
      }
      
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
    <div className="h-screen flex flex-col lg:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden obsidian-table relative">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
      
      <aside className="w-full lg:w-80 glass-panel-heavy p-4 md:p-6 rounded-xl hard-shadow flex flex-col gap-2 md:gap-4 relative z-10 shrink-0">
        <div className="flex justify-between items-center lg:flex-col lg:items-stretch gap-2">
          <button 
            onClick={() => {
              onGameOver(Math.floor((players[currentPlayer].pos / 63) * 100));
              onExit();
            }}
            className="flex-1 lg:flex-none px-4 md:px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"
          >
            Finalizar
          </button>
          <button onClick={onExit} className="flex-1 lg:flex-none justify-center lg:justify-start text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2 transition-opacity">
            <LogOut size={12} /> Salir
          </button>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 my-1 md:my-2">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary flex items-center justify-center rounded-sm hard-shadow-sm shrink-0">
            <LayoutGrid className="text-black" size={20} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-headline font-black tracking-tighter leading-none">LA <span className="text-secondary">OCA</span></h2>
            <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-50">Logística de Seguridad</p>
          </div>
        </div>

        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto max-h-[20vh] lg:max-h-[40vh] pb-2 lg:pr-2 custom-scrollbar">
          {players.map((p, i) => (
            <div key={i} className={`p-2 md:p-3 rounded-sm border-l-4 flex items-center gap-2 md:gap-3 transition-all min-w-[120px] lg:min-w-0 ${currentPlayer === i ? 'bg-secondary/10 border-secondary hard-shadow-sm' : 'bg-white/5 border-transparent opacity-50'}`}>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-sm flex items-center justify-center text-black font-black hard-shadow-sm shrink-0 text-[10px] md:text-xs" style={{ backgroundColor: p.color }}>{p.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-headline font-black uppercase truncate">{p.name}</p>
                <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${(p.pos / 63) * 100}%` }} />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-mono opacity-60">{p.pos}/63</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center lg:flex-col gap-3 md:gap-4 p-3 md:p-6 bg-black/40 rounded-xl border border-white/5 hard-shadow">
          <div className="relative shrink-0">
            <div className={`w-12 h-12 md:w-20 md:h-20 bg-white rounded-xl flex items-center justify-center text-2xl md:text-4xl text-black font-black hard-shadow transition-transform ${isRolling ? 'animate-spin' : ''}`}>
              {dice}
            </div>
            {isRolling && (
              <div className="absolute -inset-2 md:-inset-4 border-2 border-secondary/30 rounded-full animate-ping pointer-events-none" />
            )}
          </div>
          
          <button 
            onClick={rollDice} 
            disabled={isRolling || !!modal} 
            className="btn-industrial-orange flex-1 lg:w-full py-3 md:py-4 disabled:opacity-30 text-black font-headline font-black uppercase tracking-widest text-[10px] md:text-xs"
          >
            {isRolling ? '...' : 'LANZAR DADO'}
          </button>
        </div>
      </aside>

      <main className="flex-1 glass-panel-heavy rounded-xl p-2 md:p-6 overflow-hidden flex items-center justify-center border border-white/10 relative z-10">
        <div className="absolute top-2 right-2 flex items-center gap-2 md:gap-4 text-[8px] md:text-[10px] font-headline uppercase tracking-widest opacity-30 z-20">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-error-rose rounded-full" /> Riesgo</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full" /> Barrera</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-400 rounded-full" /> Trivia</div>
        </div>

        <div className="grid grid-cols-9 gap-0.5 md:gap-1 w-full max-w-4xl aspect-[9/7] p-1 md:p-2 bg-black/20 rounded-lg border border-white/5 overflow-auto">
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
                
                <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1">
                  {players.map((p, pi) => p.pos === sq.id && (
                    <motion.div 
                      layoutId={`player-${pi}`} 
                      key={pi} 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-xs font-black text-white hard-shadow-sm z-20" 
                      style={{ 
                        backgroundColor: p.color,
                        boxShadow: `0 0 15px ${p.color}80`,
                        transform: `translate(${(pi % 2) * 4}px, ${(pi > 1 ? 4 : 0)}px)`
                      }}
                      initial={{ scale: 0, y: -20 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
        
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-3xl md:text-5xl font-headline font-black mb-1 md:mb-2 tracking-tighter">LA <span className="text-secondary">OCA</span></h2>
          <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary opacity-70">Logística de Prevención</p>
        </div>

        <div className="mb-6 md:mb-10">
          <p className="text-[8px] md:text-[10px] font-headline uppercase font-black mb-3 md:mb-4 opacity-50 text-center tracking-widest">Configuración de Escuadrón</p>
          <div className="flex gap-2 md:gap-4 justify-center">
            {[2, 3, 4].map(n => (
              <button 
                key={n} 
                onClick={() => setCount(n)} 
                className={`w-10 h-10 md:w-14 md:h-14 rounded-sm font-headline font-black transition-all border-2 ${count === n ? 'bg-secondary text-black border-secondary hard-shadow-sm scale-110' : 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-10">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 rounded-sm flex items-center justify-center text-[8px] md:text-[10px] font-headline font-black bg-white/10 text-secondary group-focus-within:bg-secondary group-focus-within:text-black transition-colors">
                {i + 1}
              </div>
              <input 
                type="text" 
                value={names[i]} 
                onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n); }} 
                className="w-full bg-black/40 border border-white/10 focus:border-secondary/50 outline-none py-3 md:py-4 pl-10 md:pl-12 pr-4 uppercase font-headline font-black text-[10px] md:text-xs tracking-widest transition-all rounded-sm" 
                placeholder={`ID Op ${i+1}`} 
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

const MatchGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
      onGameOver(score);
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
        setTimeout(() => {
          setGameState('WINNER');
          onGameOver(score + currentScore);
        }, 1000);
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
      <header className="glass-panel-heavy p-2 md:p-4 flex items-center justify-between border-b border-white/10 relative z-20 hard-shadow">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={onExit} 
            className="p-2 md:p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-all group"
            title="Abortar Misión"
          >
            <ArrowRight className="rotate-180 text-secondary group-hover:scale-110 transition-transform" size={20} />
          </button>
          <div>
            <h1 className="text-lg md:text-2xl font-headline font-black tracking-tighter leading-none flex items-center gap-2">
              <span className="w-1.5 md:w-2 h-4 md:h-6 bg-secondary animate-pulse" />
              CAZA DE <span className="text-secondary">RIESGOS</span>
            </h1>
            <p className="text-[8px] md:text-[10px] font-headline font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary opacity-70">Protocolo de Identificación</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-12">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] md:text-[10px] font-headline font-bold uppercase tracking-widest text-primary opacity-50">Rendimiento</p>
            <p className="text-xl md:text-3xl font-mono font-black text-secondary leading-none tabular-nums">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
            </p>
          </div>
          <div className="text-right min-w-[80px] md:min-w-[120px]">
            <p className="text-[8px] md:text-[10px] font-headline font-bold uppercase tracking-widest text-primary opacity-50">Tiempo</p>
            <p className={`text-xl md:text-3xl font-mono font-black leading-none tabular-nums ${timeLeft < 20 ? 'text-error animate-pulse' : 'text-white'}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </p>
          </div>
          <button 
            onClick={() => {
              onGameOver(score.correct);
              onExit();
            }}
            className="px-4 md:px-8 py-2 md:py-3 bg-rose-500 text-on-primary-fixed font-black rounded-xl uppercase text-[10px] md:text-xs tracking-widest hover:bg-rose-600 transition-all shadow-lg"
          >
            Finalizar
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-8 relative z-10 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Risks Column */}
        <div className="flex-1 flex flex-col gap-3 md:gap-6 overflow-hidden">
          <div className="flex items-center justify-between px-3 md:px-4 py-2 bg-white/5 border-l-4 border-secondary shrink-0">
            <h3 className="text-[10px] md:text-sm font-headline font-black uppercase tracking-[0.2em] text-secondary flex items-center gap-2 md:gap-3">
              <AlertTriangle size={16} className="animate-hud-pulse" /> Amenazas
            </h3>
            <span className="text-[10px] md:text-xs font-mono font-bold text-white/40 bg-black/40 px-2 md:px-3 py-1 rounded-full">
              {matchedIds.length} / {pairs.length}
            </span>
          </div>
          
          <div className="flex-1 grid grid-cols-1 gap-2 md:gap-4 overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
            {pairs.map((p) => (
              <motion.div
                key={p.id}
                layout
                className={`glass-panel-heavy p-3 md:p-5 rounded-sm border-2 transition-all flex items-center gap-4 md:gap-6 relative overflow-hidden hard-shadow-sm
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
      className="w-full max-w-3xl glass-panel-heavy p-6 md:p-16 rounded-sm border-2 border-secondary/30 hard-shadow text-center relative z-10"
    >
      <div className="mb-6 md:mb-10 inline-block p-4 md:p-6 bg-secondary/10 rounded-sm border-2 border-secondary/50 hard-shadow-sm relative">
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-secondary" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-secondary" />
        <Shield className="w-10 h-10 md:w-16 md:h-16 text-secondary animate-hud-pulse" />
      </div>
      
      <h1 className="text-3xl md:text-6xl font-headline font-black text-white mb-2 md:mb-4 tracking-tighter uppercase">
        CAZA DE <span className="text-secondary">RIESGOS</span>
      </h1>
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-16">
        <div className="h-px w-8 md:w-12 bg-secondary/30" />
        <p className="text-secondary font-headline font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs opacity-80">Misión de Mitigación Industrial</p>
        <div className="h-px w-8 md:w-12 bg-secondary/30" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16">
        {[
          { id: 'easy', label: 'Nivel 01', title: 'Básico', pairs: 6, time: 90, color: 'text-emerald-500', border: 'hover:border-emerald-500/50' },
          { id: 'medium', label: 'Nivel 02', title: 'Avanzado', pairs: 9, time: 75, color: 'text-amber-500', border: 'hover:border-amber-500/50' },
          { id: 'expert', label: 'Nivel 03', title: 'Crítico', pairs: 12, time: 60, color: 'text-error', border: 'hover:border-error/50' }
        ].map((lvl) => (
          <button 
            key={lvl.id}
            onClick={() => onStart(lvl.id as any)} 
            className={`group p-4 md:p-8 bg-white/5 border-2 border-white/10 ${lvl.border} rounded-sm transition-all text-left hard-shadow-sm hover:-translate-y-2 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-8 md:w-12 h-8 md:h-12 bg-white/5 rotate-45 translate-x-4 md:translate-x-6 -translate-y-4 md:-translate-y-6" />
            <p className={`${lvl.color} font-headline font-black text-[8px] md:text-[10px] uppercase mb-1 md:mb-2 tracking-widest`}>{lvl.label}</p>
            <p className="text-white font-headline font-black text-xl md:text-3xl tracking-tighter mb-1">{lvl.title}</p>
            <p className="text-white/40 text-[8px] md:text-[10px] font-mono uppercase tracking-widest">{lvl.pairs} Riesgos • {lvl.time}s</p>
          </button>
        ))}
      </div>

      <button 
        onClick={onBack} 
        className="group flex items-center gap-2 md:gap-3 mx-auto text-white/40 hover:text-secondary font-headline uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] font-black transition-all"
      >
        <ArrowRight className="rotate-180 group-hover:-translate-x-2 transition-transform" size={14} md:size={16} />
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
      className="w-full max-w-2xl glass-panel-heavy p-6 md:p-16 rounded-sm border-2 border-secondary/30 hard-shadow text-center relative z-10"
    >
      <div className="text-5xl md:text-8xl mb-4 md:mb-8 filter drop-shadow-[0_0_25px_rgba(247,190,29,0.4)] animate-bounce">
        {score > 0 ? '🏆' : '⚠️'}
      </div>
      
      <h2 className={`text-3xl md:text-6xl font-headline font-black mb-2 md:mb-4 tracking-tighter uppercase ${score > 0 ? 'text-emerald-500' : 'text-error'}`}>
        {score > 0 ? '¡MISIÓN CUMPLIDA!' : 'OPERACIÓN FALLIDA'}
      </h2>
      <p className="text-primary font-headline font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs mb-8 md:mb-16 opacity-70">
        {score > 0 ? 'Protocolo de Seguridad Validado al 100%' : 'Se requiere re-entrenamiento inmediato'}
      </p>
      
      <div className="bg-black/60 p-6 md:p-10 rounded-sm border border-white/10 mb-8 md:mb-16 hard-shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
        <p className="text-[8px] md:text-[10px] font-headline font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary mb-2 md:mb-4">Puntaje de Eficiencia ({level})</p>
        <p className="text-5xl md:text-8xl font-headline font-black text-white tracking-tighter tabular-nums">
          {score.toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <button 
          onClick={onExit} 
          className="w-full py-4 md:py-5 bg-white/5 hover:bg-white/10 text-white font-headline font-black rounded-sm uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all border border-white/10"
        >
          Finalizar
        </button>
        <button 
          onClick={onRestart} 
          className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black rounded-sm uppercase tracking-[0.2em] text-[10px] md:text-xs"
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
      className="glass-panel-heavy p-8 md:p-12 rounded-2xl border border-secondary/30 text-center hard-shadow relative z-10 w-full max-w-md"
    >
      <div className="text-6xl md:text-8xl mb-4 md:mb-6 filter drop-shadow-[0_0_20px_rgba(247,190,29,0.5)]">🏆</div>
      <h2 className="text-3xl md:text-5xl font-headline font-black mb-1 md:mb-2 tracking-tighter uppercase">¡OPERADOR EXPERTO!</h2>
      <p className="text-sm md:text-xl text-secondary font-headline font-black uppercase mb-8 md:mb-10 tracking-widest">{player.name} ha llegado a la meta</p>
      <button onClick={onRestart} className="btn-industrial-orange w-full py-4 md:py-5 text-black font-headline font-black uppercase tracking-widest text-[10px] md:text-sm">NUEVA JORNADA</button>
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

const CarreraGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
          onGameOver(players[0].score);
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

      <div className="relative z-10 flex-1 flex flex-col p-3 md:p-6 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Header HUD - STITCH STYLE */}
        <header className="glass-panel-heavy p-2 md:p-4 flex items-center justify-between border-b border-white/10 relative z-20 hard-shadow mb-4 md:mb-8">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => {
                onGameOver(players[currentPlayerIdx].score);
                onExit();
              }}
              className="px-3 md:px-6 py-1.5 md:py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Finalizar
            </button>
            <div className="flex gap-2 md:gap-4 overflow-x-auto custom-scrollbar pb-1 max-w-[150px] md:max-w-none">
              {players.map((p, i) => (
                <div key={i} className={`flex items-center gap-2 md:gap-3 p-1.5 md:p-3 rounded-sm border transition-all min-w-[100px] md:min-w-[140px] hard-shadow-sm
                  ${i === currentPlayerIdx ? 'bg-secondary/10 border-secondary ring-1 ring-secondary/50' : 'bg-white/5 border-white/10 opacity-40'}
                `}>
                  <span className="text-xl md:text-3xl filter drop-shadow-md">{p.emoji}</span>
                  <div>
                    <p className={`text-[8px] md:text-[10px] font-headline font-black uppercase tracking-widest ${i === currentPlayerIdx ? 'text-secondary' : 'text-primary'}`}>{p.name}</p>
                    <p className="text-sm md:text-xl font-mono font-black text-white leading-none">{p.score} <span className="text-[8px] md:text-[10px] opacity-50 uppercase">PTS</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-right pl-3 md:pl-8 border-l border-white/10">
            <p className="text-[8px] md:text-[10px] font-headline font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-secondary opacity-70">Ronda</p>
            <p className="text-xl md:text-4xl font-mono font-black text-white leading-none tracking-tighter">
              {currentRound}<span className="text-sm md:text-xl opacity-30">/5</span>
            </p>
          </div>
        </header>

        {/* Main Stage */}
        <div className="flex-1 flex flex-col items-center justify-center relative scale-75 md:scale-100 origin-center">
          {playState === 'IDLE' || playState === 'SPINNING' ? (
            <div className="flex flex-col items-center gap-6 md:gap-12">
              <div className="text-center">
                <p className="text-secondary font-headline font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs mb-1 md:mb-3 animate-hud-pulse">Protocolo de Turno Activo</p>
                <h2 className="text-2xl md:text-5xl font-headline font-black text-white uppercase tracking-tighter">
                  {players[currentPlayerIdx]?.name} <span className="text-secondary">AL MANDO</span>
                </h2>
              </div>

              <div className="relative p-4 md:p-8 glass-panel-heavy rounded-full hard-shadow border-2 border-white/10">
                {/* Pointer */}
                <div className="absolute -top-2 md:-top-4 left-1/2 -translate-x-1/2 z-30 text-secondary drop-shadow-[0_0_20px_rgba(247,190,29,0.8)]">
                  <div className="w-0 h-0 border-l-[15px] md:border-l-[25px] border-l-transparent border-r-[15px] md:border-r-[25px] border-t-[25px] md:border-t-[40px] border-t-secondary" />
                </div>
                
                {/* Roulette Container */}
                <div className="relative p-2 md:p-4 rounded-full border-4 md:border-8 border-black/40 bg-black/60 shadow-inner">
                  <svg 
                    width="280" height="280" viewBox="0 0 400 400" 
                    className="md:w-[420px] md:h-[420px] transition-transform duration-[3000ms] ease-[cubic-bezier(0.15,0,0.15,1)]"
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
        <div className="text-center mb-10 md:mb-20">
          <p className="text-secondary font-headline font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-[10px] md:text-sm mb-2 md:mb-4 animate-hud-pulse">Operación Finalizada con Éxito</p>
          <h1 className="text-4xl md:text-7xl font-headline font-black text-white tracking-tighter uppercase">
            PODIO DE <span className="text-tertiary">CAMPEONES</span>
          </h1>
          <div className="w-32 md:w-48 h-1 md:h-2 bg-tertiary mx-auto mt-4 md:mt-6 rounded-full shadow-[0_0_25px_rgba(247,190,29,0.6)]" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-8 mb-12 md:mb-24 w-full">
          {/* 2nd Place */}
          {sorted[1] && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="flex flex-col items-center order-2 md:order-1"
            >
              <div className="relative mb-3 md:mb-6 group">
                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl md:text-6xl filter drop-shadow-2xl relative z-10">{sorted[1].emoji}</span>
              </div>
              <p className="text-white/50 font-headline font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4">{sorted[1].name}</p>
              <div className="w-40 md:w-48 h-40 md:h-56 bg-white/5 rounded-sm flex flex-col items-center justify-center border-2 border-white/10 shadow-2xl relative group overflow-hidden hard-shadow-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                <span className="text-4xl md:text-6xl font-headline font-black text-white/10 mb-1 md:mb-2 relative z-10">2°</span>
                <p className="text-xl md:text-2xl font-mono font-black text-white relative z-10">{sorted[1].score} <span className="text-xs opacity-50">PTS</span></p>
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

const EscapeRoomGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
      const finalScore = timeLeft * 10;
      setScore(finalScore);
      onGameOver(finalScore);
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
              onClick={() => {
                onGameOver(score);
                onExit();
              }}
              className="px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all ml-4"
            >
              Finalizar Partida
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
          <div className="lg:col-span-1 flex flex-col gap-6 relative">
            {/* Paperclip decoration */}
            <div className="absolute -top-2 left-10 z-20 rotate-[-15deg] opacity-60 pointer-events-none">
              <Paperclip className="w-10 h-10 text-slate-400 drop-shadow-md" />
            </div>

            <div className="bg-[#fdf6e3] text-black font-mono p-8 rounded-sm rotate-[-0.5deg] flex-1 overflow-y-auto custom-scrollbar shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-b-8 border-r-8 border-black/10 relative overflow-hidden group select-none">
              {/* Paper texture overlay */}
              <div className="absolute inset-0 paper-texture pointer-events-none" />
              
              {/* Subtle fold lines */}
              <div className="absolute top-1/3 left-0 w-full h-px bg-black/5 pointer-events-none" />
              <div className="absolute top-2/3 left-0 w-full h-px bg-black/5 pointer-events-none" />
              
              {/* Coffee Stain */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4a3728] opacity-[0.03] rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-8 w-32 h-32 border-8 border-[#4a3728] opacity-[0.02] rounded-full blur-md pointer-events-none" />

              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-35deg] opacity-[0.04] pointer-events-none select-none">
                <Shield className="w-96 h-96" />
              </div>

              {/* Confidential Stamp */}
              <div className="absolute top-12 right-8 border-4 border-rose-700/40 text-rose-700/40 font-black px-4 py-2 rounded-lg uppercase tracking-[0.3em] text-xs rotate-12 pointer-events-none select-none stamped flex flex-col items-center leading-none">
                <span>CONFIDENCIAL</span>
                <span className="text-[8px] mt-1 opacity-60">SRT-EHS-2026</span>
              </div>

              <div className="border-b-2 border-black/20 pb-6 mb-8 relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Expediente #COR-2026-03</h3>
                  <div className="px-2 py-1 bg-black text-white text-[8px] font-black uppercase tracking-widest">TOP SECRET</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest text-black">Protocolo EHS - Investigación de Accidentes</p>
                </div>
              </div>
              
              <div className="space-y-8 text-sm text-black relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <AlertCircle className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Evento Reportado</p>
                    <p className="leading-tight font-bold">Caída de altura (3 metros) durante montaje de vigas estructurales.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <Search className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Ubicación Geográfica</p>
                    <p className="leading-tight font-bold">Obra Civil "Nuevos Horizontes", Sector B, Córdoba.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-black/5 rounded flex items-center justify-center flex-shrink-0 border border-black/5">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Estado del Personal</p>
                    <p className="leading-tight font-bold">Operario estable, fractura de fémur. Bajo observación médica.</p>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-black/10 mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-black text-xs uppercase tracking-widest text-zinc-500">Objetivo Fase {stage}</p>
                    <div className="text-[8px] font-bold text-zinc-400">PÁGINA {stage} DE 6</div>
                  </div>
                  <p className="italic font-medium text-black leading-relaxed bg-black/5 p-5 rounded-lg border-l-4 border-black shadow-inner">
                    {stage === 1 && "Identifica las 3 evidencias físicas críticas que demuestren fallas en el sistema de seguridad."}
                    {stage === 2 && "Analiza los testimonios del personal y detecta las 3 inconsistencias o mentiras."}
                    {stage === 3 && "Clasifica técnicamente los hallazgos entre causas inmediatas y causas básicas."}
                    {stage === 4 && "Aplica la metodología de los '5 Por Qué' para profundizar hasta el origen sistémico."}
                    {stage === 5 && "Define el plan de acción preventivo para mitigar la recurrencia del evento."}
                    {stage === 6 && "Consolida los hallazgos en el reporte oficial de investigación."}
                  </p>

                  {/* Field Notes Decoration */}
                  <div className="mt-10 pt-8 border-t border-black/10 relative">
                    <div className="flex items-center gap-2 text-rose-900/40 mb-3">
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Notas de Campo del Analista</span>
                    </div>
                    <p className="text-xl text-rose-950/80 mt-2 leading-tight font-handwritten">
                      "El sistema de anclaje parece haber fallado por falta de mantenimiento preventivo. Revisar bitácora de inspecciones urgentemente."
                    </p>
                    
                    {/* Barcode placeholder */}
                    <div className="mt-10 flex flex-col items-end opacity-20">
                      <div className="flex gap-0.5 h-8">
                        {[2,4,1,3,2,1,4,2,3,1,2,4,1,3].map((w, i) => (
                          <div key={i} className="bg-black" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                      <span className="text-[8px] mt-1 font-mono">SRT-99283-EHS</span>
                    </div>
                  </div>
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

const MEMORY_PAIRS = [
  {
    riesgo: { emoji: '🔥', titulo: 'FUEGO', desc: 'Riesgo de incendio por materiales inflamables.', color: '#d71920', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧯', titulo: 'EXTINTOR', desc: 'Uso de extintor ABC para sofocar el fuego.', color: '#d71920', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🔊', titulo: 'RUIDO', desc: 'Niveles de ruido superiores a 85dB.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🎧', titulo: 'PROTECCIÓN', desc: 'Uso obligatorio de protectores auditivos.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧱', titulo: 'CAÍDA OBJETOS', desc: 'Riesgo de desprendimiento de materiales.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '👷', titulo: 'CASCO', desc: 'Uso de casco de seguridad industrial.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '✨', titulo: 'CHISPAS', desc: 'Proyección de partículas en procesos de corte.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥽', titulo: 'ANTIPARRAS', desc: 'Protección ocular contra impactos.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚡', titulo: 'ELECTRICIDAD', desc: 'Riesgo de choque eléctrico en tableros.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES DIEL.', desc: 'Uso de guantes dieléctricos certificados.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧪', titulo: 'QUÍMICOS', desc: 'Manipulación de sustancias corrosivas.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES QUIM.', desc: 'Uso de guantes de nitrilo o químicos.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌫️', titulo: 'VAPORES', desc: 'Presencia de gases o vapores tóxicos.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '😷', titulo: 'RESPIRADOR', desc: 'Uso de máscara con filtros específicos.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🪜', titulo: 'ALTURA', desc: 'Trabajos por encima de 1.8 metros.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧗', titulo: 'ARNÉS', desc: 'Uso de arnés y línea de vida.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌡️', titulo: 'CALOR', desc: 'Superficies con altas temperaturas.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES TÉRM.', desc: 'Uso de guantes para protección térmica.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚙️', titulo: 'ATRAPAMIENTO', desc: 'Partes móviles de maquinaria sin resguardo.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛑', titulo: 'PARADA EMERG.', desc: 'Accionamiento de parada de emergencia.', color: '#d71920', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '💦', titulo: 'DERRAME', desc: 'Fuga de líquidos peligrosos en el piso.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '📦', titulo: 'KIT DERRAMES', desc: 'Uso de absorbentes y barreras.', color: '#008a44', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '📦', titulo: 'CARGA PESADA', desc: 'Levantamiento manual de cargas excesivas.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛒', titulo: 'CARRO', desc: 'Uso de medios mecánicos de transporte.', color: '#008a44', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌑', titulo: 'OSCURIDAD', desc: 'Falta de iluminación en vías de escape.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🔦', titulo: 'LINTERNA', desc: 'Uso de iluminación de emergencia.', color: '#008a44', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⛸️', titulo: 'PISO RESBAL.', desc: 'Pisos mojados o con presencia de aceite.', color: '#ffcc00', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥾', titulo: 'CALZADO', desc: 'Uso de calzado con suela antideslizante.', color: '#0054a6', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🚑', titulo: 'ACCIDENTE', desc: 'Lesión que requiere atención inmediata.', color: '#d71920', tipo: 'RIESGO' },
    mitigacion: { emoji: '🩹', titulo: 'BOTIQUÍN', desc: 'Uso de elementos de primeros auxilios.', color: '#008a44', tipo: 'MITIGACIÓN' }
  }
];

const MemoryGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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

  const startGame = () => {
    const selectedPairs = shuffle([...MEMORY_PAIRS]).slice(0, difficulty);
    const gameCards: any[] = [];
    
    selectedPairs.forEach((pair, idx) => {
      // Card A: Riesgo
      gameCards.push({
        id: `R-${idx}`,
        pairId: idx,
        type: 'RIESGO',
        content: pair.riesgo.emoji,
        titulo: pair.riesgo.titulo,
        desc: pair.riesgo.desc,
        bgColor: pair.riesgo.color,
        data: pair
      });
      // Card B: Mitigación
      gameCards.push({
        id: `M-${idx}`,
        pairId: idx,
        type: 'MITIGACIÓN',
        content: pair.mitigacion.emoji,
        titulo: pair.mitigacion.titulo,
        desc: pair.mitigacion.desc,
        bgColor: pair.mitigacion.color,
        data: pair
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
              onGameOver(updatedPlayers[0].score);
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
            onClick={() => {
              onGameOver(players[0].score);
              onExit();
            }}
            className="px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all ml-4"
          >
            Finalizar Partida
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
              <div className="flex gap-2 flex-shrink-0">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/10"
                  style={{ backgroundColor: showMatchInfo.riesgo.color }}
                >
                  {showMatchInfo.riesgo.emoji}
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/10"
                  style={{ backgroundColor: showMatchInfo.mitigacion.color }}
                >
                  {showMatchInfo.mitigacion.emoji}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">¡MITIGACIÓN CORRECTA!</span>
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1 leading-none">
                  {showMatchInfo.riesgo.titulo} + {showMatchInfo.mitigacion.titulo}
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed italic opacity-80">
                  {showMatchInfo.mitigacion.desc}
                </p>
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
          className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 border-4 ${
            isMatched ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/20'
          }`}
          style={{ 
            backfaceVisibility: 'hidden', 
            rotateY: '180deg',
            backgroundColor: card.bgColor 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
            <span className="text-4xl md:text-5xl mb-2 drop-shadow-2xl filter saturate-150">{card.content}</span>
            
            <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 w-full text-center">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white leading-none mb-1">
                {card.titulo}
              </p>
              <p className="text-[7px] font-bold uppercase tracking-widest text-white/60 leading-none">
                {card.type}
              </p>
            </div>
          </div>

          {/* Industrial Corner Accents */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/40"></div>
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-white/40"></div>
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-white/40"></div>
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/40"></div>
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
  { palabra: 'ARNES', definicion: 'EPP obligatorio para trabajos en altura que detiene la caída libre.', categoria: 'EPP', dificultad: 'Básico', referencia: 'Res. SRT 35/98' },
  { palabra: 'CASCO', definicion: 'Elemento de protección personal que protege la cabeza de impactos.', categoria: 'EPP', dificultad: 'Básico', referencia: 'IRAM 3620' },
  { palabra: 'RUIDO', definicion: 'Contaminante físico medido en decibeles que puede causar hipoacusia.', categoria: 'Higiene', dificultad: 'Básico', referencia: 'Dec. 351/79 Anexo V' },
  { palabra: 'POLVO', definicion: 'Contaminante particulado que puede causar enfermedades respiratorias.', categoria: 'Higiene', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'LOTO', definicion: 'Procedimiento de bloqueo y etiquetado de energías peligrosas.', categoria: 'Legislación', dificultad: 'Medio', referencia: 'IRAM 3625' },
  { palabra: 'NORMA', definicion: 'Documento técnico que establece requisitos mínimos obligatorios.', categoria: 'Legislación', dificultad: 'Básico', referencia: '-' },
  { palabra: 'TRAMO', definicion: 'Sector de una obra o instalación delimitado para la gestión.', categoria: 'Legislación', dificultad: 'Experto', referencia: 'Res. SRT 51/97' },
  { palabra: 'SIPSA', definicion: 'Sistema de Información sobre Prevención y Seguridad en el Trabajo.', categoria: 'Legislación', dificultad: 'Experto', referencia: '-' },
  { palabra: 'OHSAS', definicion: 'Estándar de gestión de seguridad laboral predecesor de ISO 45001.', categoria: 'Gestión', dificultad: 'Experto', referencia: 'OHSAS 18001' },
  { palabra: 'DOSIS', definicion: 'Cantidad de un agente físico o químico recibida por un trabajador.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Dec. 351/79' },
  { palabra: 'AUDIT', definicion: 'Proceso sistemático de evaluación del cumplimiento de un sistema.', categoria: 'Gestión', dificultad: 'Medio', referencia: 'ISO 45001' },
  { palabra: 'TURNO', definicion: 'Período de trabajo de un grupo de empleados en rotación.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'RIESGO', definicion: 'Posibilidad de que un peligro cause daño considerando probabilidad y consecuencia.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ZONA', definicion: 'Área delimitada con características de riesgo definidas.', categoria: 'Señalética', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ALERTA', definicion: 'Estado de advertencia activa ante una condición de riesgo inminente.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ESCAPE', definicion: 'Vía habilitada para la evacuación segura ante una emergencia.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'BRIGADA', definicion: 'Grupo de trabajadores capacitados para actuar ante emergencias.', categoria: 'Emergencias', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'TRAUMA', definicion: 'Lesión física causada por un agente externo como impacto o caída.', categoria: 'Emergencias', dificultad: 'Medio', referencia: '-' },
  { palabra: 'SIRENA', definicion: 'Dispositivo sonoro de alerta que indica inicio de evacuación.', categoria: 'Emergencias', dificultad: 'Básico', referencia: '-' },
  { palabra: 'COTEP', definicion: 'Comité Técnico de Prevención, organismo de gestión mixta.', categoria: 'Legislación', dificultad: 'Experto', referencia: '-' },
  { palabra: 'ERGON', definicion: 'Disciplina que adapta el trabajo a las capacidades del trabajador.', categoria: 'Gestión', dificultad: 'Experto', referencia: 'Res. 295/03' },
  { palabra: 'ACIDO', definicion: 'Sustancia corrosiva de pH bajo que causa quemaduras químicas.', categoria: 'Químico', dificultad: 'Medio', referencia: 'GHS/SGA' },
  { palabra: 'VAPOR', definicion: 'Estado gaseoso de una sustancia que puede ser tóxico o inflamable.', categoria: 'Químico', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'VIBRA', definicion: 'Movimiento oscilatorio transmitido al cuerpo por herramientas.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Res. 295/03' },
  { palabra: 'LASER', definicion: 'Radiación óptica coherente que puede causar daño ocular grave.', categoria: 'Higiene', dificultad: 'Experto', referencia: 'Dec. 351/79' },
  { palabra: 'CALOR', definicion: 'Estrés térmico por exposición a temperaturas elevadas.', categoria: 'Higiene', dificultad: 'Medio', referencia: 'Dec. 351/79' },
  { palabra: 'FLORA', definicion: 'Término general para la vegetación de una zona específica.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'ORDEN', definicion: 'Principio de organización que reduce riesgos de caída.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'PLANO', definicion: 'Documento técnico que representa la distribución de una planta.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' },
  { palabra: 'RADIO', definicion: 'Distancia de seguridad alrededor de un equipo o zona de riesgo.', categoria: 'Gestión', dificultad: 'Básico', referencia: '-' }
];

const WordleGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME'>('INTRO');
  const [mode, setMode] = useState<'DAILY' | 'FREE'>('DAILY');
  const [wordData, setWordData] = useState<any>(WORDLE_FALLBACK[0]);
  const [allWords, setAllWords] = useState<any[]>(WORDLE_FALLBACK);
  const [isLoading, setIsLoading] = useState(true);
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
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem('prevenwordle_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    setIsLoading(true);
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
        if (data.length > 0) setAllWords(data);
      })
      .catch(err => console.error('Error loading Wordle words:', err))
      .finally(() => setIsLoading(false));
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
    onGameOver(won ? (7 - attempts) * 100 : 0);
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
    
    // Count occurrences in target
    const targetCount = target.split('').filter(l => l === letter).length;
    if (targetCount === 0) return 'absent';
    
    // Count correct positions for this letter in the guess
    const correctCount = guess.split('').filter((l, i) => l === letter && target[i] === l).length;
    
    // Count occurrences of this letter in the guess up to this position (excluding correct ones)
    let occurrencesBefore = 0;
    for (let i = 0; i < pos; i++) {
      if (guess[i] === letter && target[i] !== letter) {
        occurrencesBefore++;
      }
    }
    
    if (occurrencesBefore < (targetCount - correctCount)) return 'present';
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

  if (isLoading) {
    return (
      <div className="h-screen obsidian-table flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]"></div>
        <p className="text-emerald-500 font-black uppercase tracking-widest text-xs animate-pulse">Sincronizando Base de Datos...</p>
      </div>
    );
  }

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
          <button 
            onClick={() => {
              onGameOver(0);
              onExit();
            }}
            className="px-6 py-2 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all ml-4"
          >
            Finalizar Partida
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

      <div className="flex-1 overflow-y-auto flex flex-col items-center p-4 relative z-10 custom-scrollbar">
        {/* Tarjeta de Pista Principal - Siempre visible para guiar al usuario */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 max-w-2xl w-full glass-panel-heavy p-8 md:p-10 rounded-[2.5rem] border-2 border-emerald-500/30 text-center relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] !overflow-visible"
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-charcoal text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg whitespace-nowrap">
            IDENTIFICA EL TÉRMINO
          </div>
          
          <p className="text-sm md:text-base text-white font-medium leading-relaxed mb-4 mt-4 normal-case italic">
            "{wordData.definicion}"
          </p>
          
          <div className="flex justify-center gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {wordData.categoria}
              </span>
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              {wordData.palabra.length} LETRAS
            </span>
          </div>
        </motion.div>

        {/* Guía Rápida de Juego */}
        <div className="mb-8 max-w-lg w-full grid grid-cols-3 gap-2">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl text-center">
            <div className="w-6 h-6 bg-emerald-500 rounded mx-auto mb-1 flex items-center justify-center text-[10px] font-black">V</div>
            <p className="text-[8px] font-black text-white/60 uppercase">Correcta</p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-2 rounded-xl text-center">
            <div className="w-6 h-6 bg-yellow-400 rounded mx-auto mb-1 flex items-center justify-center text-[10px] font-black text-charcoal">A</div>
            <p className="text-[8px] font-black text-white/60 uppercase">Lugar Erróneo</p>
          </div>
          <div className="bg-zinc-800 border border-white/5 p-2 rounded-xl text-center">
            <div className="w-6 h-6 bg-zinc-700 rounded mx-auto mb-1 flex items-center justify-center text-[10px] font-black">X</div>
            <p className="text-[8px] font-black text-white/60 uppercase">No Existe</p>
          </div>
        </div>

        {/* Instrucción de juego */}
        <div className="mb-6 text-center">
          <p className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[11px] animate-pulse">
            Escribe la palabra y presiona ENVIAR
          </p>
          <p className="text-white/30 text-[9px] uppercase tracking-widest mt-1">
            Los colores aparecerán al confirmar tu palabra ({6 - guesses.length} intentos restantes)
          </p>
        </div>

        <div className="grid gap-3 mb-10">
          {/* Solo mostramos las filas usadas y la actual para ahorrar espacio */}
          {[...Array(gameState === 'PLAYING' ? Math.min(6, guesses.length + 1) : guesses.length)].map((_, rowIndex) => {
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
                      className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-2xl md:text-3xl font-black rounded-lg border-2 transition-all duration-500 relative overflow-hidden ${
                        isSubmitted 
                        ? (status === 'correct' ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : status === 'present' ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] text-charcoal' : 'bg-zinc-800 border-zinc-700 opacity-40')
                        : (letter ? 'border-emerald-500 scale-105 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : (rowIndex === guesses.length ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 bg-white/5'))
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
                    className={`h-12 md:h-14 rounded-lg font-black text-[9px] md:text-xs flex items-center justify-center transition-all uppercase tracking-tighter ${
                      isSpecial ? 'px-3 md:px-4 bg-zinc-700 min-w-[50px] md:min-w-[60px]' : 'flex-1 bg-zinc-600'
                    } ${
                      status === 'correct' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : status === 'present' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)] text-charcoal' : status === 'absent' ? 'bg-zinc-900 opacity-30' : 'hover:bg-zinc-500 active:scale-95'
                    }`}
                  >
                    {key === 'BACKSPACE' ? 'BORRAR' : key === 'ENTER' ? 'ENVIAR' : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <WordleHelp onClose={() => setShowHelp(false)} />
        )}
        {showStats && (
          <WordleStats stats={stats} onClose={() => setShowStats(false)} />
        )}
        {gameState !== 'PLAYING' && (
          <WordleResult 
            gameState={gameState} 
            wordData={wordData} 
            guesses={guesses} 
            onRestart={() => selectWord('FREE')} 
            onShare={shareResult}
            onExit={onExit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const WordleHelp = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="max-w-md w-full glass-panel-heavy p-8 rounded-[2.5rem] border border-white/10 relative"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
        <X size={24} />
      </button>
      <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">¿Cómo jugar?</h3>
      <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
        <p>Adivina la palabra de seguridad en 6 intentos.</p>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded flex-shrink-0 flex items-center justify-center font-black text-white">C</div>
            <p>La letra está en la palabra y en la posición correcta.</p>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded flex-shrink-0 flex items-center justify-center font-black text-white">A</div>
            <p>La letra está en la palabra pero en la posición incorrecta.</p>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded flex-shrink-0 flex items-center justify-center font-black text-white/40">S</div>
            <p>La letra no está en la palabra.</p>
          </li>
          <li className="flex gap-4">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/40 rounded flex-shrink-0 flex items-center justify-center text-emerald-500">
              <Lightbulb size={20} />
            </div>
            <p>Usa el botón de pista para ver la definición técnica de la palabra.</p>
          </li>
        </ul>
        <div className="pt-6 border-t border-white/10">
          <p className="font-black text-emerald-500 uppercase tracking-widest text-[10px] mb-2">Consejo de Seguridad</p>
          <p className="italic opacity-60">"Todas las palabras están relacionadas con la prevención de riesgos y la norma ISO 45001."</p>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="mt-8 w-full py-4 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-xl uppercase tracking-widest text-sm"
      >
        ¡ENTENDIDO!
      </button>
    </motion.div>
  </motion.div>
);

const WordleStats = ({ stats, onClose }: { stats: any, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="max-w-md w-full glass-panel-heavy p-8 rounded-[2.5rem] border border-white/10 relative text-center"
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white">
        <X size={24} />
      </button>
      <h3 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter">Estadísticas</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jugadas', val: stats.played },
          { label: '% Ganas', val: stats.played ? Math.round((stats.won / stats.played) * 100) : 0 },
          { label: 'Racha', val: stats.streak },
          { label: 'Máxima', val: stats.maxStreak }
        ].map(s => (
          <div key={s.label}>
            <p className="text-2xl font-black text-white">{s.val}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-white/40">{s.label}</p>
          </div>
        ))}
      </div>

      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4 text-left">Distribución de Intentos</h4>
      <div className="space-y-2 mb-8">
        {stats.distribution.map((count: number, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-black text-white/40 w-2">{i + 1}</span>
            <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.played ? (count / stats.played) * 100 : 0}%` }}
                className={`h-full flex items-center justify-end px-2 text-[10px] font-black ${count > 0 ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-white/20'}`}
              >
                {count}
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full py-4 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-xl uppercase tracking-widest text-sm"
      >
        CERRAR
      </button>
    </motion.div>
  </motion.div>
);

const WordleResult = ({ gameState, wordData, guesses, onRestart, onShare, onExit }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="max-w-md w-full glass-panel-heavy p-10 rounded-[3rem] border border-white/10 text-center relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-full h-2 ${gameState === 'WON' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
      
      <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${gameState === 'WON' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        {gameState === 'WON' ? <Trophy size={40} /> : <AlertTriangle size={40} />}
      </div>

      <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
        {gameState === 'WON' ? '¡EXCELENTE!' : 'FIN DEL TURNO'}
      </h2>
      <p className="text-on-surface-variant font-black uppercase tracking-[0.3em] text-[10px] mb-8 opacity-60">
        {gameState === 'WON' ? 'Protocolo Identificado' : 'Falla en la Identificación'}
      </p>

      <div className="bg-black/20 p-6 rounded-2xl border border-white/5 mb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">La palabra era</p>
        <p className="text-4xl font-black text-white tracking-[0.2em] mb-4">{wordData.palabra}</p>
        <div className="h-px w-12 bg-white/10 mx-auto mb-4"></div>
        <p className="text-sm text-on-surface-variant italic leading-relaxed">
          "{wordData.definicion}"
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-widest">{wordData.categoria}</span>
          <span className="text-[8px] font-black bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-widest">{wordData.referencia}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={onShare}
          className="py-4 bg-white/5 border border-white/10 text-white font-headline font-black rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
        >
          <Share2 size={16} /> COMPARTIR
        </button>
        <button 
          onClick={onRestart}
          className="py-4 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all"
        >
          <RotateCcw size={16} /> REINTENTAR
        </button>
      </div>
      
      <button 
        onClick={onExit}
        className="mt-6 text-white/40 font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
      >
        Volver al Menú Principal
      </button>
    </motion.div>
  </div>
);

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

const JengaGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
        className="text-center mb-8 md:mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-7xl font-headline tracking-tighter mb-2">JENGA<span className="text-tertiary">SEGURO</span></h1>
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="h-[1px] w-8 md:w-12 bg-white/20"></div>
          <p className="text-[8px] md:text-[10px] font-headline uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/40">Industrial Safety Training</p>
          <div className="h-[1px] w-8 md:w-12 bg-white/20"></div>
        </div>
      </motion.div>

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="glass-panel-heavy p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-4 md:space-y-8 group hover:border-emerald-500/30 transition-all duration-500"
        >
          <div className="p-4 md:p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
            <Printer className="w-8 h-8 md:w-12 md:h-12 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-headline mb-2 md:mb-3">MODO IMPRESIÓN</h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-body">Genera etiquetas físicas de alta visibilidad para tu torre Jenga real.</p>
          </div>
          <button 
            onClick={() => setMode('PRINT')} 
            className="w-full py-4 md:py-5 bg-emerald-500 text-on-primary-fixed font-headline font-black rounded-xl hard-shadow-sm btn-industrial-orange uppercase tracking-widest text-[10px] md:text-sm"
          >
            CONFIGURAR ETIQUETAS
          </button>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.1 }}
          className="glass-panel-heavy p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-4 md:space-y-8 group hover:border-amber-500/30 transition-all duration-500"
        >
          <div className="p-4 md:p-6 bg-amber-500/10 rounded-2xl border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
            <Monitor className="w-8 h-8 md:w-12 md:h-12 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-3xl font-headline mb-2 md:mb-3">MODO DIGITAL</h2>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed font-body">Utiliza la interfaz digital proyectada para dinamizar tus talleres.</p>
          </div>
          <button 
            onClick={() => setMode('DIGITAL')} 
            className="w-full py-4 md:py-5 bg-amber-500 text-on-secondary-fixed font-headline font-black rounded-xl hard-shadow-sm btn-industrial-orange uppercase tracking-widest text-[10px] md:text-sm"
          >
            INICIAR TALLER
          </button>
        </motion.div>
      </div>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => {
          onGameOver(score.correct * 10);
          onExit();
        }} 
        className="mt-8 md:mt-16 px-6 md:px-8 py-2 md:py-3 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-3"
      >
        Finalizar Partida
      </motion.button>

      <motion.button 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onExit} 
        className="mt-3 md:mt-4 px-6 md:px-8 py-2 md:py-3 glass-panel-heavy rounded-full text-white/40 font-headline font-black uppercase text-[10px] md:text-xs tracking-widest hover:text-tertiary hover:border-tertiary/30 transition-all flex items-center gap-2 md:gap-3"
      >
        <LogOut size={12} /> Volver al Menú Principal
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
    <div className="h-screen flex flex-col obsidian-table text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-5 pointer-events-none"></div>
      
      <header className="glass-panel-heavy p-6 flex justify-between items-center border-b border-white/10 z-20 relative">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setMode('START')} 
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group"
          >
            <ChevronLeft size={24} className="group-hover:text-emerald-500 transition-colors" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter leading-none uppercase">JENGA<span className="text-emerald-500">SEGURO</span></h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/60 mt-1">Taller Digital Interactivo</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest mb-1">Correctas</p>
              <p className="text-3xl font-black leading-none">{score.correct}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase text-rose-500 tracking-widest mb-1">Incorrectas</p>
              <p className="text-3xl font-black leading-none">{score.incorrect}</p>
            </div>
          </div>
          <button 
            onClick={() => { setScore({ correct: 0, incorrect: 0 }); setAnsweredIds(new Set()); }} 
            className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10 hover:border-emerald-500/30 group"
          >
            <RotateCcw size={22} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col items-center">
          <div className="mb-8 w-full flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Progreso del Taller</p>
              <div className="flex items-center gap-4">
                <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredIds.size / data.length) * 100}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <span className="text-xs font-black text-white/40">{answeredIds.size} / {data.length}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {['Básico', 'Medio', 'Experto'].map(lvl => (
                <div key={lvl} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${getLevelColorClass(lvl)}`}></div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{lvl}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-3 w-full max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar p-2">
            {data.map((block) => {
              const isAnswered = answeredIds.has(block.numero);
              return (
                <motion.button 
                  key={block.numero} 
                  whileHover={!isAnswered ? { scale: 1.05, y: -5 } : {}}
                  whileTap={!isAnswered ? { scale: 0.95 } : {}}
                  onClick={() => { if(!isAnswered) { setSelectedBlock(block); setRevealAnswer(false); } }}
                  className={`aspect-square rounded-2xl font-black text-lg transition-all flex items-center justify-center border-2 relative overflow-hidden ${
                    isAnswered 
                    ? 'bg-zinc-900 border-zinc-800 opacity-20 pointer-events-none' 
                    : `bg-white/5 ${getLevelBorderClass(block.nivel)} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]`
                  }`}
                >
                  {!isAnswered && (
                    <div className={`absolute top-0 left-0 w-full h-1 ${getLevelColorClass(block.nivel)}`}></div>
                  )}
                  <span className={`relative z-10 ${isAnswered ? 'text-white/20' : 'text-white'}`}>{block.numero}</span>
                  {!isAnswered && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedBlock && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 40 }}
              className="max-w-4xl w-full glass-panel-heavy p-12 rounded-[4rem] border border-white/10 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-hex-grid opacity-10 pointer-events-none"></div>
              
              <button 
                onClick={() => setSelectedBlock(null)} 
                className="absolute top-10 right-10 p-3 hover:bg-white/10 rounded-full transition-all z-20"
              >
                <X size={32} className="text-white/40 hover:text-white" />
              </button>

              <div className="space-y-12 relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <span className="text-8xl font-black text-white/5 leading-none tracking-tighter">#{selectedBlock.numero}</span>
                    <div className="space-y-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-2 ${getLevelBorderClass(selectedBlock.nivel)} ${getLevelTextClass(selectedBlock.nivel)}`}>
                        Nivel {selectedBlock.nivel}
                      </span>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-500/60">{selectedBlock.categoria}</p>
                    </div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-white">
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
                      <div className={`absolute top-0 left-0 w-2 h-full ${getLevelColorClass(selectedBlock.nivel)}`}></div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-6 ${getLevelTextClass(selectedBlock.nivel)}`}>Respuesta Técnica Validada</p>
                      <p className="text-2xl font-black text-white mb-6 leading-relaxed">{selectedBlock.respuesta}</p>
                      <div className="h-[1px] w-full bg-white/10 mb-6"></div>
                      <p className="text-sm italic text-white/50 leading-relaxed">
                        {selectedBlock.explicacion}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, correct: s.correct+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#f7be1d'] }); 
                        }} 
                        className="py-6 bg-emerald-500 text-on-primary-fixed font-black rounded-2xl shadow-lg hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <CheckCircle2 size={24} /> MARCACIÓN CORRECTA
                      </button>
                      <button 
                        onClick={() => { 
                          setScore(s => ({...s, incorrect: s.incorrect+1})); 
                          setAnsweredIds(prev => new Set(prev).add(selectedBlock.numero)); 
                          setSelectedBlock(null); 
                        }} 
                        className="py-6 bg-rose-500 text-on-primary-fixed font-black rounded-2xl shadow-lg hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-4 uppercase tracking-widest text-sm"
                      >
                        <XCircle size={24} /> MARCACIÓN INCORRECTA
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setRevealAnswer(true)} 
                    className="w-full py-12 bg-white/5 border-2 border-dashed border-white/20 rounded-[2.5rem] text-white/40 font-black uppercase tracking-[0.5em] hover:bg-white/10 hover:border-emerald-500/40 hover:text-emerald-500 transition-all flex items-center justify-center gap-6 group"
                  >
                    <Zap className="text-emerald-500 group-hover:scale-125 transition-transform duration-500" size={28} /> 
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

// --- DECISIONES SEGURAS GAME ---

const DECISIONES_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=841550883&single=true&output=csv';

const DECISIONES_FALLBACK = [
  {
    escenario: "Andamio sin barandas",
    descripcion: "Te encontrás con un andamio de 3 cuerpos de altura que no posee barandas de seguridad ni rodapiés. Un compañero se dispone a subir.",
    imagen_url: "",
    opcion_a: "Autorizar el trabajo con precaución",
    opcion_b: "Parar la tarea y reportar",
    opcion_c: "Avisar al capataz al final del día",
    correcta: "B",
    consecuencia_correcta: "Evitaste una caída a distinto nivel. La seguridad no es negociable.",
    consecuencia_incorrecta: "Riesgo crítico de caída. Nunca se debe trabajar en altura sin protecciones colectivas.",
    principio: "Derecho a decir NO ante condiciones inseguras.",
    dificultad: "Baja"
  },
  {
    escenario: "EPP deteriorado",
    descripcion: "Tus guantes de protección mecánica tienen agujeros y el recubrimiento está gastado. Tenés que manipular chapas con bordes filosos.",
    imagen_url: "",
    opcion_a: "Usarlos igual con cuidado",
    opcion_b: "Descartarlos y pedir nuevos",
    opcion_c: "Dejarlos para que otro los use",
    correcta: "B",
    consecuencia_correcta: "Protegiste tus manos. El EPP en mal estado no protege.",
    consecuencia_incorrecta: "Riesgo de corte severo. El EPP debe estar en óptimas condiciones.",
    principio: "El EPP es la última barrera, debe ser íntegro.",
    dificultad: "Baja"
  },
  {
    escenario: "Derrame de aceite",
    descripcion: "En un pasillo de alto tránsito peatonal y de autoelevadores, detectás una mancha de aceite importante.",
    imagen_url: "",
    opcion_a: "Rodear la mancha",
    opcion_b: "Limpiar y señalizar el área",
    opcion_c: "Ignorar y seguir tu ruta",
    correcta: "B",
    consecuencia_correcta: "Previniste resbalones y choques. Orden y limpieza son seguridad.",
    consecuencia_incorrecta: "Riesgo de accidente múltiple. Los derrames deben tratarse de inmediato.",
    principio: "Mantener el área limpia es responsabilidad de todos.",
    dificultad: "Media"
  },
  {
    escenario: "Compañero sin casco",
    descripcion: "Entrás a una zona de carga suspendida y ves a un compañero trabajando sin su casco de seguridad.",
    imagen_url: "",
    opcion_a: "Ignorar la situación",
    opcion_b: "Avisarle que use el casco",
    opcion_c: "Reportar directo al supervisor",
    correcta: "B",
    consecuencia_correcta: "Cuidado mutuo. Ayudaste a un compañero a estar seguro.",
    consecuencia_incorrecta: "Riesgo de golpe fatal. La omisión nos hace cómplices del riesgo.",
    principio: "Yo te cuido, vos me cuidás.",
    dificultad: "Baja"
  },
  {
    escenario: "Trabajo en caliente sin permiso",
    descripcion: "Se requiere realizar una soldadura de emergencia, pero el emisor de permisos no está disponible y el permiso venció hace una hora.",
    imagen_url: "",
    opcion_a: "Comenzar igual por la urgencia",
    opcion_b: "Detener y tramitar nuevo permiso",
    opcion_c: "Pedir permiso verbal por radio",
    correcta: "B",
    consecuencia_correcta: "Respetaste los procesos críticos. Las urgencias no justifican riesgos.",
    consecuencia_incorrecta: "Riesgo de incendio o explosión. Los permisos de trabajo son vitales.",
    principio: "Ninguna urgencia justifica saltarse un procedimiento de seguridad.",
    dificultad: "Alta"
  }
];

const DecisionesSegurasGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FEEDBACK' | 'FINISHED'>('START');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch(DECISIONES_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        const parsed = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          
          // Basic mapping based on expected structure
          // 0: ID, 1: Escenario/Consigna, 2: Imagen, 3: Opción A, 4: Opción B, 5: Opción C, 6: Correcta, 7: Consecuencia Correcta, 8: Consecuencia Incorrecta, 9: Principio
          const escenario = cols[1] || "";
          const raw_imagen_url = cols[2]?.startsWith('http') ? cols[2] : "";
          const imagen_url = getDirectImageUrl(raw_imagen_url);
          
          return {
            id: cols[0],
            escenario: escenario.length > 50 ? "Toma de Decisión" : escenario,
            descripcion: escenario,
            imagen_url: imagen_url,
            opcion_a: cols[3],
            opcion_b: cols[4],
            opcion_c: cols[5],
            correcta: cols[6]?.toUpperCase(),
            consecuencia_correcta: cols[7] || "¡Excelente decisión! Has priorizado la seguridad.",
            consecuencia_incorrecta: cols[8] || "Riesgo detectado. Recordá siempre seguir el protocolo.",
            principio: cols[9] || "La seguridad es lo primero.",
            dificultad: "Media"
          };
        }).filter(s => s.descripcion);
        
        if (parsed.length > 0) {
          setScenarios(parsed);
        } else {
          setScenarios(DECISIONES_FALLBACK);
        }
      } catch (error) {
        console.error("Error fetching scenarios:", error);
        setScenarios(DECISIONES_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const handleDecision = (option: string) => {
    const current = scenarios[currentIndex];
    const correct = option === current.correcta;
    setSelectedOption(option);
    setIsCorrect(correct);
    
    if (correct) {
      setCorrectAnswers(c => c + 1);
      const points = 100 * (streak + 1);
      setScore(s => s + points);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
    
    setGameState('FEEDBACK');
  };

  const nextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setGameState('PLAYING');
    } else {
      setGameState('FINISHED');
      onGameOver(score);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f7be1d', '#3b82f6']
      });
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    setGameState('START');
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const getFinalBadge = () => {
    const percentage = (correctAnswers / scenarios.length) * 100;
    if (percentage <= 50) return { label: 'Operador en Formación', color: 'text-rose-500', bg: 'bg-rose-500/20' };
    if (percentage <= 80) return { label: 'Operador Calificado', color: 'text-amber-500', bg: 'bg-amber-500/20' };
    return { label: 'Referente de Seguridad', color: 'text-emerald-500', bg: 'bg-emerald-500/20' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-emerald-500 font-black tracking-widest uppercase text-xs">Cargando Escenarios...</p>
        </div>
      </div>
    );
  }

  const current = scenarios[currentIndex];
  const progress = ((currentIndex + 1) / scenarios.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500 selection:text-black overflow-hidden flex flex-col">
      {/* Header / Progress */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-1 bg-white/10 w-full">
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
              <ShieldCheck className="text-emerald-500" size={20} />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase text-white/40">Misión_09</h2>
              <h1 className="text-sm font-black tracking-tight uppercase">Decisiones Seguras</h1>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Puntaje</p>
              <p className="text-xl font-black text-emerald-500 tabular-nums">{score.toLocaleString()}</p>
            </div>
            <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div 
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex items-center justify-center p-6 pt-24"
          >
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                <ShieldCheck className="relative text-emerald-500 mx-auto" size={80} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Briefing de<br/><span className="text-emerald-500">Conducta Segura</span></h2>
                <p className="text-lg text-white/60 font-medium leading-relaxed max-w-lg mx-auto">
                  Enfrentá escenarios reales de la operación. Tus decisiones determinan la seguridad del equipo y la integridad del proceso.
                </p>
              </div>
              <button 
                onClick={() => setGameState('PLAYING')}
                className="group relative px-12 py-6 bg-emerald-500 text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative flex items-center gap-3 text-lg tracking-widest uppercase">
                  Iniciar Misión <ArrowRight size={24} />
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {(gameState === 'PLAYING' || gameState === 'FEEDBACK') && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col pt-20"
          >
            {/* Image Section (40%) */}
            <div className="h-[40vh] relative overflow-hidden bg-white/5">
              {current.imagen_url ? (
                <img 
                  src={current.imagen_url} 
                  alt="Escenario de seguridad"
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <img 
                    src={`https://picsum.photos/seed/${currentIndex}/800/400?blur=2`}
                    alt="Placeholder"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    referrerPolicy="no-referrer"
                  />
                  <svg viewBox="0 0 200 200" className="w-64 h-64 fill-current text-white relative z-10">
                    <path d="M20,180 L180,180 L180,150 L160,150 L160,100 L140,100 L140,150 L120,150 L120,80 L100,80 L100,150 L80,150 L80,120 L60,120 L60,150 L40,150 L40,180 Z" />
                    <rect x="90" y="40" width="20" height="40" />
                    <circle cx="100" cy="30" r="10" />
                  </svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
              
              {/* Scenario Badge */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="px-4 py-1.5 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                  Escenario {currentIndex + 1} / {scenarios.length}
                </div>
                {streak > 1 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center gap-2"
                  >
                    <Zap size={12} fill="currentColor" /> Racha x{streak}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 px-8 pb-8 -mt-12 relative z-10 max-w-4xl mx-auto w-full space-y-8">
              {/* Glass Panel Description */}
              <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl space-y-4">
                {current.escenario && current.escenario !== current.descripcion && (
                  <h3 className="text-3xl font-black tracking-tight uppercase leading-none">{current.escenario}</h3>
                )}
                <p className="text-lg text-white/60 font-medium leading-relaxed">
                  {current.descripcion}
                </p>
              </div>

              {/* Options or Feedback */}
              <div className="space-y-4">
                {gameState === 'PLAYING' ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'A', text: current.opcion_a },
                      { id: 'B', text: current.opcion_b },
                      { id: 'C', text: current.opcion_c }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleDecision(opt.id)}
                        className="group relative w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-left transition-all hover:bg-white/10 hover:border-emerald-500/40 flex items-center gap-6"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                          {opt.id}
                        </div>
                        <span className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-8 rounded-[2.5rem] border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-rose-500/10 border-rose-500/40'} space-y-6`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isCorrect ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                        {isCorrect ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className={`text-xl font-black uppercase tracking-widest ${isCorrect ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isCorrect ? 'Decisión Correcta' : 'Riesgo Detectado'}
                        </h4>
                        <p className="text-lg font-medium text-white/90 leading-relaxed">
                          {isCorrect ? current.consecuencia_correcta : current.consecuencia_incorrecta}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Principio Preventivo</p>
                      <p className="text-sm font-bold text-emerald-500/80 italic leading-relaxed">
                        "{current.principio}"
                      </p>
                    </div>

                    <button 
                      onClick={nextScenario}
                      className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {currentIndex < scenarios.length - 1 ? 'Siguiente Escenario' : 'Ver Resultados'} <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'FINISHED' && (
          <motion.div 
            key="finished"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-6 pt-24"
          >
            <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center space-y-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              
              <div className="space-y-4">
                <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/40">Misión Completada</h2>
                <h3 className="text-5xl font-black tracking-tighter uppercase">Análisis Final</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Puntaje Total</p>
                  <p className="text-4xl font-black text-emerald-500 tabular-nums">{score.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Efectividad</p>
                  <p className="text-4xl font-black text-white tabular-nums">{Math.round((correctAnswers / scenarios.length) * 100)}%</p>
                </div>
              </div>

              <div className={`p-8 rounded-3xl border border-white/10 ${getFinalBadge().bg} space-y-4`}>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Rango Alcanzado</p>
                <div className={`text-2xl font-black uppercase tracking-tighter ${getFinalBadge().color}`}>
                  {getFinalBadge().label}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={resetGame}
                  className="w-full py-6 bg-emerald-500 text-black font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Reintentar Misión
                </button>
                <button 
                  onClick={onExit}
                  className="w-full py-6 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                >
                  Volver al Menú
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- CAZADOR DE RIESGOS GAME ---

const CAZADOR_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1792989854&single=true&output=csv';

const CAZADOR_FALLBACK = [
  {
    escena: "Taller de Mantenimiento",
    imagen_url: "",
    peligros: [
      { id: 1, peligro: "Cable Pelado", x: 150, y: 400, radio: 40, medida: "Aislar y reemplazar cableado", norma: "IRAM 2059" },
      { id: 2, peligro: "Caja bloqueando salida", x: 700, y: 350, radio: 50, medida: "Liberar vías de escape", norma: "Ley 19587 Cap. 18" },
      { id: 3, peligro: "Extintor vencido", x: 50, y: 200, radio: 35, medida: "Recargar y verificar manómetro", norma: "NFPA 10" },
      { id: 4, peligro: "Operario sin casco", x: 400, y: 150, radio: 45, medida: "Uso obligatorio de EPP", norma: "Res. SRT 299/11" }
    ]
  },
  {
    escena: "Almacén Central",
    imagen_url: "",
    peligros: [
      { id: 5, peligro: "Derrame sin señalizar", x: 300, y: 450, radio: 60, medida: "Limpiar y colocar cartelería", norma: "SGA / GHS" },
      { id: 6, peligro: "Estantes sobrecargados", x: 600, y: 100, radio: 55, medida: "Respetar carga máxima", norma: "EN 15635" },
      { id: 7, peligro: "Iluminación deficiente", x: 400, y: 50, radio: 40, medida: "Aumentar luxes en puesto", norma: "ISO 8995" }
    ]
  }
];

const CazadorDeRiesgosGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [scenes, setScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [foundIds, setFoundIds] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'SELECT' | 'PLAY' | 'RESULT'>('SELECT');
  const [lastClick, setLastClick] = useState<{ x: number, y: number, success: boolean } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(CAZADOR_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        
        const grouped: { [key: string]: any } = {};
        rows.forEach(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          const escena = cols[1] || "";
          const imgUrl = getDirectImageUrl(cols[2]); // C=escena_url
          if (!imgUrl) return;
          
          if (!grouped[imgUrl]) {
            grouped[imgUrl] = {
              id: cols[0], // A=escena_id
              escena: escena.length > 50 ? "Inspección de Planta" : escena,
              imagen_url: imgUrl,
              peligros: []
            };
          }
          
          grouped[imgUrl].peligros.push({
            id: Math.random(),
            peligro: cols[5], // F=riesgo_nombre
            x: parseFloat(cols[3]), // D=riesgo_x
            y: parseFloat(cols[4]), // E=riesgo_y
            radio: 30, // Default
            medida: cols[6], // G=riesgo_detalle
            norma: cols[7] // H=riesgo_norma
          });
        });
        
        const parsed = Object.values(grouped);
        if (parsed.length > 0) setScenes(parsed);
        else setScenes(CAZADOR_FALLBACK);
      } catch (error) {
        console.error("Error fetching scenes:", error);
        setScenes(CAZADOR_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchScenes();
  }, []);

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAY' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'PLAY') {
      handleGameOver();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStartScene = (scene: any) => {
    setSelectedScene(scene);
    setFoundIds([]);
    setTimeLeft(60);
    setScore(0);
    setGameState('PLAY');
  };

  const handleClick = (e: React.MouseEvent) => {
    if (gameState !== 'PLAY' || !selectedScene || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Scale click to 800x500 reference
    const refX = (clickX / rect.width) * 800;
    const refY = (clickY / rect.height) * 500;
    
    let found = false;
    let foundPeligro: any = null;
    
    selectedScene.peligros.forEach((p: any) => {
      if (foundIds.includes(p.id)) return;
      
      const dist = Math.sqrt(Math.pow(refX - p.x, 2) + Math.pow(refY - p.y, 2));
      if (dist <= p.radio) {
        setFoundIds(prev => [...prev, p.id]);
        setScore(s => s + 100);
        found = true;
        foundPeligro = p;
      }
    });

    setLastClick({ x: clickX, y: clickY, success: found });
    setTimeout(() => setLastClick(null), 800);

    if (found && foundIds.length + 1 === selectedScene.peligros.length) {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    const timeBonus = timeLeft * 5;
    const finalScore = score + timeBonus;
    setScore(finalScore);
    setGameState('RESULT');
    onGameOver(finalScore);
    
    // Update local ranking
    const localRanking = JSON.parse(localStorage.getItem(`ranking_cazador_${selectedScene.escena}`) || '[]');
    const newRanking = [...localRanking, { score: finalScore, date: new Date().toLocaleDateString() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem(`ranking_cazador_${selectedScene.escena}`, JSON.stringify(newRanking));
    setRanking(newRanking);

    if (foundIds.length === selectedScene.peligros.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const renderFallbackSVG = (sceneName: string) => {
    return (
      <svg viewBox="0 0 800 500" className="w-full h-full bg-slate-900">
        {/* Background elements */}
        <rect x="0" y="400" width="800" height="100" fill="#1e293b" />
        <rect x="50" y="100" width="700" height="300" fill="#0f172a" stroke="#334155" />
        
        {sceneName === "Taller de Mantenimiento" ? (
          <>
            {/* Cable pelado */}
            <path d="M100,400 Q150,350 200,400" stroke="#fbbf24" strokeWidth="4" fill="none" strokeDasharray="8 4" />
            {/* Caja bloqueando salida */}
            <rect x="680" y="320" width="60" height="60" fill="#92400e" />
            <text x="710" y="310" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">SALIDA</text>
            {/* Extintor vencido */}
            <rect x="40" y="180" width="20" height="50" fill="#ef4444" rx="5" />
            {/* Operario sin casco */}
            <circle cx="400" cy="150" r="20" fill="#fde68a" />
            <rect x="380" y="170" width="40" height="60" fill="#3b82f6" />
          </>
        ) : (
          <>
            {/* Derrame sin señalizar */}
            <ellipse cx="300" cy="450" rx="60" ry="20" fill="#475569" opacity="0.6" />
            {/* Estantes sobrecargados */}
            <rect x="550" y="50" width="100" height="20" fill="#ef4444" />
            <rect x="550" y="80" width="100" height="20" fill="#ef4444" />
            <rect x="550" y="110" width="100" height="20" fill="#ef4444" />
            {/* Iluminación deficiente */}
            <circle cx="400" cy="50" r="15" fill="#1e293b" stroke="#334155" />
          </>
        )}
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-rose-500 font-black tracking-widest uppercase text-xs">Escaneando Planta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-rose-500 selection:text-black flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/40">
            <Search className="text-rose-600" size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-white/40">Misión_10</h2>
            <h1 className="text-sm font-black tracking-tight uppercase">Cazador de Riesgos</h1>
          </div>
        </div>
        
        {gameState === 'PLAY' && (
          <div className="flex items-center gap-12">
            <div className="text-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Peligros</p>
              <p className="text-xl font-black text-white tabular-nums">{foundIds.length} / {selectedScene.peligros.length}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tiempo</p>
              <p className={`text-xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : timeLeft < 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                {timeLeft}s
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Puntaje</p>
            <p className="text-xl font-black text-rose-500 tabular-nums">{score.toLocaleString()}</p>
          </div>
          <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'SELECT' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 p-8 pt-12 overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Seleccioná una <span className="text-rose-600">Escena</span></h2>
                <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Inspección Visual de Seguridad Industrial</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scenes.map((scene, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStartScene(scene)}
                    className="group cursor-pointer bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-rose-500/40 transition-all"
                  >
                    <div className="h-48 bg-slate-900 relative">
                      {scene.imagen_url ? (
                        <img src={scene.imagen_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                           <Monitor size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{scene.peligros.length} Peligros</p>
                        <h3 className="text-xl font-black uppercase tracking-tight">{scene.escena}</h3>
                      </div>
                    </div>
                    <div className="p-6 flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nivel: Experto</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-black transition-colors">
                        <Play size={16} fill="currentColor" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'PLAY' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Main Inspection Area */}
            <div className="flex-1 p-8 flex items-center justify-center bg-black relative">
              <div 
                ref={containerRef}
                onClick={handleClick}
                className="relative max-w-[800px] w-full aspect-[800/500] bg-slate-900 rounded-2xl overflow-hidden cursor-crosshair shadow-2xl border border-white/10"
              >
                {selectedScene.imagen_url ? (
                  <img 
                    src={selectedScene.imagen_url} 
                    className="w-full h-full object-contain pointer-events-none" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  renderFallbackSVG(selectedScene.escena)
                )}

                {/* Found Markers */}
                {selectedScene.peligros.map((p: any) => foundIds.includes(p.id) && (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute w-12 h-12 border-4 border-emerald-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 500) * 100}%` }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  </motion.div>
                ))}

                {/* Click Feedback */}
                {lastClick && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    className={`absolute w-8 h-8 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${lastClick.success ? 'border-emerald-500' : 'border-rose-500'}`}
                    style={{ left: lastClick.x, top: lastClick.y }}
                  >
                    {lastClick.success ? <CheckCircle2 size={16} className="text-emerald-500" /> : <X size={16} className="text-rose-500" />}
                  </motion.div>
                )}

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                   <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Rec: Live Feed</p>
                </div>
              </div>
            </div>

            {/* Sidebar HUD */}
            <div className="w-full lg:w-[400px] bg-white/5 border-l border-white/10 p-8 overflow-y-auto space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList size={14} /> Hallazgos Detectados
                </h3>
                <div className="space-y-4">
                  {foundIds.length === 0 && (
                    <div className="p-6 border-2 border-dashed border-white/10 rounded-2xl text-center">
                      <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Escaneando escena...</p>
                    </div>
                  )}
                  {foundIds.map(id => {
                    const p = selectedScene.peligros.find((x: any) => x.id === id);
                    return (
                      <motion.div 
                        key={id}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-emerald-500 uppercase tracking-tight">{p.peligro}</h4>
                          <span className="text-[9px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded">OK</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                            <span className="text-white/40 uppercase mr-1">Control:</span> {p.medida}
                          </p>
                          <p className="text-[9px] font-mono text-emerald-500/60">
                            Ref: {p.norma}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Card */}
              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center space-y-10 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${foundIds.length === selectedScene.peligros.length ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                
                <div className="space-y-4">
                  <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/40">Inspección Finalizada</h2>
                  <h3 className="text-5xl font-black tracking-tighter uppercase leading-none">
                    {foundIds.length === selectedScene.peligros.length ? 'Planta Segura' : 'Riesgos Pendientes'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Puntaje</p>
                    <p className="text-4xl font-black text-rose-500 tabular-nums">{score.toLocaleString()}</p>
                  </div>
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Hallazgos</p>
                    <p className="text-4xl font-black text-white tabular-nums">{foundIds.length} / {selectedScene.peligros.length}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setGameState('SELECT')}
                    className="w-full py-6 bg-rose-600 text-white font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Nueva Inspección
                  </button>
                  <button 
                    onClick={onExit}
                    className="w-full py-6 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                  >
                    Volver al Menú
                  </button>
                </div>
              </div>

              {/* Ranking Card */}
              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-8">
                <h3 className="text-xl font-black uppercase tracking-widest text-white/40 border-b border-white/10 pb-4">Top Inspectores</h3>
                <div className="space-y-4">
                  {ranking.length > 0 ? ranking.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-rose-500 font-black text-lg">#{i+1}</span>
                        <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{r.date}</span>
                      </div>
                      <span className="font-mono font-black text-white">{r.score.toLocaleString()}</span>
                    </div>
                  )) : (
                    <p className="text-center text-white/20 font-bold uppercase tracking-widest py-12">Sin registros previos</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- PARE Y PIDA AYUDA GAME ---

const PARE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1987480223&single=true&output=csv';

const PARE_FALLBACK = {
  "inicio_1": {
    id: "inicio_1",
    historia: "Historia 1: Fuga de Gas",
    situacion: "Encontrás una fuga de gas en el sector de calderas. El olor es penetrante y se escucha un silbido fuerte.",
    opciones: [
      { texto: "Intentar cerrar la válvula manualmente", siguiente: "exposicion_gas" },
      { texto: "Evacuar el área y activar la alarma", siguiente: "esperar_brigada" },
      { texto: "Avisar solo a tu compañero cercano", siguiente: "demora_respuesta" }
    ]
  },
  "exposicion_gas": {
    id: "exposicion_gas",
    situacion: "Al intentar cerrar la válvula sin protección, inhalás una alta concentración de gas y perdés el conocimiento.",
    es_final: "SI",
    tipo_final: "critico",
    aprendizaje: "Nunca intentes controlar una fuga crítica sin el equipo y entrenamiento adecuado. La prioridad es la evacuación y el aviso a emergencias."
  },
  "esperar_brigada": {
    id: "esperar_brigada",
    situacion: "Activaste la alarma y evacuaste a todos. La brigada llega en minutos y controla la fuga de forma segura.",
    es_final: "SI",
    tipo_final: "correcto",
    aprendizaje: "Actuar según el plan de emergencia salva vidas. Identificar el riesgo, alejarse y dar aviso es la conducta correcta."
  },
  "demora_respuesta": {
    id: "demora_respuesta",
    situacion: "El aviso informal no llega a los responsables. La fuga aumenta y se produce una pequeña explosión que daña equipos.",
    es_final: "SI",
    tipo_final: "incidente",
    aprendizaje: "Las comunicaciones de emergencia deben ser formales y masivas (alarmas) para asegurar una respuesta inmediata."
  },
  "inicio_2": {
    id: "inicio_2",
    historia: "Historia 2: Procedimiento LOTO",
    situacion: "Tu compañero propone saltear el bloqueo LOTO para ganar tiempo en una reparación simple.",
    opciones: [
      { texto: "Aceptar porque confías en él", siguiente: "accidente_loto" },
      { texto: "Negarte y explicar el procedimiento", siguiente: "buscar_supervisor" },
      { texto: "Pedir opinión a otro compañero", siguiente: "decision_grupal" }
    ]
  },
  "accidente_loto": {
    id: "accidente_loto",
    situacion: "Alguien energiza la máquina mientras trabajás. Sufrís una descarga eléctrica grave.",
    es_final: "SI",
    tipo_final: "critico",
    aprendizaje: "LOTO no es una cuestión de confianza, es una barrera física de seguridad. Nunca operes sin bloqueo propio."
  },
  "buscar_supervisor": {
    id: "buscar_supervisor",
    situacion: "El supervisor refuerza la importancia del bloqueo. La tarea se hace de forma segura, aunque tome 10 minutos más.",
    es_final: "SI",
    tipo_final: "correcto",
    aprendizaje: "Hacer lo correcto a veces implica enfrentar la presión de los pares. La seguridad no se negocia por tiempo."
  },
  "decision_grupal": {
    id: "decision_grupal",
    situacion: "El tercer compañero duda, pero terminan trabajando sin bloqueo. La máquina arranca sola y daña la herramienta.",
    es_final: "SI",
    tipo_final: "incidente",
    aprendizaje: "La presión de grupo puede llevar a decisiones riesgosas. Los procedimientos están por encima de las opiniones."
  }
};

const PareYPidaAyudaGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [nodes, setNodes] = useState<any>(null);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [gameState, setGameState] = useState<'SELECT' | 'PLAY' | 'RESULT'>('SELECT');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(PARE_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        
        const map: any = {};
        rows.forEach(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          const id = cols[0]; // A=id_nodo
          if (!id) return;
          
          const opciones = [];
          if (cols[3]) opciones.push({ texto: cols[3], siguiente: cols[4] });
          if (cols[5]) opciones.push({ texto: cols[5], siguiente: cols[6] });
          if (cols[7]) opciones.push({ texto: cols[7], siguiente: cols[8] });

          map[id] = {
            id,
            situacion: (cols[1] || "").length > 100 ? "Situación de Riesgo" : cols[1], // B=situacion
            imagen_url: getDirectImageUrl(cols[2]), // C=imagen_url
            opciones,
            es_final: cols[9], // J=es_final
            tipo_final: cols[10], // K=tipo_final
            aprendizaje: cols[11] // L=aprendizaje
          };
        });
        
        if (Object.keys(map).length > 0) setNodes(map);
        else setNodes(PARE_FALLBACK);
      } catch (error) {
        console.error("Error fetching nodes:", error);
        setNodes(PARE_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchNodes();
  }, []);

  const startStory = (nodeId: string) => {
    setCurrentStory(nodeId);
    setCurrentNode(nodeId);
    setHistory([]);
    setGameState('PLAY');
  };

  const handleDecision = (opcion: any) => {
    const nextId = opcion.siguiente;
    const nextNode = nodes[nextId];
    
    setHistory(prev => [...prev, { 
      situacion: nodes[currentNode!].situacion, 
      decision: opcion.texto 
    }]);
    
    setCurrentNode(nextId);
    if (nextNode.es_final === 'SI') {
      setGameState('RESULT');
      onGameOver(nextNode.tipo_final === 'correcto' ? 100 : 0);
      if (nextNode.tipo_final === 'correcto') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const resetStory = () => {
    setCurrentNode(currentStory);
    setHistory([]);
    setGameState('PLAY');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-red-500 font-black tracking-widest uppercase text-xs">Cargando Simulador...</p>
        </div>
      </div>
    );
  }

  const node = nodes[currentNode!];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500 selection:text-black flex flex-col relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40">
            <ShieldAlert className="text-red-600" size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-white/40">Misión_11</h2>
            <h1 className="text-sm font-black tracking-tight uppercase">Pare y Pida Ayuda</h1>
          </div>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={24} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'SELECT' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 p-8 flex flex-col items-center justify-center space-y-12 z-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Simulador de <span className="text-red-600">Crisis</span></h2>
              <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Narrativa Ramificada de Seguridad Industrial</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
              {Object.values(nodes).filter((n: any) => n.id.startsWith('inicio')).map((n: any) => (
                <motion.div
                  key={n.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startStory(n.id)}
                  className="group cursor-pointer bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-red-500/40 transition-all space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-black transition-colors">
                    <Play size={24} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight">{n.historia || "Nueva Historia"}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{n.situacion.substring(0, 100)}...</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'PLAY' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col lg:flex-row z-10"
          >
            {/* Main Content Area */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8">
              <div className="max-w-3xl w-full space-y-8">
                {/* Image/Illustration Area */}
                <div className="w-full aspect-video bg-white/5 rounded-[2rem] overflow-hidden border border-white/10 relative">
                  {node.imagen_url ? (
                    <img src={node.imagen_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Zap size={120} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Situation Text */}
                <div className="glass-panel-heavy p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <p className="text-2xl font-medium leading-relaxed text-white/90 italic">
                    "{node.situacion}"
                  </p>
                </div>

                {/* Decision Buttons */}
                <div className="flex flex-col gap-4">
                  {node.opciones.map((op: any, idx: number) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 10, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDecision(op)}
                      className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-left flex items-center justify-between group transition-all"
                    >
                      <span className="text-lg font-black uppercase tracking-tight group-hover:text-red-500">{op.texto}</span>
                      <ArrowRight className="text-white/20 group-hover:text-red-500 group-hover:translate-x-2 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* History Sidebar */}
            <div className="w-full lg:w-80 bg-white/5 border-l border-white/10 p-8 overflow-y-auto space-y-8 hidden lg:block">
              <h3 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Línea de Tiempo
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10"></div>
                {history.map((h, i) => (
                  <div key={i} className="relative pl-8 space-y-2">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white/20 border-4 border-[#0a0a0a]"></div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Paso {i + 1}</p>
                    <p className="text-xs font-bold text-white/60 leading-relaxed">{h.decision}</p>
                  </div>
                ))}
                <div className="relative pl-8 space-y-2">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-red-500 border-4 border-[#0a0a0a] animate-pulse"></div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Actual</p>
                  <p className="text-xs font-bold text-white leading-relaxed">Tomando decisión...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex-1 flex items-center justify-center p-6 z-10 ${
              node.tipo_final === 'correcto' ? 'bg-emerald-950/20' : 
              node.tipo_final === 'incidente' ? 'bg-amber-950/20' : 'bg-red-950/20'
            }`}
          >
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Outcome Card */}
              <div className={`glass-panel-heavy p-12 rounded-[3rem] border-2 text-center space-y-10 relative overflow-hidden ${
                node.tipo_final === 'correcto' ? 'border-emerald-500/40' : 
                node.tipo_final === 'incidente' ? 'border-amber-500/40' : 'border-red-500/40'
              }`}>
                <div className={`absolute top-0 left-0 w-full h-2 ${
                  node.tipo_final === 'correcto' ? 'bg-emerald-500' : 
                  node.tipo_final === 'incidente' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                
                <div className="space-y-4">
                  <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/40">Simulación Finalizada</h2>
                  <h3 className={`text-5xl font-black tracking-tighter uppercase leading-none ${
                    node.tipo_final === 'correcto' ? 'text-emerald-500' : 
                    node.tipo_final === 'incidente' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {node.tipo_final === 'correcto' ? 'Éxito Operativo' : 
                     node.tipo_final === 'incidente' ? 'Incidente Reportado' : 'Accidente Crítico'}
                  </h3>
                </div>

                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                  <p className="text-lg font-medium leading-relaxed text-white/80 italic">
                    "{node.situacion}"
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={resetStory}
                    className={`w-full py-6 font-black rounded-2xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all ${
                      node.tipo_final === 'correcto' ? 'bg-emerald-500 text-black' : 
                      node.tipo_final === 'incidente' ? 'bg-amber-500 text-black' : 'bg-red-600 text-white'
                    }`}
                  >
                    Reintentar Escenario
                  </button>
                  <button 
                    onClick={() => setGameState('SELECT')}
                    className="w-full py-6 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                  >
                    Nueva Historia
                  </button>
                </div>
              </div>

              {/* Learning Card */}
              <div className="glass-panel-heavy p-12 rounded-[3rem] border border-white/10 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-widest text-white/40 border-b border-white/10 pb-4 flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-500" /> Aprendizaje Clave
                  </h3>
                  <p className="text-xl font-bold leading-relaxed text-white/90">
                    {node.aprendizaje}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tu Recorrido</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {history.map((h, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5 flex gap-3">
                        <span className="text-red-500 font-black">#{i+1}</span>
                        <p className="text-[10px] font-bold text-white/60 leading-tight uppercase">{h.decision}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- PROTOCOLO DE EMERGENCIA GAME ---

const PROTOCOLO_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2015417175&single=true&output=csv';

const PROTOCOLO_FALLBACK = {
  "INCENDIO": {
    tiempo: 90,
    pasos: [
      { id: 1, paso: "Dar la alarma", detalle: "Activar el pulsador de alarma más cercano.", icono: "AlertTriangle" },
      { id: 2, paso: "Llamar al número de emergencias", detalle: "Informar ubicación exacta y magnitud del fuego.", icono: "Phone" },
      { id: 3, paso: "Evacuar el área", detalle: "Seguir las rutas de evacuación señalizadas.", icono: "Users" },
      { id: 4, paso: "Cerrar puertas sin llave", detalle: "Para retardar la propagación del fuego y humo.", icono: "DoorClosed" },
      { id: 5, paso: "Usar extintor solo si es seguro", detalle: "Solo si el fuego es pequeño y tenés entrenamiento.", icono: "Zap" },
      { id: 6, paso: "Reunirse en punto de encuentro", detalle: "Esperar el recuento de personal.", icono: "MapPin" },
      { id: 7, paso: "No reingresar hasta autorización", detalle: "Solo cuando los bomberos o brigada lo indiquen.", icono: "XCircle" }
    ]
  },
  "PERSONA LESIONADA": {
    tiempo: 120,
    pasos: [
      { id: 1, paso: "Asegurar la escena", detalle: "Verificar que no haya peligros adicionales para vos o la víctima.", icono: "Shield" },
      { id: 2, paso: "Llamar a emergencias", detalle: "Solicitar asistencia médica especializada.", icono: "Phone" },
      { id: 3, paso: "No mover al lesionado si hay trauma", detalle: "Evitar lesiones mayores en columna o cuello.", icono: "AlertCircle" },
      { id: 4, paso: "Aplicar primeros auxilios básicos", detalle: "Controlar hemorragias o realizar RCP si sabés.", icono: "Heart" },
      { id: 5, paso: "Mantener al lesionado abrigado y consciente", detalle: "Hablarle y evitar que entre en shock.", icono: "Thermometer" },
      { id: 6, paso: "Esperar al equipo médico", detalle: "No abandonar a la víctima hasta que llegue ayuda.", icono: "Clock" }
    ]
  },
  "DERRAME QUIMICO": {
    tiempo: 90,
    pasos: [
      { id: 1, paso: "Evacuar el área", detalle: "Alejarse del derrame y vapores inmediatamente.", icono: "LogOut" },
      { id: 2, paso: "Identificar la sustancia (consultar HDS)", detalle: "Saber qué se derramó para actuar correctamente.", icono: "Search" },
      { id: 3, paso: "Dar la alarma y llamar a emergencias", detalle: "Notificar a la brigada de materiales peligrosos.", icono: "AlertTriangle" },
      { id: 4, paso: "Ventilar el área si es seguro", detalle: "Abrir puertas y ventanas exteriores.", icono: "Wind" },
      { id: 5, paso: "Contener el derrame con kit específico", detalle: "Usar absorbentes y barreras del kit de derrames.", icono: "Layers" },
      { id: 6, paso: "Registrar el incidente", detalle: "Informar para la investigación y reposición de materiales.", icono: "FileText" }
    ]
  }
};

const ProtocoloEmergenciaGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [data, setData] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentSteps, setCurrentSteps] = useState<any[]>([]);
  const [gameState, setGameState] = useState<'SELECT' | 'PLAY' | 'RESULT' | 'REVIEW'>('SELECT');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(PROTOCOLO_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        
        const grouped: any = {};
        rows.forEach(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          const type = cols[0]; // A=tipo_emergencia
          if (!type) return;
          
          if (!grouped[type]) {
            grouped[type] = {
              tiempo: parseInt(cols[4]) || 90, // E=tiempo_segundos
              pasos: []
            };
          }
          
          grouped[type].pasos.push({
            id: parseInt(cols[1]), // B=numero_paso
            paso: cols[2], // C=paso
            detalle: cols[3], // D=detalle
            icono: cols[5] || "FileText" // F=icono
          });
        });

        // Sort steps by ID
        Object.keys(grouped).forEach(key => {
          grouped[key].pasos.sort((a: any, b: any) => a.id - b.id);
        });
        
        if (Object.keys(grouped).length > 0) setData(grouped);
        else setData(PROTOCOLO_FALLBACK);
      } catch (error) {
        console.error("Error fetching protocol data:", error);
        setData(PROTOCOLO_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let timer: any;
    if (gameState === 'PLAY' && timeLeft > 0 && !isVerifying) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'PLAY' && !isVerifying) {
      handleVerify(true);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isVerifying]);

  const startLevel = (type: string) => {
    setSelectedType(type);
    const protocol = data[type];
    const shuffled = [...protocol.pasos].sort(() => Math.random() - 0.5);
    setCurrentSteps(shuffled);
    setTimeLeft(protocol.tiempo);
    setGameState('PLAY');
    setIsVerifying(false);
    setVerificationResults([]);
  };

  const handleVerify = async (isAuto = false) => {
    setIsVerifying(true);
    const correctOrder = data[selectedType!].pasos;
    const results = currentSteps.map((step, index) => step.id === correctOrder[index].id);
    
    // Sequential animation
    for (let i = 0; i <= results.length; i++) {
      setVerificationResults(results.slice(0, i));
      await new Promise(r => setTimeout(r, 200));
    }

    const correctCount = results.filter(r => r).length;
    const baseScore = correctCount * 100;
    const timeBonus = isAuto ? 0 : timeLeft * 2;
    const totalScore = baseScore + timeBonus;
    
    setScore(totalScore);
    setGameState('RESULT');
    onGameOver(totalScore);

    if (correctCount === correctOrder.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    const newSteps = [...currentSteps];
    const draggedItem = newSteps[dragIndex];
    newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, draggedItem);
    setCurrentSteps(newSteps);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-red-500 font-black tracking-widest uppercase text-xs">Cargando Protocolos...</p>
        </div>
      </div>
    );
  }

  const getIcon = (name: string) => {
    const icons: any = { AlertTriangle, Phone, Users, DoorClosed, Zap, MapPin, XCircle, Shield, AlertCircle, Heart, Thermometer, Clock, LogOut, Search, Wind, Layers, FileText };
    const IconComp = icons[name] || FileText;
    return <IconComp size={24} />;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500 selection:text-black flex flex-col relative overflow-hidden">
      {/* Background Alerts */}
      {gameState === 'PLAY' && (
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-600 pointer-events-none z-0"
        />
      )}
      
      {/* Header */}
      <div className="px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-white/5 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40">
            <ShieldAlert className="text-red-600" size={20} />
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-white/40">Misión_12</h2>
            <h1 className="text-sm font-black tracking-tight uppercase">Protocolo de Emergencia</h1>
          </div>
        </div>
        <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X size={24} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'SELECT' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 p-8 flex flex-col items-center justify-center space-y-12 z-10"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">Centro de <span className="text-red-600">Respuesta</span></h2>
              <p className="text-white/40 font-medium tracking-widest uppercase text-xs">Seleccioná el Protocolo a Validar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
              {Object.keys(data).map((type) => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startLevel(type)}
                  className="group cursor-pointer bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-red-500/40 transition-all space-y-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldAlert size={80} />
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500 group-hover:text-black transition-colors">
                    <Zap size={28} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{type}</h3>
                    <div className="flex items-center gap-4 text-white/40 text-xs font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Clock size={12} /> {data[type].tiempo}s</span>
                      <span className="flex items-center gap-1"><Layers size={12} /> {data[type].pasos.length} Pasos</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {gameState === 'PLAY' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 p-8 flex flex-col items-center z-10"
          >
            <div className="max-w-4xl w-full flex flex-col items-center space-y-8">
              {/* Emergency Banner */}
              <div className="text-center space-y-2">
                <h2 className="text-red-500 font-black tracking-[0.3em] uppercase text-xs animate-pulse">Emergencia Declarada</h2>
                <h3 className="text-4xl font-black uppercase tracking-tighter">{selectedType}</h3>
              </div>

              {/* Timer */}
              <div className="relative">
                <div className={`text-7xl font-black tabular-nums ${
                  timeLeft < 10 ? 'text-red-500 animate-bounce' : 
                  timeLeft < 30 ? 'text-amber-500' : 'text-white'
                }`}>
                  {timeLeft}s
                </div>
              </div>

              {/* Steps List */}
              <div className="w-full space-y-3">
                <p className="text-center text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Arrastrá para ordenar la secuencia correcta</p>
                {currentSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    layout
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, info) => {
                      const offset = info.offset.y;
                      const moveBy = Math.round(offset / 80);
                      if (moveBy !== 0) {
                        const newIndex = Math.max(0, Math.min(currentSteps.length - 1, index + moveBy));
                        moveStep(index, newIndex);
                      }
                    }}
                    whileDrag={{ scale: 1.02, zIndex: 50, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center gap-6 cursor-grab active:cursor-grabbing group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                      {getIcon(step.icono)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-black uppercase tracking-tight">{step.paso}</h4>
                    </div>
                    <div className="text-white/10">
                      <Layers size={20} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVerify()}
                disabled={isVerifying}
                className="px-12 py-5 bg-red-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-900/20 hover:bg-red-500 transition-all"
              >
                Verificar Protocolo
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameState === 'RESULT' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center p-6 z-10"
          >
            <div className="max-w-4xl w-full glass-panel-heavy p-12 rounded-[3rem] border border-white/10 text-center space-y-10 relative overflow-hidden">
              <div className="space-y-4">
                <h2 className="text-xs font-black tracking-[0.5em] uppercase text-white/40">Evaluación de Respuesta</h2>
                <h3 className="text-6xl font-black tracking-tighter uppercase leading-none">Puntaje: <span className="text-red-600">{score}</span></h3>
              </div>

              <div className="grid grid-cols-1 gap-3 text-left">
                {currentSteps.map((step, idx) => {
                  const isCorrect = verificationResults.length > idx ? verificationResults[idx] : null;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-2xl border flex items-center gap-4 ${
                        isCorrect === true ? 'bg-emerald-500/10 border-emerald-500/40' : 
                        isCorrect === false ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCorrect === true ? 'bg-emerald-500 text-black' : 
                        isCorrect === false ? 'bg-red-500 text-white' : 'bg-white/10 text-white/40'
                      }`}>
                        {isCorrect === true ? <CheckCircle2 size={18} /> : isCorrect === false ? <XCircle size={18} /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black uppercase tracking-tight">{step.paso}</h4>
                        {isCorrect !== null && <p className="text-[10px] text-white/40 font-medium">{step.detalle}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => startLevel(selectedType!)}
                  className="flex-1 py-6 bg-red-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-red-500 transition-all"
                >
                  Reintentar
                </button>
                <button 
                  onClick={() => setGameState('REVIEW')}
                  className="flex-1 py-6 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                >
                  Ver Protocolo Completo
                </button>
                <button 
                  onClick={() => setGameState('SELECT')}
                  className="flex-1 py-6 bg-white/5 text-white/60 font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                >
                  Otros Protocolos
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'REVIEW' && (
          <motion.div 
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-8 flex flex-col items-center z-10 overflow-y-auto"
          >
            <div className="max-w-3xl w-full bg-white p-12 rounded-[3rem] text-black space-y-10 shadow-2xl">
              <div className="text-center space-y-2 border-b-2 border-black/10 pb-8">
                <h2 className="text-xs font-black tracking-[0.5em] uppercase text-black/40">Protocolo Oficial de Seguridad</h2>
                <h3 className="text-4xl font-black uppercase tracking-tighter">{selectedType}</h3>
              </div>

              <div className="space-y-8">
                {data[selectedType!].pasos.map((step: any, idx: number) => (
                  <div key={idx} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-xl">
                        {idx + 1}
                      </div>
                      {idx < data[selectedType!].pasos.length - 1 && (
                        <div className="w-1 flex-1 bg-black/10 my-2"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h4 className="text-2xl font-black uppercase tracking-tight mb-2">{step.paso}</h4>
                      <p className="text-black/60 font-medium leading-relaxed">{step.detalle}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setGameState('RESULT')}
                className="w-full py-6 bg-black text-white font-black rounded-2xl uppercase tracking-widest hover:bg-black/80 transition-all print:hidden"
              >
                Volver a Resultados
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [view, setView] = useState<View>('START');
  const [playerData, setPlayerData] = useState<any>(null);

  // --- GOOGLE SHEETS INTEGRATION ---
  const recordGameResult = async (gameId: string, score: number) => {
    if (!playerData) return;

    const result = {
      nombre: playerData.nombre,
      fecha: new Date().toLocaleString(),
      sitio: playerData.sitio,
      sector: playerData.sector,
      udn: playerData.udn,
      edad: playerData.edad,
      numeroPartida: Date.now(),
      juego: gameId,
      puntaje: score
    };

    console.log('Recording game result:', result);
    
    try {
      const LOGS_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwZuRbqYuD1zrXZuLX0SDGYV6cDe2wbKLDVIXVgLJ5EjkIW3SU9ZITg-_jC5fRoYRBsSQ/exec';
      await fetch(LOGS_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
      console.log('Game result sent to Google Sheets');
    } catch (error) {
      console.error('Error recording game result:', error);
    }
  };

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
        setMessage("¡EHS acepta el desafío! Vale 2 puntos.");
      } else {
        setMessage("EHS evadió la intervención. Ganás la mano.");
        resolveHand('player', 1);
      }
    }, 2000);
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
    }, 2500);
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
    setMessage(`EHS responde con: ${chosenCard.l.replace('\n', ' ')}`);
    setGameStatus('resolution');

    setTimeout(() => {
      resolveRound(playerCard, chosenCard);
    }, 2500);
  };

  const resolveRound = (pCard: any, bCard: any) => {
    let winner: string;
    if (pCard.p > bCard.p) winner = 'player';
    else if (bCard.p > pCard.p) winner = 'bot';
    else winner = 'tie';

    const newRounds = [...rounds, winner];
    setRounds(newRounds);

    if (winner === 'player') setMessage("¡Punto para Seguridad!");
    else if (winner === 'bot') setMessage("EHS gana esta vuelta.");
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
           setTimeout(() => setGameStatus('dealing'), 3000);
         }
      } else {
        setTable({ player: null, bot: null });
        setGameStatus('playerTurn');
        setMessage("Siguiente vuelta...");
      }
    }, 2500);
  };

  const resolveHand = (winner: string, points: number) => {
    if (winner === 'player') {
      const newScore = playerScore + points;
      setPlayerScore(newScore);
      setMessage(`¡Misión Cumplida! Sumás ${points} puntos.`);
      
      // Victory Confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bdcac0', '#ffb690', '#f7be1d']
      });

      if (newScore >= 15) {
        setGameStatus('gameOver');
        recordGameResult('truco', newScore);
      }
      else setTimeout(() => setGameStatus('dealing'), 3500);
    } else {
      const newScore = botScore + points;
      setBotScore(newScore);
      setMessage(`Baja Disponibilidad de Controles. EHS suma ${points} puntos.`);
      if (newScore >= 15) {
        setGameStatus('gameOver');
        recordGameResult('truco', playerScore);
      }
      else setTimeout(() => setGameStatus('dealing'), 3500);
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
            <StartScreen onStart={(data) => {
              setPlayerData(data);
              setView('MENU');
            }} />
          </motion.div>
        )}

        {view === 'MENU' && (
          <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EnhancedGameMenu 
              playerData={playerData}
              onSelectGame={(id) => {
                if (id === 'truco') setView('GAME_TRUCO');
                if (id === 'oca') setView('GAME_OCA');
                if (id === 'carrera') setView('GAME_CARRERA');
                if (id === 'match') setView('GAME_MATCH');
                if (id === 'escape') setView('GAME_ESCAPE');
                if (id === 'memoria') setView('GAME_MEMORY_V3');
                if (id === 'wordle') setView('GAME_WORDLE');
                if (id === 'jenga') setView('GAME_JENGA');
                if (id === 'decisiones') setView('GAME_DECISIONES');
                if (id === 'cazador') setView('GAME_CAZADOR');
                if (id === 'pare') setView('GAME_PARE');
                if (id === 'protocolo') setView('GAME_PROTOCOLO');
              }} 
            />
          </motion.div>
        )}

        {view === 'GAME_PROTOCOLO' && (
          <motion.div key="protocolo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProtocoloEmergenciaGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('protocolo', score)} />
          </motion.div>
        )}

        {view === 'GAME_JENGA' && (
          <motion.div key="jenga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <JengaGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('jenga', score)} />
          </motion.div>
        )}

        {view === 'GAME_DECISIONES' && (
          <motion.div key="decisiones" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DecisionesSegurasGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('decisiones', score)} />
          </motion.div>
        )}

        {view === 'GAME_CAZADOR' && (
          <motion.div key="cazador" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CazadorDeRiesgosGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('cazador', score)} />
          </motion.div>
        )}

        {view === 'GAME_PARE' && (
          <motion.div key="pare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <PareYPidaAyudaGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('pare', score)} />
          </motion.div>
        )}

        {view === 'GAME_WORDLE' && (
          <motion.div key="wordle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WordleGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('wordle', score)} />
          </motion.div>
        )}

        {view === 'GAME_MEMORY_V3' && (
          <motion.div key="memory_v3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IndustrialMemoryGameV3 onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('memoria', score)} />
          </motion.div>
        )}

        {view === 'GAME_MEMORY_V2' && (
          <motion.div key="memory_v2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IndustrialMemoryGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('memoria', score)} />
          </motion.div>
        )}

        {view === 'GAME_MEMORY' && (
          <motion.div key="memory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MemoryGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('memoria', score)} />
          </motion.div>
        )}

        {view === 'GAME_ESCAPE' && (
          <motion.div key="escape" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EscapeRoomGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('escape', score)} />
          </motion.div>
        )}

        {view === 'GAME_MATCH' && (
          <motion.div key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MatchGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('match', score)} />
          </motion.div>
        )}

        {view === 'GAME_CARRERA' && (
          <motion.div key="carrera" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CarreraGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('carrera', score)} />
          </motion.div>
        )}

        {view === 'GAME_OCA' && (
          <motion.div key="oca" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <OcaGame onExit={() => setView('MENU')} onGameOver={(score) => recordGameResult('oca', score)} />
          </motion.div>
        )}

        {view === 'GAME_TRUCO' && (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="obsidian-table min-h-screen">
            {gameStatus === 'gameOver' ? (
              <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-panel-heavy p-12 rounded-2xl border-2 border-secondary shadow-2xl max-w-2xl">
                  <p className="font-headline text-secondary text-xs tracking-[0.4em] uppercase mb-3 animate-hud-pulse">Resultado de la Operación</p>
                  <h1 className="text-5xl font-black mb-4 tracking-tighter text-white uppercase">
                    {playerScore >= 15 ? "¡SEGURIDAD TOTAL!" : "BAJA DISPONIBILIDAD"}
                  </h1>
                  <p className="text-lg mb-8 text-on-surface-variant">
                    {playerScore >= 15 ? "Has mitigado todos los riesgos de la jornada." : "EHS ha demostrado mayor control preventivo en esta sesión."}
                  </p>
                  <div className="flex gap-8 justify-center mb-12">
                    <div className="text-center bg-black/40 border-l-4 border-primary p-6 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Tu Score</p>
                      <p className="text-5xl font-black text-primary drop-shadow-[0_0_8px_rgba(189,202,192,0.5)]">{playerScore}</p>
                    </div>
                    <div className="text-center bg-black/40 border-r-4 border-error p-6 shadow-inner">
                      <p className="text-[10px] uppercase tracking-widest text-error font-bold">EHS</p>
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
                  <div className="flex justify-between items-center px-4 md:px-6 h-12 md:h-16 w-full">
                    <div className="flex items-center gap-2 md:gap-3">
                      <span className="material-symbols-outlined text-secondary symbol-3d text-base md:text-lg">precision_manufacturing</span>
                      <h1 className="font-headline tracking-tighter uppercase text-sm md:text-lg font-bold text-secondary">TRUCO SEGURO</h1>
                    </div>
                    <div className="hidden md:flex gap-8 items-center">
                      {/* Navigation links removed as per user request */}
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <button 
                        onClick={() => {
                          recordGameResult('truco', playerScore);
                          setView('MENU');
                        }}
                        className="px-3 md:px-6 py-1 bg-rose-500/20 border border-rose-500/30 text-rose-500 font-black rounded-xl uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                      >
                        Finalizar
                      </button>
                      <button onClick={handleExitGame} className="glass-panel-heavy p-1.5 md:p-2 rounded-lg text-white/50 hover:text-white transition-colors">
                        <LogOut size={16} />
                      </button>
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-headline uppercase text-primary tracking-widest leading-none">Operador</p>
                        <p className="font-headline font-bold text-sm text-secondary tracking-tighter">OP-7742</p>
                      </div>
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-secondary overflow-hidden bg-surface-container-highest shadow-[0_0_10px_rgba(255,182,144,0.3)]">
                        <img alt="Operator Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIsohKgIZM3xUKL7GlEjr_x_I6f19G5XaV7fEnXfspKlqKS-KaWr9eqnCRabiqVSx98qoChSS2a3Y6Rc_ZmHqH-Hat4T1NW-qiT3hOnw8EJ9skFON9B9zw5ahb99qADyiUs0rgtEyE1Eov6EGw14czxQXsB9mXnYKmB121qZt-o0W6b-n5iDr69gAPKm99q03wrdn53KLPkbfcAIAN8ZsaNRWRf2RWDFwYMB2bsPFaxNXGOKLkT19PIAidc7TfB9ssqPgWUOuDiI91"/>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="pt-14 md:pt-20 pb-24 md:pb-32 px-4 md:px-6 h-screen flex flex-col items-center justify-between relative">
                  {/* Scoreboard Header */}
                  <div className="w-full max-w-4xl flex justify-between items-stretch gap-2 md:gap-4 mb-2">
                    <div className={`flex-1 bg-black/40 border-l-4 p-2 md:p-4 shadow-inner relative group overflow-hidden transition-all duration-500 ${gameStatus === 'playerTurn' ? 'border-primary ring-2 ring-primary/20 scale-[1.02]' : 'border-primary/30 opacity-60'}`}>
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start">
                        <p className="font-headline text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-primary mb-1 animate-hud-pulse">Tú</p>
                        {gameStatus === 'playerTurn' && <span className="text-[7px] md:text-[8px] bg-primary text-on-primary px-1.5 md:px-2 py-0.5 rounded-full font-bold animate-pulse">TU TURNO</span>}
                      </div>
                      <div className="flex items-baseline gap-1 md:gap-2">
                        <span className="text-2xl md:text-4xl font-headline font-black text-primary drop-shadow-[0_0_8px_rgba(189,202,192,0.5)]">{playerScore}</span>
                        <span className="text-[8px] md:text-xs font-label text-primary/60">PTS</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center px-1">
                      <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-transparent via-outline-variant to-transparent"></div>
                    </div>
                    <div className={`flex-1 bg-black/40 border-r-4 p-2 md:p-4 shadow-inner text-right relative group overflow-hidden transition-all duration-500 ${gameStatus === 'botTurn' ? 'border-error ring-2 ring-error/20 scale-[1.02]' : 'border-error/30 opacity-60'}`}>
                      <div className="absolute inset-0 bg-error/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start flex-row-reverse">
                        <p className="font-headline text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-error mb-1 animate-hud-pulse">EHS</p>
                        {gameStatus === 'botTurn' && <span className="text-[7px] md:text-[8px] bg-error text-on-error px-1.5 md:px-2 py-0.5 rounded-full font-bold animate-pulse">TURNO EHS</span>}
                      </div>
                      <div className="flex items-baseline justify-end gap-1 md:gap-2">
                        <span className="text-[8px] md:text-xs font-label text-error/60">PTS</span>
                        <span className="text-2xl md:text-4xl font-headline font-black text-error drop-shadow-[0_0_8px_rgba(255,180,171,0.5)]">{botScore}</span>
                      </div>
                    </div>
                  </div>

                  {/* Central Messaging Panel - Moved to top to avoid covering cards */}
                  <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 pointer-events-none">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={message}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="glass-panel-heavy rounded-xl py-6 px-8 text-center border-t border-white/20 shadow-2xl"
                      >
                        <p className="font-headline text-secondary text-[10px] tracking-[0.4em] uppercase mb-2 animate-hud-pulse">Estado del Proceso</p>
                        <h2 className="font-headline text-xl font-black text-white tracking-tighter leading-tight drop-shadow-md uppercase">
                          {message}
                        </h2>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Play Area (The Stage) */}
                  <div className="flex-1 w-full flex items-center justify-center gap-8 sm:gap-16">
                    <div className="flex flex-col items-center gap-4">
                      <p className="font-headline text-[10px] uppercase tracking-widest text-primary/40">Tu Jugada</p>
                      <IndustrialCard card={table.player} styleClass="transform -rotate-3 card-glow" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <p className="font-headline text-[10px] uppercase tracking-widest text-error/40">Respuesta EHS</p>
                      <IndustrialCard card={table.bot} styleClass="transform rotate-6" />
                    </div>
                  </div>

                  {/* Controls & Hand Area */}
                  <div className="w-full flex flex-col items-center gap-4 md:gap-8 relative z-30">
                    {/* Buttons */}
                    <div className="flex gap-4 md:gap-8">
                      <button 
                        onClick={handleIntervenir} 
                        disabled={gameStatus !== 'playerTurn' || trucoActive}
                        className="btn-industrial-orange text-white font-headline font-black text-sm md:text-xl px-6 md:px-12 py-3 md:py-5 rounded-sm flex items-center gap-2 md:gap-4 tracking-tighter disabled:opacity-30 disabled:grayscale"
                      >
                        <span className="material-symbols-outlined text-lg md:text-2xl">bolt</span>
                        INTERVENIR
                      </button>
                      <button 
                        onClick={handleDetener} 
                        disabled={gameStatus !== 'playerTurn'}
                        className="btn-industrial-red text-white font-headline font-black text-sm md:text-xl px-6 md:px-12 py-3 md:py-5 rounded-sm flex items-center gap-2 md:gap-4 tracking-tighter disabled:opacity-30 disabled:grayscale"
                      >
                        <span className="material-symbols-outlined text-lg md:text-2xl">block</span>
                        DETENER
                      </button>
                    </div>

                    {/* Player Hand */}
                    <div className="relative w-full max-w-2xl h-24 md:h-36 flex justify-center items-end">
                      <div className="absolute bottom-[-20%] w-full h-24 md:h-32 bg-secondary/10 blur-[60px] md:blur-[80px] rounded-full"></div>
                      <div className="flex -space-x-6 md:-space-x-10 translate-y-6 md:translate-y-12">
                        {playerHand.map((card, i) => (
                          <IndustrialCard 
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

                {/* Decoration HUD Elements removed as per user request */}
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

// --- DATA CON COLORES PASTELES PARA V3 ---
const MEMORY_PAIRS_PASTEL = [
  {
    riesgo: { emoji: '🔥', titulo: 'FUEGO', desc: 'Riesgo de incendio.', color: '#FFB3BA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧯', titulo: 'EXTINTOR', desc: 'Uso de extintor ABC.', color: '#FFB3BA', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🔊', titulo: 'RUIDO', desc: 'Niveles > 85dB.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🎧', titulo: 'PROTECCIÓN', desc: 'Protectores auditivos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧱', titulo: 'CAÍDA OBJETOS', desc: 'Desprendimiento.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '👷', titulo: 'CASCO', desc: 'Casco industrial.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '✨', titulo: 'CHISPAS', desc: 'Proyección partículas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥽', titulo: 'ANTIPARRAS', desc: 'Protección ocular.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚡', titulo: 'ELECTRICIDAD', desc: 'Choque eléctrico.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES DIEL.', desc: 'Guantes dieléctricos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🧪', titulo: 'QUÍMICOS', desc: 'Sustancias corrosivas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES QUIM.', desc: 'Guantes de nitrilo.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌫️', titulo: 'VAPORES', desc: 'Gases tóxicos.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '😷', titulo: 'RESPIRADOR', desc: 'Máscara con filtros.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🪜', titulo: 'ALTURA', desc: 'Trabajos > 1.8m.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧗', titulo: 'ARNÉS', desc: 'Arnés y línea vida.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌡️', titulo: 'CALOR', desc: 'Altas temperaturas.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🧤', titulo: 'GUANTES TÉRM.', desc: 'Guantes térmicos.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⚙️', titulo: 'ATRAPAMIENTO', desc: 'Partes móviles.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛑', titulo: 'PARADA EMERG.', desc: 'Parada emergencia.', color: '#FFB3BA', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '💦', titulo: 'DERRAME', desc: 'Fuga líquidos.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '📦', titulo: 'KIT DERRAMES', desc: 'Absorbentes.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '📦', titulo: 'CARGA PESADA', desc: 'Levantamiento manual.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🛒', titulo: 'CARRO', desc: 'Medios mecánicos.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🌑', titulo: 'OSCURIDAD', desc: 'Falta iluminación.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🔦', titulo: 'LINTERNA', desc: 'Iluminación emerg.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '⛸️', titulo: 'PISO RESBAL.', desc: 'Pisos mojados.', color: '#FFFFBA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🥾', titulo: 'CALZADO', desc: 'Suela antideslizante.', color: '#BAE1FF', tipo: 'MITIGACIÓN' }
  },
  {
    riesgo: { emoji: '🚑', titulo: 'ACCIDENTE', desc: 'Lesión inmediata.', color: '#FFB3BA', tipo: 'RIESGO' },
    mitigacion: { emoji: '🩹', titulo: 'BOTIQUÍN', desc: 'Primeros auxilios.', color: '#BAFFC9', tipo: 'MITIGACIÓN' }
  }
];

// --- INDUSTRIAL MEMORY GAME (V3) ---
// Mejoras: Colores pasteles, proporciones corregidas, scroll funcional y textos legibles.

const MEMORY_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1346735467&single=true&output=csv';

const IndustrialMemoryGameV3 = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [difficulty, setDifficulty] = useState(6);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [showMatchInfo, setShowMatchInfo] = useState<any>(null);
  const [gameData, setGameData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(MEMORY_SHEETS_URL);
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1);
        const parsed = rows.map(row => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          return {
            emoji: cols[0],
            descripcion: cols[1],
            tipo: cols[2],
            color: cols[3],
            norma: cols[4],
            desc_larga: cols[5]
          };
        }).filter(item => item.emoji && item.desc_larga);
        setGameData(parsed);
        setLoading(false);
      } catch (error) {
        console.error("Error loading sheets:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (view === 'GAME' && energy > 0 && matched.length < cards.length) {
      interval = setInterval(() => {
        setEnergy(prev => Math.max(0, prev - (0.25 + (matched.length / 8))));
      }, 100);
    } else if (energy === 0 && view === 'GAME') {
      setTimeout(() => setView('END'), 1000);
    }
    return () => clearInterval(interval);
  }, [view, energy, matched, cards]);

  const startGame = (diff: number) => {
    setDifficulty(diff);
    const selectedPairs = [...gameData].sort(() => Math.random() - 0.5).slice(0, diff);
    const gameCards: any[] = [];
    
    selectedPairs.forEach((item, idx) => {
      gameCards.push({
        id: `v-${idx}`,
        pairId: idx,
        type: 'SÍMBOLO',
        content: item.emoji,
        titulo: item.descripcion,
        desc_larga: item.desc_larga,
        bgColor: item.color,
        category: item.tipo
      });
      gameCards.push({
        id: `t-${idx}`,
        pairId: idx,
        type: 'ESPECIFICACIÓN',
        content: item.desc_larga,
        titulo: item.descripcion,
        desc_larga: item.desc_larga,
        bgColor: '#1a1a1a',
        category: item.tipo
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setEnergy(100);
    setScore(0);
    setCombo(1);
    setView('GAME');
  };

  const handleCardClick = (idx: number) => {
    if (isProcessing || flipped.includes(idx) || matched.includes(idx) || energy <= 0) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [f, s] = newFlipped;
      if (cards[f].pairId === cards[s].pairId) {
        const now = Date.now();
        const newCombo = (now - lastMatchTime < 4000) ? combo + 1 : 1;
        setCombo(newCombo);
        setLastMatchTime(now);
        const points = 150 * newCombo;
        setScore(p => p + points);
        setEnergy(e => Math.min(100, e + 25));
        setTimeout(() => {
          setMatched([...matched, f, s]);
          setFlipped([]);
          setShowMatchInfo(cards[f]);
          setIsProcessing(false);
          if (matched.length + 2 === cards.length) setTimeout(() => { onGameOver(score + points); setView('END'); }, 1500);
          setTimeout(() => setShowMatchInfo(null), 4000);
        }, 600);
      } else {
        setCombo(1);
        setEnergy(e => Math.max(0, e - 12));
        setTimeout(() => { setFlipped([]); setIsProcessing(false); }, 1000);
      }
    }
  };

  if (view === 'INTRO') return (
    <div className="flex-1 bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden h-screen">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent"></div>
      
      <motion.div 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="glass-panel-heavy p-12 rounded-[2rem] border-t-4 border-secondary shadow-[0_0_50px_rgba(255,182,144,0.1)] max-w-2xl w-full text-center relative z-10"
      >
        <div className="w-24 h-24 bg-secondary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-secondary/30 shadow-[0_0_30px_rgba(255,182,144,0.2)]">
          <ShieldAlert className="w-12 h-12 text-secondary animate-pulse" />
        </div>
        
        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
          MEMORIA <span className="text-secondary">CRÍTICA</span>
        </h2>
        <p className="text-white/40 mb-12 text-sm font-medium tracking-wide max-w-md mx-auto">
          Protocolo de validación de competencias EHS. Asocia la simbología visual con su especificación técnica normativa.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {[6, 12, 15].map(n => (
            <button 
              key={n} 
              disabled={loading} 
              onClick={() => startGame(n)} 
              className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-secondary transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors"></div>
              <p className="text-3xl font-black text-white relative z-10">{n}</p>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest relative z-10">Pares</p>
            </button>
          ))}
        </div>

        <button onClick={onExit} className="text-white/20 hover:text-white uppercase text-[10px] font-black tracking-[0.3em] transition-colors">
          Abortar Misión
        </button>
      </motion.div>
    </div>
  );

  if (view === 'END') return (
    <div className="flex-1 bg-[#050505] flex flex-col items-center justify-center p-8 h-screen relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="glass-panel-heavy p-12 rounded-[2.5rem] border-t-4 border-emerald-500 text-center max-w-md w-full relative z-10"
      >
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
          <Trophy className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">CERTIFICADO</h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-8">Operación Finalizada con Éxito</p>
        
        <div className="bg-black/40 border border-white/5 p-8 rounded-2xl mb-10 shadow-inner">
          <p className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Puntaje de Eficiencia</p>
          <p className="text-6xl font-black text-white tracking-tighter">{score}</p>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setView('INTRO')} className="flex-1 btn-industrial-orange py-4 font-black uppercase text-xs tracking-widest">Reiniciar</button>
          <button onClick={onExit} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-xl text-white font-black uppercase text-xs tracking-widest border border-white/10 transition-all">Panel</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex-1 bg-[#080808] flex flex-col h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none"></div>
      
      {/* INDUSTRIAL HUD */}
      <div className="p-6 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-xl relative z-20">
        <div className="flex items-center gap-6">
          <button onClick={onExit} className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all border border-white/5">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <h2 className="text-sm font-black text-white uppercase tracking-widest">SISTEMA DE ENTRENAMIENTO <span className="text-secondary">V3.2</span></h2>
            </div>
            <div className="flex gap-6">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">EFICIENCIA: <span className="text-white font-black">{score}</span></span>
              {combo > 1 && <span className="text-[10px] font-black text-secondary uppercase animate-bounce">COMBO X{combo}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="w-64 hidden md:block">
            <div className="flex justify-between mb-1.5">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Estabilidad del Sistema</span>
              <span className={`text-[9px] font-black ${energy < 30 ? 'text-error animate-pulse' : 'text-emerald-500'}`}>{Math.round(energy)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
              <motion.div 
                className={`h-full rounded-full ${energy < 30 ? 'bg-error shadow-[0_0_10px_rgba(255,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                animate={{ width: `${energy}%` }} 
                transition={{ type: 'spring', stiffness: 50 }}
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">ID SESIÓN</p>
             <p className="text-[10px] font-mono text-white/60">EHS-PRV-{difficulty}P</p>
          </div>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
        <div className={`grid gap-6 mx-auto max-w-7xl ${
          difficulty === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 
          difficulty === 12 ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' : 
          'grid-cols-4 sm:grid-cols-6 md:grid-cols-8'
        }`}>
          {cards.map((card, idx) => (
            <div 
              key={card.id} 
              className="relative aspect-[3/4] cursor-pointer group" 
              onClick={() => handleCardClick(idx)} 
              style={{ perspective: '1200px' }}
            >
              <motion.div 
                className="w-full h-full relative" 
                animate={{ rotateY: flipped.includes(idx) || matched.includes(idx) ? 180 : 0 }} 
                transition={{ duration: 0.6, type: 'spring', damping: 20 }} 
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* BACK (REVERSO INDUSTRIAL) */}
                <div className="absolute inset-0 bg-[#121212] border-2 border-white/5 rounded-2xl flex flex-col items-center justify-center shadow-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  <div className="absolute inset-2 border border-white/5 rounded-xl"></div>
                  <Shield className="w-12 h-12 text-white/5 group-hover:text-secondary/10 transition-colors duration-500" />
                  <div className="absolute bottom-4 flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                    <div className="w-1 h-1 rounded-full bg-white/10"></div>
                  </div>
                </div>

                {/* FRONT (CONTENIDO TÉCNICO) */}
                <div 
                  className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-between p-4 border-2 shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${matched.includes(idx) ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-[#1a1a1a]'}`} 
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    rotateY: '180deg'
                  }}
                >
                  <div className="w-full flex justify-between items-start">
                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{card.type}</span>
                    <div className={`w-2 h-2 rounded-full ${matched.includes(idx) ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`}></div>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full px-2">
                    {card.type === 'SÍMBOLO' ? (
                      <div 
                        className="w-24 h-24 rounded-3xl flex items-center justify-center text-6xl shadow-inner relative overflow-hidden"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <span className="relative z-10 drop-shadow-2xl">{card.content}</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col justify-center items-center text-center">
                        <div className="w-full h-[1px] bg-white/5 mb-4"></div>
                        <p className="font-mono text-white/90 text-[10px] leading-relaxed tracking-tight px-2">
                          {card.content}
                        </p>
                        <div className="w-full h-[1px] bg-white/5 mt-4"></div>
                      </div>
                    )}
                  </div>

                  <div className="w-full bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] font-black text-white uppercase leading-tight text-center truncate tracking-tighter">{card.titulo}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="h-24 w-full"></div>
      </div>

      {/* MATCH INFO OVERLAY (PREMIUM) */}
      <AnimatePresence>
        {showMatchInfo !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 50 }} 
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6 pointer-events-none"
          >
            <div className="glass-panel-heavy p-8 rounded-[2.5rem] border-2 border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.2)] flex items-center gap-8 pointer-events-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500">
                <motion.div 
                  className="h-full bg-white/50" 
                  initial={{ width: '100%' }} 
                  animate={{ width: '0%' }} 
                  transition={{ duration: 4 }} 
                />
              </div>
              
              <div 
                className="w-32 h-32 rounded-[2rem] flex items-center justify-center text-7xl shadow-2xl flex-shrink-0 relative overflow-hidden"
                style={{ backgroundColor: showMatchInfo.bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
                <span className="relative z-10">{showMatchInfo.content}</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-black uppercase rounded-md">VALIDADO</div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">PROTOCOLO EHS-7010</span>
                </div>
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-3">{showMatchInfo.titulo}</h4>
                <p className="text-xs text-white/60 leading-relaxed font-medium italic border-l-2 border-emerald-500/30 pl-4">
                  {showMatchInfo.desc_larga}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- INDUSTRIAL MEMORY GAME (V2) ---
// Mejoras sustanciales en gamificación: Timer, Combos, Efectos Visuales y HUD Industrial.

const IndustrialMemoryGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [view, setView] = useState<'INTRO' | 'GAME' | 'END'>('INTRO');
  const [difficulty, setDifficulty] = useState(6);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [lastMatchTime, setLastMatchTime] = useState(0);
  const [showMatchInfo, setShowMatchInfo] = useState<any>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (view === 'GAME' && energy > 0 && matched.length < cards.length) {
      interval = setInterval(() => {
        setEnergy(prev => Math.max(0, prev - (0.5 + (matched.length / 4))));
      }, 100);
    } else if (energy === 0 && view === 'GAME') {
      // Game Over by energy depletion
      setTimeout(() => setView('END'), 1000);
    }
    return () => clearInterval(interval);
  }, [view, energy, matched, cards]);

  const startGame = (diff: number) => {
    setDifficulty(diff);
    const selectedPairs = [...MEMORY_PAIRS].sort(() => Math.random() - 0.5).slice(0, diff);
    const gameCards: any[] = [];
    
    selectedPairs.forEach((pair, idx) => {
      gameCards.push({
        id: `R-${idx}`,
        pairId: idx,
        type: 'RIESGO',
        content: pair.riesgo.emoji,
        titulo: pair.riesgo.titulo,
        desc: pair.riesgo.desc,
        bgColor: pair.riesgo.color,
      });
      gameCards.push({
        id: `M-${idx}`,
        pairId: idx,
        type: 'MITIGACIÓN',
        content: pair.mitigacion.emoji,
        titulo: pair.mitigacion.titulo,
        desc: pair.mitigacion.desc,
        bgColor: pair.mitigacion.color,
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
    setEnergy(100);
    setScore(0);
    setCombo(1);
    setView('GAME');
  };

  const handleCardClick = (idx: number) => {
    if (isProcessing || flipped.includes(idx) || matched.includes(idx) || energy <= 0) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        const now = Date.now();
        const timeBonus = Math.max(1, 5 - (now - lastMatchTime) / 1000);
        const newCombo = (now - lastMatchTime < 3000) ? combo + 1 : 1;
        
        setCombo(newCombo);
        setLastMatchTime(now);
        
        const points = Math.round(100 * newCombo * timeBonus);
        setScore(prev => prev + points);
        setEnergy(prev => Math.min(100, prev + 15));
        
        setTimeout(() => {
          setMatched([...matched, firstIdx, secondIdx]);
          setFlipped([]);
          setShowMatchInfo(firstCard.pairId);
          setIsProcessing(false);
          
          if (matched.length + 2 === cards.length) {
            setTimeout(() => {
              onGameOver(score + points);
              setView('END');
            }, 1000);
          }
          
          setTimeout(() => setShowMatchInfo(null), 2000);
        }, 600);
      } else {
        // MISMATCH
        setCombo(1);
        setEnergy(prev => Math.max(0, prev - 10));
        setTimeout(() => {
          setFlipped([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  if (view === 'INTRO') return (
    <div className="flex-1 obsidian-table flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-grid opacity-10"></div>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel-heavy p-12 rounded-3xl border-t-4 border-tertiary shadow-2xl max-w-2xl w-full text-center relative z-10"
      >
        <ShieldCheck className="w-20 h-20 text-tertiary mx-auto mb-6 animate-hud-pulse" />
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Protocolo de Memoria Crítica</h2>
        <p className="text-on-surface-variant mb-8 leading-relaxed">
          Asocia los <span className="text-error font-bold">RIESGOS</span> con sus <span className="text-emerald-500 font-bold">MITIGACIONES</span> antes de que el sistema se sobrecaliente. 
          Mantén la energía estable mediante aciertos rápidos.
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[6, 12, 15].map(n => (
            <button 
              key={n}
              onClick={() => startGame(n)}
              className="group relative p-4 bg-white/5 border border-white/10 rounded-xl hover:border-tertiary transition-all"
            >
              <p className="text-2xl font-black text-white">{n}</p>
              <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Módulos</p>
              <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
            </button>
          ))}
        </div>

        <button onClick={onExit} className="text-white/40 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.3em]">
          Abortar Misión
        </button>
      </motion.div>
    </div>
  );

  if (view === 'END') return (
    <div className="flex-1 obsidian-table flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-hex-grid opacity-10"></div>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel-heavy p-12 rounded-3xl border-t-4 border-emerald-500 shadow-2xl max-w-md w-full text-center relative z-10"
      >
        <Trophy className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Misión Finalizada</h2>
        <p className="text-emerald-500/60 font-mono text-xs mb-8">SISTEMA ESTABILIZADO</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/60 uppercase text-[10px] font-black">Puntaje Total</span>
            <span className="text-2xl font-black text-white">{score}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-white/60 uppercase text-[10px] font-black">Módulos Cerrados</span>
            <span className="text-2xl font-black text-white">{matched.length / 2} / {difficulty}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setView('INTRO')} className="flex-1 btn-industrial-orange py-4 text-black font-black uppercase tracking-widest text-sm">Reiniciar</button>
          <button onClick={onExit} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 rounded-sm font-black uppercase tracking-widest text-sm transition-all">Salir</button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="flex-1 obsidian-table flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full h-screen overflow-hidden relative">
      <div className="absolute inset-0 bg-hex-grid opacity-20 pointer-events-none"></div>
      
      {/* HUD SUPERIOR */}
      <div className="glass-panel-heavy p-6 rounded-2xl mb-8 flex justify-between items-center border-b-2 border-tertiary/30 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-tertiary animate-hud-pulse">Protocolo de Seguridad</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Memory V2.0</h2>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div>
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Puntaje</p>
            <p className="text-2xl font-black text-white">{score.toLocaleString()}</p>
          </div>
          {combo > 1 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-tertiary text-black px-3 py-1 rounded-full font-black text-xs"
            >
              x{combo} COMBO
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 w-64">
          <div className="flex justify-between w-full">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Estabilidad del Sistema</span>
            <span className={`text-[10px] font-black uppercase ${energy < 30 ? 'text-error animate-pulse' : 'text-emerald-500'}`}>
              {Math.round(energy)}%
            </span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              className={`h-full rounded-full ${energy < 30 ? 'bg-error' : energy < 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              animate={{ width: `${energy}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
            />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className={`flex-1 grid gap-4 ${
        difficulty === 6 ? 'grid-cols-3 md:grid-cols-4' : 
        difficulty === 12 ? 'grid-cols-4 md:grid-cols-6' : 
        'grid-cols-5 md:grid-cols-8'
      } content-center overflow-y-auto custom-scrollbar relative z-10`}>
        {cards.map((card, idx) => (
          <div 
            key={card.id}
            className="relative aspect-[3/4] cursor-pointer group"
            onClick={() => handleCardClick(idx)}
            style={{ perspective: '1000px' }}
          >
            <motion.div 
              className="w-full h-full relative"
              animate={{ rotateY: flipped.includes(idx) || matched.includes(idx) ? 180 : 0 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className="absolute inset-0 obsidian-table border-2 border-white/10 rounded-xl flex items-center justify-center overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                <div className="absolute inset-0 bg-hex-grid opacity-20"></div>
                <Shield className="w-12 h-12 text-white/5 group-hover:text-tertiary/20 transition-colors" />
                <div className="absolute inset-2 border border-white/5 rounded-lg"></div>
              </div>

              {/* Back */}
              <div 
                className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2 border-4 ${
                  matched.includes(idx) ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-white/20'
                }`}
                style={{ backfaceVisibility: 'hidden', rotateY: '180deg', backgroundColor: card.bgColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-30 pointer-events-none"></div>
                <span className="text-4xl md:text-5xl mb-2 drop-shadow-2xl">{card.content}</span>
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 w-full text-center">
                  <p className="text-[9px] font-black uppercase text-white leading-none mb-1">{card.titulo}</p>
                  <p className="text-[7px] font-bold uppercase text-white/60 leading-none">{card.type}</p>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* MATCH INFO OVERLAY */}
      <AnimatePresence>
        {showMatchInfo !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="glass-panel-heavy p-6 rounded-2xl border-2 border-emerald-500 shadow-2xl flex items-center gap-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <div>
                <p className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-1">Módulo Asegurado</p>
                <h4 className="text-white font-black text-xl uppercase tracking-tighter">Mitigación Exitosa</h4>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- ENHANCED MENU COMPONENTS ---

const GAMES_ENHANCED = [
  { 
    id: 'truco', 
    title: 'TRUCO SEGURO', 
    subtitle: 'MISIÓN_01', 
    icon: 'precision_manufacturing', 
    active: true, 
    color: 'bg-emerald-500', 
    level: 'EXPERTO', 
    stats: '42 VIC / 12 RGO', 
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    desc: 'Un duelo de cartas donde la estrategia y el conocimiento de seguridad son tus mejores aliados.',
    obj: 'Superar al bot EHS aplicando las mejores medidas de control preventivo.',
    rules: [
      'Se juega con un mazo de cartas de seguridad industrial.',
      'Cada carta tiene un nivel de "Control" (Poder).',
      'Gana la vuelta quien tire la carta con mayor efectividad de control.',
      'Puedes "Intervenir" (Truco) para aumentar el valor de la mano.',
      'Gana la partida quien llegue primero a 15 puntos.'
    ]
  },
  { 
    id: 'match', 
    title: 'CAZA DE RIESGOS', 
    subtitle: 'MISIÓN_02', 
    icon: 'visibility', 
    active: true, 
    color: 'bg-rose-500', 
    level: 'PRINCIPIANTE', 
    stats: '8 VIC / 5 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Encuentra y asocia los riesgos con sus respectivas medidas de mitigación.',
    obj: 'Identificar correctamente todos los pares de riesgo-control en el menor tiempo posible.',
    rules: [
      'Haz clic en una tarjeta de riesgo para ver su descripción.',
      'Busca la tarjeta de mitigación que corresponda a ese riesgo.',
      'Si coinciden, el riesgo queda mitigado.',
      'El juego termina cuando todos los riesgos han sido controlados.'
    ]
  },
  { 
    id: 'oca', 
    title: 'LA OCA', 
    subtitle: 'MISIÓN_03', 
    icon: 'grid_view', 
    active: true, 
    color: 'bg-orange-500', 
    level: 'INTERMEDIO', 
    stats: '15 VIC / 3 RGO', 
    img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800',
    desc: 'Recorre la planta industrial enfrentando desafíos y validando protocolos.',
    obj: 'Llegar a la meta superando los obstáculos de seguridad en el camino.',
    rules: [
      'Lanza los dados para avanzar por el tablero.',
      'Ciertas casillas activan eventos de seguridad o preguntas.',
      'Responder correctamente te permite seguir avanzando.',
      'Evita las casillas de "Accidente" que te retrasarán.'
    ]
  },
  { 
    id: 'carrera', 
    title: 'CARRERA MENTE', 
    subtitle: 'MISIÓN_04', 
    icon: 'psychology', 
    active: true, 
    color: 'bg-blue-500', 
    level: 'EXPERTO', 
    stats: '22 VIC / 8 RGO', 
    img: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800',
    desc: 'Pon a prueba tus conocimientos teóricos sobre normativas y estándares de seguridad.',
    obj: 'Responder correctamente la mayor cantidad de preguntas técnicas.',
    rules: [
      'Se te presentarán preguntas de opción múltiple.',
      'Tienes un tiempo limitado para responder cada una.',
      'Las respuestas correctas suman puntos y validan tu competencia.',
      'Tres errores consecutivos terminan la evaluación.'
    ]
  },
  { 
    id: 'escape', 
    title: 'ESCAPE ROOM', 
    subtitle: 'MISIÓN_05', 
    icon: 'lock_open', 
    active: true, 
    color: 'bg-amber-500', 
    level: 'INTERMEDIO', 
    stats: '10 VIC / 2 RGO', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    desc: 'Estás atrapado en un sector crítico. Solo el cumplimiento de protocolos te permitirá salir.',
    obj: 'Resolver los acertijos de seguridad para desbloquear la salida.',
    rules: [
      'Inspecciona los elementos del entorno.',
      'Encuentra códigos y llaves basados en señales de seguridad.',
      'Sigue las instrucciones de emergencia para avanzar.',
      'Debes salir antes de que se agote el tiempo de oxígeno/energía.'
    ]
  },
  { 
    id: 'memoria', 
    title: 'MEMORY PREVENTIVO', 
    subtitle: 'MISIÓN_06', 
    icon: 'brain', 
    active: true, 
    color: 'bg-yellow-500', 
    level: 'PRINCIPIANTE', 
    stats: '30 VIC / 1 RGO', 
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    desc: 'Entrena tu memoria visual con elementos de protección personal y señalética.',
    obj: 'Encontrar todos los pares de elementos de seguridad.',
    rules: [
      'Voltea dos cartas para intentar encontrar un par.',
      'Si son iguales, permanecen visibles.',
      'Si son distintas, se vuelven a ocultar.',
      'Completa el tablero con el menor número de movimientos.'
    ]
  },
  { 
    id: 'wordle', 
    title: 'PREVENWORDLE', 
    subtitle: 'MISIÓN_07', 
    icon: 'spellcheck', 
    active: true, 
    color: 'bg-emerald-600', 
    level: 'INTERMEDIO', 
    stats: '12 VIC / 4 RGO', 
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    desc: 'Descifra la palabra clave de seguridad del día utilizando pistas técnicas.',
    obj: 'Adivinar la palabra oculta relacionada con EHS en 6 intentos.',
    rules: [
      'Escribe una palabra de seguridad del largo indicado en la cuadrícula.',
      'Verde: La letra está en la palabra y en la posición correcta.',
      'Amarillo: La letra está en la palabra pero en otra posición.',
      'Gris: La letra no forma parte de la palabra.',
      'Pista: Puedes activar la definición técnica si necesitas ayuda.'
    ]
  },
  { 
    id: 'jenga', 
    title: 'JENGA SEGURO', 
    subtitle: 'MISIÓN_08', 
    icon: 'view_in_ar', 
    active: true, 
    color: 'bg-amber-600', 
    level: 'EXPERTO', 
    stats: '5 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?auto=format&fit=crop&q=80&w=800',
    desc: 'Mantén la estabilidad de la estructura industrial retirando piezas críticas.',
    obj: 'Retirar bloques sin que la torre (el sistema) colapse.',
    rules: [
      'Selecciona un bloque para retirarlo de la torre.',
      'Cada bloque representa un proceso o control.',
      'Si la torre cae, se produce un colapso del sistema.',
      'Ganas puntos por cada retiro exitoso y seguro.'
    ]
  },
  { 
    id: 'decisiones', 
    title: 'DECISIONES SEGURAS', 
    subtitle: 'MISIÓN_09', 
    icon: 'fact_check', 
    active: true, 
    color: 'bg-indigo-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    desc: 'Enfrentá escenarios reales de la operación y tomá la decisión más segura.',
    obj: 'Resolver dilemas éticos y técnicos de seguridad industrial.',
    rules: [
      'Analizá la imagen y la descripción del escenario.',
      'Elegí entre 3 opciones de conducta (A, B o C).',
      'Las respuestas correctas multiplican tu puntaje por racha.',
      'Aprendé con el principio preventivo revelado en cada turno.'
    ]
  },
  { 
    id: 'cazador', 
    title: 'CAZADOR DE RIESGOS', 
    subtitle: 'MISIÓN_10', 
    icon: 'center_focus_weak', 
    active: true, 
    color: 'bg-rose-600', 
    level: 'EXPERTO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Identificá condiciones inseguras en imágenes reales de planta antes de que ocurra un accidente.',
    obj: 'Encontrar todos los peligros ocultos en la escena bajo presión de tiempo.',
    rules: [
      'Seleccioná una escena operativa para inspeccionar.',
      'Hacé clic sobre los peligros que detectes en la imagen.',
      'Tenés 60 segundos para encontrar todas las condiciones inseguras.',
      'Cada acierto revela la medida de control y la norma técnica.'
    ]
  },
  { 
    id: 'pare', 
    title: 'PARE Y PIDA AYUDA', 
    subtitle: 'MISIÓN_11', 
    icon: 'pan_tool', 
    active: true, 
    color: 'bg-red-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    desc: 'Simulador de situaciones críticas con narrativa ramificada. El foco es la reflexión y el aprendizaje.',
    obj: 'Tomar las decisiones correctas ante escenarios de alto riesgo.',
    rules: [
      'Seleccioná una historia de la lista.',
      'Leé atentamente la situación planteada.',
      'Elegí una de las opciones disponibles.',
      'Observá las consecuencias de tus actos y aprendé de ellas.'
    ]
  },
  { 
    id: 'protocolo', 
    title: 'PROTOCOLO DE EMERGENCIA', 
    subtitle: 'MISIÓN_12', 
    icon: 'shield_alert', 
    active: true, 
    color: 'bg-red-700', 
    level: 'EXPERTO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Ordená los pasos de respuesta ante emergencias bajo presión de tiempo.',
    obj: 'Validar la secuencia correcta del protocolo de seguridad.',
    rules: [
      'Seleccioná el tipo de emergencia.',
      'Arrastrá los pasos para ordenarlos correctamente.',
      'Verificá antes de que se agote el tiempo.',
      'Los aciertos y el tiempo restante suman puntos.'
    ]
  },
  { 
    id: 'mision_13', 
    title: 'PRÓXIMA MISIÓN', 
    subtitle: 'MISIÓN_13', 
    icon: 'lock', 
    active: false, 
    color: 'bg-slate-700', 
    level: 'BLOQUEADO', 
    stats: '-- VIC / -- RGO', 
    img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800',
    desc: 'Contenido en desarrollo. Próximamente disponible.',
    obj: 'Bloqueado',
    rules: ['Próximamente']
  },
];

const RulesModal = ({ game, onClose }: { game: any, onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-panel-heavy p-8 rounded-3xl border-2 border-secondary shadow-2xl max-w-xl w-full relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${game.color} shadow-lg`}>
            <span className="material-symbols-outlined text-white text-2xl">{game.icon}</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">{game.subtitle}</p>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{game.title}</h2>
          </div>
        </div>
        
        <div className="space-y-6">
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <Info size={14} /> Descripción
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">{game.desc}</p>
          </section>
          
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <ShieldCheck size={14} /> Objetivo
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">{game.obj}</p>
          </section>
          
          <section>
            <h3 className="text-secondary font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <ClipboardList size={14} /> Reglas del Juego
            </h3>
            <ul className="space-y-2">
              {game.rules.map((rule: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-xs">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0"></div>
                  {rule}
                </li>
              ))}
            </ul>
          </section>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-8 py-4 bg-secondary text-black font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
        >
          ENTENDIDO
        </button>
      </motion.div>
    </motion.div>
  );
};

const GameCardV2 = ({ game, onSelect, onShowRules }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMissionOfTheWeek = game.id === MISSION_OF_THE_WEEK;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer h-[320px] ${isMissionOfTheWeek ? 'border-secondary shadow-[0_0_30px_rgba(255,182,144,0.3)]' : 'border-white/10'} ${game.active ? 'hover:border-secondary hover:shadow-[0_0_30px_rgba(255,182,144,0.2)]' : 'opacity-40 grayscale cursor-not-allowed border-transparent'}`}
    >
      {isMissionOfTheWeek && (
        <div className="absolute top-0 left-0 z-20 bg-secondary text-black text-[8px] font-black px-3 py-1 rounded-br-xl shadow-lg animate-pulse">
          MISIÓN DE LA SEMANA
        </div>
      )}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={game.img} alt={game.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${game.color} shadow-lg`}>
            {game.subtitle}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onShowRules(); }}
            className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-secondary hover:text-black transition-all"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-secondary text-3xl drop-shadow-[0_0_8px_rgba(255,182,144,0.5)]">{game.icon}</span>
             <h3 className="font-headline text-2xl font-black text-white leading-none tracking-tighter uppercase drop-shadow-lg">{game.title}</h3>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">military_tech</span>
              <span className="font-label text-[10px] font-bold text-white/60 uppercase tracking-widest">{game.level}</span>
            </div>
            <p className="text-[9px] font-mono text-white/40">{game.stats}</p>
          </div>
        </div>
      </div>

      {/* Hover Callout */}
      <AnimatePresence>
        {isHovered && game.active && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 z-20 bg-secondary/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center"
            onClick={onSelect}
          >
            <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-4">
              <Info className="text-black" size={24} />
            </div>
            <h4 className="font-headline text-black text-xl font-black uppercase tracking-tighter mb-2">SOBRE EL JUEGO</h4>
            <p className="text-black/80 text-xs font-medium leading-relaxed mb-4 px-2">
              {game.desc}
            </p>
            <div className="bg-black/10 rounded-lg p-3 w-full">
              <p className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-1">Objetivo</p>
              <p className="text-[11px] font-bold text-black leading-tight">{game.obj}</p>
            </div>
            <p className="mt-6 text-[10px] font-black text-black animate-pulse uppercase tracking-widest">Haz clic para iniciar misión</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EnhancedGameMenu = ({ onSelectGame, playerData }: { onSelectGame: (id: string) => void, playerData: any }) => {
  const [activeModule, setActiveModule] = useState<'FLOOR' | 'LOGS'>('FLOOR');
  const [selectedRules, setSelectedRules] = useState<any>(null);

  const renderContent = () => {
    if (activeModule === 'LOGS') {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-panel-heavy p-8 rounded-2xl border-t border-white/20 shadow-2xl">
            <h3 className="font-headline text-3xl font-black text-white mb-6 uppercase tracking-tighter">RANKING DE SEGURIDAD</h3>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 font-headline text-[10px] text-secondary uppercase tracking-widest">
                    <th className="p-4 border-b border-white/10">Jugador</th>
                    <th className="p-4 border-b border-white/10">Juego</th>
                    <th className="p-4 border-b border-white/10">Puntaje</th>
                    <th className="p-4 border-b border-white/10">Fecha</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-[11px] text-white/80">
                  <tr className="hover:bg-white/5 transition-colors border-b border-white/5">
                    <td className="p-4 font-bold">Demo Player</td>
                    <td className="p-4">Truco Seguro</td>
                    <td className="p-4 text-secondary">1500</td>
                    <td className="p-4 text-white/40">23/03/2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES_ENHANCED.map((game) => (
          <GameCardV2 
            key={game.id}
            game={game}
            onSelect={() => onSelectGame(game.id)}
            onShowRules={() => setSelectedRules(game)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1f14] pt-16 md:pt-24 pb-8 md:pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-12">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="w-6 md:w-12 h-[2px] bg-secondary"></div>
              <p className="font-headline text-secondary text-[8px] md:text-xs tracking-[0.3em] md:tracking-[0.5em] uppercase animate-hud-pulse">Centro de Entrenamiento EHS</p>
            </div>
            <h2 className="font-headline text-3xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              PANEL DE <span className="text-secondary">MISIONES</span>
            </h2>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md w-full md:w-auto overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveModule('FLOOR')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg font-headline text-[10px] md:text-xs tracking-widest uppercase transition-all whitespace-nowrap ${activeModule === 'FLOOR' ? 'bg-secondary text-black font-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Misiones
            </button>
            <button 
              onClick={() => setActiveModule('LOGS')}
              className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-3 rounded-lg font-headline text-[10px] md:text-xs tracking-widest uppercase transition-all whitespace-nowrap ${activeModule === 'LOGS' ? 'bg-secondary text-black font-black shadow-lg' : 'text-white/40 hover:text-white'}`}
            >
              Registros
            </button>
          </div>
        </div>

        {renderContent()}
      </div>

      <AnimatePresence>
        {selectedRules && (
          <RulesModal game={selectedRules} onClose={() => setSelectedRules(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

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
  Paperclip, ShieldAlert, Phone, DoorClosed, MapPin, Thermometer, Wind, Heart,
  Cpu, Activity, Check, Circle, History, Image, ListChecks, Menu, PlayCircle, RefreshCw, Settings2, Target,
  Quote, Sparkles, MessageCircle
} from 'lucide-react';

// --- CONSTANTS & TYPES ---
type View = 'START' | 'MENU' | 'GAME_TRUCO' | 'GAME_OCA' | 'GAME_CARRERA' | 'GAME_MATCH' | 'GAME_ESCAPE' | 'GAME_MEMORY' | 'GAME_MEMORY_V2' | 'GAME_MEMORY_V3' | 'GAME_WORDLE' | 'GAME_JENGA' | 'GAME_DECISIONES' | 'GAME_CAZADOR' | 'GAME_PARE' | 'GAME_PROTOCOLO' | 'GAME_ESPEJO' | 'GAME_RESOLVE';

// URLs de configuración (Pega aquí tus links CSV cuando los tengas)
const SITIOS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1753638195&single=true&output=csv'; 
const AREAS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=980501442&single=true&output=csv'; 
const CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=2102419216&single=true&output=csv'; 
const CAZADOR_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=123456789&single=true&output=csv'; // Placeholder GID

const CAZADOR_FALLBACK = [
  {
    id: 'f1',
    escena: 'Planta Industrial',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200',
    peligros: [
      { id: 1, peligro: 'Derrame de Aceite', x: 400, y: 300, radio: 40, medida: 'Limpieza inmediata y señalización', norma: 'ISO 45001' },
      { id: 2, peligro: 'Cable Expuesto', x: 200, y: 150, radio: 30, medida: 'Aislamiento y reparación', norma: 'NFPA 70E' }
    ]
  }
];

const RESOLVE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1792989854&single=true&output=csv';

const RESOLVE_FALLBACK = [
  {
    id: '1',
    titulo: 'Guarda de prensa retirada',
    descripcion: 'Al iniciar el turno, notás que la guarda de seguridad de la prensa hidráulica no está colocada.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Falta de protección mecánica', 'Riesgo de atrapamiento por partes móviles', 'Bloquear equipo y reportar a mantenimiento', 'Verificar que la guarda esté instalada y el sensor activo'],
    opciones: [
      ['Falta de protección mecánica', 'Desorden en el área', 'Falta de iluminación'],
      ['Riesgo de atrapamiento por partes móviles', 'Riesgo de caída al mismo nivel', 'Riesgo eléctrico'],
      ['Bloquear equipo y reportar a mantenimiento', 'Seguir operando con cuidado', 'Buscar la guarda por la planta'],
      ['Verificar que la guarda esté instalada y el sensor activo', 'Limpiar la máquina', 'Firmar el registro de producción']
    ],
    aprendizaje: 'Nunca operes sin protecciones. El bloqueo es vital.',
    dificultad: 'Media'
  },
  {
    id: '2',
    titulo: 'Derrame de aceite en pasillo',
    descripcion: 'Se detecta una mancha de aceite importante en el pasillo principal de logística.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Condición insegura: Superficie resbaladiza', 'Riesgo de caída al mismo nivel', 'Delimitar zona y usar kit antiderrames', 'Confirmar que el piso esté seco y limpio'],
    opciones: [
      ['Condición insegura: Superficie resbaladiza', 'Falta de EPP', 'Ruido excesivo'],
      ['Riesgo de caída al mismo nivel', 'Riesgo de incendio', 'Riesgo de corte'],
      ['Delimitar zona y usar kit antiderrames', 'Poner un cartón encima', 'Esperar al turno de limpieza'],
      ['Confirmar que el piso esté seco y limpio', 'Seguir caminando', 'Avisar por radio']
    ],
    aprendizaje: 'La limpieza y el orden (5S) previenen la mayoría de los accidentes.',
    dificultad: 'Baja'
  },
  {
    id: '3',
    titulo: 'Uso incorrecto de autoelevador',
    descripcion: 'Un compañero circula con la carga elevada obstruyendo su visión.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Acto inseguro: Conducción temeraria', 'Riesgo de choque o vuelco', 'Intervenir con respeto y pedir bajar la carga', 'Asegurar que circule con carga baja y visión clara'],
    opciones: [
      ['Acto inseguro: Conducción temeraria', 'Falla mecánica', 'Carga mal estibada'],
      ['Riesgo de choque o vuelco', 'Riesgo de explosión', 'Riesgo ergonómico'],
      ['Intervenir con respeto y pedir bajar la carga', 'Sacar una foto de lejos', 'Ignorar si no es de mi área'],
      ['Asegurar que circule con carga baja y visión clara', 'Verificar el nivel de combustible', 'Controlar la velocidad']
    ],
    aprendizaje: 'La seguridad es responsabilidad de todos. Intervenir a tiempo salva vidas.',
    dificultad: 'Alta'
  },
  {
    id: '4',
    titulo: 'Ruido extraño en ventilador',
    descripcion: 'Un extractor de aire en el techo emite un chirrido metálico constante.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['Falla potencial de rodamiento', 'Riesgo de rotura y proyección de partes', 'Informar a mantenimiento preventivo', 'Validar que el ruido desapareció tras la reparación'],
    opciones: [
      ['Falla potencial de rodamiento', 'Falta de limpieza', 'Uso de aire comprimido'],
      ['Riesgo de rotura y proyección de partes', 'Riesgo de sordera', 'Riesgo de incendio'],
      ['Informar a mantenimiento preventivo', 'Usar protectores auditivos', 'Subir el volumen de la música'],
      ['Validar que el ruido desapareció tras la reparación', 'Encender el equipo', 'Limpiar el área']
    ],
    aprendizaje: 'Escuchar a las máquinas es parte de la prevención.',
    dificultad: 'Media'
  },
  {
    id: '5',
    titulo: 'EPP dañado',
    descripcion: 'Tus guantes de protección contra cortes tienen un agujero en la palma.',
    imagen_url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    pasos_correctos: ['EPP en mal estado', 'Riesgo de herida cortante', 'Solicitar cambio inmediato de guantes', 'Verificar que el nuevo EPP sea el adecuado'],
    opciones: [
      ['EPP en mal estado', 'Falta de capacitación', 'Herramienta defectuosa'],
      ['Riesgo de herida cortante', 'Riesgo de dermatitis', 'Riesgo de golpe'],
      ['Solicitar cambio inmediato de guantes', 'Poner cinta sobre el agujero', 'Usarlos al revés'],
      ['Verificar que el nuevo EPP sea el adecuado', 'Guardar los viejos', 'Seguir trabajando']
    ],
    aprendizaje: 'Tu EPP es tu última barrera de defensa. Mantenelo impecable.',
    dificultad: 'Baja'
  }
];

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
  { id: 'espejo', title: 'EL ESPEJO DEL TURNO', subtitle: 'MISIÓN_10', icon: 'visibility', active: true, color: 'bg-purple-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
  { id: 'resolve', title: 'RESOLVÉ EN EL PUESTO', subtitle: 'MISIÓN_13', icon: 'build', active: true, color: 'bg-blue-600', level: 'INTERMEDIO', stats: '0 VIC / 0 RGO', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
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

const ScanlineOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.03]">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
    <div className="absolute inset-0 animate-scanline bg-gradient-to-b from-transparent via-secondary/10 to-transparent h-20 w-full"></div>
  </div>
);

const SystemLoader = ({ message = "INICIALIZANDO SISTEMA..." }: { message?: string }) => (
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

const GlobalHeader = ({ playerData, onViewChange }: { playerData: any, onViewChange: (view: View) => void }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 md:h-20 bg-black/40 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onViewChange('MENU')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Shield className="text-black" size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-headline text-lg md:text-xl font-black text-white tracking-tighter leading-none">PREVEN<span className="text-secondary">EHS</span></h1>
            <p className="text-[8px] font-headline text-white/40 uppercase tracking-widest mt-1">SISTEMA DE GESTIÓN PREVENTIVA</p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">ESTADO DEL SISTEMA</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">OPERATIVO / SEGURO</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">LOCALIZACIÓN</span>
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">{playerData?.sitio || 'PLANTA_BASE'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[8px] font-headline text-secondary uppercase tracking-widest mb-0.5">RELOJ DEL SISTEMA</span>
          <span className="text-[10px] font-mono text-white/60">{time}</span>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-1.5 md:p-2 rounded-xl border border-white/10">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/20 flex items-center justify-center border border-secondary/30">
            <User className="text-secondary" size={18} />
          </div>
          <div className="pr-2 md:pr-4">
            <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-tighter leading-none">{playerData?.nombre || 'OPERADOR_01'}</p>
            <div className="flex items-center gap-2 mt-1">
              <Zap size={10} className="text-secondary" />
              <span className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-widest">{playerData?.score || 0} PTS</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

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
  const [enrollmentStep, setEnrollmentStep] = useState(0);

  const [formData, setFormData] = useState({
    nombre: '',
    sitio: '',
    sector: '',
    udn: '',
    edad: '',
    score: 0
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

  const handleNext = () => {
    if (enrollmentStep === 0 && formData.nombre.trim().length < 3) return;
    if (enrollmentStep < 1) setEnrollmentStep(prev => prev + 1);
    else onStart(formData);
  };

  if (loadingConfig) return <SystemLoader />;

  return (
    <div className="min-h-screen bg-[#0a1f14] flex items-center justify-center p-4 relative overflow-hidden">
      <ScanlineOverlay />
      
      {/* Background HUD Elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-12 left-12 w-64 h-64 border border-secondary/20 rounded-full animate-hud-pulse" />
        <div className="absolute bottom-12 right-12 w-96 h-96 border border-secondary/10 rounded-full animate-hud-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-secondary/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-secondary/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-panel-heavy p-8 md:p-12 rounded-[2rem] border-2 border-secondary/30 shadow-2xl relative overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="text-black" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">ENROLAMIENTO</h2>
                <p className="text-[8px] font-headline text-secondary uppercase tracking-[0.3em] mt-1">SISTEMA_PREVEN_EHS v1.0</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono text-white/40 uppercase">Status</p>
              <p className="text-[10px] font-mono text-emerald-500 font-bold uppercase">Ready_to_Link</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {enrollmentStep === 0 ? (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Identificación del Operador</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="NOMBRE COMPLETO"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-headline font-bold focus:border-secondary transition-all outline-none uppercase placeholder:text-white/10"
                      value={formData.nombre}
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Edad</label>
                  <input 
                    type="number" 
                    placeholder="AÑOS"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 px-4 text-white font-headline font-bold focus:border-secondary transition-all outline-none uppercase placeholder:text-white/10"
                    value={formData.edad}
                    onChange={e => setFormData({...formData, edad: e.target.value})}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Sitio Operativo</label>
                    <select 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 px-4 text-white font-headline font-bold focus:border-secondary transition-all outline-none uppercase appearance-none cursor-pointer"
                      value={formData.sitio}
                      onChange={e => setFormData({...formData, sitio: e.target.value})}
                    >
                      {sitios.map(s => <option key={s} value={s} className="bg-[#0a1f14]">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Sector / Área</label>
                    <select 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 px-4 text-white font-headline font-bold focus:border-secondary transition-all outline-none uppercase appearance-none cursor-pointer"
                      value={formData.sector}
                      onChange={e => setFormData({...formData, sector: e.target.value})}
                    >
                      {sectores.map(s => <option key={s} value={s} className="bg-[#0a1f14]">{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-secondary uppercase tracking-widest mb-2">Unidad de Negocio (UDN)</label>
                  <input 
                    type="text" 
                    placeholder="EJ: MINERÍA, ENERGÍA..."
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl py-4 px-4 text-white font-headline font-bold focus:border-secondary transition-all outline-none uppercase placeholder:text-white/10"
                    value={formData.udn}
                    onChange={e => setFormData({...formData, udn: e.target.value})}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center gap-4">
            {enrollmentStep > 0 && (
              <button 
                onClick={() => setEnrollmentStep(0)}
                className="w-16 h-16 rounded-xl border-2 border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={enrollmentStep === 0 && formData.nombre.trim().length < 3}
              className="flex-1 bg-secondary text-black font-black uppercase tracking-[0.2em] py-5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {enrollmentStep === 0 ? 'SIGUIENTE' : 'VINCULAR SISTEMA'}
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Terminal Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
            <p>Protocol: EHS_LINK_SECURE</p>
            <p>Step: 0{enrollmentStep + 1} / 02</p>
          </div>
        </div>
      </motion.div>
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
          // Robust CSV split handling quotes
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          
          // Mapping based on user screenshot:
          // A: ESCENA (0)
          // B: IMAGEN_URL (1)
          // C: PELIGRO (2)
          // D: X (3)
          // E: Y (4)
          // F: RADIO (5)
          // G: MEDIDA (6)
          
          const escena = cols[0] || "Escena Desconocida";
          const imgUrl = getDirectImageUrl(cols[1]); 
          if (!imgUrl) return;
          
          if (!grouped[imgUrl]) {
            grouped[imgUrl] = {
              id: Math.random().toString(36).substring(7),
              escena: escena,
              imagen_url: imgUrl,
              peligros: []
            };
          }
          
          const x = parseFloat(cols[3]);
          const y = parseFloat(cols[4]);
          const radio = parseFloat(cols[5]) || 35;
          
          if (!isNaN(x) && !isNaN(y)) {
            grouped[imgUrl].peligros.push({
              id: Math.random(),
              peligro: cols[2] || "Riesgo No Identificado",
              x: x,
              y: y,
              radio: radio,
              medida: cols[6] || "Sin medida preventiva registrada",
              norma: cols[7] || "Normativa General EHS"
            });
          }
        });
        
        const parsed = Object.values(grouped);
        if (parsed.length > 0) {
          setScenes(parsed);
          // If only one scene, skip selection
          if (parsed.length === 1) {
            handleStartScene(parsed[0]);
          }
        } else {
          setScenes(CAZADOR_FALLBACK);
        }
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

  const [scannerPos, setScannerPos] = useState({ x: 0, y: 0 });
  const [showScanner, setShowScanner] = useState(false);
  const [activePeligro, setActivePeligro] = useState<any>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState !== 'PLAY' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setScannerPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowScanner(true);
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
        setActivePeligro(p);
        // Auto-clear active danger after 4s
        setTimeout(() => setActivePeligro(null), 4000);
      }
    });

    setLastClick({ x: clickX, y: clickY, success: found });
    setTimeout(() => setLastClick(null), 800);

    if (found && foundIds.length + 1 === selectedScene.peligros.length) {
      setTimeout(handleGameOver, 2000);
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
            <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                 <div className="flex items-center gap-2 bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">SISTEMA_SCAN_ACTIVO</p>
                 </div>
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
                    REF_COORD: {containerRef.current ? Math.round((scannerPos.x / containerRef.current.getBoundingClientRect().width) * 800) : 0}, 
                    {containerRef.current ? Math.round((scannerPos.y / containerRef.current.getBoundingClientRect().height) * 500) : 0}
                 </p>
              </div>

              <div 
                ref={containerRef}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowScanner(false)}
                className="relative max-w-[1000px] w-full aspect-[800/500] bg-slate-900 rounded-3xl overflow-hidden cursor-none shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 group"
              >
                {selectedScene.imagen_url ? (
                  <img 
                    src={selectedScene.imagen_url} 
                    className="w-full h-full object-contain pointer-events-none z-0" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="z-0 w-full h-full">
                    {renderFallbackSVG(selectedScene.escena)}
                  </div>
                )}

                {/* Scanner Overlay */}
                {showScanner && (
                  <motion.div 
                    className="absolute pointer-events-none z-[100]"
                    animate={{ x: scannerPos.x - 60, y: scannerPos.y - 60 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  >
                    <div className="w-32 h-32 border-2 border-rose-500 rounded-full relative flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                      <div className="absolute inset-0 bg-rose-500/5 rounded-full animate-pulse"></div>
                      <div className="w-full h-[1px] bg-rose-500/30 absolute top-1/2"></div>
                      <div className="h-full w-[1px] bg-rose-500/30 absolute left-1/2"></div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-rose-500 uppercase tracking-widest whitespace-nowrap bg-black/80 px-2 py-0.5 rounded">MODO_ESCÁNER_EHS</div>
                    </div>
                  </motion.div>
                )}

                {/* Found Markers */}
                {selectedScene.peligros.map((p: any) => foundIds.includes(p.id) && (
                  <motion.div
                    key={p.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20"
                    style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 500) * 100}%` }}
                  >
                    <div className="w-full h-full bg-emerald-500/20 rounded-full animate-pulse"></div>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </motion.div>
                ))}

                {/* Click Feedback */}
                {lastClick && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    className={`absolute w-12 h-12 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-40 ${lastClick.success ? 'border-emerald-500' : 'border-rose-500'}`}
                    style={{ left: lastClick.x, top: lastClick.y }}
                  >
                    {lastClick.success ? <ShieldCheck size={24} className="text-emerald-500" /> : <AlertTriangle size={24} className="text-rose-500" />}
                  </motion.div>
                )}

                {/* HUD Overlay Elements */}
                <div className="absolute inset-0 pointer-events-none border-[1px] border-white/10 m-4 rounded-2xl"></div>
                <div className="absolute bottom-4 right-4 text-[7px] font-mono text-white/20 uppercase tracking-[0.5em]">EHS_SCANNER_v4.2.0</div>
              </div>

              {/* Active Danger Detail Popup */}
              <AnimatePresence>
                {activePeligro && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
                  >
                    <div className="glass-panel-heavy p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                          <ShieldCheck size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Riesgo Neutralizado</h4>
                          <h3 className="text-lg font-black uppercase tracking-tight leading-tight">{activePeligro.peligro}</h3>
                          <div className="h-px w-full bg-white/10 my-2"></div>
                          <p className="text-[10px] font-bold text-white/80 leading-relaxed">
                            <span className="text-emerald-500/60 uppercase mr-1">Medida:</span> {activePeligro.medida}
                          </p>
                          <p className="text-[9px] font-mono text-white/40 mt-2 italic">Ref: {activePeligro.norma}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar: Risk Inventory */}
            <div className="w-full lg:w-80 bg-black/60 backdrop-blur-xl border-l border-white/5 p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Inventario de Riesgos</h3>
                <p className="text-white/40 text-[9px] font-mono uppercase">Detectar {selectedScene.peligros.length} condiciones críticas</p>
              </div>

              <div className="space-y-3">
                {selectedScene.peligros.map((p: any, idx: number) => (
                  <div 
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all duration-500 ${
                      foundIds.includes(p.id) 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/5 opacity-40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                        foundIds.includes(p.id) ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${
                          foundIds.includes(p.id) ? 'text-white' : 'text-white/20'
                        }`}>
                          {foundIds.includes(p.id) ? p.peligro : '????????????'}
                        </p>
                        {foundIds.includes(p.id) && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[8px] font-mono text-emerald-500/60 uppercase mt-1"
                          >
                            Identificado
                          </motion.p>
                        )}
                      </div>
                      {foundIds.includes(p.id) && <CheckCircle2 size={12} className="text-emerald-500" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-2">Estado de Auditoría</p>
                    <div className="flex justify-between items-end">
                       <p className="text-2xl font-black text-white tabular-nums">{Math.round((foundIds.length / selectedScene.peligros.length) * 100)}%</p>
                       <p className="text-[10px] font-mono text-white/40 uppercase">Completado</p>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                       <motion.div 
                        className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        animate={{ width: `${(foundIds.length / selectedScene.peligros.length) * 100}%` }}
                       />
                    </div>
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
            className="flex-1 flex items-center justify-center p-8 bg-[#050505]"
          >
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Report Card */}
              <div className="glass-panel-heavy p-8 rounded-[2rem] border border-white/10 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldCheck size={200} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Informe de Auditoría</h3>
                  <h2 className="text-4xl font-black uppercase tracking-tight leading-none">Inspección <span className="text-rose-600">Finalizada</span></h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Riesgos Hallados</p>
                    <p className="text-3xl font-black text-emerald-500">{foundIds.length} / {selectedScene.peligros.length}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Puntaje Final</p>
                    <p className="text-3xl font-black text-rose-500">{score.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[11px] font-mono text-white/60 uppercase leading-relaxed">
                      La inspección en <span className="text-white font-bold">{selectedScene.escena}</span> ha sido completada exitosamente. Se han identificado las condiciones inseguras y se han registrado las medidas preventivas correspondientes en la base de datos central.
                   </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setGameState('SELECT')}
                    className="w-full py-5 bg-emerald-600 text-black font-black rounded-xl uppercase tracking-widest hover:bg-emerald-500 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    Nueva Inspección
                  </button>
                  <button 
                    onClick={onExit}
                    className="w-full py-5 bg-rose-600 text-white font-black rounded-xl uppercase tracking-widest hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  >
                    Finalizar y Salir
                  </button>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="space-y-6">
                <div className="glass-panel-heavy p-10 rounded-[2rem] border border-white/10 bg-rose-500/5 h-full flex flex-col justify-center">
                   <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500 mb-6">
                      <ShieldAlert size={32} />
                   </div>
                   <h3 className="text-[12px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Recomendación Estratégica</h3>
                   <p className="text-lg font-medium text-white/90 leading-relaxed italic mb-8">
                      "La seguridad no es un destino, es un viaje continuo. Tu capacidad de observación hoy previene el accidente de mañana."
                   </p>
                   <div className="pt-6 border-t border-white/10">
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ID_AUDITORÍA: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
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

// --- EL ESPEJO DEL TURNO GAME ---

const ESPEJO_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-1bcf0ugEXafqimV7jTMtEpZ0U1TH2zGy0EMt_R_Pc3qnShewR4ogYy3vvX8MeAiMlNNej6FsIYa3/pub?gid=1346735467&single=true&output=csv';
const ESPEJO_APPS_SCRIPT_URL = 'TU_URL_APPS_SCRIPT';

const ESPEJO_FALLBACK = [
  { id: '1', situacion: "A veces apuro el último paso porque ya terminó el turno.", categoria: "Conducta", pregunta_debate: "¿Qué riesgos reales corremos al apurarnos al final?", reflexion: "El cansancio del final del turno es el momento de mayor riesgo. Pausar asegura llegar a casa sano." },
  { id: '2', situacion: "Usé un EPP deteriorado porque no había otro disponible.", categoria: "Autocuidado", pregunta_debate: "¿Por qué a veces aceptamos EPP en mal estado?", reflexion: "Tu seguridad depende de la integridad de tu equipo. Si no es seguro, no se usa." },
  { id: '3', situacion: "Vi una condición insegura y no la reporté para no demorar.", categoria: "Confianza", pregunta_debate: "¿Qué nos frena a reportar condiciones inseguras?", reflexion: "Reportar hoy evita el accidente de mañana. Tu voz es la mejor herramienta de prevención." },
  { id: '4', situacion: "Operé una máquina con la guarda abierta por un momento.", categoria: "Conducta", pregunta_debate: "¿Por qué creemos que 'un momento' no es peligroso?", reflexion: "Los accidentes ocurren en fracciones de segundo. Las guardas son barreras de vida." },
  { id: '5', situacion: "Empecé una tarea sin AST porque ya la conozco de memoria.", categoria: "Conocimiento", pregunta_debate: "¿El exceso de confianza nos hace olvidar pasos críticos?", reflexion: "El AST no es solo un papel, es el momento de pensar antes de actuar." },
  { id: '6', situacion: "Levanté una carga pesado solo para no molestar a nadie.", categoria: "Autocuidado", pregunta_debate: "¿Por qué nos cuesta pedir ayuda para tareas físicas?", reflexion: "Tu espalda tiene memoria. Pedir ayuda o usar medios mecánicos es de profesionales." },
  { id: '7', situacion: "Usé una herramienta en mal estado porque era la única.", categoria: "Conducta", pregunta_debate: "¿Qué impacto tiene una herramienta defectuosa en la calidad y seguridad?", reflexion: "Una herramienta improvisada es un accidente anunciado. Exigí lo necesario para trabajar bien." },
  { id: '8', situacion: "Vine con mucho cansancio sin avisar a nadie cómo me sentía.", categoria: "Autocuidado", pregunta_debate: "¿Cómo afecta el cansancio nuestra percepción del riesgo?", reflexion: "Estar apto es el primer paso de la tarea. Avisar a tiempo permite reasignar tareas críticas." },
  { id: '9', situacion: "Vi a un compañero en riesgo y no le dije nada por no generar conflicto.", categoria: "Confianza", pregunta_debate: "¿Cómo podemos decir algo sin que se sienta como un ataque?", reflexion: "Cuidar al compañero es la base de la cultura de seguridad. El silencio puede ser fatal." },
  { id: '10', situacion: "Sé exactamente dónde está el punto de encuentro de mi sector.", categoria: "Conocimiento", pregunta_debate: "¿Podríamos llegar a ciegas en caso de humo o corte de luz?", reflexion: "En una emergencia, el instinto debe estar entrenado. Conocer las rutas salva vidas." },
  { id: '11', situacion: "Puedo explicar los pasos del CATA sin consultar nada.", categoria: "Conocimiento", pregunta_debate: "¿Qué paso del CATA es el que más solemos olvidar?", reflexion: "El CATA es nuestra brújula. Dominarlo es dominar nuestra propia seguridad." },
  { id: '12', situacion: "Puedo nombrar dos operaciones críticas de mi sector.", categoria: "Conocimiento", pregunta_debate: "¿Cuáles son los riesgos fatales de esas operaciones?", reflexion: "Identificar el peligro es el 50% de la prevención. No pierdas de vista lo crítico." },
  { id: '13', situacion: "Sé cómo reportar un incidente en la app Estoy Seguro.", categoria: "Conocimiento", pregunta_debate: "¿Qué nos frena a veces para reportar un incidente?", reflexion: "Reportar es prevenir. Tu reporte de hoy es el accidente que evitamos mañana." },
];

const ESPEJO_CATEGORY_COLORS: { [key: string]: string } = {
  "Autocuidado": "bg-emerald-500 shadow-emerald-500/50",
  "Conducta": "bg-blue-500 shadow-blue-500/50",
  "Confianza": "bg-purple-500 shadow-purple-500/50",
  "Conocimiento": "bg-amber-500 shadow-amber-500/50",
  "Entorno": "bg-rose-500 shadow-rose-500/50"
};

const EspejoDelTurnoGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'START' | 'IDENTIFICATION' | 'GAME' | 'PROFILE' | 'CONFIRMATION'>('START');
  const [mode, setMode] = useState<'INDIVIDUAL' | 'FACILITADOR' | null>(null);
  const [userData, setUserData] = useState({ udn: '', area: '' });
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDebate, setShowDebate] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const r = await fetch(ESPEJO_SHEETS_URL);
        const csv = await r.text();
        const lines = csv.split('\n').filter(l => l.trim() !== '').slice(1);
        const parsed = lines.map(line => {
          const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, ''));
          if (cols.length < 5) return null;
          return {
            id: cols[0],
            situacion: cols[1],
            categoria: cols[2],
            pregunta_debate: cols[3],
            reflexion: cols[4]
          };
        }).filter(c => c !== null);
        if (parsed.length > 0) setCards(parsed.slice(0, 15));
        else setCards(ESPEJO_FALLBACK);
      } catch (e) {
        setCards(ESPEJO_FALLBACK);
      }
    };
    fetchCards();
  }, []);

  const handleResponse = (value: string) => {
    if (mode === 'INDIVIDUAL') {
      setResponses([...responses, { id: cards[currentIndex].id, categoria: cards[currentIndex].categoria, value }]);
    }
    setIsFlipped(true);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowDebate(false);
    } else {
      if (mode === 'INDIVIDUAL') setGameState('PROFILE');
      else setGameState('CONFIRMATION');
    }
  };

  const getProfile = () => {
    const rojos = responses.filter(r => r.value === 'siempre').length;
    if (rojos <= 4) return { label: 'OPERADOR CONSCIENTE', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: <ShieldCheck size={48} className="text-emerald-400" />, desc: 'Tu nivel de conciencia sobre los riesgos es alto. Seguí así y sé ejemplo para tus compañeros.' };
    if (rojos <= 9) return { label: 'OPERADOR EN ALERTA', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: <AlertTriangle size={48} className="text-amber-400" />, desc: 'Detectamos algunas conductas que podrían ponerte en riesgo. Es momento de reenfocar tu atención.' };
    return { label: 'OPERADOR EN RIESGO', color: 'text-rose-400', bg: 'bg-rose-500/20', icon: <ShieldAlert size={48} className="text-rose-400" />, desc: 'Tus respuestas indican una alta exposición al riesgo. Detenete un momento y priorizá tu seguridad.' };
  };

  const saveResults = async () => {
    setIsSending(true);
    const profile = getProfile();
    const data = {
      timestamp: new Date().toISOString(),
      udn: userData.udn,
      area: userData.area,
      rojos: responses.filter(r => r.value === 'siempre').length,
      amarillos: responses.filter(r => r.value === 'a veces').length,
      verdes: responses.filter(r => r.value === 'no').length,
      perfil: profile.label,
      respuestas: responses
    };

    try {
      await fetch(ESPEJO_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      onGameOver(100);
      setGameState('CONFIRMATION');
    } catch (e) {
      onGameOver(100);
      setGameState('CONFIRMATION');
    }
    setIsSending(false);
  };

  if (gameState === 'START') {
    return (
      <div className="flex flex-col items-center justify-center p-4 md:p-12 bg-[#050505] relative overflow-y-auto min-h-screen font-sans">
        {/* Scanlines Effect */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.15, 0.1],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px]" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-5xl w-full text-center space-y-8 md:space-y-16 py-12 md:py-20"
        >
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              SISTEMA DE REFLEXIÓN EHS
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.85] italic text-white">
              El Espejo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">del Turno</span>
            </h1>
            
            <p className="text-white/40 font-medium max-w-2xl mx-auto text-base md:text-xl leading-relaxed px-4">
              Una interfaz de introspección diseñada para calibrar nuestras conductas y asegurar que el compromiso con la vida sea nuestra única prioridad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4">
            <motion.button 
              whileHover={{ scale: 1.02, y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMode('INDIVIDUAL'); setGameState('IDENTIFICATION'); }} 
              className="group p-8 md:p-12 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:border-blue-500/50 transition-all text-left space-y-6 md:space-y-8 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <User size={120} className="md:w-40 md:h-40" />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] group-hover:shadow-blue-600/60 transition-all">
                <User size={32} className="text-white md:w-10 md:h-10" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-white">Modo Individual</h2>
                <p className="text-white/40 font-medium text-sm md:text-lg">Autoevaluación confidencial para detectar tus propios puntos ciegos.</p>
              </div>
              <div className="flex items-center gap-3 text-blue-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">
                INICIAR <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform md:w-[18px] md:h-[18px]" />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02, y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setMode('FACILITADOR'); setGameState('GAME'); }} 
              className="group p-8 md:p-12 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:border-purple-500/50 transition-all text-left space-y-6 md:space-y-8 relative overflow-hidden backdrop-blur-xl"
            >
              <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={120} className="md:w-40 md:h-40" />
              </div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.4)] group-hover:shadow-purple-600/60 transition-all">
                <Users size={32} className="text-white md:w-10 md:h-10" />
              </div>
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-white">Modo Facilitador</h2>
                <p className="text-white/40 font-medium text-sm md:text-lg">Dinámica de equipo para proyectar y debatir conductas en conjunto.</p>
              </div>
              <div className="flex items-center gap-3 text-purple-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em]">
                ABRIR SESIÓN <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform md:w-[18px] md:h-[18px]" />
              </div>
            </motion.button>
          </div>

          <button 
            onClick={onExit} 
            className="flex items-center gap-3 mx-auto text-white/20 hover:text-white font-black text-[10px] md:text-xs uppercase tracking-[0.4em] transition-all hover:tracking-[0.5em]"
          >
            <ArrowLeft size={16} className="md:w-[18px] md:h-[18px]" /> VOLVER AL CENTRO DE CONTROL
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'IDENTIFICATION') {
    return (
      <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-[#050505] relative overflow-y-auto min-h-screen">
        <ScanlineOverlay />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-white/10 space-y-6 md:space-y-8 backdrop-blur-xl relative z-10"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Identificación</h2>
            <p className="text-white/40 font-medium text-xs md:text-sm">Completá estos datos para contextualizar tu perfil.</p>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">UDN / Planta</label>
              <input 
                type="text" 
                value={userData.udn} 
                onChange={e => setUserData({...userData, udn: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-white focus:border-blue-500 outline-none transition-all font-bold text-sm md:text-base" 
                placeholder="Ej: Planta Luque" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Área / Sector</label>
              <input 
                type="text" 
                value={userData.area} 
                onChange={e => setUserData({...userData, area: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 text-white focus:border-blue-500 outline-none transition-all font-bold text-sm md:text-base" 
                placeholder="Ej: Montaje Final" 
              />
            </div>
          </div>

          <button 
            disabled={!userData.udn || !userData.area} 
            onClick={() => setGameState('GAME')} 
            className="w-full py-4 md:py-5 bg-blue-600 rounded-xl md:rounded-2xl font-black text-white shadow-xl shadow-blue-600/20 disabled:opacity-20 disabled:grayscale transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-xs md:text-sm"
          >
            Comenzar Evaluación
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'GAME') {
    const card = cards[currentIndex];
    if (!card) return (
      <div className="flex-1 flex items-center justify-center bg-[#050505]">
        <RefreshCw className="text-blue-500 animate-spin" size={64} />
      </div>
    );

    return (
      <div className="min-h-screen flex flex-col p-4 md:p-8 bg-[#050505] relative overflow-y-auto pt-24">
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

        <div className="max-w-4xl w-full mx-auto flex flex-col space-y-6 md:space-y-10 relative z-10">
          {/* Progress Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white/5 p-4 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">MÓDULO DE INTROSPECCIÓN</p>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Tarjeta {currentIndex + 1} <span className="text-white/20">/ {cards.length}</span></h3>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">PROGRESO DEL TURNO</div>
              <div className="w-48 md:w-64 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.6)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Card Container */}
          <div className="relative w-full h-[500px] md:h-[650px]" style={{ perspective: '3000px' }}>
            <motion.div 
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 80, damping: 15 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* FRONT: Situation */}
              <div className="absolute inset-0 bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-8 md:space-y-12 backdrop-blur-xl overflow-y-auto scrollbar-hide" style={{ backfaceVisibility: 'hidden' }}>
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-2xl flex-shrink-0 ${ESPEJO_CATEGORY_COLORS[card.categoria] || 'bg-slate-600'}`}
                >
                  {card.categoria}
                </motion.div>
                
                <div className="space-y-4 md:space-y-8 max-w-2xl relative flex-1 flex flex-col justify-center">
                  <Quote size={40} className="absolute -top-8 -left-8 text-blue-500/20 hidden md:block" />
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-black leading-[1.1] tracking-tighter uppercase italic text-white drop-shadow-2xl">
                    "{card.situacion}"
                  </h3>
                  <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto rounded-full opacity-50 mt-4" />
                </div>

                <div className="w-full max-w-md grid gap-3 flex-shrink-0">
                  {[
                    { val: 'siempre', label: 'Me pasa siempre', color: 'rose', icon: '🔴' },
                    { val: 'a veces', label: 'Me pasa a veces', color: 'amber', icon: '🟡' },
                    { val: 'no', label: 'No me pasa', color: 'emerald', icon: '🟢' }
                  ].map((opt) => (
                    <motion.button 
                      key={opt.val}
                      whileHover={{ scale: 1.02, x: 5, backgroundColor: `rgba(var(--${opt.color}-500), 0.2)` }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResponse(opt.val)} 
                      className={`flex items-center gap-4 p-4 md:p-5 bg-${opt.color}-500/10 border border-${opt.color}-500/30 rounded-2xl text-${opt.color}-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-${opt.color}-500 hover:text-white transition-all shadow-lg`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-${opt.color}-500/20 flex items-center justify-center text-lg`}>
                        {opt.icon}
                      </div>
                      {opt.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* BACK: Reflection (The "Mirror" Side) */}
              <div className="absolute inset-0 bg-blue-950/40 border-2 border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.2)] rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:space-y-10 backdrop-blur-[40px] overflow-y-auto scrollbar-hide" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {/* Mirror Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/40 pointer-events-none opacity-50" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
                
                {/* Silhouette Reflection (Subtle) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none flex items-end justify-center">
                  <User size={400} className="text-white" />
                </div>

                <div className="relative z-10 space-y-6 md:space-y-10 max-w-2xl flex-1 flex flex-col justify-center">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(37,99,235,0.5)] border border-white/20 flex-shrink-0"
                  >
                    <Sparkles size={32} className="text-white" />
                  </motion.div>
                  
                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] drop-shadow-glow">REFLEXIÓN DEL ESPEJO</h4>
                    <p className="text-lg md:text-2xl lg:text-3xl font-black leading-tight tracking-tighter uppercase italic text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      {card.reflexion}
                    </p>
                  </div>
                  
                  {mode === 'FACILITADOR' && (
                    <div className="pt-6 md:pt-10 border-t border-white/10 w-full flex-shrink-0">
                      {!showDebate ? (
                        <motion.button 
                          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(147,51,234,0.4)' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowDebate(true)} 
                          className="px-8 md:px-12 py-4 md:py-5 bg-purple-600 rounded-2xl font-black text-[10px] md:text-xs text-white uppercase tracking-[0.3em] shadow-2xl transition-all"
                        >
                          ABRIR DEBATE GRUPAL
                        </motion.button>
                      ) : (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }} 
                          animate={{ y: 0, opacity: 1 }} 
                          className="p-6 md:p-10 bg-purple-600/20 border border-purple-600/30 rounded-[2rem] space-y-4 md:space-y-6 backdrop-blur-md"
                        >
                          <div className="flex items-center justify-center gap-3 text-purple-400">
                            <MessageCircle size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">PREGUNTA PARA EL EQUIPO</span>
                          </div>
                          <p className="text-base md:text-xl font-black text-white leading-tight tracking-tight uppercase italic">
                            "{card.pregunta_debate}"
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Footer */}
          <div className="h-24 md:h-32 flex items-center justify-center">
            <AnimatePresence>
              {isFlipped && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8, y: 30 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileHover={{ scale: 1.05, backgroundColor: '#fff' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextCard} 
                  className="group flex items-center gap-4 md:gap-6 px-10 md:px-16 py-4 md:py-6 bg-white/90 text-black rounded-2xl md:rounded-[2rem] font-black text-xs md:text-xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all"
                >
                  {currentIndex < cards.length - 1 ? 'Siguiente Tarjeta' : 'Ver Resultados Finales'}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform md:w-7 md:h-7" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'PROFILE') {
    const profile = getProfile();
    const stats = {
      rojos: responses.filter(r => r.value === 'siempre').length,
      amarillos: responses.filter(r => r.value === 'a veces').length,
      verdes: responses.filter(r => r.value === 'no').length
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#050505] relative overflow-y-auto pt-24">
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl bg-white/5 rounded-[2rem] md:rounded-[4rem] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative z-10"
        >
          <div className={`p-8 md:p-20 text-center space-y-6 md:space-y-8 ${profile.bg} relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-30%] left-[-30%] w-[80%] h-[80%] bg-current rounded-full blur-[120px]" />
            </div>
            
            <motion.div 
              initial={{ rotate: -10, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="w-20 h-20 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] bg-white/10 flex items-center justify-center mx-auto backdrop-blur-xl border border-white/20 shadow-2xl relative z-10"
            >
              {profile.icon}
            </motion.div>
            
            <div className="space-y-2 md:space-y-3 relative z-10">
              <h2 className={`text-4xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] italic ${profile.color} drop-shadow-glow`}>
                {profile.label}
              </h2>
              <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">DIAGNÓSTICO DE CONDUCTA EHS</p>
            </div>
            
            <p className="text-white/80 font-medium text-base md:text-xl leading-relaxed max-w-lg mx-auto relative z-10">
              {profile.desc}
            </p>
          </div>

          <div className="p-8 md:p-16 space-y-8 md:space-y-12 bg-black/20">
            <div className="grid grid-cols-1 gap-6 md:gap-10">
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">CONDUCTAS SEGURAS (BAJO RIESGO)</p>
                    <p className="text-xl md:text-3xl font-black">{stats.verdes} <span className="text-white/20 text-sm md:text-lg">/ {cards.length}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl md:text-3xl font-black text-emerald-400">{Math.round((stats.verdes / cards.length) * 100)}%</span>
                  </div>
                </div>
                <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.verdes / cards.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] rounded-full" 
                  />
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[8px] md:text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">CONDUCTAS EN RIESGO (ALTA EXPOSICIÓN)</p>
                    <p className="text-xl md:text-3xl font-black">{stats.rojos} <span className="text-white/20 text-sm md:text-lg">/ {cards.length}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl md:text-3xl font-black text-rose-400">{Math.round((stats.rojos / cards.length) * 100)}%</span>
                  </div>
                </div>
                <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.rojos / cards.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] rounded-full" 
                  />
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
              whileTap={{ scale: 0.98 }}
              onClick={saveResults} 
              disabled={isSending} 
              className="w-full py-5 md:py-7 bg-blue-600 rounded-2xl md:rounded-[2rem] font-black text-lg md:text-2xl text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] disabled:opacity-20 uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4"
            >
              {isSending ? <RefreshCw className="animate-spin" /> : 'FINALIZAR Y GUARDAR'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'CONFIRMATION') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-[#050505] relative overflow-y-auto text-center">
        {/* Scanlines Overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.02]" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }} />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-20 space-y-8 md:space-y-10 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 md:w-32 md:h-32 bg-emerald-500/20 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            <CheckCircle2 className="w-10 h-10 md:w-16 md:h-16 text-emerald-400" />
          </motion.div>
          
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white drop-shadow-glow">¡SESIÓN FINALIZADA!</h2>
            <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px]">DATOS SINCRONIZADOS CORRECTAMENTE</p>
          </div>
          
          <p className="text-white/60 text-base md:text-xl font-medium max-w-sm mx-auto leading-relaxed">
            Gracias por participar en El Espejo del Turno. Tu reflexión honesta es la herramienta más poderosa para prevenir accidentes.
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onExit()} 
            className="w-full py-5 md:py-7 border border-white/10 rounded-2xl md:rounded-[2rem] font-black text-base md:text-xl text-white uppercase tracking-[0.3em] transition-all hover:border-white/20"
          >
            VOLVER AL MENÚ PRINCIPAL
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return null;
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

// --- APP COMPONENT ---
// --- RESOLVÉ EN EL PUESTO GAME COMPONENT ---
const ResolveEnElPuestoGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
  const [gameState, setGameState] = useState<'MENU' | 'PLAY' | 'RESULT'>('MENU');
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [feedback, setFeedback] = useState<{ index: number, type: 'correct' | 'error' } | null>(null);

  const steps = [
    { id: 'identificar', label: 'Identificar', icon: <Target size={20} />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'analizar', label: 'Analizar', icon: <Activity size={20} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'actuar', label: 'Actuar', icon: <PlayCircle size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'verificar', label: 'Verificar', icon: <CheckCircle2 size={20} />, color: 'text-blue-500', bg: 'bg-blue-500/10' }
  ];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(RESOLVE_SHEETS_URL);
        const csv = await response.text();
        const rows = csv.split('\n').filter(row => row.trim() !== '').slice(1);
        const normalize = (s: string) => 
          (s || "").trim().toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[—–-]/g, '-')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const parsed = rows.map(row => {
          // Regex robusto para CSV que ignora comas dentro de comillas
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          if (cols.length < 12) return null;
          
          const rawCorrect = [cols[4], cols[5], cols[6], cols[7]].map(p => p?.trim() || "");
          const rawOpts = [
            (cols[8] || '').split('|').map(o => o.trim()),
            (cols[9] || '').split('|').map(o => o.trim()),
            (cols[10] || '').split('|').map(o => o.trim()),
            (cols[11] || '').split('|').map(o => o.trim())
          ];

          // Garantizar integridad: La respuesta correcta DEBE estar en las opciones
          const finalCorrect = rawCorrect.map((correct, i) => {
            const opts = rawOpts[i];
            if (opts.includes(correct)) return correct;
            const match = opts.find(o => normalize(o) === normalize(correct));
            return match || opts[0]; // Si no hay match, forzamos la primera opción como correcta para no bloquear
          });

          return {
            id: cols[0] || Math.random().toString(),
            titulo: cols[1] || "Sin título",
            descripcion: cols[2] || "Sin descripción",
            imagen_url: cols[3] || "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
            pasos_correctos: finalCorrect,
            opciones: rawOpts,
            aprendizaje: cols[12] || "La seguridad es lo primero.",
            dificultad: cols[13] || 'Media'
          };
        }).filter(p => p !== null);
        setProblems(parsed.length > 0 ? parsed : RESOLVE_FALLBACK);
      } catch (error) {
        console.error('Error fetching Resolve problems:', error);
        setProblems(RESOLVE_FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const startGame = (problem: any) => {
    setSelectedProblem(problem);
    setCurrentStep(0);
    setScore(0);
    setHistory([]);
    setGameState('PLAY');
  };

  const handleOptionSelect = (option: string, index: number) => {
    if (feedback) return; // Prevent multiple clicks during feedback

    const normalize = (s: string) => 
      (s || "").trim().toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[—–-]/g, '-')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const correctText = selectedProblem.pasos_correctos[currentStep];
    const isCorrect = normalize(option) === normalize(correctText);
    
    setFeedback({ index, type: isCorrect ? 'correct' : 'error' });

    if (isCorrect) {
      const newScore = score + 25;
      const newHistory = [...history, { step: steps[currentStep].label, option, isCorrect }];
      setHistory(newHistory);
      setScore(newScore);
      
      setTimeout(() => {
        setFeedback(null);
        if (currentStep < 3) {
          setCurrentStep(prev => prev + 1);
        } else {
          setGameState('RESULT');
          onGameOver(newScore);
        }
      }, 1000);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  const filteredProblems = problems.filter(p => filter === 'Todos' || p.dificultad === filter);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0a0a0a]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="text-secondary" size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Settings2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Resolvé en el Puesto</h1>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Control Room Interface v2.0</p>
          </div>
        </div>
        <button 
          onClick={onExit}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'MENU' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto p-8"
          >
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Panel de Desafíos</h2>
                  <p className="text-white/40 font-medium max-w-xl">Seleccioná un problema real detectado en planta y aplicá la metodología de 4 pasos para resolverlo con éxito.</p>
                </div>
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                  {['Todos', 'Baja', 'Media', 'Alta'].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProblems.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => startGame(p)}
                    className="group relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={p.imagen_url} 
                        alt={p.titulo} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${p.dificultad === 'Alta' ? 'text-rose-500' : p.dificultad === 'Media' ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {p.dificultad}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-black uppercase tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{p.titulo}</h3>
                      <p className="text-sm text-white/40 line-clamp-2 font-medium">{p.descripcion}</p>
                      <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <div className="flex -space-x-2">
                          {steps.map((s, i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0a0a0a] ${s.bg} flex items-center justify-center text-[10px] font-bold`}>
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
                          Iniciar <ArrowRight size={14} />
                        </div>
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
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row"
          >
            {/* Left Panel: Context */}
            <div className="w-full md:w-[400px] border-r border-white/10 bg-black/30 flex flex-col">
              <div className="p-8 space-y-6">
                <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img 
                    src={selectedProblem.imagen_url} 
                    alt="Contexto" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Problema Detectado
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{selectedProblem.titulo}</h2>
                  <p className="text-white/60 font-medium leading-relaxed">{selectedProblem.descripcion}</p>
                </div>
              </div>
              
              <div className="mt-auto p-8 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Progreso Metodológico</span>
                  <span className="text-xl font-black text-blue-400">{Math.round((currentStep / 4) * 100)}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 4) * 100}%` }}
                    className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel: Game Logic */}
            <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center relative">
              <div className="max-w-2xl w-full space-y-12">
                {/* Steps Indicator */}
                <div className="flex justify-between relative">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2 z-0" />
                  {steps.map((s, idx) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${idx === currentStep ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-600/40 scale-110' : idx < currentStep ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' : 'bg-white/5 border-white/10 text-white/20'}`}>
                        {idx < currentStep ? <Check size={24} /> : s.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${idx === currentStep ? 'text-white' : 'text-white/20'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Question Area */}
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className={`text-sm font-black uppercase tracking-[0.3em] ${steps[currentStep].color}`}>Paso {currentStep + 1}: {steps[currentStep].label}</h3>
                    <h4 className="text-3xl font-black uppercase tracking-tight">¿Qué acción corresponde a esta etapa?</h4>
                  </div>

                  <div className="grid gap-4">
                    {selectedProblem.opciones[currentStep].map((opt: string, idx: number) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 10 }}
                        whileTap={{ scale: 0.98 }}
                        animate={feedback?.index === idx ? (feedback.type === 'correct' ? { scale: [1, 1.05, 1], borderColor: '#10b981' } : { x: [0, -10, 10, -10, 10, 0], borderColor: '#ef4444' }) : {}}
                        onClick={() => handleOptionSelect(opt, idx)}
                        className={`group flex items-center gap-6 p-6 rounded-2xl border transition-all text-left ${
                          feedback?.index === idx 
                            ? (feedback.type === 'correct' ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-rose-500/20 border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]')
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                          feedback?.index === idx 
                            ? (feedback.type === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                            : 'bg-white/5 text-white/20 group-hover:bg-blue-600 group-hover:text-white'
                        }`}>
                          {feedback?.index === idx ? (feedback.type === 'correct' ? <Check size={20} /> : <X size={20} />) : String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`flex-1 text-lg font-bold transition-colors ${
                          feedback?.index === idx ? 'text-white' : 'text-white/80 group-hover:text-white'
                        }`}>{opt}</span>
                      </motion.button>
                    ))}
                  </div>
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
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex-1 flex items-center justify-center p-8"
          >
            <div className="max-w-4xl w-full bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-12 bg-blue-600 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border-4 border-white/30">
                  <Trophy size={64} className="text-white" />
                </div>
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">¡Problema Resuelto!</h2>
                  <p className="text-white/80 font-bold uppercase tracking-widest mt-4">Puntaje de Eficiencia</p>
                  <div className="text-7xl font-black mt-2">{score}</div>
                </div>
              </div>
              
              <div className="flex-1 p-12 space-y-8 bg-black/40">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Aprendizaje Clave</h3>
                  <div className="p-6 bg-blue-600/10 rounded-2xl border border-blue-600/20 italic text-xl font-medium leading-relaxed">
                    "{selectedProblem.aprendizaje}"
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">Recorrido Metodológico</h3>
                  <div className="space-y-3">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${h.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                          {h.isCorrect ? <Check size={12} /> : <X size={12} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase text-white/40">{h.step}</p>
                          <p className="text-sm font-bold truncate">{h.option}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setGameState('MENU')}
                    className="flex-1 py-4 bg-white text-black font-black rounded-2xl uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl"
                  >
                    Volver al Panel
                  </button>
                  <button 
                    onClick={onExit}
                    className="px-8 py-4 bg-white/5 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<View>('START');
  const [playerData, setPlayerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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

  const handleStart = (data: any) => {
    setLoadingMessage("VINCULANDO OPERADOR...");
    setIsLoading(true);
    setTimeout(() => {
      setPlayerData(data);
      setView('MENU');
      setIsLoading(false);
    }, 2000);
  };

  const handleSelectGame = (id: string) => {
    setLoadingMessage("CARGANDO PROTOCOLO DE MISIÓN...");
    setIsLoading(true);
    setTimeout(() => {
      const viewMap: any = {
        'truco': 'GAME_TRUCO',
        'oca': 'GAME_OCA',
        'carrera': 'GAME_CARRERA',
        'match': 'GAME_MATCH',
        'escape': 'GAME_ESCAPE',
        'wordle': 'GAME_WORDLE',
        'jenga': 'GAME_JENGA',
        'decisiones': 'GAME_DECISIONES',
        'pare': 'GAME_PARE',
        'protocolo': 'GAME_PROTOCOLO',
        'espejo': 'GAME_ESPEJO',
        'resolve': 'GAME_RESOLVE'
      };
      setView(viewMap[id]);
      setIsLoading(false);
    }, 1500);
  };

  const handleGameOver = (score: number) => {
    setPlayerData((prev: any) => ({
      ...prev,
      score: (prev?.score || 0) + score
    }));
    recordGameResult(view, score);
  };

  const renderView = () => {
    switch (view) {
      case 'START': return <StartScreen onStart={handleStart} />;
      case 'MENU': return <EnhancedGameMenu onSelectGame={handleSelectGame} playerData={playerData} />;
      case 'GAME_TRUCO': return <TrucoGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_OCA': return <OcaGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_CARRERA': return <CarreraGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_MATCH': return <MatchGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_ESCAPE': return <EscapeRoomGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_WORDLE': return <WordleGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_JENGA': return <JengaGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_DECISIONES': return <DecisionesSegurasGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_PARE': return <PareYPidaAyudaGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_PROTOCOLO': return <ProtocoloEmergenciaGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_ESPEJO': return <EspejoDelTurnoGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      case 'GAME_RESOLVE': return <ResolveEnElPuestoGame onExit={() => setView('MENU')} onGameOver={handleGameOver} />;
      default: return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="font-sans text-white bg-[#0a1f14] min-h-screen selection:bg-secondary selection:text-black">
      <ScanlineOverlay />
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loader-container">
            <SystemLoader message={loadingMessage} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {view !== 'START' && <GlobalHeader playerData={playerData} onViewChange={setView} />}
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- TRUCO GAME COMPONENT ---

const TrucoGame = ({ onExit, onGameOver }: { onExit: () => void, onGameOver: (score: number) => void }) => {
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
    if (gameStatus === 'dealing') startNewHand();
  }, [gameStatus]);

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
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bdcac0', '#ffb690', '#f7be1d']
      });

      if (newScore >= 15) {
        setGameStatus('gameOver');
        onGameOver(newScore);
      }
      else setTimeout(() => setGameStatus('dealing'), 3500);
    } else {
      const newScore = botScore + points;
      setBotScore(newScore);
      setMessage(`Baja Disponibilidad de Controles. EHS suma ${points} puntos.`);
      if (newScore >= 15) {
        setGameStatus('gameOver');
        onGameOver(playerScore);
      }
      else setTimeout(() => setGameStatus('dealing'), 3500);
    }
  };

  return (
    <div className="min-h-screen bg-[#050f0a] pt-24 pb-12 px-4 relative overflow-hidden">
      <ScanlineOverlay />
      
      {/* Background HUD Elements */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-secondary/10 rounded-full scale-150" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-[1px] border-secondary/5 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-6">
        
        {/* TOP HUD: SCORES & STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* EHS SCORE */}
          <div className="glass-panel-heavy p-4 rounded-xl border border-red-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <Cpu size={20} />
              </div>
              <div>
                <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">SISTEMA EHS</p>
                <div className="h-1.5 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(botScore / 15) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-4xl font-black text-red-500 tracking-tighter leading-none">{botScore}</p>
          </div>

          {/* CENTRAL MESSAGE BAR */}
          <div className="glass-panel-heavy p-4 rounded-xl border border-secondary/30 bg-secondary/5 flex flex-col items-center justify-center min-h-[80px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
            
            {/* TURN INDICATOR */}
            <div className="flex items-center gap-6 mb-2">
              <div className={`flex items-center gap-2 transition-opacity duration-300 ${gameStatus === 'botTurn' || gameStatus === 'resolution' ? 'opacity-100' : 'opacity-20'}`}>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">EHS_THINKING</span>
              </div>
              <div className="w-12 h-px bg-white/10" />
              <div className={`flex items-center gap-2 transition-opacity duration-300 ${gameStatus === 'playerTurn' ? 'opacity-100' : 'opacity-20'}`}>
                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">USER_ACTION_REQUIRED</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p 
                key={message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-white font-headline text-sm md:text-base font-bold text-center uppercase tracking-tight"
              >
                {message}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* PLAYER SCORE */}
          <div className="glass-panel-heavy p-4 rounded-xl border border-emerald-500/20 flex items-center justify-between">
            <p className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">{playerScore}</p>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">OPERADOR</p>
                <div className="h-1.5 w-24 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(playerScore / 15) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GAME AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* LEFT: ROUND INDICATORS & LOG */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel-heavy p-5 rounded-2xl border border-white/10">
              <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Layers size={12} /> Rondas de la Mano
              </h4>
              <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      rounds[i] === 'player' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                      rounds[i] === 'bot' ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                      rounds[i] === 'tie' ? 'bg-yellow-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                      'bg-white/5 border-white/10'
                    }`}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                  <span>Valor de la Mano:</span>
                  <span className="text-secondary font-bold">{handPoints} PTS</span>
                </div>
                {trucoActive && (
                  <div className="mt-1 flex justify-between text-[9px] font-mono text-red-400 uppercase animate-pulse">
                    <span>Estado:</span>
                    <span className="font-bold">INTERVENCIÓN ACTIVA</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-panel-heavy p-5 rounded-2xl border border-white/10 hidden lg:block">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Historial de Turnos</h4>
              <div className="h-40 overflow-y-auto space-y-2 font-mono text-[9px] pr-2 scrollbar-hide opacity-60">
                <p className="text-white/80 border-l-2 border-secondary/30 pl-2 py-1">{message}</p>
                <p className="text-white/40 border-l-2 border-transparent pl-2 py-1 italic">Esperando respuesta del sistema...</p>
              </div>
            </div>
          </div>

          {/* CENTER: TABLE */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel-heavy aspect-[16/9] md:aspect-video rounded-[2.5rem] border-2 border-white/5 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
               {/* Table HUD Overlay */}
               <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-secondary/20 rounded-full" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-secondary/10" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-secondary/10" />
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono text-secondary/40 tracking-[1em] uppercase">Sector_de_Operaciones</div>
               </div>

               <div className="flex gap-6 md:gap-12 relative z-10 items-center">
                 <div className="flex flex-col items-center gap-2">
                   <p className="text-[8px] font-black text-red-500/60 uppercase tracking-widest mb-2">Respuesta EHS</p>
                   <AnimatePresence mode="wait">
                     {table.bot ? (
                       <motion.div 
                        key={table.bot.id}
                        initial={{ opacity: 0, y: -100, rotate: -15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                        className="w-28 md:w-40 shadow-2xl"
                       >
                         <IndustrialCard card={table.bot} />
                       </motion.div>
                     ) : (
                       <div className="w-28 md:w-40 h-40 md:h-56 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
                         <Cpu className="text-white/5 animate-pulse" size={32} />
                       </div>
                     )}
                   </AnimatePresence>
                 </div>

                 <div className="w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />

                 <div className="flex flex-col items-center gap-2">
                   <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest mb-2">Acción Operador</p>
                   <AnimatePresence mode="wait">
                     {table.player ? (
                       <motion.div 
                        key={table.player.id}
                        initial={{ opacity: 0, y: 100, rotate: 15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                        className="w-28 md:w-40 shadow-2xl"
                       >
                         <IndustrialCard card={table.player} />
                       </motion.div>
                     ) : (
                       <div className="w-28 md:w-40 h-40 md:h-56 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
                         <User className="text-white/5 animate-pulse" size={32} />
                       </div>
                     )}
                   </AnimatePresence>
                 </div>
               </div>
            </div>

            {/* PLAYER HAND & CONTROLS */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex-1 flex gap-3 md:gap-4 justify-center md:justify-start">
                {playerHand.map((card, idx) => (
                  <motion.div 
                    key={card.id}
                    whileHover={{ y: -15, scale: 1.05, rotate: idx === 0 ? -5 : idx === 2 ? 5 : 0 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-20 md:w-32 cursor-pointer transition-opacity duration-300 ${gameStatus !== 'playerTurn' ? 'opacity-50 grayscale' : 'opacity-100'}`}
                    onClick={() => playCard(idx)}
                  >
                    <IndustrialCard card={card} />
                  </motion.div>
                ))}
                {playerHand.length === 0 && (
                  <div className="h-32 flex items-center text-white/20 font-mono text-[10px] uppercase tracking-widest">
                    Mano finalizada
                  </div>
                )}
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={handleIntervenir}
                  disabled={gameStatus !== 'playerTurn' || trucoActive}
                  className="flex-1 md:flex-none px-8 py-4 bg-secondary text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,182,144,0.3)] disabled:opacity-30 disabled:grayscale disabled:scale-100"
                >
                  Intervenir
                </button>
                <button 
                  onClick={handleDetener}
                  disabled={gameStatus !== 'playerTurn'}
                  className="flex-1 md:flex-none px-8 py-4 bg-white/5 text-white/60 font-black uppercase rounded-xl hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:scale-100"
                >
                  Irse al Mazo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* EXIT BUTTON */}
      <button 
        onClick={onExit}
        className="fixed top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 border border-transparent transition-all z-50 group"
      >
        <X size={20} className="group-hover:rotate-90 transition-transform" />
      </button>

      {/* FOOTER HUD */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-8 opacity-20 pointer-events-none">
        <p className="text-[7px] font-mono text-white uppercase tracking-[0.5em]">PREVEN_EHS_TRUCO_MODULE_ACTIVE</p>
        <div className="w-32 h-px bg-white/20" />
        <p className="text-[7px] font-mono text-white uppercase tracking-[0.5em]">TERMINAL_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
      </div>
    </div>
  );
};

// --- DATA CON COLORES PASTELES PARA V3 ---
/* Removed MEMORY_PAIRS_PASTEL */
const MEMORY_PAIRS = [
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

/* Removed _unused_IndustrialMemoryGameV3_REMOVED */
const _unused_IndustrialMemoryGameV3_REMOVED = () => {
  return null;
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
    title: 'PRÓXIMAMENTE', 
    subtitle: 'MISIÓN_06', 
    icon: 'lock', 
    active: false, 
    color: 'bg-slate-500', 
    level: 'BLOQUEADO', 
    stats: '---', 
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
    desc: 'Módulo en desarrollo para futuros desafíos de memoria preventiva.',
    obj: 'Próximamente disponible.',
    rules: [
      'Contenido bloqueado.',
      'En desarrollo.'
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
    id: 'espejo', 
    title: 'EL ESPEJO DEL TURNO', 
    subtitle: 'MISIÓN_10', 
    icon: 'mirror', 
    active: true, 
    color: 'bg-purple-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    desc: 'Una pausa para reflexionar sobre nuestras conductas y cuidarnos entre todos.',
    obj: 'Autoevaluación de conductas para todo el personal de MABE.',
    rules: [
      'Seleccioná el modo de juego (Individual o Facilitador).',
      'Leé atentamente la situación planteada en la tarjeta.',
      'Respondé con sinceridad sobre tu conducta habitual.',
      'Reflexioná sobre el mensaje y participá en el debate si estás en grupo.'
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
    id: 'resolve', 
    title: 'RESOLVÉ EN EL PUESTO', 
    subtitle: 'MISIÓN_13', 
    icon: 'build', 
    active: true, 
    color: 'bg-blue-600', 
    level: 'INTERMEDIO', 
    stats: '0 VIC / 0 RGO', 
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    desc: 'Metodología de 4 pasos para resolver problemas reales en tu puesto de trabajo.',
    obj: 'Aplicar Identificar, Analizar, Actuar y Verificar ante desafíos de planta.',
    rules: [
      'Seleccioná un problema de la lista.',
      'Seguí la secuencia de los 4 pasos obligatorios.',
      'Elegí la opción correcta en cada etapa.',
      'Aprendé con la retroalimentación inmediata y el resumen final.'
    ]
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

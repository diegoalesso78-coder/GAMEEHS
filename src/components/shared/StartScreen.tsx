
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, ChevronRight, User, MapPin, Briefcase, Building, Trophy, Users, Flame, Wrench, Truck, Star, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { PlayerData } from '../../types';
import { SITIOS_SHEET_URL, AREAS_SHEET_URL, LOGS_READ_URL, AVATARS } from '../../constants';

export const StartScreen = ({ onStart }: { onStart: (data: PlayerData) => void }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    sitio: '',
    sector: '',
    udn: '',
    edad: '',
    avatar: 'operator'
  });
  const [sitios, setSitios] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<{
    topPlayers: { name: string, score: number }[],
    topSectors: { name: string, count: number }[]
  }>({ topPlayers: [], topSectors: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitiosRes, areasRes, logsRes] = await Promise.all([
          fetch(SITIOS_SHEET_URL),
          fetch(AREAS_SHEET_URL),
          fetch(`${LOGS_READ_URL}&t=${Date.now()}`)
        ]);
        
        const sitiosText = await sitiosRes.text();
        const areasText = await areasRes.text();
        const logsText = await logsRes.text();
        
        setSitios(Array.from(new Set(sitiosText.split(/\r?\n/).slice(1).map(s => s.trim()).filter(Boolean))));
        setAreas(Array.from(new Set(areasText.split(/\r?\n/).slice(1).map(a => a.trim()).filter(Boolean))));

        // Parse logs for leaderboard
        const rows = logsText.split(/\r?\n/).filter(row => row.trim()).map(row => {
          const separator = row.includes(';') ? ';' : ',';
          return row.split(separator).map(cell => cell.trim().replace(/^"|"$/g, ''));
        });

        if (rows.length > 1) {
          const headers = rows[0].map(h => h.toLowerCase());
          const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('operador'));
          const scoreIdx = headers.findIndex(h => h.includes('puntaje') || h.includes('puntos'));
          const sectorIdx = headers.findIndex(h => h.includes('sector') || h.includes('área'));

          const playerScores: Record<string, number> = {};
          const sectorCounts: Record<string, number> = {};

          rows.slice(1).forEach(row => {
            const name = row[nameIdx];
            const score = parseInt(row[scoreIdx]) || 0;
            const sector = row[sectorIdx];

            if (name) playerScores[name] = (playerScores[name] || 0) + score;
            if (sector && sector !== 'SITIO' && sector !== 'LUQUE') {
              sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
            }
          });

          const topPlayers = Object.entries(playerScores)
            .map(([name, score]) => ({ name, score }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

          const topSectors = Object.entries(sectorCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          setLeaderboard({ topPlayers, topSectors });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSitios(['Planta A', 'Planta B', 'Centro Logístico']);
        setAreas(['Producción', 'Mantenimiento', 'Logística', 'Seguridad']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre && formData.sitio && formData.sector) {
      onStart({ ...formData, score: 0 });
    }
  };

  const renderAvatarIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'User': return <User size={size} />;
      case 'Shield': return <Shield size={size} />;
      case 'Wrench': return <Wrench size={size} />;
      case 'Truck': return <Truck size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'Flame': return <Flame size={size} />;
      default: return <User size={size} />;
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative">
              <Shield className="w-10 h-10 text-emerald-500" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              PREVENT_CORE <span className="text-emerald-500">2.0</span>
            </h1>
            <p className="text-white/40 font-mono text-[10px] tracking-[0.3em] uppercase">
              Unified Safety Intelligence System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Operador</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="NOMBRE COMPLETO"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono text-sm"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Sitio</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                  <select
                    required
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono text-sm appearance-none"
                    value={formData.sitio}
                    onChange={e => setFormData({ ...formData, sitio: e.target.value })}
                  >
                    <option value="" className="bg-slate-900">SELECCIONAR SITIO</option>
                    {sitios.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Sector</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                  <select
                    required
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono text-sm appearance-none"
                    value={formData.sector}
                    onChange={e => setFormData({ ...formData, sector: e.target.value })}
                  >
                    <option value="" className="bg-slate-900">SELECCIONAR SECTOR</option>
                    {areas.map(a => <option key={a} value={a} className="bg-slate-900">{a}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">UDN</label>
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="UNIDAD DE NEGOCIO"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono text-sm"
                    value={formData.udn}
                    onChange={e => setFormData({ ...formData, udn: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="md:col-span-2 space-y-4 pt-4 border-t border-white/5">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Star size={12} className="text-emerald-500" /> Selecciona tu Avatar
              </label>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: avatar.id })}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1.5 ${
                      formData.avatar === avatar.id 
                        ? 'border-emerald-500 bg-emerald-500/10' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${avatar.color} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {renderAvatarIcon(avatar.icon, 20)}
                      </div>
                    </div>
                    <span className="text-[7px] font-black text-white/40 uppercase tracking-tighter group-hover:text-white transition-colors">
                      {avatar.label}
                    </span>
                    {formData.avatar === avatar.id && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
            >
              INICIAR ENROLAMIENTO
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          {/* Muro de Honor */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Muro de Honor</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Jugadores */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-3 opacity-50">
                  <User className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Top Operadores</span>
                </div>
                <div className="space-y-2">
                  {leaderboard.topPlayers.length > 0 ? leaderboard.topPlayers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-white/60 font-mono truncate max-w-[120px]">{i + 1}. {p.name}</span>
                      <span className="text-emerald-500 font-black">{p.score} PTS</span>
                    </div>
                  )) : (
                    <div className="text-[10px] text-white/20 italic">Cargando ranking...</div>
                  )}
                </div>
              </div>

              {/* Top Sectores */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-3 opacity-50">
                  <Users className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Duelo de Sectores</span>
                </div>
                <div className="space-y-2">
                  {leaderboard.topSectors.length > 0 ? leaderboard.topSectors.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className="text-white/60 font-mono truncate max-w-[120px]">{i + 1}. {s.name}</span>
                      <span className="text-blue-400 font-black">{s.count} JUGADAS</span>
                    </div>
                  )) : (
                    <div className="text-[10px] text-white/20 italic">Cargando datos...</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
            <div className="flex items-center gap-4">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[8px] font-mono tracking-widest uppercase text-white">Encrypted Connection</span>
            </div>
            <span className="text-[8px] font-mono tracking-widest uppercase text-white">v2.4.0_STABLE</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

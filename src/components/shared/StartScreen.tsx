
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Activity, Zap, ChevronRight, User, MapPin, Briefcase, Building } from 'lucide-react';
import { PlayerData } from '../../types';
import { SITIOS_SHEET_URL, AREAS_SHEET_URL } from '../../constants';

export const StartScreen = ({ onStart }: { onStart: (data: PlayerData) => void }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    sitio: '',
    sector: '',
    udn: '',
    edad: ''
  });
  const [sitios, setSitios] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitiosRes, areasRes] = await Promise.all([
          fetch(SITIOS_SHEET_URL),
          fetch(AREAS_SHEET_URL)
        ]);
        
        const sitiosText = await sitiosRes.text();
        const areasText = await areasRes.text();
        
        setSitios(sitiosText.split('\n').slice(1).map(s => s.trim()).filter(Boolean));
        setAreas(areasText.split('\n').slice(1).map(a => a.trim()).filter(Boolean));
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

            <button
              type="submit"
              className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
            >
              INICIAR ENROLAMIENTO
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

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

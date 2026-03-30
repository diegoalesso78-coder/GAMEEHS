
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, User, MapPin, Briefcase, ChevronRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { SITIOS_SHEET_URL, AREAS_SHEET_URL } from '../lib/constants';
import { IndustrialCard } from './IndustrialCard';
import { PersistenceService } from '../services/PersistenceService';

interface StartScreenProps {
  onStart: (data: any) => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    site: '',
    sector: '',
    udn: '',
    age: ''
  });
  const [sites, setSites] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stats = PersistenceService.getUserStats();
    if (stats.userProfile) {
      setFormData({
        ...formData,
        ...stats.userProfile
      });
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [sitesRes, sectorsRes] = await Promise.all([
          fetch(SITIOS_SHEET_URL),
          fetch(AREAS_SHEET_URL)
        ]);

        const sitesText = await sitesRes.text();
        const sectorsText = await sectorsRes.text();

        const parseCSV = (text: string) => {
          const lines = text.split('\n');
          return lines.slice(1)
            .map(line => line.split(',')[0]?.replace(/"/g, '').trim())
            .filter(Boolean);
        };

        setSites(parseCSV(sitesText));
        setSectors(parseCSV(sectorsText));
      } catch (err) {
        console.error('Error fetching enrollment data:', err);
        setError('Error al cargar datos de sitios y sectores. Usando datos locales.');
        setSites(['PLANTA_01', 'PLANTA_02', 'LOGÍSTICA', 'ADMINISTRACIÓN']);
        setSectors(['PRODUCCIÓN', 'MANTENIMIENTO', 'CALIDAD', 'SEGURIDAD']);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    if (step === 1 && formData.name.trim().length < 3) return;
    if (step === 2 && (!formData.site || !formData.sector)) return;
    if (step < 3) setStep(step + 1);
    else onStart(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary font-black text-xs tracking-[0.3em] uppercase mb-6">
            <ShieldAlert size={16} />
            Sistema de Enrolamiento EHS
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-4">
            BIENVENIDO AL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20 uppercase">ENTRENAMIENTO</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
            Identifícate para comenzar tu jornada de seguridad
          </p>
        </motion.div>

        <IndustrialCard className="p-8 md:p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-secondary shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                    <User size={14} /> Nombre Completo
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                      placeholder="INGRESA TU NOMBRE..."
                      className="w-full bg-black/40 border-2 border-white/10 rounded-xl py-4 px-6 text-xl font-black text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/5 uppercase"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-focus-within:w-full transition-all duration-500" />
                  </div>
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    Este nombre se utilizará para tu certificación de entrenamiento
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                      <MapPin size={14} /> Sitio / Planta
                    </label>
                    <select
                      value={formData.site}
                      onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                      className="w-full bg-black/40 border-2 border-white/10 rounded-xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-secondary transition-all appearance-none uppercase"
                    >
                      <option value="">SELECCIONAR...</option>
                      {sites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                      <Briefcase size={14} /> Sector / Área
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full bg-black/40 border-2 border-white/10 rounded-xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-secondary transition-all appearance-none uppercase"
                    >
                      <option value="">SELECCIONAR...</option>
                      {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest">
                    <CheckCircle2 size={14} /> UDN / Proyecto
                  </label>
                  <input
                    type="text"
                    value={formData.udn}
                    onChange={(e) => setFormData({ ...formData, udn: e.target.value.toUpperCase() })}
                    placeholder="EJ: LOGÍSTICA SUR"
                    className="w-full bg-black/40 border-2 border-white/10 rounded-xl py-4 px-6 text-sm font-black text-white focus:outline-none focus:border-secondary transition-all placeholder:text-white/5 uppercase"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6 space-y-4">
                  <h3 className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={16} /> Resumen de Enrolamiento
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Operador</div>
                      <div className="text-sm font-black text-white uppercase">{formData.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ubicación</div>
                      <div className="text-sm font-black text-white uppercase">{formData.site}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Sector</div>
                      <div className="text-sm font-black text-white uppercase">{formData.sector}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">UDN</div>
                      <div className="text-sm font-black text-white uppercase">{formData.udn || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <AlertTriangle className="text-blue-400 flex-shrink-0" size={20} />
                  <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest leading-relaxed">
                    Al iniciar, confirmas que has leído y comprendido las normas básicas de seguridad de la planta.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-8 py-4 bg-white/5 text-white/40 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                VOLVER
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={loading || (step === 1 && !formData.name) || (step === 2 && (!formData.site || !formData.sector))}
              className={`flex-1 flex items-center justify-center gap-3 py-4 bg-secondary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {step === 3 ? 'INICIAR ENTRENAMIENTO' : 'SIGUIENTE PASO'}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </IndustrialCard>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold uppercase tracking-widest text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <div className="text-[10px] font-black text-white/10 tracking-[0.4em] uppercase">
            EHS_GAMIFICATION_ENGINE // SECURE_ACCESS_GRANTED
          </div>
        </div>
      </div>
    </div>
  );
};

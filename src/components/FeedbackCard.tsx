
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Shield, Lightbulb, Send, X, CheckCircle2, Factory, MapPin, AlertTriangle, Star, HelpCircle } from 'lucide-react';
import { FeedbackData } from '../types';

interface FeedbackCardProps {
  gameName: string;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
  initialUdn?: string;
  initialArea?: string;
}

const UDN_OPTIONS = ['MABE CORDOBA', 'MABE MEXICO', 'MABE BRASIL'];
const AREA_OPTIONS = [
  'CONFORMADO DE CHAPA',
  'ENSAMBLE FINAL',
  'INYECCION DE PLASTICOS',
  'FUNDICION / INYECCION ALUMINIO',
  'MATRICERIA',
  'LOGISTICA / ALMACEN',
  'MANTENIMIENTO',
  'CALIDAD',
  'EHS / SEGURIDAD',
  'OTRO'
];

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  gameName, 
  onClose, 
  onSubmit,
  initialUdn = 'MABE CORDOBA',
  initialArea = 'CONFORMADO DE CHAPA'
}) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [type, setType] = useState<FeedbackData['tipo_comentario']>('JUEGO');
  const [comment, setComment] = useState('');
  const [udn, setUdn] = useState(initialUdn);
  const [area, setArea] = useState(initialArea);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data: FeedbackData = {
      timestamp: new Date().toLocaleString('es-AR'),
      juego: gameName,
      tipo_comentario: type,
      comentario: comment,
      udn,
      area
    };

    // Simulate API call
    console.log('Feedback Data to be sent:', data);
    
    // Here we would normally call a Google Apps Script or a Google Form endpoint
    // For now, we simulate success
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit(data);
    setStep('SUCCESS');
    setIsSubmitting(false);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 'FORM' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Tu Voz Cuenta</h2>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Feedback de Seguridad</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-white/60 leading-relaxed">
                  ¿Tienes alguna sugerencia sobre el juego o viste algo en tu puesto que podamos mejorar?
                </p>

                {/* Type Selector */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'JUEGO', label: 'El Juego', icon: MessageSquare, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { id: 'EHS', label: 'Equipo EHS', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { id: 'MEJORA_PUESTO', label: 'Mejora Planta', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { id: 'RIESGO', label: 'Riesgo', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
                    { id: 'SUGERENCIA', label: 'Sugerencia', icon: HelpCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { id: 'FELICITACION', label: 'Felicitación', icon: Star, color: 'text-pink-500', bg: 'bg-pink-500/10' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setType(opt.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                        type === opt.id 
                          ? `border-white/40 ${opt.bg}` 
                          : 'border-white/5 bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 ${opt.color}`} />
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter">{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Comment Area */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">Comentario (Opcional)</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={
                      type === 'MEJORA_PUESTO' 
                        ? "¿Qué oportunidad de mejora viste hoy?" 
                        : "¿Qué te pareció el desafío?"
                    }
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm placeholder:text-white/10 focus:border-red-500/50 outline-none transition-all resize-none"
                  />
                </div>

                {/* Context Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest px-2">
                      <Factory className="w-3 h-3" /> UDN
                    </label>
                    <select 
                      value={udn}
                      onChange={(e) => setUdn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      {UDN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest px-2">
                      <MapPin className="w-3 h-3" /> Área
                    </label>
                    <select 
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-red-500/50"
                    >
                      {AREA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-white/10 text-white/40 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Omitir
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Reporte
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-slate-950" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">¡Reporte Recibido!</h2>
                <p className="text-white/60 text-sm">Gracias por ayudarnos a construir un Mabe más seguro.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

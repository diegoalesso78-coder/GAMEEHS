
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Shield, Lightbulb, Send, X, CheckCircle2, AlertTriangle, Star, HelpCircle, Sparkles } from 'lucide-react';
import { FeedbackData } from '../types';

interface FeedbackCardProps {
  gameName: string;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  gameName, 
  onClose, 
  onSubmit
}) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [type, setType] = useState<FeedbackData['tipo_comentario']>('SUGERENCIA');
  const [categoria, setCategoria] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data: FeedbackData = {
      timestamp: new Date().toLocaleString('es-AR'),
      juego: gameName,
      tipo_comentario: type,
      comentario: comment,
      categoria
    };

    console.log('Feedback Data to be sent:', data);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit(data);
    setStep('SUCCESS');
    setIsSubmitting(false);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const feedbackTypes = [
    { id: 'JUEGO', label: 'El Juego', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'EHS', label: 'Equipo EHS', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'MEJORA_PUESTO', label: 'Mejora Planta', icon: Lightbulb, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 'RIESGO', label: 'Riesgo', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'SUGERENCIA', label: 'Sugerencia', icon: HelpCircle, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { id: 'FELICITACION', label: 'Felicitación', icon: Star, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-600/10 blur-[60px] rounded-full -ml-16 -mb-16 pointer-events-none" />

        <AnimatePresence mode="wait">
          {step === 'FORM' ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 md:p-10 space-y-8 relative z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-xl shadow-red-600/20 ring-1 ring-white/20">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">Tu Voz Cuenta</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Feedback de Seguridad</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/20 hover:text-white transition-all flex items-center justify-center group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Type Grid */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">¿Qué quieres reportar?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {feedbackTypes.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setType(opt.id as any)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 relative group ${
                          type === opt.id 
                            ? `border-white/20 ${opt.bg} shadow-lg` 
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                        }`}
                      >
                        {type === opt.id && (
                          <motion.div 
                            layoutId="active-type"
                            className="absolute inset-0 rounded-2xl ring-2 ring-white/20 pointer-events-none"
                          />
                        )}
                        <opt.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${opt.color}`} />
                        <span className={`text-[9px] font-black uppercase tracking-tight transition-colors ${type === opt.id ? 'text-white' : 'text-white/40'}`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Input */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-400" /> Categoría / Tema
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-white/20 group-focus-within:text-emerald-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="EJ: ERGONOMÍA, EPP, ORDEN Y LIMPIEZA..."
                      className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-emerald-500/50 focus:bg-emerald-500/5 transition-all font-mono text-xs tracking-wider"
                      value={categoria}
                      onChange={e => setCategoria(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                {/* Comment Area */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Comentario Detallado</label>
                  <div className="relative">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={
                        type === 'MEJORA_PUESTO' 
                          ? "¿Qué oportunidad de mejora viste hoy?" 
                          : "¿Qué te pareció el desafío o qué sugerencia tienes?"
                      }
                      className="w-full h-32 bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-white text-sm placeholder:text-white/10 focus:border-red-500/50 focus:bg-red-500/5 outline-none transition-all resize-none font-sans leading-relaxed"
                    />
                    <div className="absolute bottom-4 right-4 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                      {comment.length} caracteres
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border border-white/5 text-white/20 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white/40 transition-all active:scale-95"
                >
                  Omitir
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !categoria.trim()}
                  className="flex-[2] py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-30 disabled:grayscale text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      Enviar Reporte
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-16 text-center space-y-8 relative z-10"
            >
              <div className="relative mx-auto w-24 h-24">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  <CheckCircle2 className="w-12 h-12 text-slate-950" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border-4 border-emerald-500"
                />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">¡Reporte Recibido!</h2>
                <p className="text-white/40 text-sm font-medium max-w-[280px] mx-auto leading-relaxed">
                  Gracias por ayudarnos a construir un <span className="text-emerald-400">Mabe más seguro</span>.
                </p>
              </div>
              <div className="pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sincronizando con el sistema...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

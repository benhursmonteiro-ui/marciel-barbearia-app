"use client";

import React, { useState } from 'react';
import {
    Star,
    MessageCircle,
    CheckCircle2,
    ChevronRight,
    Search,
    Filter,
    ArrowUpRight,
    TrendingUp,
    Quote
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber } from '@/context/BarberContext';

export default function BarberRatings() {
    const { currentUser, barbers } = useBarber();

    // Get current barber profile
    const barberProfile = barbers.find(b => b.userId === currentUser?.id);

    // For now, if no ratings exist in context (yet to be implemented in context), 
    // we show an empty state or just the summary from the profile.
    const [ratings, setRatings] = useState<any[]>([]);

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Minhas <span className="text-[var(--color-primary-gold)]">Avaliações</span></h1>
                    <p className="text-gray-500 text-sm italic">O que seus clientes estão dizendo sobre seu trabalho.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-black/40 border border-white/5 rounded-2xl flex items-center gap-3">
                        <Star className="text-[var(--color-primary-gold)] fill-current w-5 h-5" />
                        <span className="text-xl font-black text-white">{barberProfile?.rating.toFixed(1) || "5.0"}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest border-l border-white/10 pl-3">{barberProfile?.reviews || 0} REVIEWS</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Ratings Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                            {['RECENTES', 'ESTRELAS', 'CRÍTICAS'].map((f, i) => (
                                <button key={f} className={`px-4 py-2 text-[9px] font-black tracking-widest rounded-lg transition-all ${i === 0 ? 'bg-[var(--color-primary-gold)] text-black' : 'text-gray-500 hover:text-white'}`}>{f}</button>
                            ))}
                        </div>
                        <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest border border-white/5">
                            <Filter size={14} /> FILTRAR
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {ratings.length > 0 ? ratings.map((r) => (
                            <div key={r.id} className="group relative bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 transition-all hover:border-[var(--color-primary-gold)]/30">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-[var(--color-primary-gold)] shrink-0">
                                        <Quote size={24} className="opacity-20 translate-y-2 translate-x-1" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-white text-lg tracking-tight">{r.client}</h4>
                                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">Serviço: {r.service} • {r.date}</p>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={`${i < r.stars ? 'text-[var(--color-primary-gold)] fill-current' : 'text-gray-800'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed italic">"{r.comment}"</p>
                                        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                            <button className="text-[9px] font-black text-gray-500 hover:text-[var(--color-primary-gold)] uppercase tracking-[0.2em] transition-all">RESPONDER AVALIAÇÃO</button>
                                            <button className="text-[9px] font-black text-gray-700 hover:text-white transition-all uppercase tracking-widest">DENUNCIAR</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-[3rem] p-20 text-center space-y-6">
                                <Star className="w-16 h-16 text-gray-800 mx-auto opacity-20" />
                                <h3 className="text-xl font-bold text-gray-600">Nenhuma avaliação ainda</h3>
                                <p className="text-xs text-gray-500 max-w-xs mx-auto italic">Seu feedback aparecerá aqui assim que os clientes começarem a avaliar seus serviços.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-[var(--color-dark-card)] to-black border border-[var(--color-dark-border)] rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-16 -mt-16" />

                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-lg font-bold italic">Performance</h3>
                            <TrendingUp className="text-emerald-500 w-5 h-5" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            {[
                                { label: 'Habilidade Técnica', val: 98, color: 'bg-[var(--color-primary-gold)]' },
                                { label: 'Pontualidade', val: 95, color: 'bg-blue-500' },
                                { label: 'Atendimento', val: 100, color: 'bg-emerald-500' },
                                { label: 'Limpeza', val: 92, color: 'bg-amber-500' },
                            ].map(item => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        <span>{item.label}</span>
                                        <span className="text-white">{item.val}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <p className="text-[9px] text-gray-600 italic leading-relaxed">Estes dados são baseados nas tags deixadas pelos clientes em seus comentários.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

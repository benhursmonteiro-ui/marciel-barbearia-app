"use client";

import React, { useState } from 'react';
import {
    Star,
    MessageCircle,
    CheckCircle2,
    ChevronRight,
    Award,
    Scissors,
    User,
    Calendar,
    ArrowLeft,
    Sparkles,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

import { useBarber } from '@/context/BarberContext';

export default function RatePage() {
    const { appointments, currentUser } = useBarber();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Get the last completed appointment to rate
    const lastApt = appointments
        .filter(a => a.clientId === currentUser?.id && a.status === 'concluido')
        .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // In a real scenario, you'd send this to a 'avaliacoes' table
            // For now, we simulate the success
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar avaliação.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto py-20 animate-fade-in-up">
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-10 md:p-14 text-center space-y-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border-2 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <Check className="w-12 h-12" strokeWidth={3} />
                    </div>

                    <div>
                        <h2 className="text-3xl font-black mb-4">Obrigado pela sua <span className="text-emerald-400">avaliação!</span></h2>
                        <p className="text-gray-500 text-sm italic leading-relaxed">Sua opinião é fundamental para mantermos a excelência do nosso time e o padrão premium da MarcielBarberShop.</p>
                    </div>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/client" className="w-full sm:w-auto">
                            <Button className="w-full h-14 px-10 rounded-2xl bg-[var(--color-primary-gold)] text-black font-black uppercase text-[10px] tracking-widest shadow-xl">VOLTAR AO PAINEL</Button>
                        </Link>
                        <Link href="/client/appointments" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-14 px-10 rounded-2xl border-white/5 uppercase text-[10px] font-black tracking-widest">VER AGENDAMENTOS</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-10 animate-fade-in-up">
            <header>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Avaliar <span className="text-[var(--color-primary-gold)]">Atendimento</span></h1>
                <p className="text-gray-500 text-sm">Como foi sua experiência no último corte?</p>
            </header>

            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-primary-gold)]/5 rounded-full blur-[60px] -mr-24 -mt-24" />

                {/* Summary of Last Service */}
                <div className="flex items-center gap-6 p-6 bg-black/40 border border-white/5 rounded-3xl mb-12 shadow-inner">
                    <div className="w-16 h-16 bg-[var(--color-primary-gold)]/10 border border-[var(--color-primary-gold)]/20 rounded-2xl flex items-center justify-center text-[var(--color-primary-gold)] group">
                        <Scissors className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.2em] mb-1 italic">Último Agendamento</p>
                        <h3 className="text-xl font-bold text-white mb-1">{lastApt?.serviceName || "Nenhum agendamento"}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                            <p className="flex items-center gap-1.5"><User className="w-3 h-3" /> {lastApt?.barberName || "---"}</p>
                            <p className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {lastApt?.date || "---"}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="space-y-4 text-center">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-500 italic">Sua Nota</h4>
                        <div className="flex items-center justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(num)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(num)}
                                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${(hoverRating || rating) >= num
                                        ? 'bg-[var(--color-primary-gold)]/10 border-[var(--color-primary-gold)] text-[var(--color-primary-gold)] shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                        : 'bg-black border-white/5 text-gray-800'
                                        }`}
                                >
                                    <Star className={`w-8 h-8 ${(hoverRating || rating) >= num ? 'fill-current scale-110' : ''} transition-all duration-300`} />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-[var(--color-primary-gold)] h-4 italic">
                            {rating === 1 && "Precisa melhorar muito"}
                            {rating === 2 && "Poderia ser melhor"}
                            {rating === 3 && "Bom atendimento"}
                            {rating === 4 && "Ótima experiência"}
                            {rating === 5 && "Experiência excepcional!"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 italic block">Seu Comentário (Opcional)</label>
                        <div className="relative group">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-black/40 border-2 border-white/5 focus:border-[var(--color-primary-gold)]/50 rounded-3xl p-6 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none transition-all resize-none h-40 group-hover:border-white/10"
                                placeholder="Conte-nos o que você mais gostou ou o que podemos melhorar..."
                            />
                            <MessageCircle className="absolute right-6 top-6 w-5 h-5 text-gray-800 group-hover:text-gray-700 transition-colors pointer-events-none" />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] text-gray-600 italic flex items-start gap-2 max-w-xs text-center md:text-left">
                            <Sparkles className="w-3 h-3 flex-shrink-0 text-[var(--color-primary-gold)]" /> Sua avaliação pode ser exibida de forma anônima em nosso site/redes sociais para inspirar outros clientes.
                        </p>
                        <Button
                            type="submit"
                            disabled={rating === 0 || isLoading}
                            isLoading={isLoading}
                            className={`w-full md:w-auto h-16 px-14 rounded-2xl font-black text-xs tracking-widest shadow-2xl transition-all ${rating > 0
                                ? 'bg-[var(--color-primary-gold)] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]'
                                : 'bg-gray-800 text-gray-500 opacity-50'
                                }`}
                        >
                            ENVIAR AVALIAÇÃO <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

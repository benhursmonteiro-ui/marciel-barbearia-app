"use client";

import {
    ChevronRight,
    Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber } from '@/context/BarberContext';

export default function PromotionsPage() {
    const { promotions } = useBarber();
    const activePromos = promotions.filter(p => p.active);

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-dark-border)]">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1"><span className="text-[var(--color-primary-gold)]">Promoções</span> & Benefícios</h1>
                    <p className="text-gray-500 text-sm italic">Fique atento às nossas ofertas exclusivas.</p>
                </div>
            </header>

            {activePromos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activePromos.map((promo) => (
                        <div
                            key={promo.id}
                            className={`group relative overflow-hidden bg-gradient-to-br ${promo.color} border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                        >
                            <span className={`inline-block px-3 py-1 ${promo.accentBg} ${promo.textColor} text-[9px] font-black uppercase rounded-full mb-6 tracking-widest`}>
                                {promo.tag}
                            </span>
                            <h3 className="text-2xl font-bold mb-3 tracking-tight">{promo.title}</h3>
                            <p className="text-gray-500 text-xs mb-8 leading-relaxed italic">{promo.description}</p>
                            <p className="text-3xl font-black text-[var(--color-primary-gold)] mb-8">R$ {promo.price.toFixed(2)}</p>
                            <Button
                                className="w-full h-14 rounded-2xl font-black text-[10px] tracking-[0.2em] bg-[var(--color-primary-gold)] text-black"
                            >
                                ATIVAR CUPOM <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] border-dashed rounded-[3rem] p-20 text-center space-y-6">
                    <Ticket className="w-16 h-16 text-gray-800 mx-auto opacity-20" />
                    <h3 className="text-xl font-bold text-gray-600">Nenhuma promoção ativa</h3>
                    <p className="text-xs text-gray-500 italic max-w-xs mx-auto">Em breve teremos ofertas exclusivas para você. Fique de olho!</p>
                </div>
            )}
        </div>
    );
}

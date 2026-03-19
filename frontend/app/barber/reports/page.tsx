"use client";

import React from 'react';
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    PieChart,
    ChevronRight,
    ArrowUpRight,
    Scissors,
    UserCheck,
    Star,
    Target,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber } from '@/context/BarberContext';

export default function BarberReports() {
    const { appointments, currentUser, barbers } = useBarber();

    // Get current barber profile
    const barberProfile = barbers.find(b => b.userId === currentUser?.id);

    // Filter completed appointments for this barber
    const completedApps = appointments.filter(a =>
        a.barberId === barberProfile?.id && a.status === 'concluido'
    );

    const totalRevenue = completedApps.reduce((acc, curr) => acc + curr.price, 0);
    const avgTicket = completedApps.length > 0 ? totalRevenue / completedApps.length : 0;
    const uniqueClients = new Set(completedApps.map(a => a.clientId)).size;

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Performance <span className="text-[var(--color-primary-gold)]">& Análise</span></h1>
                    <p className="text-gray-500 text-sm italic">Entenda seus números e impulsione sua carreira.</p>
                </div>
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                    {['ESTÁTICO', 'DINÂMICO'].map((tab, i) => (
                        <button key={tab} className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${i === 0 ? 'bg-[var(--color-primary-gold)] text-black' : 'text-gray-600 hover:text-white'}`}>{tab}</button>
                    ))}
                </div>
            </header>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Clientes Atendidos</p>
                    <h3 className="text-4xl font-black text-white">{uniqueClients}</h3>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase"><ArrowUpRight size={14} /> Total Acumulado</div>
                </div>
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Ticket Médio</p>
                    <h3 className="text-4xl font-black text-white">R$ {avgTicket.toFixed(2)}</h3>
                    <div className="flex items-center gap-2 text-[var(--color-primary-gold)] text-[10px] font-bold uppercase">Média Por Serviço</div>
                </div>
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Feedback Positivo</p>
                    <h3 className="text-4xl font-black text-white">100%</h3>
                    <div className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase">Avaliação Máxima</div>
                </div>
                <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 space-y-4">
                    <p className="text-[10px] text-gray-500 uppercase font-black">Serviços Totais</p>
                    <h3 className="text-4xl font-black text-white">{completedApps.length}</h3>
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase">Ciclo Atual</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Chart Mock/Graphic */}
                <div className="lg:col-span-2 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-10 shadow-2xl space-y-10 flex flex-col items-center justify-center">
                    <BarChart3 className="w-20 h-20 text-gray-800 opacity-20" />
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-600 italic">Análise de Faturamento Semanal</h3>
                        <p className="text-xs text-gray-700 mt-2 max-w-sm italic">O gráfico de evolução aparecerá aqui assim que você registrar seus primeiros atendimentos desta semana.</p>
                    </div>
                </div>

                {/* Right Lists */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-black to-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-10 shadow-2xl space-y-8">
                        <h3 className="text-xl font-bold flex items-center gap-3 italic">
                            <Target className="w-5 h-5 text-[var(--color-primary-gold)]" /> Ranking Serviços
                        </h3>
                        <div className="space-y-6">
                            <p className="text-xs text-gray-600 italic text-center py-10">Dados insuficientes para gerar o ranking.</p>
                        </div>
                    </div>

                    <div className="bg-[var(--color-primary-gold)] rounded-[2.5rem] p-10 text-black shadow-2xl text-center space-y-4 group">
                        <Award size={48} strokeWidth={1.5} className="mx-auto transition-transform group-hover:scale-125 duration-500" />
                        <h4 className="text-2xl font-black uppercase tracking-tighter">Próximo Nível</h4>
                        <p className="text-xs font-bold italic">Atenda mais 50 clientes para subir ao nível PLATINUM e aumentar sua comissão em 5%.</p>
                        <div className="w-full h-2 bg-black/10 rounded-full mt-6 overflow-hidden">
                            <div className="h-full bg-black rounded-full" style={{ width: '5%' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

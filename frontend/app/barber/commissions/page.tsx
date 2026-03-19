"use client";

import React from 'react';
import {
    DollarSign,
    TrendingUp,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    PieChart,
    Target,
    BarChart3,
    Award,
    Wallet,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber } from '@/context/BarberContext';

export default function BarberCommissions() {
    const { appointments, currentUser, barbers } = useBarber();

    // Get current barber profile
    const barberProfile = barbers.find(b => b.userId === currentUser?.id);

    // Filter completed appointments for this barber
    const completedApps = appointments.filter(a =>
        a.barberId === barberProfile?.id && a.status === 'concluido'
    );

    const totalToReceive = completedApps.reduce((acc, curr) => acc + (curr.commission || 0), 0);

    // Group by service for the table
    const serviceStats = completedApps.reduce((acc: any, app) => {
        if (!acc[app.serviceId]) {
            acc[app.serviceId] = {
                name: app.serviceName,
                count: 0,
                revenue: 0,
                commission: 0,
                rate: ((app.commission / app.price) * 100).toFixed(0) + '%'
            };
        }
        acc[app.serviceId].count += 1;
        acc[app.serviceId].revenue += app.price;
        acc[app.serviceId].commission += app.commission;
        return acc;
    }, {});

    const statsList = Object.values(serviceStats);

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Meus <span className="text-[var(--color-primary-gold)]">Ganhos</span></h1>
                    <p className="text-gray-500 text-sm italic">Gestão detalhada de comissões e faturamento pessoal.</p>
                </div>
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 sm:w-auto w-full overflow-x-auto">
                    {['DIÁRIO', 'SEMANAL', 'MENSAL', 'TOTAL'].map((tab, i) => (
                        <button
                            key={tab}
                            className={`px-6 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${i === 2 ? 'bg-[var(--color-primary-gold)] text-black shadow-lg shadow-[var(--color-primary-gold)]/20' : 'text-gray-600 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-[var(--color-dark-card)] to-black border border-[var(--color-dark-border)] rounded-[2.5rem] p-10 space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-black border border-[var(--color-primary-gold)]/20 rounded-2xl flex items-center justify-center text-[var(--color-primary-gold)]">
                            <Wallet size={24} />
                        </div>
                        <ArrowUpRight className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total a Receber</p>
                        <h2 className="text-4xl font-black text-white">R$ {totalToReceive.toFixed(2)}</h2>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Sincronizado em tempo real</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-dark-card)] to-black border border-[var(--color-dark-border)] rounded-[2.5rem] p-10 space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-black border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                            <Target size={24} />
                        </div>
                        <BarChart3 className="text-blue-500 w-5 h-5" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Meta Mensal ({(totalToReceive / 5000 * 100).toFixed(0)}%)</p>
                        <h2 className="text-4xl font-black text-white">R$ 5.000,00</h2>
                        <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000"
                                style={{ width: `${Math.min(100, (totalToReceive / 5000 * 100))}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[var(--color-dark-card)] to-black border border-[var(--color-dark-border)] rounded-[2.5rem] p-10 space-y-4 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-all duration-700" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-14 h-14 bg-black border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Award size={24} />
                        </div>
                        <Star className="text-emerald-500 w-5 h-5 fill-current" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Bônus Performance</p>
                        <h2 className="text-4xl font-black text-white">R$ {(totalToReceive * 0.05).toFixed(2)}</h2>
                        <p className="text-[10px] text-emerald-500 font-bold uppercase mt-2">Extra de 5% aplicado</p>
                    </div>
                </div>
            </div>

            {/* Commissions Detail Table */}
            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-gold)]/20 to-transparent" />
                <h3 className="text-xl font-bold mb-10 italic">Detalhamento por Serviço</h3>

                <div className="space-y-6">
                    {statsList.length > 0 ? statsList.map((item: any, i) => (
                        <div key={i} className="group relative bg-[#090909] border border-white/5 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:border-white/10 hover:bg-white/[0.02]">
                            <div className="flex items-center gap-6 text-center md:text-left">
                                <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center group-hover:border-[var(--color-primary-gold)]/30 transition-all">
                                    <span className="text-2xl">💈</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white tracking-tight">{item.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Total: {item.count} atendimentos</p>
                                </div>
                            </div>

                            <div className="flex flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-xl">
                                <div>
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Bruto Total</p>
                                    <p className="text-lg font-bold text-gray-300 italic">R$ {item.revenue.toFixed(2)}</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Cota</p>
                                    <p className="text-lg font-bold text-[var(--color-primary-gold)]">{item.rate}</p>
                                </div>
                                <div className="text-right col-span-2 md:col-span-1 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                                    <p className="text-[9px] text-[var(--color-primary-gold)] font-black uppercase tracking-widest mb-1 px-2 py-0.5 bg-[var(--color-primary-gold)]/10 rounded-md inline-block">Sua Comissão</p>
                                    <p className="text-2xl font-black text-emerald-400">R$ {item.commission.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 text-center text-gray-500 italic">Nenhum serviço finalizado para contabilizar comissões.</div>
                    )}
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest italic text-center md:text-left">Nota: As comissões são liquidadas toda segunda-feira automaticamente via PIX.</p>
                    <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/5 uppercase text-[10px] font-black tracking-widest hover:border-white/20">
                        BAIXAR EXTRATO COMPLETO <ChevronRight size={14} className="ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

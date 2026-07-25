"use client";

import React from 'react';
import {
    CalendarCheck,
    User,
    DollarSign,
    Star,
    Clock,
    TrendingUp,
    ChevronRight,
    Scissors,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useBarber } from '@/context/BarberContext';

// Reusable Stat Card
const StatCard = ({ title, value, subtitle, icon, trend }: any) => (
    <div className="group relative overflow-hidden bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 transition-all duration-500 hover:border-[var(--color-primary-gold)]/30 hover:-translate-y-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150" />

        <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-[var(--color-primary-gold)] group-hover:bg-[var(--color-primary-gold)] group-hover:text-black transition-all duration-500">
                    {icon}
                </div>
                {trend && (
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 italic">{title}</p>
                <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
            </div>
        </div>
    </div>
);

export default function BarberDashboard() {
    const { appointments, currentUser, barbers, refreshData } = useBarber();

    // Refresh data when component mounts to ensure fresh appointments
    React.useEffect(() => {
        refreshData();
    }, []);

    // Get current barber profile
    const barberProfile = barbers.find(b => b.userId === currentUser?.id);

    // Filter today's appointments for this barber
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysApps = appointments.filter(a => a.barberId === barberProfile?.id && a.date === todayStr);
    const completedToday = todaysApps.filter(a => a.status === 'concluido');
    const pendingToday = todaysApps.filter(a => a.status === 'agendado' || a.status === 'confirmado' || a.status === 'em atendimento');

    const dailyRevenue = completedToday.reduce((acc, curr) => acc + curr.price, 0);
    const monthlyCommissions = appointments.filter(a =>
        a.barberId === barberProfile?.id &&
        a.status === 'concluido' &&
        new Date(a.date).getMonth() === new Date().getMonth()
    ).reduce((acc, curr) => acc + (curr.commission || 0), 0);

    return (
        <div className="space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Olá, <span className="text-[var(--color-primary-gold)]">{currentUser?.name?.split(' ')[0] || ''}!</span> 👋</h1>
                    <p className="text-gray-500 text-sm italic">Você tem {todaysApps.length} atendimentos para hoje.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/barber/horarios">
                        <Button variant="outline" className="h-12 px-6 rounded-xl border-white/5 uppercase text-[10px] font-black tracking-widest gap-2">
                            <Clock className="w-4 h-4" /> MEU HORÁRIO
                        </Button>
                    </Link>
                    <Link href="/barber/schedule">
                        <Button className="h-12 px-8 rounded-xl bg-[var(--color-primary-gold)] text-black font-black uppercase text-[10px] tracking-widest shadow-xl gap-2 hover:scale-[1.02] transition-transform">
                            VER AGENDA <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Atendimentos do Dia"
                    value={todaysApps.length.toString().padStart(2, '0')}
                    subtitle={`${completedToday.length} concluídos, ${pendingToday.length} pendentes`}
                    icon={<CalendarCheck className="w-6 h-6" />}
                />
                <StatCard
                    title="Faturamento do Dia"
                    value={`R$ ${dailyRevenue.toFixed(2)}`}
                    subtitle="Bruto total de hoje"
                    icon={<DollarSign className="w-6 h-6" />}
                />
                <StatCard
                    title="Comissão Acumulada"
                    value={`R$ ${monthlyCommissions.toFixed(2)}`}
                    subtitle="Referente ao mês atual"
                    icon={<TrendingUp className="w-6 h-6" />}
                />
                <StatCard
                    title="Avaliação Média"
                    value={barberProfile?.rating.toFixed(1) || "5.0"}
                    subtitle={`Baseado em ${barberProfile?.reviews || 0} reviews`}
                    icon={<Star className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Next Customers List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-3 italic">
                            <Clock className="w-5 h-5 text-[var(--color-primary-gold)]" /> Próximos Atendimentos
                        </h2>
                        <Link href="/barber/schedule" className="text-[10px] font-black text-gray-500 hover:text-[var(--color-primary-gold)] uppercase tracking-widest transition-colors">VER TUDO</Link>
                    </div>

                    <div className="space-y-4">
                        {pendingToday.slice(0, 5).map((apt, i) => (
                            <div key={i} className="group relative bg-[#111] border border-white/5 rounded-3xl p-6 transition-all hover:border-[var(--color-primary-gold)]/20 hover:bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-16 px-3 py-2 bg-black rounded-2xl border border-white/5">
                                        <p className="text-lg font-black text-white leading-none">{apt.time}</p>
                                        <p className="text-[8px] text-[var(--color-primary-gold)] font-black uppercase tracking-widest mt-1">HOJE</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-white tracking-tight">{apt.clientName}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium italic">
                                            <span className="flex items-center gap-1"><Scissors className="w-3 h-3 text-[var(--color-primary-gold)]" /> {apt.serviceName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`hidden md:inline-flex px-3 py-1 bg-[var(--color-primary-gold)]/10 text-[var(--color-primary-gold)] text-[9px] font-black uppercase rounded-lg border border-[var(--color-primary-gold)]/20 tracking-widest`}>
                                        {apt.status}
                                    </span>
                                    <Link href="/barber/schedule">
                                        <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[9px] font-black border border-white/5 hover:border-[var(--color-primary-gold)]/50 group-hover:bg-[var(--color-primary-gold)] group-hover:text-black transition-all uppercase tracking-widest">
                                            GERENCIAR
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {pendingToday.length === 0 && (
                            <p className="text-gray-500 text-sm italic py-10 text-center bg-black/20 rounded-3xl border border-dashed border-white/5">Nenhum atendimento pendente para hoje.</p>
                        )}
                    </div>
                </div>

                {/* Right Panel: Daily Summary / Commission Detail */}
                <div className="space-y-8">
                    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] -mr-16 -mt-16" />
                        <h3 className="text-lg font-bold mb-6 italic">Resumo de Ganhos</h3>
                        <div className="space-y-5">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Atendimentos Concluídos</p>
                                <p className="font-bold text-white">{completedToday.length}</p>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-primary-gold)] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: todaysApps.length > 0 ? `${(completedToday.length / todaysApps.length) * 100}%` : '0%' }} />
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-gray-500 uppercase font-black italic">Comissão do Dia</p>
                            <p className="text-2xl font-black text-[var(--color-primary-gold)]">R$ {completedToday.reduce((acc, curr) => acc + (curr.commission || 0), 0).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-black to-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Star className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold italic">Mensagem</h4>
                        </div>
                        <div className="space-y-3">
                            <p className="text-xs text-gray-400 leading-relaxed italic">"Comece seu dia com excelência. Cadastre seus serviços e barbeiros na área administrativa para começar a usar o sistema."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

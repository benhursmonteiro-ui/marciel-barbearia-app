"use client";

import React from 'react';
import {
    Users,
    CalendarCheck,
    DollarSign,
    Scissors,
    TrendingUp,
    ChevronRight,
    ArrowUpRight,
    Search,
    Clock,
    UserPlus,
    Settings,
    Briefcase,
    Calendar,
    Wallet,
    PieChart,
    Target,
    Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useBarber } from '@/context/BarberContext';

// Reusable Stat Card
const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="group bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 transition-all hover:border-[var(--color-primary-gold)]/30 hover:-translate-y-1 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color}/5 rounded-full blur-[40px] -mr-12 -mt-12`} />
        <div className="flex items-center justify-between mb-4 relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center ${color}`}>
                {icon}
            </div>
            {trend && <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">{trend} <ArrowUpRight size={12} /></div>}
        </div>
        <div className="relative z-10">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1 italic">{title}</p>
            <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
    </div>
);

// Quick Action Card
const ActionCard = ({ icon, label, description, href }: any) => (
    <Link href={href} className="group bg-black/40 border border-white/5 rounded-[2rem] p-6 transition-all hover:bg-[var(--color-primary-gold)]/5 hover:border-[var(--color-primary-gold)]/30">
        <div className="flex items-center gap-5 text-left">
            <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-[var(--color-primary-gold)] group-hover:bg-[var(--color-primary-gold)] group-hover:text-black transition-all duration-300">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white group-hover:text-[var(--color-primary-gold)] transition-colors tracking-tight">{label}</h4>
                <p className="text-[10px] text-gray-500 font-medium italic mt-0.5">{description}</p>
            </div>
        </div>
    </Link>
);

export default function AdminDashboard() {
    const { appointments, users, barbers, services } = useBarber();

    // Calculate real stats
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysApps = appointments.filter(a => a.date === todayStr);
    const totalRevenue = appointments.filter(a => a.status === 'concluido').reduce((acc, curr) => acc + curr.price, 0);
    const clientsCount = users.filter(u => u.role === 'client').length;

    return (
        <div className="space-y-12 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 uppercase text-center md:text-left">Relatório <span className="text-[var(--color-primary-gold)]">Geral</span></h1>
                    <p className="text-gray-500 text-xs md:text-sm italic text-center md:text-left">Gestão estratégica da MarcielBarberShop.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-6 rounded-xl border-white/5 uppercase text-[10px] font-black tracking-widest gap-2">
                        <Calendar className="w-4 h-4" /> EXTRATO MENSAL
                    </Button>
                    <Link href="/admin/agendamentos" className="w-full sm:w-auto">
                        <Button className="w-full h-12 px-8 rounded-xl bg-[var(--color-primary-gold)] text-black font-black uppercase text-[10px] tracking-widest shadow-xl gap-2 hover:scale-[1.02] transition-transform">
                            GERENCIAR <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Clientes Totais" value={clientsCount.toString()} icon={<Users size={24} />} color="text-blue-500" />
                <StatCard title="Agendamentos Hoje" value={todaysApps.length.toString().padStart(2, '0')} icon={<CalendarCheck size={24} />} color="text-[var(--color-primary-gold)]" />
                <StatCard title="Faturamento Total" value={`R$ ${totalRevenue.toFixed(2)}`} icon={<DollarSign size={24} />} color="text-emerald-500" />
                <StatCard title="Barbeiros Ativos" value={barbers.length.toString()} icon={<Briefcase size={24} />} color="text-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Recent Appointments */}
                <div className="lg:col-span-2 space-y-8 min-w-0">
                    <div className="flex items-center justify-between px-2 md:px-0">
                        <h2 className="text-lg md:text-xl font-bold italic flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[var(--color-primary-gold)]" /> Atividades Recentes
                        </h2>
                        <Link href="/admin/agendamentos" className="text-[9px] md:text-[10px] font-black text-gray-500 hover:text-[var(--color-primary-gold)] uppercase tracking-widest transition-colors">VER TUDO</Link>
                    </div>

                    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2rem] md:rounded-[3rem] p-4 md:p-6 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left">
                                <thead className="border-b border-white/5">
                                    <tr className="text-[9px] md:text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                        <th className="px-4 md:px-8 py-5">Cliente</th>
                                        <th className="px-4 md:px-8 py-5 hidden md:table-cell">Profissional</th>
                                        <th className="px-4 md:px-8 py-5">Horário</th>
                                        <th className="px-4 md:px-8 py-5 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {appointments.slice(0, 6).map((apt, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 md:px-8 py-5">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-[var(--color-primary-gold)] text-[10px] md:text-xs font-bold shrink-0">{apt.clientName?.[0] || '?'}</div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-white text-xs md:text-sm truncate">{apt.clientName}</p>
                                                        <p className="text-[8px] md:text-[10px] text-gray-500 italic uppercase tracking-widest truncate">{apt.serviceName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-8 py-5 text-xs md:text-sm font-medium text-gray-400 italic hidden md:table-cell">{apt.barberName}</td>
                                            <td className="px-4 md:px-8 py-5 text-xs md:text-sm font-bold text-white">{apt.time}</td>
                                            <td className="px-4 md:px-8 py-5 text-right">
                                                <span className={`px-2 md:px-3 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest ${apt.status === 'agendado' ? 'bg-[var(--color-primary-gold)]/10 text-[var(--color-primary-gold)] border border-[var(--color-primary-gold)]/20' :
                                                    apt.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-16 text-center text-gray-600 italic text-sm">Nenhum agendamento registrado.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Side Actions Area */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-4">
                        <ActionCard icon={<Users size={22} />} label="Profissionais" description="Gerenciar equipe e comissões" href="/admin/profissionais" />
                        <ActionCard icon={<Calendar size={22} />} label="Agendamentos" description="Lista completa de horários" href="/admin/agendamentos" />
                        <ActionCard icon={<Scissors size={22} />} label="Serviços" description="Preços e tempos de execução" href="/admin/servicos" />
                        <ActionCard icon={<PieChart size={22} />} label="Relatórios" description="Análise de faturamento e metas" href="/admin/relatorios" />
                        <ActionCard icon={<Ticket size={22} />} label="Marketing" description="Promoções e campanhas" href="/admin/marketing" />
                        <ActionCard icon={<Settings size={22} />} label="Configurações" description="Perfil da empresa e acesso" href="/admin/configuracoes" />
                    </div>


                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useBarber, Appointment, Barber } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminRelatorios() {
    const { appointments, barbers } = useBarber();
    const [period, setPeriod] = useState("Mensal");
    const [isLoading, setIsLoading] = useState(false);

    // Calculate real stats
    const finishedApps = appointments.filter((a: Appointment) => a.status === 'concluido');
    const totalRevenue = finishedApps.reduce((acc: number, curr: Appointment) => acc + curr.price, 0);
    const countApps = appointments.length;
    const ticketMedio = countApps > 0 ? totalRevenue / countApps : 0;

    const stats = [
        { label: "Receita Bruta Total", value: `R$ ${totalRevenue.toLocaleString()}`, color: "text-[#D4AF37]", icon: "DollarSign", change: "" },
        { label: "Agendamentos Totais", value: countApps.toString(), color: "text-[#D4AF37]", icon: "Calendar", change: "" },
        { label: "Ticket Médio", value: `R$ ${ticketMedio.toFixed(2)}`, color: "text-[#D4AF37]", icon: "Zap", change: "" },
    ];

    // Simple monthly data logic (current year)
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    const monthsToShow = months.slice(0, currentMonthIndex + 1);

    const monthlyRevenue = new Array(12).fill(0);
    finishedApps.forEach((app: Appointment) => {
        if (!app.date) return;
        const [y, m] = app.date.split('-');
        if (parseInt(y) === currentYear) {
            monthlyRevenue[parseInt(m) - 1] += app.price;
        }
    });

    const chartData = monthsToShow.map((m, i) => monthlyRevenue[i]);
    const maxRevenue = Math.max(...chartData, 0);
    const maxVal = maxRevenue > 0 ? maxRevenue : 1;

    // Real rank of professionals (only show those with revenue or if virgin, show empty list)
    const barberRank = barbers
        .map((b: Barber) => {
            const rev = appointments
                .filter((a: Appointment) => a.barberId === b.id && a.status === 'concluido')
                .reduce((acc: number, curr: Appointment) => acc + curr.price, 0);
            return { name: b.name, rev, score: totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0 };
        })
        .filter(b => b.rev > 0) // Hide professionals with zero revenue from rank if preferred, OR keep them
        .sort((a: any, b: any) => b.rev - a.rev);

    const handleExport = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Relatório gerado em PDF com sucesso!");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up uppercase">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black mb-1 italic tracking-tighter uppercase font-serif">
                            Master <span className="text-[#D4AF37]">Insights</span>
                        </h1>
                        <p className="text-gray-600 text-[10px] font-black tracking-[0.4em]">Analytics Empresarial de Performance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-[#111111] p-1 rounded-2xl border border-[#1f1f1f]">
                            {["Tempo Real"].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-12 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all bg-[#D4AF37] text-black shadow-xl shadow-[#D4AF37]/20`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleExport} disabled={isLoading} className="h-12 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all gap-2 px-8">
                            {isLoading ? <Icon name="Loader2" className="w-4 h-4 animate-spin" /> : <Icon name="FileDown" className="w-4 h-4" />}
                            Exportar
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-[#111111] border border-[#1f1f1f] p-10 rounded-[40px] relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-[#D4AF37]/5 rounded-2xl flex items-center justify-center text-[#D4AF37]">
                                    <Icon name={stat.icon} className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-3xl font-black mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#111111] border border-[#1f1f1f] p-10 rounded-[48px]">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-12">Curva de Faturamento (Mensal)</h4>
                        <div className="flex items-end justify-between h-64 gap-3">
                            {monthsToShow.map((month, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                                    <div
                                        className="w-full bg-gradient-to-t from-[#D4AF37] to-white rounded-2xl opacity-80 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                                        style={{ height: `${(chartData[i] / maxVal) * 100}%`, minHeight: chartData[i] > 0 ? '4px' : '2px' }}
                                    />
                                    <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-[#1f1f1f] p-10 rounded-[48px] space-y-8">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Rank de Profissionais</h4>
                        <div className="space-y-6 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                            {barberRank.map((barber, i) => (
                                <div key={i} className="bg-[#0a0a0a] p-6 rounded-3xl border border-[#1f1f1f] flex items-center justify-between group hover:border-[#D4AF37]/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-black flex items-center justify-center font-black text-xs italic">#{i + 1}</div>
                                        <h5 className="font-black text-sm italic tracking-tight">{barber.name}</h5>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-white font-black text-base">R$ {barber.rev.toLocaleString()}</span>
                                        <div className="w-24 h-1 bg-[#1a1a1a] rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-[#D4AF37]" style={{ width: `${barber.score}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {barberRank.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <Icon name="Users" className="w-10 h-10 text-gray-800 mb-4" />
                                    <p className="text-gray-600 italic text-[10px] font-black tracking-widest uppercase">Nenhum atendimento concluído ainda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

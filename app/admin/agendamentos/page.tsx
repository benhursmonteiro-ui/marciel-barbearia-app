"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useBarber, AppointmentStatus } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string; className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon)
        return (
            <div
                className={className}
                style={{ width: "20px", height: "20px", backgroundColor: "#333", borderRadius: "4px" }}
            />
        );
    return <LucideIcon className={className} />;
}

export default function AdminAgendamentos() {
    const { appointments, updateAppointmentStatus, updateAppointmentPayment, currentUser, barbers, users, refreshData } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");

    React.useEffect(() => {
        refreshData();
    }, []);

    // Calculated metrics
    const stats = useMemo(() => {
        const total = appointments.length;
        const pending = appointments.filter(a => ['agendado', 'confirmado', 'em atendimento'].includes((a.status || '').toLowerCase())).length;
        const completed = appointments.filter(a => (a.status || '').toLowerCase() === 'concluido').length;
        const totalRevenue = appointments
            .filter(a => (a.status || '').toLowerCase() === 'concluido')
            .reduce((acc, curr) => acc + (curr.price || 0), 0);

        return { total, pending, completed, totalRevenue };
    }, [appointments]);

    const filteredAppointments = appointments.filter(apt => {
        const clientName = apt.clientName || "";
        const barberName = apt.barberName || "";
        const serviceName = apt.serviceName || "";
        const status = apt.status || "";

        const matchesSearch =
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            serviceName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "TODOS"
            ? (status.toUpperCase() !== "CONCLUIDO" && status.toUpperCase() !== "CANCELADO")
            : (status.toUpperCase() === statusFilter);

        return matchesSearch && matchesStatus;
    });

    const statusOptions = ["TODOS", "AGENDADO", "CONFIRMADO", "EM ATENDIMENTO", "CONCLUIDO", "CANCELADO"];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-10 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            
            {/* Top Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic">AGENDAMENTOS</h1>
                    <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Gestão centralizada de atendimentos</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:flex-1 lg:w-80">
                        <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar cliente, barbeiro ou serviço..."
                            className="pl-12 bg-[#111] border-[#1f1f1f] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                        />
                    </div>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {[
                    { label: "Total Geral", val: stats.total, icon: "Calendar", color: "text-blue-500" },
                    { label: "Pendentes", val: stats.pending, icon: "Clock", color: "text-amber-500" },
                    { label: "Concluídos", val: stats.completed, icon: "CheckCircle2", color: "text-emerald-500" },
                    { label: "Receita Concluída", val: `R$ ${stats.totalRevenue.toFixed(2)}`, icon: "DollarSign", color: "text-[#D4AF37]" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#111] border-[#1f1f1f] p-4 md:p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-full pointer-events-none transition-all group-hover:scale-150" />
                        <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 relative z-10 text-center xs:text-left">
                            <div className={`${stat.color} bg-[#1a1a1a] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/5 shrink-0`}>
                                <Icon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] md:text-[10px] uppercase text-gray-500 font-black tracking-widest truncate">{stat.label}</p>
                                <h3 className="text-lg md:text-2xl font-black truncate">{stat.val}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Status Filter Pills */}
            <div className="flex bg-[#111111] p-1.5 rounded-2xl border border-[#1f1f1f] overflow-x-auto no-scrollbar mb-8 gap-2">
                {statusOptions.map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                            statusFilter === status
                                ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-[1.02]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Agendamentos List */}
            <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="bg-[#111111] border border-[#1f1f1f] p-6 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between group hover:border-[#D4AF37]/40 transition-all gap-6 shadow-xl"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-black text-xl border border-[#D4AF37]/20 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shrink-0">
                                    {apt.clientName?.[0] || '?'}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-extrabold text-lg text-white capitalize">{apt.clientName || 'Cliente'}</h4>
                                        <span className={`text-[8px] md:text-[9px] font-black px-3 py-1 rounded-full border ${
                                            (apt.status || '').toLowerCase() === 'agendado' ? 'bg-[#221c0b] text-[#D4AF37] border-[#D4AF37]/30' :
                                            (apt.status || '').toLowerCase() === 'concluido' ? 'bg-[#0f2419] text-[#4ade80] border-[#4ade80]/30' :
                                            (apt.status || '').toLowerCase() === 'confirmado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                            'bg-red-500/10 text-red-500 border-red-500/30'
                                        }`}>
                                            {(apt.status || 'PENDENTE').toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                                        <span className="text-white">{apt.serviceName || 'Serviço'}</span> • Barbeiro: <span className="text-[#D4AF37]">{apt.barberName || 'Barbeiro'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                                <div className="text-left lg:text-right">
                                    <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase font-black mb-1">
                                        <Icon name="Calendar" className="w-3.5 h-3.5 text-[#D4AF37]" />
                                        {apt.date ? apt.date.split('-').reverse().join('/') : '--/--/----'}
                                        <span className="mx-1 opacity-40">•</span>
                                        <Icon name="Clock" className="w-3.5 h-3.5 text-[#D4AF37]" />
                                        {apt.time || '--:--'}
                                    </div>
                                    <p className="text-[#D4AF37] font-black text-xl tracking-tight">R$ {(apt.price || 0).toFixed(2).replace('.', ',')}</p>
                                </div>

                                <div className="flex items-center gap-3 flex-wrap">
                                    {(() => {
                                        const clientUser = users.find(u => u.id === apt.clientId);
                                        const rawPhone = clientUser?.phone || "";
                                        const cleanPhone = rawPhone.replace(/\D/g, '');
                                        const waPhone = (cleanPhone.length >= 12 && cleanPhone.startsWith('55')) ? cleanPhone : `55${cleanPhone}`;
                                        const waLink = `https://wa.me/${waPhone}`;
                                        const telLink = `tel:${rawPhone}`;

                                        if (!rawPhone) return null;

                                        return (
                                            <>
                                                <a 
                                                    href={telLink}
                                                    className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                                                    title="Ligar para Cliente"
                                                >
                                                    <Icon name="Phone" className="w-4 h-4" />
                                                </a>
                                                <a 
                                                    href={waLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20"
                                                    title="WhatsApp do Cliente"
                                                >
                                                    <Icon name="MessageSquare" className="w-4 h-4" />
                                                </a>
                                            </>
                                        );
                                    })()}

                                    {((apt.status || '').toLowerCase() === 'agendado' || (apt.status || '').toLowerCase() === 'confirmado') && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    updateAppointmentStatus(apt.id, 'concluido');
                                                    updateAppointmentPayment(apt.id, 'pago', 'pix');
                                                }}
                                                className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                                                title="Concluir e Marcar Pago"
                                            >
                                                <Icon name="Check" className="w-4 h-4" /> Pago
                                            </button>
                                            <button
                                                onClick={() => {
                                                    updateAppointmentStatus(apt.id, 'concluido');
                                                    updateAppointmentPayment(apt.id, 'fiado', 'fiado');
                                                }}
                                                className="px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                                                title="Concluir no Fiado"
                                            >
                                                <Icon name="BookOpen" className="w-4 h-4" /> Fiado
                                            </button>
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                title="Cancelar Agendamento"
                                            >
                                                <Icon name="X" className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}

                                    {(apt.status || '').toLowerCase() === 'concluido' && (
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                                                apt.isFiado || apt.paymentStatus === 'fiado' 
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            }`}>
                                                {apt.isFiado || apt.paymentStatus === 'fiado' ? '📖 FIADO PENDENTE' : '✓ PAGO'}
                                            </span>
                                            {(apt.isFiado || apt.paymentStatus === 'fiado') && !apt.fiadoPaid && (
                                                <button
                                                    onClick={() => updateAppointmentPayment(apt.id, 'pago', 'dinheiro')}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                                                >
                                                    Quitar Fiado
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-2xl">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 text-gray-600 border border-white/5">
                            <Icon name="Inbox" className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300 mb-1">Nenhum agendamento encontrado</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Tente ajustar seus termos de busca ou filtros de status.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


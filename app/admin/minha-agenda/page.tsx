"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useBarber } from "@/context/BarberContext";
import { getTodayLocalDateStr } from "@/lib/timeUtils";

export default function AdminMinhaAgenda() {
    const { appointments, updateAppointmentStatus, currentUser, barbers, addBarber, users, refreshData } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");
    const [selectedDate, setSelectedDate] = useState(() => getTodayLocalDateStr());
    const dateInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        refreshData();
    }, []);

    // Encontra o registro de barbeiro que pertence ao administrador logado
    const currentBarber = useMemo(() => {
        if (!currentUser) return null;

        // 1. Se for Admin, força a visualização do barbeiro Marciel
        if (currentUser.role === 'admin' || currentUser.email === 'marciel_farias@admin.com') {
            const marciel = barbers.find(b => b.name.toLowerCase().includes('marciel') || b.name === 'Admin' || b.name === 'Administrador');
            if (marciel) return marciel;
        }

        // 2. Tenta achar pelo vínculo direto de ID
        const byId = barbers.find(b => b.userId === currentUser.id);
        if (byId) return byId;

        // 3. Fallback pelo nome
        return barbers.find(b => b.name === currentUser.name);
    }, [barbers, currentUser]);

    // Filtra agendamentos APENAS deste barbeiro
    const myAppointments = useMemo(() => {
        if (!currentBarber) return [];
        return appointments.filter(apt => 
            String(apt.barberId) === String(currentBarber.id) ||
            (apt.barberName && currentBarber.name && apt.barberName.toLowerCase().trim() === currentBarber.name.toLowerCase().trim())
        );
    }, [appointments, currentBarber]);

    // KPI Metrics for personal agenda
    const stats = useMemo(() => {
        const total = myAppointments.length;
        const pendingToday = myAppointments.filter(a =>
            a.date === selectedDate &&
            ['agendado', 'confirmado', 'em atendimento'].includes((a.status || '').toLowerCase())
        ).length;
        const completed = myAppointments.filter(a => (a.status || '').toLowerCase() === 'concluido').length;
        const estimatedRevenue = myAppointments
            .filter(a => (a.status || '').toLowerCase() === 'concluido')
            .reduce((acc, curr) => acc + (curr.price || 0), 0);

        return { total, pendingToday, completed, estimatedRevenue };
    }, [myAppointments, selectedDate]);

    const filteredAppointments = myAppointments.filter(apt => {
        const clientName = apt.clientName || "";
        const serviceName = apt.serviceName || "";
        const status = apt.status || "";
        const date = apt.date || "";

        const matchesSearch =
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            serviceName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "TODOS"
            ? (status.toUpperCase() !== "CONCLUIDO" && status.toUpperCase() !== "CANCELADO")
            : (status.toUpperCase() === statusFilter);

        const matchesDate = !selectedDate || date === selectedDate;
        return matchesSearch && matchesStatus && matchesDate;
    });

    const statusOptions = ["TODOS", "AGENDADO", "CONFIRMADO", "CONCLUIDO", "CANCELADO"];

    const [isLinking, setIsLinking] = useState(false);

    const handleLinkAccount = async () => {
        if (!currentUser) return;
        setIsLinking(true);
        try {
            await addBarber({
                name: currentUser.name || "Marciel",
                email: currentUser.email,
                specialty: "Corte Premium",
                commission: 100,
                workingHours: "08:00 às 18:00",
                photo: "",
                blockedSlots: [],
                holidays: []
            });
        } catch (error) {
            console.error("Erro ao vincular conta:", error);
            alert("Erro ao vincular conta. Tente novamente.");
        } finally {
            setIsLinking(false);
        }
    };

    if (!currentBarber) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 flex items-center justify-center font-sans">
                <div className="max-w-md w-full bg-[#111111] border border-[#1f1f1f] p-10 rounded-[2.5rem] text-center shadow-2xl animate-fade-in-up">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                        <Icon name="UserX" className="w-10 h-10 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-black mb-3 tracking-tight italic">BARBEIRO NÃO VINCULADO</h2>
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-widest leading-relaxed mb-8">
                        Para visualizar sua agenda pessoal, você precisa estar cadastrado como Profissional na plataforma.
                    </p>
                    <button 
                        onClick={handleLinkAccount}
                        disabled={isLinking}
                        className="w-full h-14 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-3"
                    >
                        {isLinking ? (
                            <Icon name="Loader2" className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Icon name="UserCheck" className="w-5 h-5" />
                                VINCULAR MINHA CONTA AGORA
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-10 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic">MINHA <span className="text-[#D4AF37]">AGENDA</span></h1>
                    <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Agenda Pessoal de {currentBarber.name}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:flex-1 lg:w-80">
                        <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar cliente ou serviço..."
                            className="pl-12 bg-[#111] border-[#1f1f1f] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                        />
                    </div>

                    <div className="relative w-full sm:w-auto flex items-center gap-2">
                        <input 
                            type="date"
                            ref={dateInputRef}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none w-1 h-1"
                        />
                        <button
                            onClick={() => {
                                try {
                                    dateInputRef.current?.showPicker();
                                } catch (e) {
                                    dateInputRef.current?.focus();
                                }
                            }}
                            className="w-full sm:w-auto h-14 px-6 bg-[#111] border border-[#1f1f1f] text-[#D4AF37] hover:border-[#D4AF37]/50 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all"
                        >
                            <Icon name="Calendar" className="w-4 h-4 text-[#D4AF37]" />
                            {selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR') : 'TODAS AS DATAS'}
                        </button>

                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate('')}
                                className="h-14 px-4 bg-[#111] border border-[#1f1f1f] text-gray-400 hover:text-white hover:border-white/20 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 transition-all shrink-0"
                                title="Ver Todas as Datas"
                            >
                                <Icon name="X" className="w-4 h-4 text-red-400" />
                                <span className="hidden md:inline text-[10px]">TODAS AS DATAS</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {[
                    { label: "Meus Atendimentos", val: stats.total, icon: "CalendarRange", color: "text-blue-500" },
                    { label: "Pendentes Hoje", val: stats.pendingToday, icon: "Clock", color: "text-amber-500" },
                    { label: "Concluídos", val: stats.completed, icon: "CheckCircle2", color: "text-emerald-500" },
                    { label: "Faturamento Próprio", val: `R$ ${stats.estimatedRevenue.toFixed(2)}`, icon: "DollarSign", color: "text-[#D4AF37]" }
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

            {/* My Appointments List */}
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
                                        Serviço: <span className="text-white">{apt.serviceName || 'Serviço'}</span>
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

                                    {(apt.status || '').toLowerCase() === 'agendado' && (
                                        <>
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'confirmado')}
                                                className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                                                title="Confirmar"
                                            >
                                                <Icon name="Check" className="w-4 h-4" /> Confirmar
                                            </button>
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                                                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                title="Cancelar"
                                            >
                                                <Icon name="X" className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}

                                    {(apt.status || '').toLowerCase() === 'confirmado' && (
                                        <button
                                            onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                                            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-lg shadow-[#D4AF37]/20"
                                        >
                                            <Icon name="CheckCircle2" className="w-4 h-4" /> CONCLUIR
                                        </button>
                                    )}

                                    {((apt.status || '').toLowerCase() === 'concluido' || (apt.status || '').toLowerCase() === 'cancelado') && (
                                        <button
                                            onClick={() => updateAppointmentStatus(apt.id, 'agendado')}
                                            className="w-10 h-10 rounded-xl bg-white/5 text-gray-400 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all border border-white/10"
                                            title="Reverter Status"
                                        >
                                            <Icon name="RotateCcw" className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-2xl">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 text-[#D4AF37] border border-white/5">
                            <Icon name="CalendarX" className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300 mb-1">Nada agendado para esta data</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Altere a data no filtro superior para visualizar outros dias.</p>
                    </div>
                )}
            </div>
        </div>
    );
}


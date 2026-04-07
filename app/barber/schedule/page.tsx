"use client";

import React, { useState } from 'react';
import {
    Calendar as CalendarIcon,
    User,
    Scissors,
    CheckCircle2,
    Play,
    Phone,
    MessageSquare,
    Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { useBarber, Appointment, AppointmentStatus } from '@/context/BarberContext';

export default function BarberSchedule() {
    const { appointments, updateAppointmentStatus, currentUser, barbers, users } = useBarber();
    const [selectedDateFilter, setSelectedDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [statusFilter, setStatusFilter] = useState("TODOS");
    const [activeApt, setActiveApt] = useState<Appointment | null>(null);
    const [showCalendar, setShowCalendar] = useState(false);

    // Get current barber's ID
    const barberProfile = barbers.find(b => b.userId === currentUser?.id);

    const statusOptions = ["TODOS", "AGENDADO", "CONFIRMADO", "CONCLUIDO", "CANCELADO"];

    // Filter appointments for THIS barber and status/date
    const filteredAppointments = appointments.filter(app => {
        if (app.barberId !== barberProfile?.id) return false;
        
        const statusUpper = app.status.toUpperCase();
        const matchesStatus = statusFilter === "TODOS" 
            ? (statusUpper !== "CONCLUIDO" && statusUpper !== "CANCELADO") 
            : (statusUpper === statusFilter);
            
        const matchesDate = statusFilter === "TODOS" || app.date === selectedDateFilter;
        
        return matchesStatus && matchesDate;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'concluido': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'em atendimento': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'agendado': return 'text-[var(--color-primary-gold)] bg-[var(--color-primary-gold)]/10 border-[var(--color-primary-gold)]/20';
            case 'confirmado': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'cancelado': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-gray-400 bg-white/5 border-white/5';
        }
    };

    const handleStatusUpdate = (id: string, newStatus: AppointmentStatus) => {
        updateAppointmentStatus(id, newStatus);
        if (activeApt?.id === id) {
            setActiveApt((prev: Appointment | null) => prev ? ({ ...prev, status: newStatus }) : null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[var(--color-primary-gold)]/10 border border-[var(--color-primary-gold)]/30 rounded-3xl flex flex-col items-center justify-center text-[var(--color-primary-gold)] shadow-inner">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                            {new Date(selectedDateFilter).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                        </p>
                        <p className="text-xl font-black leading-none">
                            {new Date(selectedDateFilter).getDate() + 1}
                        </p>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Minha <span className="text-[var(--color-primary-gold)]">Agenda</span></h1>
                        <p className="text-gray-500 text-sm italic">Organize seus atendimentos com precisão.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                    <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar max-w-full">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status ? 'bg-[var(--color-primary-gold)] text-black shadow-lg shadow-[var(--color-primary-gold)]/10' : 'text-gray-500 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        {showCalendar && (
                            <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 z-50 animate-fade-in">
                                <div className="fixed inset-0 bg-black/60 md:hidden" onClick={() => setShowCalendar(false)} />
                                <Calendar
                                    selectedDate={selectedDateFilter}
                                    onDateSelect={(date) => {
                                        setSelectedDateFilter(date);
                                        setShowCalendar(false);
                                    }}
                                    className="w-[280px] shadow-2xl border-[#D4AF37]/20 relative z-50"
                                />
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={`w-full h-12 rounded-2xl border-white/5 bg-black/40 text-[10px] font-black uppercase tracking-[0.2em] gap-3 transition-all ${showCalendar ? 'border-[var(--color-primary-gold)]/50 bg-[var(--color-primary-gold)]/5' : ''}`}
                        >
                            <CalendarIcon className="w-4 h-4 text-[var(--color-primary-gold)]" />
                            {new Date(selectedDateFilter + 'T12:00:00').toLocaleDateString('pt-BR')}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Daily Schedule List */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt) => (
                            <div
                                key={apt.id}
                                onClick={() => setActiveApt(apt)}
                                className={`group relative overflow-hidden bg-[var(--color-dark-card)] border-2 transition-all duration-300 p-6 rounded-[2.5rem] flex items-center justify-between cursor-pointer ${activeApt?.id === apt.id
                                    ? 'border-[var(--color-primary-gold)] shadow-[0_10px_30px_rgba(212,175,55,0.1)]'
                                    : 'border-white/5 border-dashed hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center gap-8">
                                    <div className="text-center min-w-[80px] bg-black/40 p-3 rounded-2xl border border-white/5">
                                        <p className="text-[8px] text-[var(--color-primary-gold)] font-black uppercase tracking-widest mb-1">
                                            {apt.date ? apt.date.split('-').reverse().slice(0, 2).join('/') : '--/--'}
                                        </p>
                                        <p className="text-lg font-black text-white leading-none">{apt.time}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-bold tracking-tight text-white capitalize">
                                                {apt.clientName}
                                            </h4>
                                            <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${getStatusColor(apt.status)}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium italic text-gray-500">
                                            {apt.serviceName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 scale-0 group-hover:scale-100 transition-all origin-right">
                                    {apt.status === 'agendado' && (
                                        <Button
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(apt.id, 'em atendimento'); }}
                                            className="h-10 w-10 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black"
                                        >
                                            <Play className="w-4 h-4 fill-current" />
                                        </Button>
                                    )}
                                    {apt.status === 'em atendimento' && (
                                        <Button
                                            size="sm"
                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(apt.id, 'concluido'); }}
                                            className="h-10 w-10 p-0 rounded-xl bg-blue-500 hover:bg-blue-600 text-black"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-black/20 border-2 border-dashed border-white/5 rounded-[3.5rem] p-20 text-center space-y-6">
                            <CalendarIcon className="w-16 h-16 text-gray-800 mx-auto opacity-20" />
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">Nenhum agendamento para este dia</p>
                        </div>
                    )}
                </div>

                {/* Right Panel: Client Details / Quick Actions */}
                <div className="space-y-8">
                    {activeApt ? (
                        <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-10 shadow-2xl space-y-8 sticky top-32 animate-fade-in-up">
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 rounded-3xl border-2 border-[var(--color-primary-gold)]/30 p-1 mx-auto relative group">
                                    <div className="absolute inset-0 bg-[var(--color-primary-gold)]/5 rounded-3xl blur-xl group-hover:bg-[var(--color-primary-gold)]/20 transition-all" />
                                    <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center text-[var(--color-primary-gold)] relative z-10 overflow-hidden">
                                        <User size={48} strokeWidth={1} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight capitalize">{activeApt.clientName}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 italic">Status: {activeApt.status}</p>
                                </div>
                            </div>

                            {(() => {
                                const clientUser = users.find(u => u.id === activeApt.clientId);
                                const rawPhone = clientUser?.phone || "";
                                const cleanPhone = rawPhone.replace(/\D/g, '');
                                const waPhone = (cleanPhone.length >= 12 && cleanPhone.startsWith('55')) ? cleanPhone : `55${cleanPhone}`;
                                const waLink = `https://wa.me/${waPhone}`;
                                const telLink = `tel:${rawPhone}`;

                                return (
                                    <div className="grid grid-cols-2 gap-4">
                                        <a 
                                            href={rawPhone ? telLink : "#"}
                                            className={`flex items-center justify-center gap-2 h-14 rounded-2xl border border-white/5 bg-black/40 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all ${!rawPhone && 'opacity-30 cursor-not-allowed'}`}
                                            onClick={(e) => !rawPhone && e.preventDefault()}
                                        >
                                            <Phone className="w-4 h-4 text-emerald-400" /> LIGAR
                                        </a>
                                        <a 
                                            href={rawPhone ? waLink : "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center gap-2 h-14 rounded-2xl border border-white/5 bg-black/40 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/10 hover:border-blue-500/20 transition-all ${!rawPhone && 'opacity-30 cursor-not-allowed'}`}
                                            onClick={(e) => !rawPhone && e.preventDefault()}
                                        >
                                            <MessageSquare className="w-4 h-4 text-blue-400" /> WHATSAPP
                                        </a>
                                    </div>
                                );
                            })()}

                            <div className="space-y-4 pt-6">
                                {activeApt.status === 'agendado' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(activeApt.id, 'em atendimento')}
                                        className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-xl"
                                    >
                                        INICIAR ATENDIMENTO
                                    </Button>
                                )}
                                {activeApt.status === 'em atendimento' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(activeApt.id, 'concluido')}
                                        className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-xl"
                                    >
                                        CONCLUIR SERVIÇO
                                    </Button>
                                )}
                                <Button
                                    onClick={() => handleStatusUpdate(activeApt.id, 'cancelado')}
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl border-red-500/20 text-red-500 hover:bg-red-500/10 font-black uppercase text-[10px] tracking-widest border-dashed"
                                >
                                    CANCELAR HORÁRIO
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] border-dashed rounded-[3rem] p-16 text-center space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-700">
                                <Scissors size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-500">Selecione um cliente</h3>
                                <p className="text-xs text-gray-600 mt-2 italic px-8">Acompanhe e gerencie seus atendimentos em tempo real.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

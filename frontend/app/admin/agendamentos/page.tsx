"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { useBarber, AppointmentStatus } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminAgendamentos() {
    const { appointments, updateAppointmentStatus, currentUser, barbers, users } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");

    const filteredAppointments = appointments.filter(apt => {
        const clientName = apt.clientName || "";
        const barberName = apt.barberName || "";
        const status = apt.status || "";

        const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barberName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "TODOS" 
            ? (status.toUpperCase() !== "CONCLUIDO" && status.toUpperCase() !== "CANCELADO") 
            : (status.toUpperCase() === statusFilter);
        return matchesSearch && matchesStatus;
    });

    const statusOptions = ["TODOS", "AGENDADO", "CONFIRMADO", "CONCLUIDO", "CANCELADO"];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="max-w-4xl mx-auto bg-[#111111] border border-[#1f1f1f] rounded-3xl p-5 md:p-8 shadow-2xl h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                            <Icon name="Calendar" className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Agendamentos</h2>
                    </div>
                    <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-[#222] overflow-x-auto no-scrollbar max-w-full">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${statusFilter === status ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10' : 'text-gray-500 hover:text-white'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="relative mb-8">
                    <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Buscar por cliente ou barbeiro..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-[#1a1a1a] border-[#222] h-14 text-sm focus:border-[#D4AF37]/50"
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-4 custom-scrollbar">
                    {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-[#1a1a1a]/50 border border-[#222] p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-[#D4AF37]/20 transition-all gap-4">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-lg md:text-xl border border-[#D4AF37]/10 group-hover:bg-[#D4AF37] group-hover:text-black transition-all shrink-0">
                                    {apt.clientName?.[0] || '?'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-lg text-gray-100 mb-0.5">{apt.clientName || 'Cliente'}</h4>
                                    <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-black leading-tight">
                                        {apt.serviceName || 'Serviço'} • <span className="text-[#D4AF37]">{apt.barberName || 'Barbeiro'}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-4 md:gap-12 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                <div className="text-left sm:text-right">
                                    <div className="flex items-center gap-2 text-gray-400 text-[9px] md:text-[10px] uppercase font-black justify-start sm:justify-end mb-0.5">
                                        <Icon name="Calendar" className="w-3 h-3 text-[#D4AF37]" /> {apt.date ? apt.date.split('-').reverse().join('/') : '--/--/----'}
                                        <span className="mx-1 opacity-50">•</span>
                                        <Icon name="Clock" className="w-3 h-3 text-[#D4AF37]" /> {apt.time || '--:--'}
                                    </div>
                                    <p className="text-white font-bold text-base md:text-lg tracking-tighter">R$ {(apt.price || 0).toFixed(2).replace('.', ',')}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 rounded-full border ${(apt.status || '').toLowerCase() === 'agendado' ? 'bg-[#221c0b] text-[#D4AF37] border-[#D4AF37]/20' :
                                            (apt.status || '').toLowerCase() === 'concluido' ? 'bg-[#0f2419] text-[#4ade80] border-[#4ade80]/20' :
                                                (apt.status || '').toLowerCase() === 'confirmado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                        {(apt.status || 'PENDENTE').toUpperCase()}
                                    </span>

                                    <div className="flex gap-2 shrink-0">
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
                                                        className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/10"
                                                        title="Ligar para Cliente"
                                                    >
                                                        <Icon name="Phone" className="w-4 h-4" />
                                                    </a>
                                                    <a 
                                                        href={waLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all border border-blue-500/10"
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
                                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20"
                                                    title="Confirmar"
                                                >
                                                    <Icon name="Check" className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                                                    title="Cancelar"
                                                >
                                                    <Icon name="X" className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {(apt.status || '').toLowerCase() !== 'agendado' && (
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'agendado')}
                                                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1a1a1a] text-gray-600 flex items-center justify-center hover:text-white transition-all border border-[#222]"
                                                title="Reverter Status"
                                            >
                                                <Icon name="RotateCcw" className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                            <Icon name="Inbox" className="w-16 h-16 mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest text-white">Nenhum agendamento encontrado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

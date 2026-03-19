"use client";

import React, { useState, useMemo, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { useBarber } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminMinhaAgenda() {
    const { appointments, updateAppointmentStatus, currentUser, barbers, addBarber, users } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const dateInputRef = useRef<HTMLInputElement>(null);

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
        return appointments.filter(apt => apt.barberId === currentBarber.id);
    }, [appointments, currentBarber]);

    const filteredAppointments = myAppointments.filter(apt => {
        const clientName = apt.clientName || "";
        const status = apt.status || "";
        const date = apt.date || "";

        const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "TODOS" 
            ? (status.toUpperCase() !== "CONCLUIDO" && status.toUpperCase() !== "CANCELADO") 
            : (status.toUpperCase() === statusFilter);
        const matchesDate = statusFilter === "TODOS" || date === selectedDate;
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
            // A lista de barbeiros será atualizada via context e o useMemo recalculará
        } catch (error) {
            console.error("Erro ao vincular conta:", error);
            alert("Erro ao vincular conta. Tente novamente.");
        } finally {
            setIsLinking(false);
        }
    };

    if (!currentBarber) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 flex items-center justify-center">
                <div className="max-w-md w-full bg-[#111111] border border-[#1f1f1f] p-10 rounded-[2.5rem] text-center shadow-2xl animate-fade-in-up">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20">
                        <Icon name="UserX" className="w-10 h-10 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3 tracking-tight">Barbeiro não vinculado</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        Para ver sua agenda pessoal, você precisa estar cadastrado como um Profissional.
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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="max-w-4xl mx-auto bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl h-[calc(100vh-100px)] flex flex-col relative overflow-hidden">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20">
                            <Icon name="CalendarRange" className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight italic">MINHA <span className="text-[#D4AF37]">AGENDA</span></h2>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Agenda Pessoal de {currentBarber.name}</p>
                        </div>
                    </div>
                    <div className="flex bg-[#1a1a1a] p-1 rounded-xl border border-[#222] items-center">
                        <div className="relative">
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
                                className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-[#D4AF37] hover:text-white transition-all bg-black/40 rounded-lg border border-[#D4AF37]/20"
                            >
                                <Icon name="Calendar" className="w-3 h-3" />
                                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </button>
                        </div>
                        <div className="flex overflow-x-auto no-scrollbar max-w-full pl-2 ml-2 border-l border-white/5">
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
                    </div>
                </header>

                <div className="relative mb-8">
                    <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Pesquisar por cliente na minha agenda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-[#1a1a1a] border-[#222] h-14 text-sm focus:border-[#D4AF37]/50 placeholder:text-gray-700"
                    />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                        <div key={apt.id} className="bg-[#1a1a1a]/50 border border-[#222] p-5 md:p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:border-[#D4AF37]/30 transition-all hover:bg-[#1a1a1a] shadow-sm gap-4">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-[#D4AF37] font-black text-lg md:text-xl shadow-inner group-hover:border-[#D4AF37]/30 transition-all shrink-0">
                                    {apt.clientName?.[0] || '?'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-base md:text-lg text-white mb-0.5 tracking-tight">{apt.clientName || 'Cliente'}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-[#D4AF37]/10 flex items-center justify-center">
                                            <Icon name="Scissors" className="w-2 h-2 text-[#D4AF37]" />
                                        </div>
                                        <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-black">
                                            {apt.serviceName || 'Serviço'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-4 md:gap-12 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                <div className="text-left sm:text-right">
                                    <div className="flex flex-col sm:items-end gap-1 mb-1">
                                        <div className="flex items-center gap-2 text-[#D4AF37] text-[9px] md:text-[10px] uppercase font-black justify-start sm:justify-end tracking-[0.1em]">
                                            <Icon name="Calendar" className="w-3 h-3" /> {apt.date ? apt.date.split('-').reverse().join('/') : '--/--/----'}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-[9px] md:text-[10px] uppercase font-black justify-start sm:justify-end tracking-[0.1em]">
                                            <Icon name="Clock" className="w-3 h-3" /> {apt.time || '--:--'}
                                        </div>
                                    </div>
                                    <p className="text-white font-black text-base md:text-lg tracking-tighter italic">R$ {(apt.price || 0).toFixed(2).replace('.', ',')}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1.5 rounded-full border shadow-sm ${(apt.status || '').toLowerCase() === 'agendado' ? 'bg-[#221c0b] text-[#D4AF37] border-[#D4AF37]/20 italic' :
                                            (apt.status || '').toLowerCase() === 'concluido' ? 'bg-[#0f2419] text-[#4ade80] border-[#4ade80]/20 italic' :
                                                (apt.status || '').toLowerCase() === 'confirmado' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 italic' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20 italic'
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
                                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg hover:shadow-emerald-500/20 border border-emerald-500/10"
                                                    title="Confirmar"
                                                >
                                                    <Icon name="Check" className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateAppointmentStatus(apt.id, 'cancelado')}
                                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20 border border-red-500/10"
                                                    title="Cancelar"
                                                >
                                                    <Icon name="X" className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {(apt.status || '').toLowerCase() === 'confirmado' && (
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'concluido')}
                                                className="px-3 md:px-4 h-9 md:h-10 rounded-xl bg-[#D4AF37] text-black font-black text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#D4AF37]/10"
                                            >
                                                <Icon name="CheckCircle2" className="w-4 h-4" /> CONCLUIR
                                            </button>
                                        )}
                                        {((apt.status || '').toLowerCase() === 'concluido' || (apt.status || '').toLowerCase() === 'cancelado') && (
                                            <button
                                                onClick={() => updateAppointmentStatus(apt.id, 'agendado')}
                                                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1a1a1a] text-gray-600 flex items-center justify-center hover:text-white transition-all border border-white/5"
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
                        <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
                            <Icon name="CalendarX" className="w-20 h-20 mb-6 text-[#D4AF37]" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Nada agendado para você ainda</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

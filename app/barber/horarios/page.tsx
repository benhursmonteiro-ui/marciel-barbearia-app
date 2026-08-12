"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { useBarber } from "../../../context/BarberContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Calendar } from "../../../components/ui/Calendar";
import { timeToMinutes, getDurationMinutes, getTodayLocalDateStr } from "@/lib/timeUtils";

export default function BarberHorarios() {
    const { barbers, currentUser, updateBarber, appointments, shopConfig, services, refreshData } = useBarber();
    
    // Refresh data when component mounts to ensure fresh appointments
    useEffect(() => {
        console.log('[MBS Horarios] Component mounted, refreshing data...');
        refreshData();
    }, []);

    const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
    const [holidays, setHolidays] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'rules'>('grid');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDateStr());
    const [selectedBarberId, setSelectedBarberId] = useState<string>('');

    // Local working hours config per day
    const [workingHours, setWorkingHours] = useState<Record<string, { start: string; end: string; closed: boolean }>>({
        "Segunda": { start: "00:00", end: "00:00", closed: true },
        "Terça": { start: "08:00", end: "19:00", closed: false },
        "Quarta": { start: "08:00", end: "19:00", closed: false },
        "Quinta": { start: "08:00", end: "19:00", closed: false },
        "Sexta": { start: "08:00", end: "19:00", closed: false },
        "Sábado": { start: "08:00", end: "19:00", closed: false },
        "Domingo": { start: "00:00", end: "00:00", closed: true }
    });

    // Schedule Rules State
    const [intervalMinutes, setIntervalMinutes] = useState("15");
    const [minAdvanceHours, setMinAdvanceHours] = useState("2");
    const [maxAdvanceDays, setMaxAdvanceDays] = useState("30");
    const [allowClientCancel, setAllowClientCancel] = useState(true);
    const [cancelLimitHours, setCancelLimitHours] = useState("24");

    // Find current barber robustly
    const currentBarber = useMemo(() => {
        const targetId = selectedBarberId;
        if (targetId) {
            const foundSelected = barbers.find(b => b.id === targetId);
            if (foundSelected) return foundSelected;
        }

        const found = barbers.find(b => 
            b.userId === currentUser?.id || 
            b.id === currentUser?.id || 
            b.name.toLowerCase() === currentUser?.name?.toLowerCase()
        );
        return found;
    }, [barbers, currentUser, selectedBarberId]);

    useEffect(() => {
        if (currentBarber && !selectedBarberId) {
            setSelectedBarberId(currentBarber.id);
        }
    }, [currentBarber, selectedBarberId]);

    // Initial load from context when barber selection changes
    useEffect(() => {
        if (currentBarber) {
            setBlockedSlots(currentBarber.blockedSlots || []);
            setHolidays(currentBarber.holidays || []);

            const bHours = (currentBarber as any).workingHours;
            if (bHours && typeof bHours === 'object' && Object.keys(bHours).length > 0) {
                setWorkingHours(bHours);
            } else if (shopConfig?.workingHours) {
                setWorkingHours(shopConfig.workingHours);
            }
        }
    }, [currentBarber?.id, shopConfig?.id]);

    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const hours = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

    const toggleSlot = (day: string, hour: string) => {
        const slot = `${day}-${hour}`;
        setBlockedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    };

    const blockEntireDay = (day: string) => {
        const slotsToBlock = hours.map(h => `${day}-${h}`);
        setBlockedSlots(prev => {
            const isAlreadyFullyBlocked = slotsToBlock.every(s => prev.includes(s));
            if (isAlreadyFullyBlocked) {
                return prev.filter(s => !slotsToBlock.includes(s));
            } else {
                const newBlocked = [...prev];
                slotsToBlock.forEach(s => {
                    if (!newBlocked.includes(s)) newBlocked.push(s);
                });
                return newBlocked;
            }
        });
    };

    const toggleHoliday = (dateStr: string) => {
        const timestamp = new Date(dateStr + 'T12:00:00').getTime();
        setHolidays(prev =>
            prev.includes(timestamp) ? prev.filter(t => t !== timestamp) : [...prev, timestamp]
        );
    };

    const toggleDay = (day: string) => {
        setWorkingHours(prev => ({
            ...prev,
            [day]: { ...prev[day], closed: !prev[day]?.closed }
        }));
    };

    const updateHour = (day: string, field: 'start' | 'end', value: string) => {
        setWorkingHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const replicateHours = () => {
        const monday = workingHours["Segunda"];
        if (!monday) return;
        const newHours = { ...workingHours };
        ["Terça", "Quarta", "Quinta", "Sexta"].forEach(day => {
            newHours[day] = { ...monday };
        });
        setWorkingHours(newHours);
        alert("Horários da Segunda-feira replicados para os dias úteis (Ter-Sex)!");
    };

    const handleSave = async () => {
        if (!currentBarber) return;
        setIsSaving(true);
        try {
            await updateBarber(currentBarber.id, {
                blockedSlots,
                holidays,
                workingHours: workingHours as any
            });
            alert("Suas configurações de horário e regras foram salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSaving(false);
        }
    };

    // Helper to get dates for the current week based on selectedDate
    const weekDates = useMemo(() => {
        if (!selectedDate) return {};
        const date = new Date(selectedDate + 'T12:00:00');
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)
        // Adjust to Monday (1)
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(new Date(date).setDate(diff));
        
        const mapped: Record<string, string> = {};
        days.forEach((d, i) => {
            const current = new Date(new Date(monday).setDate(monday.getDate() + i));
            mapped[d] = current.toISOString().split('T')[0];
        });
        return mapped;
    }, [selectedDate]);

    // Helper to check if a slot is "Taken" by an appointment on its specific date
    const getAppointmentForSlot = (dayName: string, hour: string) => {
        const targetDate = weekDates[dayName];
        if (!targetDate || !currentBarber) return null;
        
        const slotMin = timeToMinutes(hour);

        return appointments.find(apt => {
            if (apt.barberId !== currentBarber.id) return false;
            if (apt.date !== targetDate) return false;
            if (!['agendado', 'confirmado', 'em atendimento', 'concluido'].includes(apt.status.toLowerCase())) return false;

            const appMin = timeToMinutes(apt.time);
            const service = services.find(s => s.id === apt.serviceId || s.name === apt.serviceName);
            const durMin = getDurationMinutes(service?.duration || "30 min");

            return slotMin >= appMin && slotMin < (appMin + durMin);
        });
    };

    if (!currentBarber) {
        return <div className="p-12 text-center text-gray-500 uppercase font-black tracking-widest">Carregando perfil...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest py-1 text-center z-50">
                Sistema de Bloqueios e Regras Ativo
            </div>
            <header className="mb-10 lg:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 lg:px-12 pt-6">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">
                        Configuração de <span className="text-[#D4AF37]">Agenda</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Gerencie sua grade, horários de trabalho, folgas e regras de atendimento</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-black/40 border border-[#1f1f1f] rounded-xl p-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase text-gray-600 pl-1">Data:</label>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold text-[#D4AF37] outline-none"
                            />
                        </div>
                        {barbers.length > 1 && (
                            <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                                <label className="text-[8px] font-black uppercase text-gray-600 pl-1">Profissional:</label>
                                <select
                                    value={selectedBarberId}
                                    onChange={(e) => setSelectedBarberId(e.target.value)}
                                    className="bg-transparent border-none text-[10px] font-bold text-[#D4AF37] outline-none cursor-pointer"
                                >
                                    {barbers.map(b => (
                                        <option key={b.id} value={b.id} className="bg-[#111] text-white">{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#b5952f] px-8 h-12 rounded-xl text-[10px]"
                    >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <div className="flex bg-[#111111] border border-[#1f1f1f] p-1 rounded-2xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Grade
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Calendário
                        </button>
                        <button
                            onClick={() => setViewMode('rules')}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'rules' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Regras
                        </button>
                    </div>
                </div>
            </header>

            {viewMode === 'grid' && (
                <div className="animate-fade-in-up px-6 lg:px-12">
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl overflow-hidden shadow-2xl mb-8">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#161616] border-b border-[#1f1f1f]">
                                        <th className="p-6 text-left text-[10px] uppercase tracking-widest text-gray-500 font-bold border-r border-[#1f1f1f] w-32">Horário</th>
                                        {days.map(day => {
                                            const dayCfg = workingHours[day] || (shopConfig?.workingHours as any)?.[day];
                                            const isClosed = (day === "Segunda" || day === "Domingo" || dayCfg?.closed);
                                            return (
                                                <th key={day} className="p-6 text-center border-r border-[#1f1f1f] last:border-0 min-w-[120px]">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black">{day}</span>
                                                        {isClosed && (
                                                            <span className="text-[7px] text-red-500/80 font-black uppercase tracking-widest bg-red-500/5 px-2 py-0.5 rounded-full border border-red-500/10 -mt-1">Fechado</span>
                                                        )}
                                                        <button
                                                            onClick={() => blockEntireDay(day)}
                                                            className="text-[8px] uppercase font-black px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            Alternar Dia
                                                        </button>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1f1f1f]">
                                    {hours.map(hour => (
                                        <tr key={hour} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 text-center border-r border-[#1f1f1f] font-bold text-gray-400 text-xs text-nowrap">
                                                {hour}
                                            </td>
                                            {days.map(day => {
                                                const dayCfg = workingHours[day] || (shopConfig?.workingHours as any)?.[day];
                                                const isClosed = (day === "Segunda" || day === "Domingo" || dayCfg?.closed);
                                                const isOutsideHours = (!isClosed && dayCfg) ? (hour < dayCfg.start || hour > dayCfg.end) : false;
                                                const isBlocked = blockedSlots.includes(`${day}-${hour}`);
                                                const appointment = getAppointmentForSlot(day, hour);
                                                
                                                return (
                                                    <td key={day} className="p-2 border-r border-[#1f1f1f] last:border-0 group">
                                                        <button
                                                            disabled={!!appointment || isClosed || isOutsideHours}
                                                            onClick={() => !appointment && !isClosed && !isOutsideHours && toggleSlot(day, hour)}
                                                            className={`w-full py-4 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${appointment 
                                                                 ? 'bg-gray-800 text-gray-400 border border-gray-700 cursor-default' 
                                                                 : isClosed
                                                                     ? 'bg-red-500/20 text-red-500 border border-red-500/30 opacity-60 cursor-not-allowed'
                                                                     : isOutsideHours
                                                                         ? 'bg-white/5 text-gray-700 border border-transparent opacity-20 cursor-default'
                                                                         : isBlocked
                                                                             ? 'bg-red-500/10 text-red-500 border border-transparent hover:bg-red-500/20'
                                                                             : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black'
                                                                  }`}
                                                        >
                                                            {appointment ? (
                                                                 <div className="flex flex-col items-center">
                                                                     <Icon name="User" className="w-3 h-3 text-white/40 mb-1" />
                                                                     <span className="text-[9px] leading-tight text-white/90">{appointment.clientName}</span>
                                                                 </div>
                                                             ) : (isClosed || isOutsideHours) ? (
                                                                 <><Icon name="XCircle" className="w-3 h-3" /> Fechado</>
                                                             ) : isBlocked ? (
                                                                 <><Icon name="XCircle" className="w-3 h-3" /> Bloqueado</>
                                                             ) : (
                                                                 <><Icon name="CheckCircle" className="w-3 h-3" /> Livre</>
                                                             )}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'calendar' && (
                <div className="animate-fade-in-up px-6 lg:px-12">
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20">
                                    <Icon name="Calendar" className="text-[#D4AF37] w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Folgas e Exceções</h2>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Marque dias que você não poderá atender</p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
                            <div className="lg:col-span-2">
                                <Calendar
                                    onDateSelect={(date) => {
                                        toggleHoliday(date);
                                        setSelectedDate(date);
                                    }}
                                    className="!bg-transparent !border-none !shadow-none !p-0"
                                    holidays={holidays}
                                />
                            </div>

                            <div className="space-y-6">
                                <div className="bg-black/40 border border-[#1f1f1f] rounded-3xl p-8 space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#D4AF37]">Dias de Folga</h3>
                                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {holidays.length > 0 ? [...holidays].sort((a, b) => a - b).map((timestamp: number) => (
                                            <div key={timestamp} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                                                <div className="flex items-center gap-3">
                                                    <Icon name="CalendarOff" className="w-4 h-4 text-red-500" />
                                                    <span className="text-xs font-bold">{new Date(timestamp).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <button
                                                    onClick={() => setHolidays(prev => prev.filter(t => t !== timestamp))}
                                                    className="text-gray-600 hover:text-red-500 transition-colors"
                                                >
                                                    <Icon name="Trash2" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )) : (
                                            <p className="text-[10px] text-gray-600 uppercase font-bold italic py-10 text-center">Nenhuma folga marcada</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'rules' && (
                <div className="animate-fade-in-up px-6 lg:px-12 space-y-8 pb-12">
                    {/* Section 1: Working Hours per day */}
                    <section className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl space-y-6">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                    <Icon name="Clock" className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Funcionamento por Dia de Trabalho</h2>
                                    <p className="text-gray-500 text-xs">Defina seus horários de início e término em cada dia</p>
                                </div>
                            </div>
                            <Button onClick={replicateHours} variant="outline" className="text-[9px] font-black uppercase tracking-widest gap-2 h-10 border-[#1f1f1f]">
                                <Icon name="Copy" className="w-4 h-4" /> Replicar Seg p/ dias úteis
                            </Button>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {days.map(day => {
                                const config = workingHours[day] || { start: "08:00", end: "19:00", closed: day === "Segunda" || day === "Domingo" };
                                return (
                                    <div key={day} className={`bg-[#0a0a0a] border p-5 rounded-3xl flex flex-col gap-4 transition-all ${config.closed ? 'opacity-40 border-red-500/20' : 'hover:border-[#D4AF37]/20 border-[#1f1f1f]'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{day}</span>
                                            <button
                                                onClick={() => toggleDay(day)}
                                                className={`w-10 h-5 rounded-full relative border transition-colors ${!config.closed ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-gray-500/10 border-gray-500/20'}`}
                                            >
                                                <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${!config.closed ? 'right-0.5 bg-emerald-500' : 'left-0.5 bg-gray-600'}`} />
                                            </button>
                                        </div>
                                        {!config.closed ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={config.start}
                                                    onChange={e => updateHour(day, 'start', e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/5 h-10 text-center text-xs font-bold rounded-xl focus:border-[#D4AF37]/50 focus:outline-none"
                                                    placeholder="08:00"
                                                />
                                                <span className="text-gray-600 font-bold text-[8px] uppercase">às</span>
                                                <input
                                                    type="text"
                                                    value={config.end}
                                                    onChange={e => updateHour(day, 'end', e.target.value)}
                                                    className="w-full bg-[#111111] border border-white/5 h-10 text-center text-xs font-bold rounded-xl focus:border-[#D4AF37]/50 focus:outline-none"
                                                    placeholder="19:00"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center border border-dashed border-red-500/20 rounded-xl py-2">
                                                <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mx-auto italic">Fechado</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 2: Tempos e Regras */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl space-y-6">
                            <header className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                    <Icon name="Hourglass" className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">Tempos e Intervalos</h2>
                            </header>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Intervalo entre atendimentos (min)</label>
                                    <Input value={intervalMinutes} onChange={e => setIntervalMinutes(e.target.value)} className="bg-[#1a1a1a] border-[#222]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo mínimo de antecedência (h)</label>
                                    <Input value={minAdvanceHours} onChange={e => setMinAdvanceHours(e.target.value)} className="bg-[#1a1a1a] border-[#222]" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo máximo p/ agendar (dias)</label>
                                    <Input value={maxAdvanceDays} onChange={e => setMaxAdvanceDays(e.target.value)} className="bg-[#1a1a1a] border-[#222]" />
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl space-y-6">
                            <header className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Icon name="XSquare" className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">Cancelamento</h2>
                            </header>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-2xl border border-[#1f1f1f]">
                                    <span className="text-sm font-bold text-gray-300">Permitir cancelamento pelo cliente</span>
                                    <button 
                                        onClick={() => setAllowClientCancel(!allowClientCancel)}
                                        className={`w-10 h-5 rounded-full relative border transition-colors ${allowClientCancel ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-gray-500/10 border-gray-500/20'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${allowClientCancel ? 'right-0.5 bg-emerald-500' : 'left-0.5 bg-gray-600'}`} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo limite para cancelar (h)</label>
                                    <Input value={cancelLimitHours} onChange={e => setCancelLimitHours(e.target.value)} className="bg-[#1a1a1a] border-[#222]" />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-between items-center bg-[#111111] p-6 rounded-3xl border border-[#1f1f1f]">
                        <Button variant="outline" onClick={replicateHours} className="text-[10px] font-black uppercase tracking-widest gap-2">
                            <Icon name="Copy" className="w-4 h-4" /> Replicar Seg p/ Todos
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-14 px-12 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#b5952f] shadow-[0_4px_30px_rgba(212,175,55,0.2)] text-[10px]"
                        >
                            {isSaving ? "Salvando..." : "Salvar Regras de Agenda"}
                        </Button>
                    </div>
                </div>
            )}
            
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

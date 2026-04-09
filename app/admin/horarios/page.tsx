"use client";

import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { useBarber } from "../../../context/BarberContext";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Calendar } from "../../../components/ui/Calendar";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminHorarios() {
    const { shopConfig, updateShopConfig, appointments, barbers, updateBarber, services } = useBarber();
    
    // Add helper functions
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getDurationMinutes = (durationStr: string): number => {
        if (!durationStr) return 30;
        const matches = durationStr.match(/\d+/);
        return matches ? parseInt(matches[0]) : 30;
    };
    const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
    const [holidays, setHolidays] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'calendar' | 'rules'>('grid');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = (now.getMonth() + 1).toString().padStart(2, '0');
        const d = now.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${d}`;
    });
    const [selectedBarberId, setSelectedBarberId] = useState<string>('all');

    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const hours = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

    // Helper to get dates for the current week based on selectedDate
    const weekDates = React.useMemo(() => {
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

    // Helper to check if a slot is "Taken" by an appointment
    const getAppointmentForSlot = (dayName: string, hour: string) => {
        const targetDate = weekDates[dayName];
        if (!targetDate) return null;
        
        const slotMin = timeToMinutes(hour);

        return appointments.find(apt => {
            if (!(selectedBarberId === 'all' || apt.barberId === selectedBarberId)) return false;
            if (apt.date !== targetDate) return false;
            if (!['agendado', 'confirmado', 'em atendimento'].includes(apt.status.toLowerCase())) return false;

            const appMin = timeToMinutes(apt.time);
            const service = services.find(s => s.id === apt.serviceId);
            const durMin = getDurationMinutes(service?.duration || "30 min");

            return slotMin >= appMin && slotMin < (appMin + durMin);
        });
    };

    // Initial load from context depending on selection
    useEffect(() => {
        if (selectedBarberId === 'all') {
            if (shopConfig) {
                setBlockedSlots(shopConfig.blockedSlots || []);
                setHolidays(shopConfig.holidays || []);
            }
        } else {
            const barber = barbers.find(b => b.id === selectedBarberId);
            if (barber) {
                setBlockedSlots(barber.blockedSlots || []);
                setHolidays(barber.holidays || []);
            }
        }
    }, [selectedBarberId]); // Somente recarrega quando mudar a seleção do profissional

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

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (selectedBarberId === 'all') {
                await updateShopConfig({
                    blockedSlots,
                    holidays
                });
            } else {
                await updateBarber(selectedBarberId, {
                    blockedSlots,
                    holidays
                });
            }
            alert("Configurações salvas com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest py-1 text-center z-50">
                Sistema de Bloqueios V2 Ativo (Seg/Dom + Intervalos)
            </div>
            <header className="mb-10 lg:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 lg:p-12 pb-0">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">
                        Configuração de <span className="text-[#D4AF37]">Agenda - MB</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Controle regras de agendamento, horários e feriados</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
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
                        <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                            <label className="text-[8px] font-black uppercase text-gray-600 pl-1">Profissional:</label>
                            <select
                                value={selectedBarberId}
                                onChange={(e) => setSelectedBarberId(e.target.value)}
                                className="bg-transparent border-none text-[10px] font-bold text-[#D4AF37] outline-none cursor-pointer"
                            >
                                <option value="all" className="bg-[#111] text-white">Todos</option>
                                {barbers.map(b => (
                                    <option key={b.id} value={b.id} className="bg-[#111] text-white">{b.name}</option>
                                ))}
                            </select>
                        </div>
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
                    </div>
                </div>
            </header>

            {viewMode === 'grid' && (
                <div className="animate-fade-in-up">
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-3xl overflow-hidden shadow-2xl mb-8">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#161616] border-b border-[#1f1f1f]">
                                        <th className="p-6 text-left text-[10px] uppercase tracking-widest text-gray-500 font-bold border-r border-[#1f1f1f] w-32">Horário</th>
                                        {days.map(day => (
                                            <th key={day} className="p-6 text-center border-r border-[#1f1f1f] last:border-0 min-w-[120px]">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-black">{day}</span>
                                                    {(day === "Segunda" || day === "Domingo" || (selectedBarberId === 'all' ? (shopConfig?.workingHours as any)?.[day]?.closed : ((barbers.find(b=>b.id===selectedBarberId)?.workingHours as any)?.[day]?.closed ?? (shopConfig?.workingHours as any)?.[day]?.closed))) && (
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
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1f1f1f]">
                                    {hours.map(hour => (
                                        <tr key={hour} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 text-center border-r border-[#1f1f1f] font-bold text-gray-400 text-xs text-nowrap">
                                                {hour}
                                            </td>
                                            {days.map(day => {
                                                const currentBarber = barbers.find(b => b.id === selectedBarberId);
                                                const dayConfig = (currentBarber?.workingHours as any)?.[day] || (shopConfig?.workingHours as any)?.[day];
                                                const isClosed = (day === "Segunda" || day === "Domingo" || dayConfig?.closed);
                                                const isOutsideHours = (!isClosed && dayConfig) ? (hour < dayConfig.start || hour > dayConfig.end) : false;
                                                const isBlocked = blockedSlots.includes(`${day}-${hour}`);
                                                const appointment = getAppointmentForSlot(day, hour);

                                                return (
                                                    <td key={day} className="p-2 border-r border-[#1f1f1f] last:border-0 group">
                                                        <button
                                                            disabled={appointment || isClosed || isOutsideHours}
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
                <div className="animate-fade-in-up bg-[#111111] border border-[#1f1f1f] rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center border border-[#D4AF37]/20">
                                <Icon name="Calendar" className="text-[#D4AF37] w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Agenda Mensal</h2>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Defina feriados e folgas extraordinárias</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1">
                        <div className="lg:col-span-2">
                            <Calendar
                                onDateSelect={(date) => toggleHoliday(date)}
                                className="!bg-transparent !border-none !shadow-none !p-0"
                                holidays={holidays}
                            />
                        </div>

                        <div className="space-y-6">
                            <div className="bg-black/40 border border-[#1f1f1f] rounded-3xl p-8 space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#D4AF37]">Dias Bloqueados</h3>
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
                                        <p className="text-[10px] text-gray-600 uppercase font-bold italic py-10 text-center">Nenhum dia bloqueado</p>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-red-500/5 rounded-3xl border border-red-500/10">
                                <p className="text-[10px] text-red-500/60 font-medium italic leading-relaxed">
                                    Dica: Clique em qualquer dia no calendário para alternar entre "Dia de Trabalho" e "Feriado/Bloqueado".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {viewMode === 'rules' && (
                <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                <Input defaultValue="15" className="bg-[#1a1a1a] border-[#222]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo mínimo de antecedência (h)</label>
                                <Input defaultValue="2" className="bg-[#1a1a1a] border-[#222]" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo máximo p/ agendar (dias)</label>
                                <Input defaultValue="30" className="bg-[#1a1a1a] border-[#222]" />
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
                                <button className="w-10 h-5 bg-emerald-500/20 rounded-full relative border border-emerald-500/30">
                                    <div className="absolute right-0.5 top-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Tempo limite para cancelar (h)</label>
                                <Input defaultValue="24" className="bg-[#1a1a1a] border-[#222]" />
                            </div>
                        </div>
                    </section>

                    <div className="md:col-span-2 flex justify-between items-center bg-[#111111] p-6 rounded-3xl border border-[#1f1f1f]">
                        <Button variant="outline" onClick={() => alert("Regras da Segunda-feira replicadas!")} className="text-[10px] font-black uppercase tracking-widest gap-2">
                            <Icon name="Copy" className="w-4 h-4" /> Replicar Seg p/ Todos
                        </Button>
                        <Button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-14 px-12 bg-[#D4AF37] text-black font-bold uppercase tracking-widest hover:bg-[#b5952f] shadow-[0_4px_30px_rgba(212,175,55,0.2)]"
                        >
                            {isSaving ? "Salvando..." : "Salvar Regras de Agenda"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

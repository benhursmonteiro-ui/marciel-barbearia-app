"use client";

import React, { useState, useEffect, useMemo } from "react";
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

export default function BarberHorarios() {
    const { barbers, currentUser, updateBarber, appointments, shopConfig, services, refreshData } = useBarber();
    
    // Refresh data when component mounts to ensure fresh appointments
    useEffect(() => {
        console.log('[MBS Horarios] Component mounted, refreshing data...');
        refreshData();
    }, []);

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
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Find current barber
    const currentBarber = useMemo(() => {
        const found = barbers.find(b => b.userId === currentUser?.id);
        console.log('[MBS Horarios] Finding barber:', {
            currentUserId: currentUser?.id,
            barbersCount: barbers.length,
            barberUserIds: barbers.map(b => ({ barberId: b.id, userId: b.userId, name: b.name })),
            foundBarber: found ? { id: found.id, name: found.name, userId: found.userId } : null
        });
        return found;
    }, [barbers, currentUser]);

    // Debug: Log appointments for this barber
    useEffect(() => {
        if (currentBarber) {
            const myAppointments = appointments.filter(a => a.barberId === currentBarber.id);
            console.log('[MBS Horarios] Appointments debug:', {
                totalAppointments: appointments.length,
                myBarberId: currentBarber.id,
                myAppointments: myAppointments.length,
                appointmentBarberIds: [...new Set(appointments.map(a => a.barberId))],
                sampleAppointments: myAppointments.slice(0, 3).map(a => ({
                    id: a.id, date: a.date, time: a.time, status: a.status, barberId: a.barberId
                }))
            });
        }
    }, [appointments, currentBarber]);

    // Initial load from context
    useEffect(() => {
        if (currentBarber) {
            setBlockedSlots(currentBarber.blockedSlots || []);
            setHolidays(currentBarber.holidays || []);
        }
    }, [currentUser?.id, !!currentBarber, currentBarber?.blockedSlots?.length, currentBarber?.holidays?.length]); // Recarrega se o barbeiro ou seus dados mudarem

    const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
    const hours = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

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
        if (!currentBarber) return;
        setIsSaving(true);
        try {
            await updateBarber(currentBarber.id, {
                blockedSlots,
                holidays
            });
            alert("Suas configurações de horário foram salvas!");
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

    // Helpler to check if a slot is "Taken" by an appointment on its specific date
    const getAppointmentForSlot = (dayName: string, hour: string) => {
        const targetDate = weekDates[dayName];
        if (!targetDate || !currentBarber) return null;
        
        const slotMin = timeToMinutes(hour);

        return appointments.find(apt => {
            if (apt.barberId !== currentBarber.id) return false;
            if (apt.date !== targetDate) return false;
            if (!['agendado', 'confirmado', 'em atendimento'].includes(apt.status.toLowerCase())) return false;

            const appMin = timeToMinutes(apt.time);
            const service = services.find(s => s.id === apt.serviceId);
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
                Sistema de Bloqueios V2 Ativo (Seg/Dom + Intervalos)
            </div>
            <header className="mb-10 lg:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 lg:px-12 pt-6">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">
                        Minha <span className="text-[#D4AF37]">Disponibilidade</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Bloqueie seus horários recorrentes ou datas específicas</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1 px-4 py-2 bg-black/40 border border-[#1f1f1f] rounded-xl mr-4">
                        <label className="text-[8px] font-black uppercase text-gray-600">Visualizar Agendamentos de:</label>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-xs font-bold text-[#D4AF37] outline-none"
                        />
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
                                                    {(day === "Segunda" || day === "Domingo" || (shopConfig?.workingHours as any)?.[day]?.closed) && (
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
                                                const dayConfig = (shopConfig?.workingHours as any)?.[day];
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

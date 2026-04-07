"use client";

import React, { useState } from 'react';
import {
    CalendarX,
    User,
    Clock,
    AlertTriangle,
    History as HistoryIcon,
    MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber, Appointment } from '@/context/BarberContext';

// Mock Data
export default function AppointmentsPage() {
    const { appointments, currentUser, updateAppointmentStatus } = useBarber();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const [isCanceling, setIsCanceling] = useState(false);

    const handleCancel = async (id: string) => {
        setIsCanceling(true);
        try {
            await updateAppointmentStatus(id, 'cancelado');
            setCancelingId(null);
            alert('Agendamento cancelado com sucesso.');
        } catch (error) {
            console.error(error);
            alert('Erro ao cancelar agendamento.');
        } finally {
            setIsCanceling(false);
        }
    };

    const userAppointments = appointments.filter((a: Appointment) => a.clientId === currentUser?.id);
    const upcoming = userAppointments.filter((a: Appointment) => a.status === 'agendado' || a.status === 'confirmado');
    const past = userAppointments.filter((a: Appointment) => a.status === 'concluido' || a.status === 'cancelado');

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Meus <span className="text-[var(--color-primary-gold)]">Agendamentos</span></h1>
                    <p className="text-gray-500 text-sm">Visualize e gerencie todos os seus horários.</p>
                </div>

                <div className="flex bg-[var(--color-dark-card)] p-1 rounded-2xl border border-[var(--color-dark-border)]">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-[var(--color-primary-gold)] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        PRÓXIMOS
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-[var(--color-primary-gold)] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        PASSADOS
                    </button>
                </div>
            </header>

            <div className="space-y-6">
                {activeTab === 'upcoming' ? (
                    upcoming.length > 0 ? (
                        upcoming.map((apt) => (
                            <div key={apt.id} className="group relative overflow-hidden bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-6 md:p-8 hover:border-[var(--color-primary-gold)]/30 transition-all duration-300 shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-10 -mt-10" />

                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                    <div className="flex gap-6">
                                        <div className="hidden sm:flex flex-col items-center justify-center bg-black/40 border border-[var(--color-dark-border)] w-20 h-20 rounded-3xl group-hover:border-[var(--color-primary-gold)]/30 transition-colors">
                                            <p className="text-lg font-black text-white">{apt.date?.split('-')?.[2] || '?'}</p>
                                            <p className="text-[9px] text-[var(--color-primary-gold)] font-black uppercase tracking-widest">SET</p>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold">{apt.serviceName}</h3>
                                                <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">{apt.status}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-gray-400">
                                                <p className="flex items-center gap-2"><User className="w-4 h-4 text-[var(--color-primary-gold)]" /> {apt.barberName}</p>
                                                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--color-primary-gold)]" /> {apt.time}</p>
                                                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--color-primary-gold)]" /> Unidade Central</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t border-white/5 md:border-t-0">
                                        <div className="text-right mr-4 mb-4 md:mb-0 lg:mb-0">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold text-nowrap">Valor Final</p>
                                            <p className="text-xl font-black text-white">R$ {apt.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-11 px-6 border-[var(--color-dark-border)] text-gray-400 hover:text-white hover:border-white/20 uppercase text-[10px] font-black tracking-widest">
                                                REAGENDAR
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCancelingId(apt.id)}
                                                className="flex-1 sm:flex-none h-11 px-6 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white uppercase text-[10px] font-black tracking-widest"
                                            >
                                                CANCELAR
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[var(--color-dark-card)] rounded-3xl border border-dashed border-[var(--color-dark-border)]">
                            <CalendarX className="w-16 h-16 text-gray-700 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Nenhum agendamento futuro</h3>
                            <p className="text-gray-500 text-sm mb-8">Parece que você ainda não agendou seu próximo corte.</p>
                            <Button className="bg-[var(--color-primary-gold)] text-black px-10 h-14 font-black tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.2)]">AGENDAR AGORA</Button>
                        </div>
                    )
                ) : (
                    <div className="space-y-4">
                        {past.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-6 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-2xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-gray-500">
                                        <HistoryIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-white">{apt.serviceName}</p>
                                            <p className="text-[10px] text-gray-500">{apt.date}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Com {apt.barberName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-bold text-gray-400">R$ {apt.price.toFixed(2)}</span>
                                    <Button variant="outline" size="sm" className="h-10 px-4 border-white/5 text-[10px] uppercase font-black tracking-widest hover:border-[var(--color-primary-gold)]">REPETIR</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setCancelingId(null)} />
                    <div className="relative bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-8 max-w-md w-full animate-scale-in">
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Deseja cancelar?</h3>
                                <p className="text-gray-400 text-sm italic">&quot;O cancelamento é gratuito em até 24h, mas ficaremos tristes em não vê-lo(a).&quot;</p>
                            </div>
                            <div className="flex items-center gap-4 w-full">
                                <Button
                                    className="flex-1 bg-red-600 hover:bg-red-700 h-14 font-black tracking-widest"
                                    onClick={() => handleCancel(cancelingId)}
                                >
                                    CONFIRMAR
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-14 font-black tracking-widest border-[var(--color-dark-border)]"
                                    onClick={() => setCancelingId(null)}
                                >
                                    CANCELAR
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

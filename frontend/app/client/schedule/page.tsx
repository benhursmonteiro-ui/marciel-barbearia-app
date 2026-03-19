"use client";

import React, { useState, useMemo } from 'react';
import {
    Scissors,
    User,
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Star,
    ShieldCheck,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/Calendar';
import { useBarber, Service, Barber, ShopConfig } from '@/context/BarberContext';
import { useRouter } from 'next/navigation';

export default function SchedulePage() {
    const router = useRouter();
    const { barbers, services, addAppointment, currentUser, appointments, shopConfig } = useBarber();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Utility functions moved inside or imported if available
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const getDurationMinutes = (durationStr: string): number => {
        if (!durationStr) return 30;
        const matches = durationStr.match(/\d+/);
        return matches ? parseInt(matches[0]) : 30;
    };

    // Filter available slots
    const availableSlots = useMemo(() => {
        if (!selectedDate || !selectedBarber || !shopConfig) return [];

        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        
        const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const dayName = dayNames[dateObj.getDay()];
        const dayConfig = shopConfig.workingHours?.[dayName];
        
        let generatedSlots: string[] = [];
        if (dayConfig && !dayConfig.closed) {
            let [startH, startM] = (dayConfig.start || "08:00").split(':').map(Number);
            let [endH, endM] = (dayConfig.end || "19:00").split(':').map(Number);
            let curH = startH, curM = startM;
            while (curH < endH || (curH === endH && curM <= endM)) {
                generatedSlots.push(`${curH.toString().padStart(2, '0')}:${curM.toString().padStart(2, '0')}`);
                curM += 30; if (curM >= 60) { curH++; curM -= 60; }
            }
        }

        // Check if today is a non-working day (Mon/Sun)
        const isNonWorkingDay = dayName === "Segunda" || dayName === "Domingo";

        // Filter appointments for the selected day and barber
        const relevantAppointments = appointments.filter(apt => 
            apt.date === selectedDate && 
            apt.barberId === selectedBarber.id && 
            ['agendado', 'confirmado', 'em atendimento'].includes(apt.status?.toLowerCase() || '')
        );

        const globalBlocked = (shopConfig.blockedSlots || []).filter(s => s.startsWith(`${dayName}-`)).map(s => s.split('-')[1]);
        const individualBlocked = (selectedBarber.blockedSlots || []).filter(s => s.startsWith(`${dayName}-`)).map(s => s.split('-')[1]);

        // Past times for today
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
        const isToday = selectedDate === todayStr;
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

        return generatedSlots.map(t => {
            const slotMin = timeToMinutes(t);
            
            // 1. Check if occupied by an appointment (including duration)
            const isOccupiedByAppointment = relevantAppointments.some(apt => {
                const appMin = timeToMinutes(apt.time);
                // We find the service to get its duration
                const service = services.find(s => s.id === apt.serviceId);
                const durMin = getDurationMinutes(service?.duration || "30 min");
                return slotMin >= appMin && slotMin < (appMin + durMin);
            });

            // 2. Business rules
            const isTaken = 
                (isToday && slotMin <= currentTotalMinutes) || 
                isNonWorkingDay ||
                isOccupiedByAppointment || 
                globalBlocked.includes(t) || 
                individualBlocked.includes(t);

            return {
                time: t,
                taken: isTaken
            };
        });
    }, [selectedDate, selectedBarber, appointments, shopConfig, services]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const isStepValid = () => {
        if (step === 1) return !!selectedService;
        if (step === 2) return !!selectedBarber;
        if (step === 3) return !!selectedDate;
        if (step === 4) return !!selectedTime;
        return true;
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleConfirm = async () => {
        if (!currentUser || !selectedBarber || !selectedService) {
            if (!currentUser) router.push('/');
            return;
        }

        setIsSaving(true);
        try {
            await addAppointment({
                clientId: currentUser.id,
                clientName: currentUser.name,
                barberId: selectedBarber.id,
                barberName: selectedBarber.name,
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                price: selectedService.price,
                date: selectedDate,
                time: selectedTime,
                status: 'agendado'
            });

            router.push('/client');
        } catch (error) {
            console.error(error);
            alert("Erro ao confirmar agendamento. Tente novamente.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderStepNumbers = () => (
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto overflow-hidden">
            {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step >= num
                        ? 'bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-black border-[var(--color-dark-border)] text-gray-600'
                        }`}>
                        {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
                    </div>
                </div>
            ))}
            {/* Progress line */}
            <div className="absolute top-[138px] left-[10%] right-[10%] h-[2px] bg-[var(--color-dark-border)] -z-0 hidden md:block" />
            <div
                className="absolute top-[138px] left-[10%] h-[2px] bg-[var(--color-primary-gold)] transition-all duration-700 -z-0 hidden md:block"
                style={{ width: `${(step - 1) * 20}%` }}
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Agendar <span className="text-[var(--color-primary-gold)]">Horário (V2)</span></h1>
                <p className="text-gray-500 text-sm italic">Siga os passos abaixo para reservar seu momento premium.</p>
            </header>

            {renderStepNumbers()}

            <div className="flex-1 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-gold)]/20 to-transparent" />

                {/* Step 1: Services */}
                {step === 1 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Scissors className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha o Serviço</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedService(s)}
                                    className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${selectedService?.id === s.id
                                        ? 'bg-[var(--color-primary-gold-dim)] border-[var(--color-primary-gold)]'
                                        : 'bg-black/40 border-[var(--color-dark-border)] hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl">{s.icon || '💈'}</span>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-white tracking-tight">{s.name}</p>
                                                {s.popular && <span className="text-[8px] bg-[var(--color-primary-gold)] text-black font-black px-1 rounded">POPULAR</span>}
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.duration}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${selectedService?.id === s.id ? 'text-[var(--color-primary-gold)]' : 'text-gray-400'}`}>
                                        R$ {s.price.toFixed(2)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Barbers */}
                {step === 2 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha o Barbeiro</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {barbers.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBarber(b)}
                                    className={`group relative overflow-hidden flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${selectedBarber?.id === b.id
                                        ? 'bg-[var(--color-primary-gold-dim)] border-[var(--color-primary-gold)] shadow-lg'
                                        : 'bg-black/40 border-[var(--color-dark-border)] hover:border-white/10'
                                        }`}
                                >
                                    <div className="relative mb-4">
                                        <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[var(--color-primary-gold)] text-4xl">
                                            👤
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-black border border-[var(--color-primary-gold)] text-[var(--color-primary-gold)] text-[10px] px-1.5 py-0.5 rounded-lg flex items-center gap-1 font-bold">
                                            <Star className="w-2 h-2 fill-current" /> {b.rating}
                                        </div>
                                    </div>
                                    <p className="font-bold text-white mb-1">{b.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center">{b.specialty}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Date */}
                {step === 3 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CalendarIcon className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha a Data</h2>
                        </div>

                        <div className="bg-black/40 border border-[var(--color-dark-border)] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <Calendar
                                selectedDate={selectedDate}
                                onDateSelect={(dateStr) => setSelectedDate(dateStr)}
                                disabledDates={(date) => {
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    
                                    // Clone date and set to noon to avoid timezone issues when comparing timestamps
                                    const checkDate = new Date(date);
                                    checkDate.setHours(12, 0, 0, 0);
                                    const timestamp = checkDate.getTime();
                                    
                                    const isShopHoliday = (shopConfig.holidays || []).includes(timestamp);
                                    const isBarberHoliday = (selectedBarber?.holidays || []).includes(timestamp);
                                    
                                    const dayNum = date.getDay();
                                    const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                                    const dayName = dayNames[dayNum];
                                    const isShopClosed = dayNum === 0 || dayNum === 1 || shopConfig.workingHours?.[dayName]?.closed;

                                    return isPast || !!isShopClosed || isShopHoliday || isBarberHoliday;
                                }}
                                className="!bg-transparent !border-none !shadow-none !p-4"
                            />

                            <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex flex-wrap gap-6 items-center justify-center text-[9px] font-black uppercase tracking-widest text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary-gold)]" /> Selecionado
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-800" /> Indisponível (Fechado/Passado)
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Time */}
                {step === 4 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha o Horário</h2>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                            {availableSlots.map(({ time: t, taken }) => (
                                <button
                                    key={t}
                                    disabled={taken}
                                    onClick={() => setSelectedTime(t)}
                                    className={`p-4 rounded-xl border-2 font-bold transition-all ${selectedTime === t
                                        ? 'bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-black shadow-lg'
                                        : taken 
                                            ? 'bg-red-500/10 border-red-500/10 text-red-500/40 cursor-not-allowed line-through'
                                            : 'bg-black border-[var(--color-dark-border)] text-white hover:border-white/10'
                                        }`}
                                >
                                    {t}
                                    {taken && <span className="block text-[8px] mt-1 font-black opacity-60">OCUPADO</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 5: Confirm */}
                {step === 5 && (
                    <div className="animate-fade-in-up space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Confirmar Agendamento</h2>
                        </div>

                        <div className="bg-black/60 rounded-3xl border border-[var(--color-dark-border)] p-8 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <Scissors className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Serviço</p>
                                            <p className="text-lg font-bold">{selectedService?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Barbeiro</p>
                                            <p className="text-lg font-bold">{selectedBarber?.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Data & Horário</p>
                                            <p className="text-lg font-bold">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <Info className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Valor Total</p>
                                            <p className="text-2xl font-black text-[var(--color-primary-gold)]">R$ {selectedService?.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-[var(--color-dark-border)]">
                    {step > 1 ? (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
                        >
                            <ChevronLeft className="w-4 h-4" /> VOLTAR
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 5 ? (
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="bg-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold-hover)] text-black px-8 py-3 rounded-xl font-black text-xs tracking-widest gap-2"
                        >
                            PRÓXIMO PASSO <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold-hover)] text-black px-12 py-4 rounded-2xl font-black text-sm tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
                            onClick={handleConfirm}
                            isLoading={isSaving}
                        >
                            CONFIRMAR AGENDAMENTO
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

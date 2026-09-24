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
    Info,
    Phone,
    UserCheck,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar } from '@/components/ui/Calendar';
import { useBarber, Service, Barber, ShopConfig } from '@/context/BarberContext';
import { useRouter } from 'next/navigation';
import { timeToMinutes, getDurationMinutes, getTodayLocalDateStr } from '@/lib/timeUtils';

export default function SchedulePage() {
    const router = useRouter();
    const { barbers, services, addAppointment, currentUser, appointments, shopConfig } = useBarber();
    
    // Step state: 1=Identificação, 2=Serviço, 3=Barbeiro, 4=Data, 5=Horário, 6=Confirmação
    const [step, setStep] = useState(1);

    // Form states
    const [clientName, setClientName] = useState(currentUser?.name || '');
    const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Filter available slots
    const availableSlots = useMemo(() => {
        if (!selectedDate || !selectedBarber || !shopConfig || !selectedService) return [];

        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        
        const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const dayName = dayNames[dateObj.getDay()];
        const dayConfig = (selectedBarber as any)?.workingHours?.[dayName] || shopConfig.workingHours?.[dayName];
        
        let generatedSlots: string[] = [];
        let shopEndMinutes = 0;
        if (dayConfig && !dayConfig.closed) {
            let [startH, startM] = (dayConfig.start || "08:00").split(':').map(Number);
            let [endH, endM] = (dayConfig.end || "19:00").split(':').map(Number);
            shopEndMinutes = endH * 60 + endM;
            let curH = startH, curM = startM;
            while (curH < endH || (curH === endH && curM <= endM)) {
                generatedSlots.push(`${curH.toString().padStart(2, '0')}:${curM.toString().padStart(2, '0')}`);
                curM += 30; if (curM >= 60) { curH++; curM -= 60; }
            }
        }

        const isNonWorkingDay = dayName === "Segunda" || dayName === "Domingo";

        const relevantAppointments = appointments.filter(apt => 
            apt.date === selectedDate && 
            String(apt.barberId) === String(selectedBarber.id) && 
            ['agendado', 'confirmado', 'em atendimento', 'concluido'].includes(apt.status?.toLowerCase() || '')
        );

        const globalBlocked = (shopConfig.blockedSlots || []).filter(s => s.startsWith(`${dayName}-`)).map(s => s.split('-')[1]);
        const individualBlocked = (selectedBarber.blockedSlots || []).filter(s => s.startsWith(`${dayName}-`)).map(s => s.split('-')[1]);

        const now = new Date();
        const todayStr = getTodayLocalDateStr();
        const isToday = selectedDate === todayStr;
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

        const baseSlots = generatedSlots.map(t => {
            const slotMin = timeToMinutes(t);
            
            const isOccupiedByAppointment = relevantAppointments.some(apt => {
                const appMin = timeToMinutes(apt.time);
                const service = services.find(s => String(s.id) === String(apt.serviceId) || s.name === apt.serviceName);
                const durMin = getDurationMinutes(service?.duration || "30 min");
                return slotMin >= appMin && slotMin < (appMin + durMin);
            });

            const isTaken = 
                (isToday && slotMin <= currentTotalMinutes) || 
                isNonWorkingDay ||
                isOccupiedByAppointment || 
                globalBlocked.includes(t) || 
                individualBlocked.includes(t);

            return {
                time: t,
                minutes: slotMin,
                taken: isTaken
            };
        });

        const selectedDuration = getDurationMinutes(selectedService.duration || "30 min");

        return baseSlots.map(slot => {
            if (slot.taken) return { time: slot.time, taken: true };

            const endTime = slot.minutes + selectedDuration;

            if (slot.minutes > shopEndMinutes) return { time: slot.time, taken: true };

            const hasConflict = baseSlots.some(otherSlot => 
               otherSlot.minutes > slot.minutes && 
               otherSlot.minutes < endTime && 
               otherSlot.taken
            );

            return {
                time: slot.time,
                taken: hasConflict
            };
        });
    }, [selectedDate, selectedBarber, appointments, shopConfig, services, selectedService]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const isStepValid = () => {
        if (step === 1) return clientName.trim().length >= 3 && clientPhone.trim().length >= 8;
        if (step === 2) return !!selectedService;
        if (step === 3) return !!selectedBarber;
        if (step === 4) return !!selectedDate;
        if (step === 5) return !!selectedTime;
        return true;
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleConfirm = async () => {
        if (!clientName || !clientPhone || !selectedBarber || !selectedService) {
            alert("Por favor, preencha seus dados de contato e selecione todas as opções do agendamento.");
            setStep(1);
            return;
        }

        setIsSaving(true);
        try {
            await addAppointment({
                clientId: `cli-${Date.now()}`,
                clientName: clientName,
                clientPhone: clientPhone,
                barberId: selectedBarber.id,
                barberName: selectedBarber.name,
                serviceId: selectedService.id,
                serviceName: selectedService.name,
                price: selectedService.price,
                date: selectedDate,
                time: selectedTime,
                status: 'agendado'
            });

            // Redirecionamento para WhatsApp de Confirmação
            const message = `Olá! Gostaria de confirmar meu agendamento:
👤 *Cliente:* ${clientName}
📱 *Telefone:* ${clientPhone}
📌 *Serviço:* ${selectedService.name}
💈 *Barbeiro:* ${selectedBarber.name}
📅 *Data:* ${selectedDate.split('-').reverse().join('/')}
🕒 *Horário:* ${selectedTime}
💰 *Valor:* R$ ${selectedService.price.toFixed(2)}

_Confirmado pelo app Marciel BarberShop_`;

            const waNumber = (shopConfig?.whatsapp || "(89) 9985-0601").replace(/\D/g, '');
            const waLink = `https://wa.me/55${waNumber}?text=${encodeURIComponent(message)}`;
            
            window.location.href = waLink;
        } catch (error: any) {
            console.error(error);
            const errStr = error?.message || '';
            if (errStr.includes('idx_prevent_double_booking') || errStr.includes('duplicate key') || errStr.includes('já foi reservado')) {
                alert("⚠️ Este horário já foi reservado por outro cliente!\n\nPor favor, selecione outro horário disponível.");
                setSelectedTime('');
                setStep(5);
            } else {
                alert(errStr || "Erro ao confirmar agendamento. Tente novamente.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    const renderStepNumbers = () => (
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto overflow-hidden px-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex flex-col items-center relative z-10">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 text-xs md:text-sm font-bold transition-all duration-500 ${step >= num
                        ? 'bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-black border-[var(--color-dark-border)] text-gray-600'
                        }`}>
                        {step > num ? <CheckCircle2 className="w-5 h-5" /> : num}
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold uppercase mt-1 hidden md:block">
                        {num === 1 ? 'Dados' : num === 2 ? 'Serviço' : num === 3 ? 'Barbeiro' : num === 4 ? 'Data' : num === 5 ? 'Horário' : 'Confirmar'}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Agendar <span className="text-[var(--color-primary-gold)]">Horário</span></h1>
                <p className="text-gray-400 text-sm">Sem necessidade de login! Preencha seus dados e escolha seu horário.</p>
            </header>

            {renderStepNumbers()}

            <div className="flex-1 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-gold)]/20 to-transparent" />

                {/* Step 1: Client Info */}
                {step === 1 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <UserCheck className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <div>
                                <h2 className="text-xl font-bold">Seus Dados de Contato</h2>
                                <p className="text-xs text-gray-400">Insira seu nome e WhatsApp para confirmar o agendamento</p>
                            </div>
                        </div>

                        <div className="max-w-md space-y-5">
                            <Input
                                label="Seu Nome Completo"
                                placeholder="Ex: João da Silva"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                icon={<User className="w-4 h-4" />}
                            />

                            <Input
                                label="Seu Telefone / WhatsApp"
                                placeholder="Ex: (89) 99999-9999"
                                value={clientPhone}
                                onChange={(e) => setClientPhone(e.target.value)}
                                icon={<Phone className="w-4 h-4" />}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Services */}
                {step === 2 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Scissors className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha o Serviço</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedService(s);
                                        setStep(3);
                                    }}
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

                {/* Step 3: Barbers */}
                {step === 3 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <User className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha o Barbeiro</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {barbers.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => {
                                        setSelectedBarber(b);
                                        setStep(4);
                                    }}
                                    className={`group relative overflow-hidden flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-300 ${selectedBarber?.id === b.id
                                        ? 'bg-[var(--color-primary-gold-dim)] border-[var(--color-primary-gold)] shadow-lg'
                                        : 'bg-black/40 border-[var(--color-dark-border)] hover:border-white/10'
                                        }`}
                                >
                                    <div className="relative mb-4">
                                        <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-[var(--color-primary-gold)] text-4xl overflow-hidden">
                                            {b.photo ? <img src={b.photo} alt={b.name} className="w-full h-full object-cover" /> : '👤'}
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

                {/* Step 4: Date */}
                {step === 4 && (
                    <div className="animate-fade-in-up space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CalendarIcon className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Escolha a Data</h2>
                        </div>

                        <div className="bg-black/40 border border-[var(--color-dark-border)] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <Calendar
                                selectedDate={selectedDate}
                                onDateSelect={(dateStr) => {
                                    setSelectedDate(dateStr);
                                    setStep(5);
                                }}
                                disabledDates={(date) => {
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    
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

                {/* Step 5: Time */}
                {step === 5 && (
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
                                    onClick={() => {
                                        setSelectedTime(t);
                                        setStep(6);
                                    }}
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

                {/* Step 6: Confirm */}
                {step === 6 && (
                    <div className="animate-fade-in-up space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-[var(--color-primary-gold)] w-6 h-6" />
                            <h2 className="text-xl font-bold">Confirmar Agendamento</h2>
                        </div>

                        <div className="bg-black/60 rounded-3xl border border-[var(--color-dark-border)] p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <UserCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Cliente</p>
                                            <p className="text-lg font-bold">{clientName}</p>
                                            <p className="text-xs text-gray-400">{clientPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <Scissors className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Serviço</p>
                                            <p className="text-lg font-bold">{selectedService?.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Barbeiro</p>
                                            <p className="text-lg font-bold">{selectedBarber?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[var(--color-primary-gold)]">
                                            <CalendarIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-black">Data & Horário</p>
                                            <p className="text-lg font-bold">{selectedDate.split('-').reverse().join('/')} às {selectedTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">Valor Total</p>
                                    <p className="text-2xl font-black text-[var(--color-primary-gold)]">R$ {selectedService?.price.toFixed(2)}</p>
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
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
                        >
                            <ChevronLeft className="w-4 h-4" /> VOLTAR
                        </button>
                    ) : (
                        <div />
                    )}

                    {step < 6 ? (
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid()}
                            className="bg-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold-hover)] text-black px-8 py-3 rounded-xl font-black text-xs tracking-widest gap-2 disabled:opacity-30"
                        >
                            PRÓXIMO PASSO <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-[var(--color-primary-gold)] hover:bg-[var(--color-primary-gold-hover)] text-black px-12 py-4 rounded-2xl font-black text-sm tracking-widest shadow-[0_10px_30px_rgba(212,175,55,0.3)] gap-2"
                            onClick={handleConfirm}
                            isLoading={isSaving}
                        >
                            <MessageSquare className="w-5 h-5" /> CONFIRMAR NO WHATSAPP
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

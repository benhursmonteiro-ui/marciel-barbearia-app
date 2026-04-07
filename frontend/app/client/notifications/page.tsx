"use client";

import React, { useState } from 'react';
import {
    Bell,
    CalendarCheck,
    TicketPercent,
    Star,
    X,
    MoreVertical,
    Scissors,
    User,
    Compass,
    Clock,
    CheckCircle2,
    ChevronRight,
    Trash2,
    Filter,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

// Mock Notifications Data
const initialNotifications = [
    {
        id: 1,
        type: 'appointment',
        title: 'Agendamento Confirmado!',
        message: 'Seu agendamento para Corte + Barba no dia 15/09 às 10:30 foi confirmado com sucesso.',
        time: 'há 10 minutos',
        read: false,
        icon: <CalendarCheck className="w-5 h-5" />
    },
    {
        id: 2,
        type: 'promo',
        title: 'Corte + Barba por R$ 69',
        message: 'Aproveite nossa promoção da semana! Válida exclusivamente para agendamentos de Terça a Quinta.',
        time: 'há 2 horas',
        read: false,
        icon: <TicketPercent className="w-5 h-5" />
    },
    {
        id: 3,
        type: 'reminder',
        title: 'Lembrete de Atendimento',
        message: 'Olá Carlos! Não esqueça do seu horário amanhã às 10:30 na unidade central.',
        time: 'há 1 dia',
        read: true,
        icon: <Clock className="w-5 h-5" />
    },
    {
        id: 4,
        type: 'system',
        title: 'Nova Funcionalidade',
        message: 'Agora você pode salvar seus barbeiros favoritos para agendamentos ainda mais rápidos!',
        time: 'há 3 dias',
        read: true,
        icon: <Award className="w-5 h-5" />
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const deleteNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const filtered = activeTab === 'all' ? notifications : notifications.filter(n => !n.read);

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Central de <span className="text-[var(--color-primary-gold)]">Notificações</span></h1>
                    <p className="text-gray-500 text-sm">Fique por dentro de suas reservas, avisos e ofertas.</p>
                </div>
                {notifications.some(n => !n.read) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={markAllRead}
                        className="h-10 px-6 rounded-2xl border-white/5 text-[10px] uppercase font-black tracking-widest hover:border-[var(--color-primary-gold)]/50"
                    >
                        MARCAR TODAS COMO LIDAS
                    </Button>
                )}
            </header>

            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-gold)]/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                {/* Tabs */}
                <div className="flex items-center gap-6 mb-10 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`relative pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                            }`}
                    >
                        TODAS
                        {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary-gold)] shadow-[0_0_10px_rgba(212,175,55,0.4)]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('unread')}
                        className={`relative pb-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'unread' ? 'text-white' : 'text-gray-600 hover:text-gray-400'
                            }`}
                    >
                        NÃO LIDAS
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-[var(--color-primary-gold)] text-black text-[9px] rounded-md font-black">{notifications.filter(n => !n.read).length}</span>
                        )}
                        {activeTab === 'unread' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--color-primary-gold)] shadow-[0_0_10px_rgba(212,175,55,0.4)]" />}
                    </button>
                </div>

                <div className="space-y-4">
                    {filtered.length > 0 ? (
                        filtered.map((n) => (
                            <div
                                key={n.id}
                                className={`group relative flex items-start gap-5 p-6 rounded-3xl border-2 transition-all duration-300 ${!n.read
                                    ? 'bg-[var(--color-primary-gold)]/5 border-[var(--color-primary-gold)]/20 shadow-inner'
                                    : 'bg-black/40 border-white/5 opacity-70 grayscale-[0.5] border-dashed hover:opacity-100'
                                    }`}
                            >
                                <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all ${!n.read
                                    ? 'bg-[var(--color-primary-gold)]/20 text-[var(--color-primary-gold)]'
                                    : 'bg-white/5 text-gray-500 group-hover:bg-white/10 group-hover:text-gray-400'
                                    }`}>
                                    {n.icon}
                                </div>
                                <div className="flex-1 min-w-0 pr-10">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors truncate">{n.title}</h3>
                                        {!n.read && <div className="w-1.5 h-1.5 bg-[var(--color-primary-gold)] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,1)]" />}
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2 md:line-clamp-none italic font-medium">{n.message}</p>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{n.time}</p>
                                </div>

                                <div className="absolute right-6 top-6 flex flex-col gap-2 scale-0 group-hover:scale-100 transition-all origin-right">
                                    <button
                                        onClick={() => deleteNotification(n.id)}
                                        className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-600/20 hover:bg-red-600 hover:text-white transition-colors shadow-2xl"
                                        title="Remover"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    {!n.read && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="p-2.5 bg-emerald-600/10 text-emerald-500 rounded-xl border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-colors shadow-2xl"
                                            title="Lido"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-black/40 border border-[var(--color-dark-border)] border-dashed rounded-3xl">
                            <Bell className="w-16 h-16 text-gray-800 mb-6 opacity-40" />
                            <h3 className="text-xl font-bold mb-1">Vazio por aqui</h3>
                            <p className="text-gray-600 text-sm font-medium">Tudo limpo! Você não tem novas notificações.</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest italic max-w-xs text-center md:text-left">Dica: Ative as notificações push em Configurações para nunca perder um lembrete.</p>
                    <Link href="/client/settings">
                        <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/5 uppercase text-[10px] font-black tracking-widest hover:border-white/20">
                            ABRIR CONFIGURAÇÕES <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

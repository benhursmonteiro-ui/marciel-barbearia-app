"use client";

import React, { useState, useEffect } from 'react';
import {
    Bell,
    CalendarCheck,
    XCircle,
    Search,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBarber, MBSNotification } from '@/context/BarberContext';

export default function AdminNotifications() {
    const { notifications, currentUser, markNotificationAsRead } = useBarber();
    const [userNotifications, setUserNotifications] = useState<MBSNotification[]>([]);

    useEffect(() => {
        if (currentUser) {
            setUserNotifications(notifications.filter(n => n.userId === currentUser.id));
        }
    }, [notifications, currentUser]);

    const markAllRead = () => {
        userNotifications.forEach(n => {
            if (!n.read) markNotificationAsRead(n.id);
        });
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'novo_agendamento': return <CalendarCheck className="w-5 h-5" />;
            case 'novo_agendamento_admin': return <Bell className="w-5 h-5 text-[#D4AF37]" />;
            case 'cancelamento': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Bell className="w-5 h-5" />;
        }
    };

    return (
        <div className="p-6 lg:p-12 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Centro de <span className="text-[#D4AF37]">Notificações</span></h1>
                    <p className="text-gray-500 text-sm">Acompanhe todos os movimentos da sua barbearia em tempo real.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={markAllRead}
                        variant="outline"
                        className="h-12 px-6 rounded-xl border-white/5 uppercase text-[10px] font-black tracking-widest hover:border-[#D4AF37]/50 transition-all"
                    >
                        MARCAR TODAS COMO LIDAS
                    </Button>
                </div>
            </header>

            <div className="max-w-4xl space-y-4">
                {userNotifications.length > 0 ? (
                    userNotifications.map((n) => (
                        <div
                            key={n.id}
                            className={`group relative flex items-start gap-6 p-8 rounded-[2rem] border transition-all duration-300 ${!n.read
                                ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20 shadow-xl'
                                : 'bg-black/40 border-white/5 opacity-60 border-dashed hover:opacity-100'
                                }`}
                        >
                            <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${!n.read
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                : 'bg-white/5 text-gray-700'
                                }`}>
                                {getIcon(n.type)}
                            </div>

                            <div className="flex-1 min-w-0 pr-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white tracking-tight">{n.title}</h3>
                                    {!n.read && <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]" />}
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4 italic font-medium">{n.message}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString('pt-BR')} {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                                    {!n.read && (
                                        <button 
                                            onClick={() => markNotificationAsRead(n.id)}
                                            className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline"
                                        >
                                            Marcar como lida
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-[#111] border border-[#1f1f1f] border-dashed rounded-[3rem] p-20 text-center space-y-6">
                        <Bell className="w-16 h-16 text-gray-800 mx-auto opacity-20" />
                        <h3 className="text-xl font-bold text-gray-600">Sem notificações por enquanto</h3>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto">Novos agendamentos e cancelamentos aparecerão aqui para você acompanhar sua equipe.</p>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

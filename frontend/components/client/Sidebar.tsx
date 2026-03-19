"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CalendarCheck,
    CalendarPlus,
    History,
    Star,
    TicketPercent,
    UserCircle,
    Bell,
    LogOut,
    Scissors,
    MessageSquare,
    Phone
} from 'lucide-react';

import { useBarber } from '@/context/BarberContext';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/client', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/client/schedule', label: 'Agendar Horário', icon: CalendarPlus },
    { href: '/client/appointments', label: 'Meus Agendamentos', icon: CalendarCheck },
    { href: '/client/history', label: 'Histórico', icon: History },
    { href: '/client/rate', label: 'Avaliar', icon: Star },
    { href: '/client/promotions', label: 'Promoções', icon: TicketPercent },
    { href: '/client/profile', label: 'Meu Perfil', icon: UserCircle },
    { href: '/client/notifications', label: 'Notificações', icon: Bell },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, shopConfig } = useBarber();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-dark-card)] overflow-hidden">
            {/* Logo area */}
            <div className="p-8 mb-4">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-black border border-[var(--color-primary-gold)] rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        <Scissors className="text-[var(--color-primary-gold)] w-6 h-6" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-[var(--color-primary-gold-dim)] text-[var(--color-primary-gold)] border border-[var(--color-primary-gold)]/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className={`text-sm font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Support section */}
            <div className="px-6 mb-4">
                <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-3">Precisa de ajuda?</p>
                    <div className="flex flex-col gap-2">
                        {(() => {
                            const waPhone = shopConfig.whatsapp.replace(/\D/g, '');
                            const finalWa = (waPhone.length >= 12 && waPhone.startsWith('55')) ? waPhone : `55${waPhone}`;
                            return (
                                <a 
                                    href={`https://wa.me/${finalWa}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <MessageSquare className="w-3 h-3" /> WHATSAPP
                                </a>
                            );
                        })()}
                        <a 
                            href={`tel:${shopConfig.phone}`}
                            className="flex items-center gap-3 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <Phone className="w-3 h-3" /> LIGAR
                        </a>
                    </div>
                </div>
            </div>

            {/* Logout/Footer */}
            <div className="p-4 mt-auto border-t border-[var(--color-dark-border)]">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-300 group text-left"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Sair da Conta</span>
                </button>
            </div>
        </div>
    );
}

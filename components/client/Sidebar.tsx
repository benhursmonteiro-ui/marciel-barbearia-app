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
        <div className="flex flex-col h-full bg-[#0d111a] border-r border-white/5 overflow-hidden">
            {/* Logo area */}
            <div className="p-6 mb-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
                        <Scissors className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                        <h2 className="text-base font-extrabold tracking-tight text-white leading-none">Marciel</h2>
                        <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">Área do Cliente</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto no-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'text-slate-950 scale-105' : 'text-amber-400 group-hover:scale-110'}`} />
                            <span className="text-sm tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Support section */}
            <div className="px-4 mb-3">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2">Precisa de ajuda?</p>
                    <div className="flex flex-col gap-1.5">
                        {(() => {
                            const waPhone = shopConfig?.whatsapp ? shopConfig.whatsapp.replace(/\D/g, '') : '';
                            const finalWa = (waPhone.length >= 12 && waPhone.startsWith('55')) ? waPhone : `55${waPhone}`;
                            return (
                                <a 
                                    href={`https://wa.me/${finalWa}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                                >
                                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Suporte
                                </a>
                            );
                        })()}
                        <a 
                            href={`tel:${shopConfig?.phone || ''}`}
                            className="flex items-center gap-2 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5" /> Ligar para a Barbearia
                        </a>
                    </div>
                </div>
            </div>

            {/* Logout/Footer */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-xs uppercase tracking-widest group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Sair da Conta</span>
                </button>
            </div>
        </div>
    );
}

"use client";

import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    History,
    DollarSign,
    Star,
    User,
    LogOut,
    X,
    Scissors,
    Clock,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useBarber } from '@/context/BarberContext';

const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/barber' },
    { icon: <Calendar size={20} />, label: 'Minha Agenda', href: '/barber/schedule' },
    { icon: <Clock size={20} />, label: 'Horários', href: '/barber/horarios' },
    { icon: <History size={20} />, label: 'Histórico', href: '/barber/history' },
    { icon: <DollarSign size={20} />, label: 'Comissões', href: '/barber/commissions' },
    { icon: <Star size={20} />, label: 'Avaliações', href: '/barber/ratings' },
    { icon: <BarChart3 size={20} />, label: 'Relatórios', href: '/barber/reports' },
    { icon: <User size={20} />, label: 'Meu Perfil', href: '/barber/profile' },
];

export default function BarberSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, currentUser } = useBarber();

    const isAdmin = currentUser?.role === 'admin';
    const finalMenuItems = isAdmin 
        ? [{ icon: <BarChart3 size={20} />, label: 'Painel Admin', href: '/admin' }, ...menuItems]
        : menuItems;

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const [touchStart, setTouchStart] = React.useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = touchStart - currentTouch;

        // If swipe left more than 50px, close
        if (diff > 50) {
            onClose();
            setTouchStart(null);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

        <aside 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className={`
            fixed top-0 left-0 h-full w-72 bg-[#0d111a] border-r border-white/5 z-50
            transition-transform duration-500 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            <div className="flex flex-col h-full p-6 overflow-y-auto no-scrollbar">
                {/* Header/Logo */}
                <div className="flex items-center gap-3.5 mb-10 pb-6 border-b border-white/5">
                    <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.35)] shrink-0">
                        <Scissors className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-white leading-none">Marciel</h2>
                        <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1">Barber Manager</p>
                    </div>
                    <button onClick={onClose} className="ml-auto lg:hidden text-slate-400 hover:text-white">
                        <X size={22} />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 space-y-1.5">
                    {finalMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`
                                    flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium text-sm
                                    ${isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'}
                                `}
                            >
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-amber-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="tracking-wide">{item.label}</span>
                                {isActive && <div className="ml-auto w-2 h-2 bg-slate-950 rounded-full" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="pt-6 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3.5 w-full px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-xs uppercase tracking-widest group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sair do Painel</span>
                    </button>
                </div>
            </div>
        </aside>
        </>
    );
}

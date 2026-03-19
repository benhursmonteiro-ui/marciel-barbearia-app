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
                fixed top-0 left-0 h-full w-72 bg-[var(--color-dark-card)] border-r border-[var(--color-dark-border)] z-50
                transition-transform duration-500 ease-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full p-8 overflow-y-auto no-scrollbar">
                    {/* Header/Logo */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 bg-black border border-[var(--color-primary-gold)] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <Scissors className="text-[var(--color-primary-gold)] w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white leading-none">Marciel</h2>
                            <p className="text-[var(--color-primary-gold)] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Barber Area</p>
                        </div>
                        <button onClick={onClose} className="ml-auto lg:hidden text-gray-500 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 space-y-2">
                        {finalMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => onClose()}
                                    className={`
                                        flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                                        ${isActive
                                            ? 'bg-[var(--color-primary-gold)] text-black font-bold shadow-[0_10px_20px_rgba(212,175,55,0.15)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'}
                                    `}
                                >
                                    <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-black' : 'text-[var(--color-primary-gold)]'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm tracking-wide">{item.label}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Logout */}
                    <div className="pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold tracking-widest uppercase">Sair do Painel</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

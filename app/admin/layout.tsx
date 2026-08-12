"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { useBarber } from "@/context/BarberContext";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, currentUser, isAuthReady } = useBarber();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Protection: Redirect if not admin - only after auth has been restored
    React.useEffect(() => {
        if (!isAuthReady) return; // Wait for session to be loaded
        if (!currentUser || currentUser.role !== 'admin') {
            router.push('/');
        }
    }, [currentUser, router, isAuthReady]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: "TrendingUp", label: "Dashboard", href: "/admin" },
        { icon: "CalendarRange", label: "Minha Agenda", href: "/admin/minha-agenda" },
        { icon: "Calendar", label: "Agendamentos", href: "/admin/agendamentos" },
        { icon: "Scissors", label: "Serviços", href: "/admin/servicos" },
        { icon: "Clock", label: "Horários", href: "/admin/horarios" },
        { icon: "Users", label: "Profissionais", href: "/admin/profissionais" },
        { icon: "UserPlus", label: "Clientes", href: "/admin/clientes" },
        { icon: "Wallet", label: "Financeiro", href: "/admin/financeiro" },
        { icon: "Package", label: "Estoque", href: "/admin/estoque" },
        { icon: "FileText", label: "Relatórios", href: "/admin/relatorios" },
        { icon: "Settings", label: "Configurações", href: "/admin/configuracoes" },
    ];

    const SidebarContent = () => (
        <>
            {/* Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 w-6 h-6 rounded-full hidden md:flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60]"
            >
                <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-4 h-4" />
            </button>

            <div className={`flex items-center gap-3 mb-10 pb-4 border-b border-white/5 overflow-hidden ${isCollapsed ? 'md:justify-center' : ''}`}>
                <div className="shrink-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <Icon name="Scissors" className="w-5 h-5 stroke-[2.5]" />
                </div>
                {(!isCollapsed || isMobileMenuOpen) && (
                    <div className="whitespace-nowrap transition-opacity duration-300 group">
                        <h2 className="font-extrabold tracking-tight text-sm leading-tight text-white">MARCIEL</h2>
                        <p className="text-amber-400 tracking-widest text-[10px] uppercase font-bold leading-tight mb-1">Barber Admin</p>
                        <button onClick={handleLogout} className="text-[9px] text-red-400 hover:text-red-300 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                            <Icon name="LogOut" className="w-2.5 h-2.5" />
                            Sair
                        </button>
                    </div>
                )}
                {isCollapsed && !isMobileMenuOpen && (
                    <button onClick={handleLogout} title="Sair" className="absolute top-[88px] text-red-400 hover:text-red-300 transition-colors hidden md:block">
                        <Icon name="LogOut" className="w-4 h-4" />
                    </button>
                )}
            </div>

            <ul className="space-y-1.5">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? item.label : ""}
                                className={`flex items-center gap-3.5 py-3 rounded-xl transition-all duration-300 ${isCollapsed && !isMobileMenuOpen ? 'md:justify-center md:px-0' : 'px-4'} ${isActive
                                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                            >
                                <Icon name={item.icon} className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                                {(!isCollapsed || isMobileMenuOpen) && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStart || !isMobileMenuOpen) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = touchStart - currentTouch;

        // If swipe left more than 50px, close
        if (diff > 50) {
            setIsMobileMenuOpen(false);
            setTouchStart(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#080a0f] text-slate-100 font-sans flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-[#0d111a] border-b border-white/5 sticky top-0 z-[60]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <Icon name="Scissors" className="w-4 h-4" />
                    </div>
                    <span className="font-extrabold text-sm tracking-wide text-white">MARCIEL <span className="text-amber-400">ADMIN</span></span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 border border-slate-800"
                >
                    <Icon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[55] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar / Navigation (Desktop and Mobile) */}
            <nav 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                className={`
                fixed top-0 bottom-0 z-[60] bg-[#0d111a] border-r border-white/5 transition-all duration-500 ease-in-out
                md:left-0 overflow-y-auto no-scrollbar
                ${isMobileMenuOpen ? 'left-0 w-72 p-6' : '-left-full md:left-0'}
                ${isCollapsed ? 'md:w-20 md:p-4' : 'md:w-64 md:p-6'}
            `}>
                <SidebarContent />
            </nav>

            {/* Main Content Area */}
            <main className={`
                flex-1 transition-all duration-500 ease-in-out min-h-screen bg-[#080a0f]
                ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}
            `}>
                {children}
            </main>
        </div>
    );
}

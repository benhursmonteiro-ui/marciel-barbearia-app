"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

import { useBarber } from "@/context/BarberContext";
import { useRouter } from "next/navigation";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333' }} />;
    return <LucideIcon className={className} />;
}

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
        { icon: "Megaphone", label: "Marketing", href: "/admin/marketing" },
        { icon: "FileText", label: "Relatórios", href: "/admin/relatorios" },
        { icon: "Bell", label: "Notificações", href: "/admin/notifications" },
        { icon: "Settings", label: "Configurações", href: "/admin/configuracoes" },
    ];

    const SidebarContent = () => (
        <>
            {/* Toggle Button (Desktop Only) */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-[#D4AF37] text-black w-6 h-6 rounded-full hidden md:flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[60]"
            >
                <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} className="w-4 h-4" />
            </button>

            <div className={`flex items-center gap-3 mb-12 overflow-hidden ${isCollapsed ? 'md:justify-center' : ''}`}>
                <div className="shrink-0 w-10 h-10 bg-[#0a0a0a] border border-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                    <Icon name="Scissors" className="w-5 h-5 text-[#D4AF37]" />
                </div>
                {(!isCollapsed || isMobileMenuOpen) && (
                    <div className="whitespace-nowrap transition-opacity duration-300 group">
                        <h2 className="font-semibold tracking-wider text-sm leading-tight">MARCIEL</h2>
                        <p className="text-[#D4AF37] tracking-widest text-[10px] uppercase leading-tight mb-1">BarberShop</p>
                        <button onClick={handleLogout} className="text-[9px] text-red-500/80 hover:text-red-500 font-bold uppercase tracking-[0.2em] flex items-center gap-1 transition-colors">
                            <Icon name="LogOut" className="w-2.5 h-2.5" />
                            Sair
                        </button>
                    </div>
                )}
                {isCollapsed && !isMobileMenuOpen && (
                    <button onClick={handleLogout} title="Sair" className="absolute top-[88px] text-red-500/50 hover:text-red-500 transition-colors hidden md:block">
                        <Icon name="LogOut" className="w-4 h-4" />
                    </button>
                )}
            </div>

            <ul className="space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                title={isCollapsed ? item.label : ""}
                                className={`flex items-center gap-3 py-3 rounded-lg transition-all duration-300 ${isCollapsed && !isMobileMenuOpen ? 'md:justify-center md:px-0' : 'px-4'} ${isActive
                                    ? "bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                                    }`}
                            >
                                <Icon name={item.icon} className="w-5 h-5 shrink-0" />
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
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-[#111] border-b border-[#1f1f1f] sticky top-0 z-[60]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#0a0a0a] border border-[#D4AF37] rounded-full flex items-center justify-center">
                        <Icon name="Scissors" className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="font-black text-xs tracking-widest italic">MARCIEL <span className="text-[#D4AF37]">ADMIN</span></span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-[#D4AF37] border border-white/5"
                >
                    <Icon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
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
                fixed top-0 bottom-0 z-[60] bg-[#111111] border-r border-[#1f1f1f] transition-all duration-500 ease-in-out
                md:left-0 overflow-y-auto no-scrollbar
                ${isMobileMenuOpen ? 'left-0 w-72 p-6' : '-left-full md:left-0'}
                ${isCollapsed ? 'md:w-20 md:p-4' : 'md:w-64 md:p-6'}
            `}>
                <SidebarContent />
            </nav>

            {/* Main Content Area */}
            <main className={`
                flex-1 transition-all duration-500 ease-in-out min-h-screen
                ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}
            `}>
                {children}
            </main>
        </div>
    );
}

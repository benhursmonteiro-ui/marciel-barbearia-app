"use client";

import React, { useState } from 'react';
import BarberSidebar from '@/components/barber/Sidebar';
import { Menu, Bell, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useBarber } from '@/context/BarberContext';
import { useRouter } from 'next/navigation';

export default function BarberLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { currentUser, isAuthReady } = useBarber();
    const router = useRouter();

    // Protection: Redirect if not barber (or admin who can see barber pages)
    React.useEffect(() => {
        if (!isAuthReady) return;
        if (!currentUser || (currentUser.role !== 'barber' && currentUser.role !== 'admin')) {
            router.push('/');
        }
    }, [currentUser, router, isAuthReady]);

    return (
        <div className="min-h-screen bg-[#080a0f] text-slate-100 font-sans">
            <BarberSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#080a0f]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-xl bg-slate-900/60 border border-slate-800"
                            >
                                <Menu size={22} />
                            </button>
                            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-[#121622]/90 border border-white/5 rounded-2xl w-full max-w-md text-slate-400 focus-within:border-amber-500/50 focus-within:text-amber-400 transition-all shadow-inner">
                                <Search size={18} className="shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente, corte ou serviço..."
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-500 text-white font-medium"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/barber/notifications">
                                <button className="relative p-2.5 text-slate-400 hover:text-white bg-[#121622]/80 hover:bg-[#161c2b] border border-white/5 rounded-xl transition-colors group">
                                    <Bell size={20} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-amber-400 rounded-full border-2 border-[#080a0f] animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                </button>
                            </Link>

                            <div className="flex items-center gap-3.5 pl-4 border-l border-white/5">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white leading-none">{currentUser?.name || "Barbeiro"}</p>
                                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-1">Status: Online</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl border border-amber-500/30 overflow-hidden bg-slate-900 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                    {currentUser?.photo ? <img src={currentUser.photo} alt="" className="w-full h-full object-cover" /> : <User size={20} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

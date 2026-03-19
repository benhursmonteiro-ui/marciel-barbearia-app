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
        <div className="min-h-screen bg-[var(--color-dark-bg)] text-white">
            <BarberSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="lg:ml-72 min-h-screen flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[var(--color-dark-bg)]/80 backdrop-blur-xl border-b border-[var(--color-dark-border)] p-4 md:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-black/40 border border-white/5 rounded-2xl w-64 lg:w-96 text-gray-500 focus-within:border-[var(--color-primary-gold)]/50 focus-within:text-[var(--color-primary-gold)] transition-all">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente ou serviço..."
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            <Link href="/barber/notifications">
                                <button className="relative p-2 text-gray-400 hover:text-white transition-colors group">
                                    <Bell size={22} />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-primary-gold)] rounded-full border-2 border-[var(--color-dark-bg)] animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                                </button>
                            </Link>

                            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold leading-none">{currentUser?.name || "Barbeiro"}</p>
                                    <p className="text-[9px] text-[var(--color-primary-gold)] font-black uppercase tracking-widest mt-1">Status: Online</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl border border-[var(--color-dark-border)] overflow-hidden bg-black flex items-center justify-center text-[var(--color-primary-gold)]">
                                    {currentUser?.photo ? <img src={currentUser.photo} alt="" className="w-full h-full object-cover" /> : <User size={20} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}

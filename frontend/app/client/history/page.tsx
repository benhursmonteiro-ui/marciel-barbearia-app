"use client";

import React, { useState } from 'react';
import {
    History as HistoryIcon,
    Scissors,
    User,
    Clock,
    Search,
    Download,
    ChevronRight,
    ChevronLeft,
    Filter,
    Calendar,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBarber } from '@/context/BarberContext';

export default function HistoryPage() {
    const { appointments, currentUser } = useBarber();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter current user's appointments and apply search
    const userHistory = appointments.filter(a => a.clientId === currentUser?.id);

    const filteredHistory = userHistory.filter(item =>
        item.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barberName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

    const totalSpent = userHistory
        .filter(a => a.status === 'concluido')
        .reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Histórico de <span className="text-[var(--color-primary-gold)]">Serviços</span></h1>
                    <p className="text-gray-500 text-sm">Visualize todo o seu percurso na MarcielBarberShop.</p>
                </div>
                <div className="flex bg-[var(--color-dark-card)] p-4 rounded-2xl border border-[var(--color-dark-border)] gap-6 shadow-xl">
                    <div className="text-center group">
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1 group-hover:text-[var(--color-primary-gold)] transition-colors">Total Gasto</p>
                        <p className="text-xl font-black text-white">R$ {totalSpent.toFixed(2)}</p>
                    </div>
                </div>
            </header>

            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-gold)]/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-10 relative z-10">
                    <div className="relative w-full max-w-sm">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por serviço ou barbeiro..."
                            className="pl-12 bg-black/40 h-14 rounded-2xl border-white/5 pr-4 border-2 focus:border-[var(--color-primary-gold)] transition-all"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="h-14 px-6 border-white/5 hover:border-[var(--color-primary-gold)]/30 rounded-2xl uppercase tracking-[0.2em] font-black text-[10px]">
                            <Filter className="w-4 h-4 mr-2" /> FILTRAR
                        </Button>
                        <Button variant="outline" size="sm" className="h-14 px-6 border-white/5 hover:border-[var(--color-primary-gold)]/30 rounded-2xl uppercase tracking-[0.2em] font-black text-[10px]">
                            <Download className="w-4 h-4 mr-2" /> EXPORTAR
                        </Button>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto relative z-10 custom-scrollbar">
                    {filteredHistory.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">Serviço</th>
                                    <th className="py-4 text-[10px] uppercase font-black tracking-widest text-gray-500">Barbeiro</th>
                                    <th className="py-4 text-[10px] uppercase font-black tracking-widest text-gray-500 text-center">Data</th>
                                    <th className="py-4 text-[10px] uppercase font-black tracking-widest text-gray-500 text-right">Valor</th>
                                    <th className="py-4 text-[10px] uppercase font-black tracking-widest text-gray-500 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginatedItems.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/[0.02] transition-all">
                                        <td className="py-6 font-bold">{item.serviceName}</td>
                                        <td className="py-6 text-gray-400 font-medium capitalize">{item.barberName}</td>
                                        <td className="py-6 text-gray-500 text-center text-sm">{item.date.split('-').reverse().join('/')}</td>
                                        <td className="py-6 text-right font-black text-white">R$ {item.price.toFixed(2)}</td>
                                        <td className="py-6 text-right">
                                            <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${item.status === 'concluido' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
                                                    item.status === 'cancelado' ? 'text-red-400 border-red-400/20 bg-red-400/5' :
                                                        'text-[var(--color-primary-gold)] border-[var(--color-primary-gold)]/20 bg-[var(--color-primary-gold)]/5'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center text-gray-500 italic">Nenhum registro encontrado.</div>
                    )}
                </div>

                {/* Mobile/Small Screens List View */}
                <div className="lg:hidden space-y-4 relative z-10">
                    {paginatedItems.map((item) => (
                        <div key={item.id} className="bg-black/40 border border-white/5 p-6 rounded-3xl space-y-4 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg mb-1">{item.serviceName}</p>
                                    <p className="text-xs text-gray-500 italic capitalize">Com {item.barberName}</p>
                                </div>
                                <span className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg border shadow-inner ${item.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
                                        'bg-[var(--color-primary-gold)]/10 text-[var(--color-primary-gold)] border-[var(--color-primary-gold)]/20'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-4 border-y border-white/5">
                                <p className="text-gray-500 flex items-center gap-2"><Calendar className="w-3 h-3" /> {item.date.split('-').reverse().join('/')}</p>
                                <p className="font-bold text-white tracking-tight">R$ {item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <div className="py-10 text-center text-gray-600 italic">Nenhum registro.</div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 relative z-10">
                        <p className="text-xs text-gray-500 italic">Mostrando <span className="text-white font-bold">{startIndex + 1}</span> a <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, filteredHistory.length)}</span> de <span className="text-white font-bold">{filteredHistory.length}</span> registros.</p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                className="p-3 bg-black border border-white/5 rounded-xl disabled:opacity-20 hover:border-white/20 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-11 h-11 rounded-xl text-xs font-black transition-all border-2 ${currentPage === i + 1
                                        ? 'bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                                        : 'bg-black border-white/5 text-gray-500 hover:border-white/20'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                className="p-3 bg-black border border-white/5 rounded-xl disabled:opacity-20 hover:border-white/20 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

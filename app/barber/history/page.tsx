"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    History as HistoryIcon,
    Search,
    Filter,
    Download,
    User,
    Scissors,
    Calendar,
    MoreVertical,
    Eye,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBarber } from '@/context/BarberContext';

function ActionMenu({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) {
    const { updateAppointmentStatus } = useBarber();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [onClose]);

    const handleConcluir = async () => {
        await updateAppointmentStatus(appointmentId, 'concluido');
        onClose();
    };

    const handleCancelar = async () => {
        await updateAppointmentStatus(appointmentId, 'cancelado');
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-8 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl min-w-[180px] overflow-hidden animate-scale-in"
        >
            <button
                onClick={handleConcluir}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-emerald-400 hover:bg-emerald-500/10 transition-colors text-left"
            >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como Concluído
            </button>
            <button
                onClick={handleCancelar}
                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
                <XCircle className="w-4 h-4" />
                Cancelar Atendimento
            </button>
        </div>
    );
}

const ITEMS_PER_PAGE = 8;

export default function BarberHistory() {
    const { appointments, currentUser } = useBarber();
    const [searchTerm, setSearchTerm] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter appointments for this barber that are concluded or all (history)
    const myAppointments = appointments.filter(a =>
        a.barberId === currentUser?.id || a.barberName === currentUser?.name
    );

    const filtered = myAppointments.filter(a => {
        const term = searchTerm.toLowerCase();
        return (
            a.clientName?.toLowerCase().includes(term) ||
            a.serviceName?.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const statusColor = (status: string) => {
        if (status === 'concluido') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (status === 'cancelado') return 'text-red-400 bg-red-500/10 border-red-500/20';
        return 'text-[var(--color-primary-gold)] bg-[var(--color-primary-gold)]/10 border-[var(--color-primary-gold)]/20';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Meu <span className="text-[var(--color-primary-gold)]">Histórico</span></h1>
                    <p className="text-gray-500 text-sm italic">O registro de todos os seus atendimentos realizados.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-white/5 uppercase text-[10px] font-black tracking-widest gap-2">
                        <Download className="w-4 h-4" /> EXPORTAR PDF
                    </Button>
                </div>
            </header>

            <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-gold)]/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-10 relative z-10">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="Buscar cliente ou serviço..."
                            className="bg-black/40 h-14 pl-12 border-white/5 rounded-2xl"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="h-14 px-6 border-white/5 rounded-2xl uppercase tracking-widest font-black text-[10px] gap-2">
                            <Calendar className="w-4 h-4" /> DATA
                        </Button>
                        <Button variant="outline" className="h-14 px-6 border-white/5 rounded-2xl uppercase tracking-widest font-black text-[10px] gap-2">
                            <Filter className="w-4 h-4" /> FILTROS
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto relative z-10">
                    {paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Scissors className="w-12 h-12 text-gray-800 mb-4" />
                            <p className="text-gray-600 font-bold text-sm italic">Nenhum atendimento encontrado.</p>
                            <p className="text-gray-700 text-xs mt-1">Seus atendimentos aparecem aqui quando adicionados pelo administrador.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600">Cliente</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600">Serviço</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 text-center">Data</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 text-center">Status</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 text-right">Valor</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 text-right">Comissão</th>
                                    <th className="py-6 text-[10px] uppercase font-black tracking-[0.2em] text-gray-600 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {paginated.map((item) => (
                                    <tr key={item.id} className="group hover:bg-white/[0.01] transition-all">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:bg-[var(--color-primary-gold)]/10 group-hover:text-[var(--color-primary-gold)] transition-colors">
                                                    <User size={18} />
                                                </div>
                                                <span className="font-bold text-white tracking-tight">{item.clientName || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <span className="text-gray-400 font-medium italic">{item.serviceName || '—'}</span>
                                        </td>
                                        <td className="py-6 text-center text-sm font-bold text-gray-600">
                                            {item.date ? item.date.split('-').reverse().join('/') : '—'}
                                        </td>
                                        <td className="py-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusColor(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-6 text-right font-black text-white">
                                            R$ {item.price?.toFixed(2) ?? '0,00'}
                                        </td>
                                        <td className="py-6 text-right font-black text-emerald-400">
                                            R$ {item.commission?.toFixed(2) ?? '0,00'}
                                        </td>
                                        <td className="py-6 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                                    className="p-2 text-gray-700 hover:text-[var(--color-primary-gold)] transition-colors rounded-lg hover:bg-white/5"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                                {openMenuId === item.id && (
                                                    <ActionMenu
                                                        appointmentId={item.id}
                                                        onClose={() => setOpenMenuId(null)}
                                                    />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {filtered.length > ITEMS_PER_PAGE && (
                    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5">
                        <p className="text-xs text-gray-600 italic">
                            Exibindo {Math.min(paginated.length, ITEMS_PER_PAGE)} de {filtered.length} atendimentos.
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-3 bg-black border border-white/5 rounded-xl text-gray-600 hover:text-white disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(i => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`w-11 h-11 rounded-xl text-xs font-black border-2 transition-all ${i === currentPage ? 'bg-[var(--color-primary-gold)] border-[var(--color-primary-gold)] text-black' : 'bg-black border-white/5 text-gray-600'}`}
                                >
                                    {i}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-3 bg-black border border-white/5 rounded-xl text-gray-600 hover:text-white disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

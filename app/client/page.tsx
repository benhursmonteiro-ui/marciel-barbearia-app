"use client";

import React from 'react';
import { DashboardCard } from '@/components/client/DashboardCard';
import {
    Calendar,
    User,
    Scissors,
    ArrowRight,
    History,
    TicketPercent,
    Sparkles,
    CalendarPlus,
    ShoppingBag,
    Package,
    Plus,
    Minus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useBarber } from '@/context/BarberContext';

export default function ClientDashboard() {
    const { appointments, currentUser, promotions, products, addToCart } = useBarber();

    // Get current client's appointments
    const clientAppointments = appointments.filter(a => a.clientId === currentUser?.id);
    const completedApps = clientAppointments.filter(a => a.status === 'concluido');

    // Get next appointment
    const nextApp = clientAppointments
        .filter(a => a.status === 'agendado' || a.status === 'confirmado')
        .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())[0];

    // Filter active products with stock
    const availableProducts = products.filter(p => p.active && p.stock > 0);

    return (
        <div className="space-y-10 animate-fade-in-up pb-10">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Próximo Atendimento"
                    value={nextApp ? nextApp.date.split('-').reverse().join('/') : "--/--/----"}
                    subtitle={nextApp ? nextApp.time : "Nenhum agendado"}
                    icon={<Calendar className="w-6 h-6" />}
                />
                <DashboardCard
                    title="Barbeiro"
                    value={nextApp ? nextApp.barberName : "---"}
                    subtitle={nextApp ? "Profissional Premium" : "Escolha um barbeiro"}
                    icon={<User className="w-6 h-6" />}
                />
                <DashboardCard
                    title="Serviço"
                    value={nextApp ? nextApp.serviceName : "---"}
                    subtitle={nextApp ? `R$ ${nextApp.price.toFixed(2)}` : "Selecione um serviço"}
                    icon={<Scissors className="w-6 h-6" />}
                />
                <DashboardCard
                    title="Total de Cortes"
                    value={completedApps.length.toString()}
                    subtitle="Estilo consolidado"
                    icon={<Sparkles className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-10">
                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-dark-card)] to-black border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 lg:p-12 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary-gold)]/5 rounded-full blur-3xl -mr-20 -mt-20" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h3 className="text-3xl lg:text-4xl font-black text-white mb-2 tracking-tight">
                                    Olá, {currentUser?.name?.split(' ')[0] || ''}! <br />
                                    Pronto para seu <span className="text-[var(--color-primary-gold)]">novo visual?</span>
                                </h3>
                                <p className="text-gray-400 mb-8 max-w-sm font-medium">Garanta seu horário com os melhores profissionais e produtos exclusivos.</p>
                                <Link href="/client/schedule">
                                    <Button size="lg" className="h-16 px-12 gap-3 text-xs font-black tracking-[0.2em] bg-[var(--color-primary-gold)] text-black shadow-[0_15px_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-all">
                                        <CalendarPlus className="w-5 h-5" /> AGENDAR AGORA
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Products for Sale (Inventory) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="flex items-center gap-3 text-xl font-bold italic">
                                <ShoppingBag className="w-6 h-6 text-[var(--color-primary-gold)]" /> Produtos para Você
                            </h4>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">Disponíveis na Loja</span>
                        </div>

                        {availableProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                                {availableProducts.slice(0, 3).map((prod) => (
                                    <div key={prod.id} className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2rem] p-5 hover:border-[var(--color-primary-gold)]/30 transition-all group">
                                        <div className="aspect-square bg-black rounded-2xl border border-white/5 mb-4 overflow-hidden flex items-center justify-center relative shadow-inner">
                                            {prod.image ? (
                                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <Package className="w-10 h-10 text-gray-800" />
                                            )}
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-[8px] font-black text-[var(--color-primary-gold)] border border-[var(--color-primary-gold)]/20 uppercase tracking-widest">
                                                {prod.category}
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-sm text-gray-100 mb-1 line-clamp-1">{prod.name}</h5>
                                        <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                                            <span className="text-[var(--color-primary-gold)] font-black text-sm">R$ {prod.price.toFixed(2)}</span>
                                            <button 
                                                onClick={() => prod.stock > 0 && addToCart(prod)}
                                                disabled={prod.stock <= 0}
                                                className={`w-8 h-8 rounded-lg bg-black flex items-center justify-center border border-white/5 transition-colors ${prod.stock > 0 ? 'text-gray-600 group-hover:text-white group-hover:bg-[var(--color-primary-gold)]' : 'text-red-500/30'}`}
                                            >
                                                {prod.stock > 0 ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {prod.stock <= 0 && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-[2rem]">
                                                <span className="bg-red-500 text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase">Esgotado</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {availableProducts.length > 3 && (
                                    <Link href="/client/products" className="group col-span-full">
                                        <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-[var(--color-primary-gold)] group-hover:border-[var(--color-primary-gold)]/30 transition-all">
                                            Ver Catálogo Completo
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="p-10 bg-[var(--color-dark-card)] border border-dashed border-[var(--color-dark-border)] rounded-[2.5rem] text-center opacity-40">
                                <Package className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                                <p className="text-xs font-bold uppercase tracking-widest">Novos produtos chegando em breve</p>
                            </div>
                        )}
                    </div>

                    {/* Recent History Preview */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h4 className="flex items-center gap-2 text-xl font-bold italic">
                                <History className="w-5 h-5 text-[var(--color-primary-gold)]" /> Histórico Recente
                            </h4>
                            <Link href="/client/history" className="text-xs text-[var(--color-primary-gold)] hover:underline flex items-center gap-1 font-bold">Ver todos <ArrowRight className="w-3 h-3" /></Link>
                        </div>
                        <div className="space-y-3">
                            {completedApps.slice(0, 3).map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-2xl hover:border-[var(--color-primary-gold)]/10 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center w-14 border-r border-[var(--color-dark-border)] pr-6">
                                            <p className="text-lg font-black text-white group-hover:text-[var(--color-primary-gold)] transition-colors">{item.date.split('-')[2]}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter font-black">
                                                {new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-black text-base text-gray-100">{item.serviceName}</p>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-0.5">Barbeiro: <span className="text-[var(--color-primary-gold)]">{item.barberName}</span></p>
                                        </div>
                                    </div>
                                    <span className="text-base font-black text-[var(--color-primary-gold)]">R$ {item.price.toFixed(2)}</span>
                                </div>
                            ))}
                            {completedApps.length === 0 && (
                                <div className="p-8 bg-black/20 border border-dashed border-white/5 rounded-2xl text-center opacity-50">
                                    <p className="text-xs font-bold uppercase tracking-widest italic">Sua jornada de estilo começa aqui.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div></div>
            </div>
            
            <style jsx global>{`
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}


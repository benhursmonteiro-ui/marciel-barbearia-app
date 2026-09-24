"use client";

import Sidebar from '@/components/client/Sidebar';
import { useState, useEffect } from 'react';
import { Menu, X, Bell, User, ShoppingCart, Minus, Plus, MessageSquare, Package } from 'lucide-react';
import { useBarber } from '@/context/BarberContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import React from 'react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, isAuthReady, cart, updateCartQuantity, removeFromCart, clearCart, shopConfig } = useBarber();
    const router = useRouter();
    const [isCartOpen, setIsCartOpen] = useState(false);

    const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const finalizeOrder = () => {
        const waNumber = shopConfig?.whatsapp?.replace(/\D/g, '') || "";
        const finalWa = (waNumber.length >= 12 && waNumber.startsWith('55')) ? waNumber : `55${waNumber}`;

        let message = `*📦 NOVO PEDIDO DE PRODUTOS*\n\n`;
        message += `*Cliente:* ${currentUser?.name || 'Não identificado'}\n`;
        if (currentUser?.phone) message += `*WhatsApp:* ${currentUser.phone}\n`;
        message += `\n--------------------------\n`;
        
        cart.forEach(item => {
            message += `✅ ${item.quantity}x ${item.product.name}\n`;
            message += `   _R$ ${(item.product.price * item.quantity).toFixed(2)}_\n\n`;
        });
        
        message += `--------------------------\n`;
        message += `*💰 TOTAL: R$ ${cartTotal.toFixed(2)}*\n\n`;
        message += `Gostaria de separar esses itens para mim?`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${finalWa}?text=${encodedMessage}`, '_blank');
        clearCart();
        setIsCartOpen(false);
    };

    // Protection: Redirect if not logged in - wait for auth to be restored
    useEffect(() => {
        if (!isAuthReady) return;
        if (!currentUser) {
            router.push('/');
        }
    }, [currentUser, router, isAuthReady]);

    const [touchStart, setTouchStart] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStart || !sidebarOpen) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = touchStart - currentTouch;

        // If swipe left more than 50px, close
        if (diff > 50) {
            setSidebarOpen(false);
            setTouchStart(null);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#080a0f] text-slate-100 font-sans">
            {/* Mobile sidebar overlay */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-500 md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                className={`fixed z-50 inset-y-0 left-0 w-72 transform bg-[#0d111a] border-r border-white/5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'} md:translate-x-0 md:static overflow-y-auto no-scrollbar`}
            >
                <Sidebar />
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-30 flex items-center justify-between p-4 md:px-8 border-b border-white/5 bg-[#080a0f]/90 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 -ml-2 text-slate-400 hover:text-amber-400 md:hidden transition-colors rounded-xl bg-slate-900/60 border border-slate-800"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Área do Cliente</p>
                            <h2 className="text-sm font-bold text-white">Bem-vindo(a), {currentUser?.name?.split(' ')[0] || 'Cliente'}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-3 pl-3 border-l border-white/5">
                            <div className="hidden md:block text-right">
                                <p className="text-xs font-bold text-white">{currentUser?.name || "Cliente"}</p>
                                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Membro VIP</p>
                            </div>
                            <div className="w-9 h-9 border border-amber-500/30 rounded-xl flex items-center justify-center bg-slate-900 overflow-hidden text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                {currentUser?.photo ? <img src={currentUser.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-5 h-5 text-amber-400" />}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar">
                    <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Floating Cart Button (Global) */}
            {cart.length > 0 && (
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-[var(--color-primary-gold)] text-black rounded-2xl md:rounded-3xl shadow-2xl shadow-[var(--color-primary-gold)]/40 flex items-center justify-center group animate-bounce-slow z-[60] hover:scale-110 transition-all border-4 border-black/10"
                >
                    <ShoppingCart className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                    <span className="absolute -top-3 -right-3 w-7 h-7 md:w-8 md:h-8 bg-black text-[var(--color-primary-gold)] rounded-full border-2 border-[var(--color-primary-gold)] flex items-center justify-center text-[10px] md:text-xs font-black">
                        {cartItemsCount}
                    </span>
                </button>
            )}

            {/* Global Cart Modal */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-md h-full md:h-auto md:max-h-[90vh] bg-[#0d0d0d] border-l md:border border-white/5 md:rounded-[3rem] shadow-2xl flex flex-col animate-slide-left overflow-hidden">
                        <header className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase italic">Meu <span className="text-[#D4AF37]">Pedido</span></h2>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">{cartItemsCount} Itens selecionados</p>
                            </div>
                            <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="py-20 text-center opacity-20">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Sua sacola está vazia</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.product.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-[var(--color-primary-gold)]/20 transition-all">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/5 bg-black shrink-0">
                                            {item.product.image ? (
                                                <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <Package className="w-6 h-6" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-sm text-white truncate">{item.product.name}</h4>
                                            <p className="text-[#D4AF37] font-black text-xs">R$ {item.product.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center bg-black rounded-lg border border-white/5">
                                                <button onClick={() => updateCartQuantity(item.product.id, -1)} className="p-1 hover:text-white transition-colors"><Minus className="w-4 h-4" /></button>
                                                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                <button onClick={() => updateCartQuantity(item.product.id, 1)} className="p-1 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                                            </div>
                                            <button onClick={() => removeFromCart(item.product.id)} className="text-[10px] text-red-500/50 hover:text-red-500 font-black uppercase tracking-widest">Remover</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <footer className="p-8 border-t border-white/5 bg-black space-y-6 md:rounded-b-[3rem]">
                            <div className="flex justify-between items-end">
                                <div className="text-left font-black tracking-widest uppercase text-[10px] text-gray-500">Valor Estimado</div>
                                <div className="text-3xl font-black text-[var(--color-primary-gold)] tracking-tight">R$ {cartTotal.toFixed(2)}</div>
                            </div>
                            <Button 
                                onClick={finalizeOrder}
                                disabled={cart.length === 0}
                                className="w-full h-16 bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-[#D4AF37]/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
                            >
                                <MessageSquare className="w-5 h-5" strokeWidth={2.5} /> ENVIAR PEDIDO AO WHATSAPP
                            </Button>
                        </footer>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .animate-slide-left {
                    animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes slideLeft {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-bounce-slow {
                    animation: bounceSlow 3s infinite;
                }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

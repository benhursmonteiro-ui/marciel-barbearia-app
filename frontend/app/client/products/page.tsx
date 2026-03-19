"use client";

import React, { useState } from 'react';
import {
    ShoppingBag,
    Search,
    Package,
    Plus,
    Filter,
    ArrowLeft,
    ShoppingCart,
    Trash2,
    Minus,
    MessageSquare,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useBarber, Product } from '@/context/BarberContext';

export default function ClientProducts() {
    const { 
        products, 
        cart, 
        addToCart, 
        removeFromCart, 
        updateCartQuantity, 
        clearCart, 
        shopConfig, 
        currentUser 
    } = useBarber();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("TODOS");

    const availableProducts = products.filter(p => p.active);
    
    const categories = ["TODOS", ...Array.from(new Set(availableProducts.map(p => p.category)))];

    const filteredProducts = availableProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "TODOS" || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <Link href="/client">
                        <Button variant="ghost" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[var(--color-primary-gold)] hover:text-black transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase">Catálogo de <span className="text-[var(--color-primary-gold)]">Produtos</span></h1>
                        <p className="text-gray-500 text-sm italic">Itens exclusivos para o seu cuidado diário.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="Buscar produto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[#111111] border-[#1f1f1f] h-14 pl-12 rounded-2xl focus:border-[var(--color-primary-gold)]/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Categories Tab */}
                <div className="flex bg-[#111111] border border-[#1f1f1f] p-1.5 rounded-[2rem] overflow-x-auto no-scrollbar max-w-fit">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[var(--color-primary-gold)] text-black shadow-lg shadow-[var(--color-primary-gold)]/10' : 'text-gray-500 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {filteredProducts.map((prod) => (
                            <div key={prod.id} className="bg-[#111111] border border-[#1f1f1f] rounded-[3rem] p-6 hover:border-[var(--color-primary-gold)]/30 transition-all group flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none" />
                                
                                <div className="aspect-[4/5] bg-black rounded-[2rem] border border-white/5 mb-6 overflow-hidden flex items-center justify-center relative shadow-inner group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all">
                                    {prod.image ? (
                                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <Package className="w-16 h-16 text-gray-800 group-hover:scale-110 transition-transform" />
                                    )}
                                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[9px] font-black text-[var(--color-primary-gold)] border border-[var(--color-primary-gold)]/20 uppercase tracking-widest">
                                        {prod.category}
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col">
                                    <h5 className="font-black text-lg text-gray-100 mb-2 leading-tight group-hover:text-[var(--color-primary-gold)] transition-colors">{prod.name}</h5>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-6">Pronta Entrega</p>
                                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Preço</span>
                                            <span className="text-[var(--color-primary-gold)] font-black text-2xl tracking-tighter">R$ {prod.price.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={() => prod.stock > 0 && addToCart(prod)}
                                            disabled={prod.stock <= 0}
                                            className={`w-14 h-14 rounded-2xl bg-black border border-white/5 flex items-center justify-center transition-all ${prod.stock > 0 
                                                ? 'text-gray-600 group-hover:bg-[var(--color-primary-gold)] group-hover:text-black group-hover:shadow-xl group-hover:shadow-[var(--color-primary-gold)]/20' 
                                                : 'text-red-500/30 cursor-not-allowed'}`}
                                        >
                                            {prod.stock > 0 ? <Plus className="w-6 h-6" strokeWidth={3} /> : <Minus className="w-6 h-6" />}
                                        </button>
                                    </div>
                                    {prod.stock <= 0 && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10 md:rounded-[3rem]">
                                            <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl tracking-widest uppercase">Esgotado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center bg-[#111111] rounded-[4rem] border border-dashed border-[#1f1f1f] opacity-30">
                        <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                        <h4 className="text-xl font-bold uppercase tracking-widest">Nenhum produto encontrado</h4>
                        <p className="text-sm italic mt-2">Tente buscar por outro termo ou categoria.</p>
                    </div>
                )}
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}

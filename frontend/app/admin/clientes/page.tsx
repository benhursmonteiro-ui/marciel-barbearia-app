"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useBarber } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminClientes() {
    const { users } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter only clients from the users list
    const clients = users.filter(u => u.role === 'client');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        // Promotionally we don't have addClient in context yet besides registration, 
        // but for now we just close or show alert since we want virgin state
        alert("Para cadastrar um cliente, ele deve se registrar pelo portal do cliente.");
        setIsModalOpen(false);
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-semibold mb-1">
                        Gestão de <span className="text-[#D4AF37]">Clientes</span>
                    </h1>
                    <p className="text-gray-400 text-sm">Base de dados e histórico de fidelidade</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Input
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 bg-[#111111] border-[#1f1f1f] h-12 rounded-2xl"
                        />
                        <Icon name="Search" className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2 h-12 rounded-2xl shadow-lg shadow-[#D4AF37]/10">
                        <Icon name="UserPlus" className="w-4 h-4" /> Novo Cliente
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredClients.length > 0 ? filteredClients.map((client) => (
                    <div key={client.id} className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-[32px] hover:border-[#D4AF37]/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-[80px] group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />

                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[#D4AF37] text-2xl font-black group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                                {client.name?.[0] || '?'}
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">{client.name}</h3>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{client.email || 'Sem e-mail'}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-gray-500">
                                <span>Última Visita</span>
                                <span className="text-gray-300">Nunca</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-gray-500">
                                <span>Total Visitas</span>
                                <span className="text-[#D4AF37] font-bold text-base">0</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full text-[9px] h-11 uppercase tracking-[0.2em] font-black rounded-xl border-[#1f1f1f] group-hover:border-[#D4AF37]/50 group-hover:text-[#D4AF37]">Ver Histórico</Button>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center text-gray-600 italic">
                        <p>Nenhum cliente cadastrado ainda.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#111111] border border-[#1f1f1f] rounded-[40px] p-10 shadow-2xl animate-fade-in-up">
                        <header className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold tracking-tighter italic">Novo Cliente</h2>
                            <button onClick={() => setIsModalOpen(false)}><Icon name="X" className="w-6 h-6 text-gray-500" /></button>
                        </header>
                        <form onSubmit={handleAddClient} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome Completo</label>
                                <Input
                                    value={newClient.name}
                                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                                    className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl"
                                    placeholder="Ex: Roberto Carlos"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">E-mail</label>
                                <Input
                                    value={newClient.email}
                                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                                    className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl"
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                            <Button type="submit" className="w-full h-14 bg-[#D4AF37] text-black font-black uppercase tracking-widest rounded-2xl mt-4">Cadastrar</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

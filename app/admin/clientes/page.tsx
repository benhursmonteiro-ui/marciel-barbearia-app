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
    const { users, updateUser, appointments } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");

    // Filter only clients from the users list
    const clients = users.filter(u => u.role === 'client');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

    // History Modal states
    const [selectedClientForHistory, setSelectedClientForHistory] = useState<any>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const handleAddClient = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Para cadastrar um cliente, ele deve se registrar pelo portal do cliente.");
        setIsModalOpen(false);
    };

    const handleToggleBlock = async (client: any) => {
        const isBlocked = client.blocked;
        const actionText = isBlocked ? 'desbloquear' : 'bloquear';
        
        if (confirm(`Deseja realmente ${actionText} o cliente ${client.name}?`)) {
            try {
                await updateUser(client.id, { blocked: !isBlocked });
            } catch (err: any) {
                alert(`Erro ao atualizar status do cliente: ${err.message}`);
            }
        }
    };

    const handleViewHistory = (client: any) => {
        setSelectedClientForHistory(client);
        setIsHistoryModalOpen(true);
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sort clients alphabetically by name
    const sortedClients = [...filteredClients].sort((a, b) => a.name.localeCompare(b.name));

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
                {sortedClients.length > 0 ? sortedClients.map((client) => {
                    const clientApps = appointments.filter(a => a.clientId === client.id);
                    const completedApps = clientApps.filter(a => a.status === 'concluido');
                    const lastApp = completedApps
                        .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())[0];
                    const lastVisitDate = lastApp ? lastApp.date.split('-').reverse().join('/') : 'Nunca';
                    const isBlocked = client.blocked;

                    return (
                        <div key={client.id} className={`bg-[#111111] border ${isBlocked ? 'border-red-500/20 bg-red-950/5' : 'border-[#1f1f1f]'} p-8 rounded-[32px] hover:border-[#D4AF37]/30 transition-all group relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-[80px] group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />

                            <div className="flex items-center gap-5 mb-8">
                                <div className={`w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-2xl font-black group-hover:bg-[#D4AF37] group-hover:text-black transition-all ${isBlocked ? 'text-red-500 border-red-500/20' : 'text-[#D4AF37]'}`}>
                                    {client.name?.[0] || '?'}
                                </div>
                                <div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-white tracking-tight leading-tight">{client.name}</h3>
                                        {isBlocked && (
                                            <span className="w-fit px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md text-[8px] font-black uppercase tracking-widest">
                                                Bloqueado
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1.5 truncate max-w-[150px]">{client.email || 'Sem e-mail'}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-gray-500">
                                    <span>Última Visita</span>
                                    <span className="text-gray-300">{lastVisitDate}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-gray-500">
                                    <span>Total Visitas</span>
                                    <span className="text-[#D4AF37] font-bold text-base">{completedApps.length}</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => handleViewHistory(client)}
                                    variant="outline" 
                                    className="flex-1 text-[9px] h-11 uppercase tracking-[0.1em] font-black rounded-xl border-[#1f1f1f] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                                >
                                    Histórico
                                </Button>
                                <Button 
                                    onClick={() => handleToggleBlock(client)}
                                    variant="outline" 
                                    className={`flex-1 text-[9px] h-11 uppercase tracking-[0.1em] font-black rounded-xl border-[#1f1f1f] ${isBlocked ? 'text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30' : 'text-red-400 hover:text-red-300 hover:border-red-500/30'}`}
                                >
                                    {isBlocked ? 'Ativar' : 'Bloquear'}
                                </Button>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-span-full py-20 text-center text-gray-600 italic">
                        <p>Nenhum cliente cadastrado ainda.</p>
                    </div>
                )}
            </div>

            {/* Novo Cliente Modal */}
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

            {/* History Modal */}
            {isHistoryModalOpen && selectedClientForHistory && (() => {
                const clientApps = appointments
                    .filter(a => a.clientId === selectedClientForHistory.id)
                    .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());
                
                const completedApps = clientApps.filter(a => a.status === 'concluido');
                const totalSpent = completedApps.reduce((acc, app) => acc + app.price, 0);

                return (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsHistoryModalOpen(false)} />
                        <div className="relative w-full max-w-2xl bg-[#111111] border border-[#1f1f1f] rounded-[40px] p-8 md:p-10 shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh] overflow-hidden">
                            <header className="flex justify-between items-center mb-6 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tighter italic">Histórico do Cliente</h2>
                                    <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mt-1">{selectedClientForHistory.name}</p>
                                </div>
                                <button onClick={() => setIsHistoryModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <Icon name="X" className="w-6 h-6 text-gray-500" />
                                </button>
                            </header>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-2 gap-4 mb-6 shrink-0 bg-black/40 border border-[#1f1f1f] p-5 rounded-2xl">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Total de Visitas Concluídas</p>
                                    <p className="text-2xl font-black text-white mt-1">{completedApps.length}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Total Gasto (R$)</p>
                                    <p className="text-2xl font-black text-[#D4AF37] mt-1">R$ {totalSpent.toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Appointments List */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800">
                                {clientApps.length > 0 ? clientApps.map((app) => (
                                    <div key={app.id} className="bg-black/35 border border-[#1f1f1f] p-5 rounded-2xl flex items-center justify-between gap-4 hover:border-white/5 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center w-12 border-r border-[#1f1f1f] pr-4 shrink-0">
                                                <p className="text-lg font-black text-white">{app.date.split('-')[2]}</p>
                                                <p className="text-[9px] text-gray-500 uppercase font-black">
                                                    {new Date(app.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-100">{app.serviceName}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                                    Profissional: <span className="text-[#D4AF37]">{app.barberName}</span>
                                                </p>
                                                <p className="text-[9px] text-gray-600 mt-1">{app.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 flex flex-col items-end gap-2">
                                            <span className="text-sm font-black text-[#D4AF37]">R$ {app.price.toFixed(2)}</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                                                app.status === 'concluido' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                app.status === 'cancelado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                app.status === 'agendado' || app.status === 'confirmado' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-12 text-center text-gray-600 italic">
                                        <p>Nenhum agendamento encontrado para este cliente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

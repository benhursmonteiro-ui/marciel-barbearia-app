"use client";

import React, { useState, useMemo } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useBarber, Service } from "@/context/BarberContext";

export default function AdminServicos() {
    const { services, addService, updateService, removeService } = useBarber();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        icon: "✂️",
        popular: false
    });

    // Stats calculation
    const stats = useMemo(() => {
        const total = services.length;
        const active = services.filter(s => s.active).length;
        const popular = services.filter(s => s.popular).length;
        const avgPrice = total > 0
            ? services.reduce((acc, s) => acc + s.price, 0) / total
            : 0;

        return { total, active, popular, avgPrice };
    }, [services]);

    // Filtered services
    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.price) return;

        const priceNum = parseFloat(formData.price.replace("R$", "").replace(",", ".").trim());
        const durationStr = formData.duration.endsWith("min") ? formData.duration : `${formData.duration} min`;

        setIsSaving(true);
        try {
            if (isEditing && editId !== null) {
                await updateService(editId, {
                    name: formData.name,
                    description: formData.description,
                    price: priceNum,
                    duration: durationStr,
                    icon: formData.icon,
                    popular: formData.popular
                });
            } else {
                await addService({
                    name: formData.name,
                    description: formData.description,
                    price: priceNum,
                    duration: durationStr,
                    icon: formData.icon,
                    popular: formData.popular,
                    active: true
                });
            }
            resetForm();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar serviço.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (service: Service) => {
        setIsEditing(true);
        setEditId(service.id);
        setFormData({
            name: service.name,
            description: service.description || "",
            price: service.price.toString(),
            duration: service.duration.replace(" min", ""),
            icon: service.icon || "✂️",
            popular: service.popular || false
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: "", description: "", price: "", duration: "", icon: "✂️", popular: false });
        setIsFormOpen(false);
    };

    const toggleStatus = async (service: Service) => {
        await updateService(service.id, { active: !service.active });
    };

    const togglePopular = async (service: Service) => {
        await updateService(service.id, { popular: !service.popular });
    };

    const handleDelete = async (id: string) => {
        if (confirm("Deseja realmente remover este serviço permanentemente?")) {
            await removeService(id);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-10 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">

            {/* Header com Busca e Novos Ações */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-12">
                <div className="w-full lg:w-auto text-center lg:text-left">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic">SERVIÇOS</h1>
                    <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Gestão completa do catálogo</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:flex-1 lg:w-80">
                        <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar serviço..."
                            className="pl-12 bg-[#111] border-[#1f1f1f] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                        />
                    </div>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-[#D4AF37] text-black hover:bg-white h-14 rounded-2xl px-8 font-black uppercase tracking-wider shadow-xl shadow-[#D4AF37]/10 w-full sm:w-auto"
                    >
                        <Icon name="Plus" className="w-5 h-5 mr-2" />
                        Novo Serviço
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                {[
                    { label: "Total", val: stats.total, icon: "Layers", color: "text-blue-500" },
                    { label: "Ativos", val: stats.active, icon: "CheckCircle", color: "text-emerald-500" },
                    { label: "Populares", val: stats.popular, icon: "Star", color: "text-amber-500" },
                    { label: "Preço Médio", val: `R$ ${stats.avgPrice.toFixed(0)}`, icon: "DollarSign", color: "text-[#D4AF37]" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#111] border-[#1f1f1f] p-4 md:p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-full pointer-events-none transition-all group-hover:scale-150" />
                        <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 relative z-10 text-center xs:text-left">
                            <div className={`${stat.color} bg-[#1a1a1a] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/5 shrink-0`}>
                                <Icon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] md:text-[10px] uppercase text-gray-500 font-black tracking-widest truncate">{stat.label}</p>
                                <h3 className="text-xl md:text-2xl font-black truncate">{stat.val}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                        <Card key={service.id} className={`group cursor-pointer bg-[#111] border-[#1f1f1f] hover:border-[#D4AF37]/30 transition-all p-0 overflow-hidden relative ${!service.active ? 'opacity-50 grayscale' : ''}`}>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-black border border-[#1f1f1f] shadow-inner flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                        {service.icon || "✂️"}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); togglePopular(service); }}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${service.popular ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                                            title={service.popular ? "Remover dos Populares" : "Marcar como Popular"}
                                        >
                                            <Icon name="Star" className={`w-4 h-4 ${service.popular ? 'fill-current' : ''}`} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleStatus(service); }}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${service.active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-red-500/10 text-red-500 border border-red-500/10'}`}
                                            title={service.active ? "Desativar" : "Ativar"}
                                        >
                                            <Icon name={service.active ? "Power" : "Play"} className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black group-hover:text-[#D4AF37] transition-colors">{service.name}</h3>
                                        {service.popular && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 h-10 italic uppercase font-medium">{service.description || "Sem descrição disponível."}</p>
                                </div>

                                <div className="bg-[#0a0a0a]/50 rounded-2xl p-4 flex justify-between items-center border border-white/5">
                                    <div className="flex items-center gap-2 text-xs font-black uppercase text-gray-400">
                                        <Icon name="Clock" className="w-4 h-4 text-[#D4AF37]" />
                                        <span>{service.duration}</span>
                                    </div>
                                    <div className="text-[#D4AF37] font-black text-lg">
                                        R$ {service.price.toFixed(2)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); handleEdit(service); }}
                                        variant="outline"
                                        className="bg-transparent border-[#1f1f1f] text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-[10px] uppercase font-black tracking-widest h-10"
                                    >
                                        <Icon name="Edit" className="w-3 h-3 mr-2" />
                                        Editar
                                    </Button>
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(service.id); }}
                                        variant="outline"
                                        className="bg-transparent border-[#1f1f1f] text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] uppercase font-black tracking-widest h-10"
                                    >
                                        <Icon name="Trash2" className="w-3 h-3 mr-2" />
                                        Remover
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-[#111] rounded-[40px] border border-dashed border-[#1f1f1f]">
                        <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon name="Search" className="w-10 h-10 text-gray-700" />
                        </div>
                        <h3 className="text-xl font-black text-gray-400 mb-2 uppercase">Nenhum serviço encontrado</h3>
                        <p className="text-gray-600 text-xs max-w-md mx-auto italic uppercase font-bold tracking-widest">
                            Tente ajustar sua busca ou cadastre um novo serviço para seu catálogo começar a ganhar vida.
                        </p>
                    </div>
                )}
            </div>

            {/* Sidebar Form Panel (Simulated Modal) */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={resetForm} />
                    <div className="w-full max-w-md bg-[#111] h-full shadow-2xl relative z-[110] border-l border-[#1f1f1f] flex flex-col transform animate-slide-in-right">
                        <header className="p-8 border-b border-[#1f1f1f] flex justify-between items-center bg-[#0d0d0d]">
                            <div>
                                <h2 className="text-2xl font-black uppercase text-[#D4AF37]">{isEditing ? "Editar Serviço" : "Novo Serviço"}</h2>
                                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{isEditing ? "Altere as informações do serviço selecionado" : "Preencha os campos abaixo para adicionar"}</p>
                            </div>
                            <button onClick={resetForm} className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors">
                                <Icon name="X" className="w-5 h-5 text-white" />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Nome do Serviço</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: Corte Degradê Premium"
                                        className="bg-[#1a1a1a] border-[#252525] h-14 rounded-2xl focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/20"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Preço (R$)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
                                            <Input
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="0.00"
                                                className="pl-12 bg-[#1a1a1a] border-[#252525] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Duração (min)</label>
                                        <div className="relative">
                                            <Input
                                                required
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="40"
                                                className="bg-[#1a1a1a] border-[#252525] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-600 uppercase">Min</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Descrição</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Descreva o que está incluso no serviço..."
                                        className="w-full bg-[#1a1a1a] border border-[#252525] rounded-2xl p-4 min-h-[120px] text-sm focus:border-[#D4AF37]/50 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/20 transition-all text-white placeholder:text-gray-700 hover:border-[#2a2a2a]"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Configurações Extras</label>
                                    <div className="flex flex-col gap-4">
                                        <label className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/[0.08] transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.popular ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-[#0a0a0a]'}`}>
                                                    <Icon name="Star" className={`w-4 h-4 ${formData.popular ? 'fill-current' : ''}`} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">Serviço Popular</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Destaque para o cliente</p>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={formData.popular}
                                                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                                                className="w-6 h-6 accent-[#D4AF37] opacity-0 absolute"
                                            />
                                            <div className={`w-12 h-6 rounded-full transition-all relative ${formData.popular ? 'bg-amber-500' : 'bg-gray-800'}`}>
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${formData.popular ? 'left-7' : 'left-1'}`} />
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Ícone Representativo</label>
                                    <div className="grid grid-cols-5 gap-3">
                                        {["✂️", "💈", "🪒", "🧖", "💇‍♂️", "🧴", "🔥", "💎", "🧼", "🍺"].map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                className={`h-14 rounded-xl flex items-center justify-center text-xl transition-all border ${formData.icon === icon ? 'bg-[#D4AF37]/20 border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/10' : 'bg-black border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                                            >
                                                {icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <footer className="p-8 border-t border-[#1f1f1f] bg-[#0d0d0d] mt-auto">
                            <Button
                                type="submit"
                                form="service-form"
                                isLoading={isSaving}
                                className={`w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-[#D4AF37] text-black hover:bg-white shadow-[#D4AF37]/20 hover:-translate-y-1'}`}
                            >
                                {isEditing ? "Confirmar Edição" : "Cadastrar Serviço"}
                            </Button>
                        </footer>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1f1f1f;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #2a2a2a;
                }
            `}</style>
        </div>
    );
}

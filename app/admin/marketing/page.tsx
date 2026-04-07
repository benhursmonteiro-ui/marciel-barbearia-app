"use client";

import React, { useState } from "react";
import {
    TicketPercent,
    Plus,
    Search,
    Trash2,
    Edit,
    Type,
    DollarSign,
    Tag,
    Palette,
    Eye,
    EyeOff,
    CheckCircle2,
    X,
    Megaphone,
    Target,
    Users,
    TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBarber, Promotion } from "@/context/BarberContext";

export default function AdminMarketing() {
    const { promotions, addPromotion, updatePromotion, removePromotion } = useBarber();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
    const [activeTab, setActiveTab] = useState<'promotions' | 'campaigns'>('promotions');

    // Form states
    const [formData, setFormData] = useState({
        tag: "",
        title: "",
        description: "",
        price: 0,
        color: "from-[#1A1100] to-black",
        accentBg: "bg-[#D4AF37]",
        textColor: "text-black",
        active: true
    });

    const filteredPromos = promotions.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (promo?: Promotion) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData({
                tag: promo.tag,
                title: promo.title,
                description: promo.description,
                price: promo.price,
                color: promo.color,
                accentBg: promo.accentBg,
                textColor: promo.textColor,
                active: promo.active
            });
        } else {
            setEditingPromo(null);
            setFormData({
                tag: "",
                title: "",
                description: "",
                price: 0,
                color: "from-[#1A1100] to-black",
                accentBg: "bg-[#D4AF37]",
                textColor: "text-black",
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingPromo) {
                await updatePromotion(editingPromo.id, formData);
            } else {
                await addPromotion(formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar promoção.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase">Centro de <span className="text-[#D4AF37]">Marketing</span></h1>
                    <p className="text-gray-500 text-sm italic">Gerencie promoções e campanhas para atrair mais clientes.</p>
                </div>
                <div className="flex bg-[#111111] border border-[#1f1f1f] p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('promotions')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'promotions' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        PROMOÇÕES
                    </button>
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'campaigns' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        CAMPANHAS
                    </button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto space-y-12">
                {activeTab === 'promotions' ? (
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="relative group max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
                                <Input
                                    placeholder="Buscar Promoções..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 bg-[#111111] border-[#1f1f1f] h-14 text-sm focus:border-[#D4AF37]/50 rounded-2xl"
                                />
                            </div>
                            <Button
                                onClick={() => handleOpenModal()}
                                className="h-14 px-8 rounded-2xl bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform gap-2"
                            >
                                <Plus className="w-5 h-5" /> NOVA PROMOÇÃO
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPromos.map(promo => (
                                <div key={promo.id} className="bg-[#111111] border border-[#1f1f1f] rounded-[2.5rem] p-6 flex flex-col justify-between group hover:border-[#D4AF37]/20 transition-all">
                                    <div className="space-y-6">
                                        <div className={`relative overflow-hidden bg-gradient-to-br ${promo.color} border border-white/5 rounded-[2rem] p-6 opacity-80 group-hover:opacity-100 transition-opacity`}>
                                            <span className={`inline-block px-3 py-1 ${promo.accentBg} ${promo.textColor} text-[8px] font-black uppercase rounded-full mb-4 tracking-widest`}>
                                                {promo.tag}
                                            </span>
                                            <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                                            <p className="text-[10px] text-gray-500 mb-4 line-clamp-1 italic">{promo.description}</p>
                                            <p className="text-2xl font-black text-[#D4AF37]">R$ {promo.price.toFixed(2)}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-200">{promo.title}</h4>
                                                <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${promo.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {promo.active ? 'Ativa' : 'Inativa'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium leading-relaxed">
                                                ID: {promo.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#1f1f1f]">
                                        <Button
                                            onClick={() => handleOpenModal(promo)}
                                            variant="ghost"
                                            className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-[10px] font-black uppercase tracking-widest gap-2"
                                        >
                                            <Edit className="w-4 h-4" /> EDITAR
                                        </Button>
                                        <Button
                                            onClick={() => updatePromotion(promo.id, { active: !promo.active })}
                                            variant="ghost"
                                            className="w-12 h-12 p-0 rounded-xl bg-white/5 hover:bg-blue-500/10 hover:text-blue-500"
                                        >
                                            {promo.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </Button>
                                        <Button
                                            onClick={() => removePromotion(promo.id)}
                                            variant="ghost"
                                            className="w-12 h-12 p-0 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPromos.length === 0 && (
                            <div className="py-20 text-center space-y-4 opacity-20">
                                <TicketPercent size={64} className="mx-auto" />
                                <p className="text-sm font-bold uppercase tracking-widest">Nenhuma promoção encontrada.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-12 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Alcance Estimado", value: "1.2k", icon: Users, color: "text-blue-500" },
                                { title: "Taxa de Conversão", value: "8.4%", icon: Target, color: "text-[#D4AF37]" },
                                { title: "Impressões", value: "4.5k", icon: TrendingUp, color: "text-emerald-500" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#111111] border border-[#1f1f1f] p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />
                                    <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
                                    <p className="text-gray-500 text-[10px] font-black tracking-[0.3em] mb-1 uppercase">{stat.title}</p>
                                    <h3 className="text-3xl font-black mb-2 tracking-tight">{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#111111] border border-[#1f1f1f] rounded-[3rem] p-12 text-center space-y-8">
                            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-3xl flex items-center justify-center text-[#D4AF37] mx-auto">
                                <Megaphone className="w-10 h-10" />
                            </div>
                            <div className="max-w-md mx-auto space-y-4">
                                <h3 className="text-2xl font-black italic tracking-tighter uppercase">Disparo de Campanhas</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Em breve você poderá enviar suas promoções diretamente para o WhatsApp ou e-mail da sua base de clientes.
                                </p>
                            </div>
                            <Button disabled className="h-14 px-8 rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] font-black uppercase text-[10px] tracking-[0.2em] border border-[#D4AF37]/20">
                                CONFIGURAR DISPAROS
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#111111] border border-[#1f1f1f] rounded-[3rem] p-10 max-w-2xl w-full shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                        <header className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic">
                                    {editingPromo ? 'Editar' : 'Nova'} <span className="text-[#D4AF37]">Promoção</span>
                                </h2>
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Defina os detalhes da sua oferta.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1"><Tag size={12} className="text-[#D4AF37]" /> Etiqueta (ex: Especial)</label>
                                    <Input
                                        required
                                        value={formData.tag}
                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                        placeholder="EX: ESPECIAL DE PRIMAVERA"
                                        className="bg-[#1a1a1a] border-[#222] h-14"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1"><DollarSign size={12} className="text-[#4ade80]" /> Preço Promocional</label>
                                    <Input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="bg-[#1a1a1a] border-[#222] h-14"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1"><Type size={12} className="text-[#D4AF37]" /> Título da Oferta</label>
                                    <Input
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="EX: CORTE + HIDRATAÇÃO"
                                        className="bg-[#1a1a1a] border-[#222] h-14"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Descrição Curta</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-[#1a1a1a] border border-[#222] rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-[#D4AF37]/50 min-h-[100px]"
                                        placeholder="Breve descrição da promoção..."
                                    />
                                </div>


                                <div className="space-y-2 text-center flex flex-col justify-center">
                                    <label className="inline-flex items-center justify-center gap-4 cursor-pointer">
                                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Status: {formData.active ? 'Ativa' : 'Inativa'}</span>
                                        <input
                                            type="checkbox"
                                            checked={formData.active}
                                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                            className="hidden"
                                        />
                                        <div className={`w-14 h-7 rounded-full relative border transition-all ${formData.active ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                                            <div className={`absolute top-1 w-5 h-5 rounded-full transition-all ${formData.active ? 'right-1 bg-emerald-500' : 'left-1 bg-red-500'}`} />
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-[#1f1f1f]">
                                <Button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    variant="ghost"
                                    className="flex-1 h-14 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest"
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isSaving}
                                    className="flex-[2] h-14 rounded-2xl bg-[#D4AF37] text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform"
                                >
                                    {editingPromo ? 'SALVAR ALTERAÇÕES' : 'LANÇAR PROMOÇÃO'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useState, useRef, useMemo } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { useBarber, Barber as ContextBarber } from "@/context/BarberContext";
import { uploadImage } from "@/lib/supabase";

const SPECIALTIES = ["Corte Degradê", "Corte Social", "Barba", "Pigmentação", "Relaxamento", "Hidratação", "Pezinho"];

interface BarberFormState {
    name: string;
    email: string;
    password?: string;
    commission: string;
    specialty: string;
    workingHours: string;
    photo: string;
}

const EMPTY_FORM: BarberFormState = {
    name: "", email: "", password: "", commission: "40", specialty: "Corte Degradê", workingHours: "08:00 às 18:00", photo: ""
};

export default function AdminProfissionais() {
    const { barbers, users, addBarber, updateBarber, removeBarber } = useBarber();

    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<BarberFormState>(EMPTY_FORM);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculated team metrics
    const stats = useMemo(() => {
        const total = barbers.length;
        const active = barbers.filter(b => b.active).length;
        const avgCommission = total > 0
            ? Math.round(barbers.reduce((acc, b) => acc + (b.commission || 0), 0) / total)
            : 0;
        const avgRating = total > 0
            ? (barbers.reduce((acc, b) => acc + (b.rating || 5.0), 0) / total).toFixed(1)
            : "5.0";

        return { total, active, avgCommission, avgRating };
    }, [barbers]);

    const filteredBarbers = barbers.filter(b =>
        (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.specialty || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setForm({ ...EMPTY_FORM });
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEdit = (barber: ContextBarber) => {
        const user = users.find((u: any) => u.id === barber.userId);
        
        setForm({
            name: barber.name,
            email: user?.email || "",
            password: "",
            commission: barber.commission.toString(),
            specialty: barber.specialty,
            workingHours: barber.workingHours || "08:00 às 18:00",
            photo: barber.photo || ""
        });
        setIsEditing(true);
        setEditingId(barber.id);
        setIsModalOpen(true);
    };

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleDelete = async (id: string, name: string) => {
        if (id === 'b_marciel') {
            alert("O administrador principal não pode ser removido.");
            return;
        }
        if (confirm(`Deseja realmente remover o profissional ${name}?`)) {
            await removeBarber(id);
        }
    };

    const toggleStatus = async (barber: ContextBarber) => {
        await updateBarber(barber.id, { active: !barber.active });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || (!isEditing && !form.email)) return;

        setIsSaving(true);
        try {
            if (isEditing && editingId) {
                await updateBarber(editingId, {
                    name: form.name,
                    specialty: form.specialty,
                    commission: parseInt(form.commission),
                    workingHours: form.workingHours,
                    photo: form.photo
                });
            } else {
                await addBarber({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    specialty: form.specialty,
                    commission: parseInt(form.commission),
                    workingHours: form.workingHours,
                    photo: form.photo,
                    blockedSlots: [],
                    holidays: []
                });
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar profissional.");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            setForm(f => ({ ...f, photo: url }));
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar foto.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-10 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic">PROFISSIONAIS</h1>
                    <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Gestão de equipe e comissões</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:flex-1 lg:w-80">
                        <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar profissional..."
                            className="pl-12 bg-[#111] border-[#1f1f1f] h-14 rounded-2xl focus:border-[#D4AF37]/50"
                        />
                    </div>
                    <Button 
                        onClick={openCreate} 
                        className="bg-[#D4AF37] text-black hover:bg-white h-14 rounded-2xl px-8 font-black uppercase tracking-wider shadow-xl shadow-[#D4AF37]/10 w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <Icon name="UserPlus" className="w-5 h-5" /> Cadastrar Barbeiro
                    </Button>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                {[
                    { label: "Total Barbeiros", val: stats.total, icon: "Users", color: "text-blue-500" },
                    { label: "Equipe Ativa", val: stats.active, icon: "CheckCircle2", color: "text-emerald-500" },
                    { label: "Comissão Média", val: `${stats.avgCommission}%`, icon: "Percent", color: "text-amber-500" },
                    { label: "Rating Médio", val: stats.avgRating, icon: "Star", color: "text-[#D4AF37]" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#111] border-[#1f1f1f] p-4 md:p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-full pointer-events-none transition-all group-hover:scale-150" />
                        <div className="flex flex-col xs:flex-row items-center xs:items-start gap-4 relative z-10 text-center xs:text-left">
                            <div className={`${stat.color} bg-[#1a1a1a] w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border border-white/5 shrink-0`}>
                                <Icon name={stat.icon} className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] md:text-[10px] uppercase text-gray-500 font-black tracking-widest truncate">{stat.label}</p>
                                <h3 className="text-lg md:text-2xl font-black truncate">{stat.val}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBarbers.length > 0 ? filteredBarbers.map(b => (
                    <div key={b.id} className={`bg-[#111111] border border-[#1f1f1f] rounded-3xl p-6 flex flex-col gap-6 transition-all duration-300 relative group hover:border-[#D4AF37]/40 shadow-xl ${!b.active ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-24 h-24 rounded-2xl border-2 border-[#D4AF37]/20 overflow-hidden flex items-center justify-center bg-[#1a1a1a] text-3xl font-black text-[#D4AF37] group-hover:border-[#D4AF37]/60 transition-all shadow-inner relative">
                                {b.photo ? (
                                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{b.name?.[0] || '?'}</span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h3 className="text-lg font-black tracking-tight">{b.name}</h3>
                                    <span className={`w-2.5 h-2.5 rounded-full ${b.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                </div>
                                <p className="text-[#D4AF37] text-[9px] uppercase font-black tracking-[0.2em]">{b.specialty}</p>
                                <p className="text-gray-500 text-[9px] font-bold uppercase mt-1 italic">{b.workingHours || "08:00 às 18:00"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#0a0a0a] p-3 rounded-2xl border border-[#1f1f1f] text-center">
                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Comissão</p>
                                <p className="text-base font-black text-white">{b.commission}%</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-3 rounded-2xl border border-[#1f1f1f] text-center">
                                <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1">Rating</p>
                                <p className="text-base font-black text-[#D4AF37]">{(b.rating || 5.0).toFixed(1)} ★</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => openEdit(b)}
                                className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all"
                                title="Editar"
                            >
                                <Icon name="Edit3" className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleStatus(b)}
                                className={`flex-1 h-11 text-[9px] font-black uppercase tracking-widest gap-2 rounded-xl transition-all border flex items-center justify-center ${b.active ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'}`}
                            >
                                <Icon name={b.active ? "UserX" : "UserCheck"} className="w-4 h-4" />
                                {b.active ? "Desativar" : "Ativar"}
                            </button>
                            <button
                                onClick={() => handleDelete(b.id, b.name)}
                                className="w-11 h-11 rounded-xl bg-white/5 text-gray-500 border border-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                title="Remover"
                            >
                                <Icon name="Trash2" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full bg-[#111111] border border-[#1f1f1f] rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-2xl">
                        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 text-gray-600 border border-white/5">
                            <Icon name="Users" className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300 mb-1">Nenhum profissional encontrado</h3>
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Cadastre novos barbeiros para compor a equipe.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-[#111111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[48px] p-6 md:p-10 shadow-2xl animate-fade-in-up">
                        <header className="flex items-center justify-between mb-8 md:mb-10 text-center md:text-left">
                            <div className="w-full md:w-auto">
                                <h2 className="text-xl md:text-2xl font-black tracking-tighter">
                                    {isEditing ? "EDITAR PERFIL" : "NOVO BARBEIRO"}
                                </h2>
                                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">
                                    {isEditing ? "Atualize os dados da equipe" : "Defina os dados de acesso"}
                                </p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="hidden md:flex w-10 h-10 rounded-xl bg-[#1a1a1a] items-center justify-center text-gray-500 hover:text-white border border-[#222]">
                                <Icon name="X" className="w-5 h-5" />
                            </button>
                        </header>

                        <form onSubmit={handleSave} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Nome Completo *</label>
                                <Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl" placeholder="Ex: Marciel Santos" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">E-mail *</label>
                                    <Input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl" placeholder="email@barba.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Senha *</label>
                                    <Input required type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl" placeholder="******" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Especialidade</label>
                                    <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} className="w-full bg-[#1a1a1a] border-transparent h-14 rounded-2xl text-white text-sm font-bold px-4 focus:outline-none border border-[#222]">
                                        {SPECIALTIES.map(s => <option key={s} className="bg-[#111]">{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Horário</label>
                                    <Input value={form.workingHours} onChange={e => setForm(f => ({ ...f, workingHours: e.target.value }))} className="bg-[#1a1a1a] border-transparent h-14 rounded-2xl" placeholder="08:00 às 18:00" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2 flex items-center gap-2">
                                    <Icon name="Camera" className="w-3 h-3" /> Foto do Profissional
                                </label>
                                <div className="flex items-center gap-4">
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-20 h-20 rounded-full bg-[#1a1a1a] border border-[#222] flex flex-col items-center justify-center text-gray-500 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all cursor-pointer overflow-hidden relative group"
                                    >
                                        {isUploading ? (
                                            <Icon name="Loader2" className="w-6 h-6 animate-spin text-[#D4AF37]" />
                                        ) : form.photo ? (
                                            <>
                                                <img src={form.photo} alt="Preview" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                                <Icon name="RefreshCw" className="absolute w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-white" />
                                            </>
                                        ) : (
                                            <>
                                                <Icon name="User" className="w-6 h-6 mb-1" />
                                                <span className="text-[7px] font-black uppercase">Galeria</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input 
                                            value={form.photo} 
                                            onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
                                            className="bg-[#1a1a1a] border-transparent h-12 rounded-xl text-[10px]" 
                                            placeholder="URL da foto ou use a galeria" 
                                        />
                                        <p className="text-[8px] text-gray-600 font-bold italic ml-2">Clique no círculo para escolher uma foto.</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handlePhotoChange} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest ml-2 flex items-center gap-2">
                                    <Icon name="Percent" className="w-3 h-3" /> Comissão (%)
                                </label>
                                <div className="flex items-center gap-6">
                                    <input
                                        type="range" min="0" max="100" step="5"
                                        value={parseInt(form.commission) || 0}
                                        onChange={e => setForm(f => ({ ...f, commission: e.target.value }))}
                                        className="flex-1 accent-[#D4AF37] h-2 rounded-full bg-black border border-white/5"
                                    />
                                    <div className="w-16 h-12 md:w-20 md:h-14 bg-black border border-[#D4AF37]/30 rounded-2xl flex items-center justify-center text-[#D4AF37] text-xl md:text-2xl font-black">{form.commission}%</div>
                                </div>
                            </div>

                            <Button type="submit" isLoading={isSaving} className="w-full h-16 bg-[#D4AF37] text-black font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-white transition-all text-sm shadow-2xl shadow-[#D4AF37]/20 mt-4">
                                {isEditing ? "SALVAR ALTERAÇÕES" : "CADASTRAR PROFISSIONAL"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
            <style jsx global>{`
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
            `}</style>
        </div>
    );
}

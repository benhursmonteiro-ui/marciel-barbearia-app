"use client";

import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useBarber, Barber as ContextBarber } from "@/context/BarberContext";
import { uploadImage } from "@/lib/supabase";

function Icon({ name, className }: { name: string; className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: 20, height: 20, background: "#333", borderRadius: 4 }} />;
    return <LucideIcon className={className} />;
}

const SPECIALTIES = ["Corte Degradê", "Corte Social", "Barba", "Pigmentação", "Relaxamento", "Hidratação", "Pezinho"];
const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<BarberFormState>(EMPTY_FORM);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const openCreate = () => {
        setForm({ ...EMPTY_FORM });
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEdit = (barber: ContextBarber) => {
        // Find user by barber's userId to get email
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
        if (!form.name || !form.email) return;

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
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-10 font-sans animate-fade-in-up">
            <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 italic">PROFISSIONAIS</h1>
                    <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Gestão de equipe e comissões</p>
                </div>
                <Button onClick={openCreate} className="gap-2 h-14 bg-[#D4AF37] text-black font-black tracking-widest uppercase rounded-2xl shadow-lg shadow-[#D4AF37]/20 hover:bg-white transition-all w-full md:w-auto">
                    <Icon name="UserPlus" className="w-5 h-5" /> Cadastrar Barbeiro
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {barbers.length > 0 ? barbers.map(b => (
                    <div key={b.id} className={`bg-[#111111] border border-[#1f1f1f] rounded-[32px] p-8 flex flex-col gap-6 transition-all duration-500 relative group hover:border-[#D4AF37]/40 ${!b.active ? 'opacity-50 grayscale' : ''}`}>
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37]/20 overflow-hidden flex items-center justify-center bg-[#1a1a1a] text-3xl font-black text-[#D4AF37] group-hover:border-[#D4AF37]/60 transition-all">
                                {b.name?.[0] || '?'}
                            </div>
                            <div>
                                <div className="flex items-center justify-center gap-2">
                                    <h3 className="text-lg font-black tracking-tight">{b.name}</h3>
                                    <span className={`w-2 h-2 rounded-full ${b.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                                </div>
                                <p className="text-[#D4AF37] text-[9px] uppercase font-black tracking-[0.3em]">{b.specialty}</p>
                                <p className="text-gray-500 text-[8px] font-bold uppercase mt-1 italic">{b.workingHours}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#0a0a0a] p-3 rounded-2xl border border-[#1f1f1f] text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Comissão</p>
                                <p className="text-base font-black">{b.commission}%</p>
                            </div>
                            <div className="bg-[#0a0a0a] p-3 rounded-2xl border border-[#1f1f1f] text-center">
                                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Rating</p>
                                <p className="text-base font-black text-[#D4AF37]">{(b.rating || 5.0).toFixed(1)}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <button
                                onClick={() => openEdit(b)}
                                className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/10 flex items-center justify-center hover:bg-[#D4AF37] hover:text-black transition-all"
                                title="Editar"
                            >
                                <Icon name="Edit3" className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleStatus(b)}
                                className={`flex-1 h-11 text-[9px] font-black uppercase tracking-widest gap-2 rounded-xl transition-all border ${b.active ? 'bg-red-500/10 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10 hover:bg-emerald-500 hover:text-white'}`}
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
                    <div className="col-span-full py-20 text-center text-gray-600 italic">
                        <p>Nenhum profissional cadastrado.</p>
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

"use client";

import React, { useState, useRef } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { uploadImage } from "@/lib/supabase";
import { useBarber } from "@/context/BarberContext";

export default function AdminConfiguracoes() {
    const { currentUser, updateUser, shopConfig, updateShopConfig } = useBarber();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const logoInputRef = useRef<HTMLInputElement>(null);

    // Local state for all config fields
    const [localConfig, setLocalConfig] = useState(shopConfig);
    const [adminEmail, setAdminEmail] = useState(currentUser?.email || "");
    const [adminPass, setAdminPass] = useState(currentUser?.password || "");

    // Sync local state when context data arrives or changes
    React.useEffect(() => {
        if (shopConfig) {
            setLocalConfig(shopConfig);
        }
    }, [shopConfig]);

    React.useEffect(() => {
        if (currentUser) {
            setAdminEmail(currentUser.email || "");
            setAdminPass(currentUser.password || "");
        }
    }, [currentUser]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLogo(true);
        try {
            const url = await uploadImage(file);
            setLocalConfig(prev => ({ ...prev, logo: url }));
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar logo.");
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setShowSuccess(false);

        try {
            // Update admin credentials
            if (currentUser) {
                await updateUser(currentUser.id, {
                    email: adminEmail,
                    password: adminPass
                });
            }

            // Update shop config in context
            await updateShopConfig(localConfig);

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleDay = (day: string) => {
        setLocalConfig(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: { ...prev.workingHours[day], closed: !prev.workingHours[day].closed }
            }
        }));
    };

    const updateHour = (day: string, field: 'start' | 'end', value: string) => {
        setLocalConfig(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: { ...prev.workingHours[day], [field]: value }
            }
        }));
    };

    const replicateHours = () => {
        const monday = localConfig.workingHours["Segunda"];
        const newHours = { ...localConfig.workingHours };
        ["Terça", "Quarta", "Quinta", "Sexta"].forEach(day => {
            newHours[day] = { ...monday };
        });
        setLocalConfig(prev => ({ ...prev, workingHours: newHours }));
        alert("Horários da Segunda-feira replicados para dias úteis (Ter-Sex)!");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
                <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-1 italic">CONFIGURAÇÕES</h1>
                        <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em]">Personalize o funcionamento do negócio</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 1. Informações da Barbearia */}
                    <section className="bg-[#111111] border border-[#1f1f1f] rounded-[32px] p-8 shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />
                        <header className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                <Icon name="Store" className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">🏪 Informações</h2>
                        </header>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Nome do Negócio</label>
                                <Input value={localConfig.name} onChange={e => setLocalConfig(p => ({ ...p, name: e.target.value }))} placeholder="Marciel Barber Shop" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Logo da Barbearia</label>
                                <div className="flex gap-4">
                                    <div 
                                        onClick={() => logoInputRef.current?.click()}
                                        className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all cursor-pointer relative overflow-hidden group"
                                    >
                                        {isUploadingLogo ? (
                                            <Icon name="Loader2" className="w-5 h-5 animate-spin" />
                                        ) : localConfig.logo ? (
                                            <>
                                                <img src={localConfig.logo} alt="Logo" className="w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />
                                                <Icon name="RefreshCw" className="absolute w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </>
                                        ) : (
                                            <Icon name="Camera" className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input 
                                            value={localConfig.logo} 
                                            onChange={e => setLocalConfig(p => ({ ...p, logo: e.target.value }))} 
                                            placeholder="URL da imagem ou use a galeria" 
                                            className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" 
                                        />
                                        <input 
                                            type="file" 
                                            ref={logoInputRef} 
                                            onChange={handleLogoUpload} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Endereço Físico</label>
                                <Input value={localConfig.address} onChange={e => setLocalConfig(p => ({ ...p, address: e.target.value }))} placeholder="Ex: Rua das Tesouras, 123 - Centro" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>
                        </div>
                    </section>

                    {/* 2. Contatos */}
                    <section className="bg-[#111111] border border-[#1f1f1f] rounded-[32px] p-8 shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />
                        <header className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                <Icon name="Phone" className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">📞 Contatos e Social</h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">WhatsApp</label>
                                <Input value={localConfig.whatsapp} onChange={e => setLocalConfig(p => ({ ...p, whatsapp: e.target.value }))} placeholder="(00) 00000-0000" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Telefone Fixo</label>
                                <Input value={localConfig.phone} onChange={e => setLocalConfig(p => ({ ...p, phone: e.target.value }))} placeholder="(00) 0000-0000" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Instagram</label>
                                <div className="relative">
                                    <Icon name="Instagram" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input value={localConfig.social.instagram} onChange={e => setLocalConfig(p => ({ ...p, social: { ...p.social, instagram: e.target.value } }))} placeholder="@usuario" className="pl-12 bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Facebook</label>
                                <div className="relative">
                                    <Icon name="Facebook" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <Input value={localConfig.social.facebook} onChange={e => setLocalConfig(p => ({ ...p, social: { ...p.social, facebook: e.target.value } }))} placeholder="fb.com/pagina" className="pl-12 bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">E-mail Comercial</label>
                            <Input value={localConfig.email} onChange={e => setLocalConfig(p => ({ ...p, email: e.target.value }))} placeholder="contato@empresa.com" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                        </div>
                    </section>

                    {/* 3. Acesso e Segurança */}
                    <section className="bg-[#111111] border border-[#1f1f1f] rounded-[32px] p-8 shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full group-hover:bg-red-500/10 transition-all pointer-events-none" />
                        <header className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <Icon name="Shield" className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">🔒 Acesso Administrativo</h2>
                        </header>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">E-mail do Admin</label>
                                <Input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@teste.com" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-2">Senha do Admin</label>
                                <Input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="******" className="bg-[#1a1a1a] border-transparent h-12 rounded-xl focus:border-[#D4AF37]/40" />
                            </div>
                        </div>
                    </section>

                    {/* 3. Horário de Funcionamento */}
                    <section className="bg-[#111111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[40px] p-6 md:p-10 shadow-xl lg:col-span-2 space-y-8 md:space-y-10 relative group">
                        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/10">
                                    <Icon name="Clock" className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Funcionamento</h2>
                            </div>
                            <Button onClick={replicateHours} variant="outline" className="w-full md:w-auto text-[8px] md:text-[9px] font-black uppercase tracking-widest gap-2 h-10 border-[#1f1f1f]">
                                <Icon name="Copy" className="w-4 h-4" /> Replicar para dias úteis
                            </Button>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {Object.entries(localConfig.workingHours).map(([day, config]) => (
                                <div key={day} className={`bg-[#0a0a0a] border p-5 md:p-6 rounded-3xl flex flex-col gap-5 md:gap-6 transition-all ${config.closed ? 'opacity-40 border-red-500/20' : 'hover:border-[#D4AF37]/20 border-[#1f1f1f]'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{day}</span>
                                        <button
                                            onClick={() => toggleDay(day)}
                                            className={`w-10 h-5 rounded-full relative border transition-colors ${!config.closed ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-gray-500/10 border-gray-500/20'}`}
                                        >
                                            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all ${!config.closed ? 'right-0.5 bg-emerald-500' : 'left-0.5 bg-gray-600'}`} />
                                        </button>
                                    </div>
                                    {!config.closed ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={config.start}
                                                onChange={e => updateHour(day, 'start', e.target.value)}
                                                className="w-full bg-[#111111] border border-white/5 h-10 text-center text-[10px] md:text-xs font-bold rounded-xl focus:border-[#D4AF37]/50 focus:outline-none transition-all"
                                                placeholder="08:00"
                                            />
                                            <span className="text-gray-700 font-bold text-[8px] uppercase">às</span>
                                            <input
                                                type="text"
                                                value={config.end}
                                                onChange={e => updateHour(day, 'end', e.target.value)}
                                                className="w-full bg-[#111111] border border-white/5 h-10 text-center text-[10px] md:text-xs font-bold rounded-xl focus:border-[#D4AF37]/50 focus:outline-none transition-all"
                                                placeholder="18:00"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center border border-dashed border-red-500/20 rounded-xl py-2">
                                            <span className="text-[10px] font-black text-red-500/60 uppercase tracking-widest mx-auto italic">Fechado</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="flex flex-col items-center md:items-end gap-4 pt-4 md:pt-10 pb-10">
                    {showSuccess && (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 animate-fade-in-up w-full md:w-auto justify-center">
                            <Icon name="BadgeCheck" className="w-5 h-5" />
                            <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-center">Configurações salvas com sucesso!</span>
                        </div>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full md:w-auto h-16 px-16 text-black font-black uppercase tracking-[0.3em] rounded-3xl transition-all shadow-2xl relative overflow-hidden ${isSaving ? 'bg-gray-700' : 'bg-[#D4AF37] hover:bg-white'}`}
                    >
                        {isSaving ? (
                            <div className="flex items-center gap-3">
                                <Icon name="Loader2" className="w-5 h-5 animate-spin" />
                                <span>Processando...</span>
                            </div>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

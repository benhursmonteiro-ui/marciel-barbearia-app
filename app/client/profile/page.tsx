"use client";

import React, { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    Lock,
    Camera,
    ShieldCheck,
    Save,
    AlertCircle,
    CheckCircle2,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { useBarber } from '@/context/BarberContext';

export default function ProfilePage() {
    const { currentUser, updateUser } = useBarber();
    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState(currentUser?.phone || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [photo, setPhoto] = useState<string | null>(currentUser?.photo || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        try {
            await updateUser(currentUser.id, {
                name,
                email,
                phone: phone,
                password: newPassword || currentUser.password,
                photo: photo || undefined
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => setPhoto(event.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--color-dark-border)]">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Meu <span className="text-[var(--color-primary-gold)]">Perfil</span></h1>
                    <p className="text-gray-500 text-sm">Gerencie suas informações pessoais e preferências.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-[var(--color-primary-gold)]/10 border border-[var(--color-primary-gold)]/30 rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--color-primary-gold)] shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        CLIENTE VIP
                    </span>
                    <span className="text-xs text-gray-500 italic">Membro desde 2024</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar and Quick Stats */}
                <div className="space-y-8">
                    <div className="relative group mx-auto w-48 h-48 md:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary-gold)] to-amber-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative w-48 h-48 rounded-3xl border-2 border-[var(--color-dark-border)] group-hover:border-[var(--color-primary-gold)]/50 bg-[#111] overflow-hidden transition-all overflow-hidden flex items-center justify-center p-2">
                            {photo ? (
                                <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <User className="w-20 h-20 text-gray-700" />
                            )}
                            <label className="absolute bottom-4 right-4 cursor-pointer">
                                <div className="w-10 h-10 bg-[var(--color-primary-gold)] border-4 border-black rounded-xl text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                    <Camera className="w-5 h-5" />
                                </div>
                                <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-6 space-y-6">
                        <h4 className="text-sm font-bold flex items-center gap-2 italic mb-4">
                            <Star className="w-4 h-4 text-[var(--color-primary-gold)]" /> Seu Impacto
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                                <p className="text-xl font-black text-white">12</p>
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Cortes</p>
                            </div>
                            <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                                <p className="text-xl font-black text-white">05</p>
                                <p className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">Availações</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Barbeiros Favoritos</h5>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-primary-gold)] border border-white/10" title="Marcelo Silva">MS</div>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[var(--color-primary-gold)] border border-white/10" title="Ricardo Alves">RA</div>
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 border border-dashed border-white/10 hover:border-white/20 transition-all cursor-pointer"><User className="w-3 h-3" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSave} className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-3xl p-8 shadow-2xl space-y-10">
                        {/* Personal Info Group */}
                        <section className="space-y-6">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Informações Básicas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Nome Completo</label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4 text-gray-500" />} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">E-mail</label>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" icon={<Mail className="w-4 h-4 text-gray-500" />} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">WhatsApp / Telefone</label>
                                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="w-4 h-4 text-gray-500" />} />
                                </div>
                            </div>
                        </section>

                        {/* Security Group */}
                        <section className="space-y-6 pt-10 border-t border-white/5">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <Lock className="w-5 h-5 text-red-500" /> Alterar Senha
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <Input
                                    placeholder="Senha Atual"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="bg-black/40"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Nova Senha"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="bg-black/40"
                                    />
                                    <Input
                                        placeholder="Repetir Senha"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="bg-black/40"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 px-2 italic flex items-start gap-2">
                                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                    Use pelo menos 8 caracteres com uma mistura de letras e números para maior segurança.
                                </p>
                            </div>
                        </section>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10   border-t border-white/5">
                            <p className="text-gray-500 text-xs italic">Sua conta é processada com criptografia de ponta a ponta.</p>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className={`w-full md:w-auto h-14 px-12 gap-2 text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all ${isSaved ? 'bg-emerald-600' : 'bg-[var(--color-primary-gold)] text-black'
                                    }`}
                            >
                                {isSaved ? (
                                    <><CheckCircle2 className="w-5 h-5 animate-scale-in" /> DADOS SALVOS</>
                                ) : (
                                    <><Save className="w-5 h-5" /> SALVAR ALTERAÇÕES</>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import {
    User as UserIcon,
    Camera,
    Smartphone,
    Mail,
    Lock,
    Save,
    Scissors,
    CheckCircle2,
    ShieldCheck,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBarber } from '@/context/BarberContext';

export default function BarberProfile() {
    const { currentUser, barbers, updateBarber, updateUser } = useBarber();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Encontra os dados do barbeiro vinculado ao usuário logado
    const barber = barbers.find(b => b.userId === currentUser?.id);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        password: ""
    });

    // Inicializa o formulário com dados reais
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                specialty: barber?.specialty || ""
            }));
        }
    }, [currentUser, barber]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        try {
            // 1. Atualiza dados do usuário (nome, senha se houver)
            const userUpdate: any = { name: formData.name };
            if (formData.password) userUpdate.password = formData.password;
            
            await updateUser(currentUser.id, userUpdate);

            // 2. Atualiza dados do barbeiro (especialidade)
            if (barber) {
                await updateBarber(barber.id, {
                    name: formData.name, // Mantém sincronizado se o adm mudar lá
                    specialty: formData.specialty
                });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar perfil.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Meu <span className="text-[var(--color-primary-gold)]">Perfil</span></h1>
                    <p className="text-gray-500 text-sm italic">Gerencie suas informações profissionais e preferências.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Side: Avatar & Public Info */}
                <div className="space-y-8">
                    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary-gold)]/5 rounded-full blur-[40px] -mr-16 -mt-16" />

                        <div className="relative inline-block mb-6 group">
                            <div className="w-32 h-32 rounded-[2rem] bg-black border-2 border-[var(--color-primary-gold)]/20 p-1 overflow-hidden transition-all group-hover:border-[var(--color-primary-gold)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                <img 
                                    src={currentUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff&size=200`} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover rounded-[1.5rem]" 
                                />
                            </div>
                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-[var(--color-primary-gold)] text-black rounded-xl border-4 border-[var(--color-dark-card)] flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                                <Camera size={18} />
                            </button>
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-tight">{formData.name || "Sem Nome"}</h2>
                        <p className="text-[10px] text-[var(--color-primary-gold)] font-black uppercase tracking-[0.2em] mt-2 italic">
                            {formData.specialty || "Barbeiro Parceiro"}
                        </p>

                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-lg font-black text-white">{barber?.rating?.toFixed(1) || "5.0"}</p>
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Nota</p>
                            </div>
                            <div className="border-x border-white/5">
                                <p className="text-lg font-black text-white">{barber?.reviews || "0"}</p>
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Cortes</p>
                            </div>
                            <div>
                                <p className="text-lg font-black text-white">Novo</p>
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Exp.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2 italic">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Permissões da Conta
                        </h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Acesso Administrativo', status: currentUser.role === 'admin' ? 'Ativo' : 'Inativo' },
                                { label: 'Gerenciar Outros Barbeiros', status: currentUser.role === 'admin' ? 'Ativo' : 'Inativo' },
                                { label: 'Visualizar Financeiro Global', status: currentUser.role === 'admin' ? 'Ativo' : 'Inativo' },
                            ].map((perm, i) => (
                                <div key={i} className={`flex items-center justify-between text-[10px] font-bold p-3 rounded-xl border ${perm.status === 'Ativo' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-black/40 border-white/5 opacity-60'}`}>
                                    <span className="text-gray-400">{perm.label}</span>
                                    <span className={`${perm.status === 'Ativo' ? 'text-emerald-500' : 'text-red-500/50'} uppercase`}>{perm.status}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-700 italic text-center font-medium">Contate o administrador para alterar permissões.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSave} className="bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-[3rem] p-10 md:p-14 shadow-2xl space-y-12">
                        {/* Section: Basic Info */}
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold flex items-center gap-3 italic">
                                <UserIcon className="w-5 h-5 text-[var(--color-primary-gold)]" /> Dados Profissionais
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Seu Nome Completo</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-primary-gold)] transition-colors" />
                                        <Input 
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nome do Barbeiro" 
                                            className="bg-black/40 h-14 pl-12 border-white/5 rounded-2xl focus:border-[var(--color-primary-gold)]/50 transition-all font-bold" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">E-mail Principal (Somente Leitura)</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                        <Input disabled value={formData.email} className="bg-black/20 h-14 pl-12 border-white/5 rounded-2xl text-gray-600 cursor-not-allowed border-dashed" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Telefone Celular</label>
                                    <div className="relative group">
                                        <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[var(--color-primary-gold)] transition-colors" />
                                        <Input 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+55 11 99999-9999" 
                                            className="bg-black/40 h-14 pl-12 border-white/5 rounded-2xl focus:border-[var(--color-primary-gold)]/50 transition-all font-bold" 
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Minha Especialidade (Bio Profissional)</label>
                                    <textarea
                                        value={formData.specialty}
                                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                        className="w-full bg-black/40 border-2 border-white/5 focus:border-[var(--color-primary-gold)]/50 rounded-2xl p-5 text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none transition-all resize-none h-32 font-medium"
                                        placeholder="Ex: Especialista em Degradê e Barba..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Security */}
                        <div className="space-y-8 pt-6 border-t border-white/5">
                            <h3 className="text-xl font-bold flex items-center gap-3 italic">
                                <Lock className="w-5 h-5 text-amber-500" /> Alterar Senha
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 italic">Nova Senha</label>
                                    <div className="relative">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="Deixe em branco para não alterar" 
                                            className="bg-black/40 h-14 pl-12 border-white/5 rounded-2xl" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic max-w-xs text-center md:text-left">
                                Suas alterações serão refletidas em seu perfil público da barbearia.
                            </p>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className={`w-full md:w-auto h-16 px-14 rounded-2xl font-black text-xs tracking-widest shadow-2xl transition-all ${success ? 'bg-emerald-600' : 'bg-[var(--color-primary-gold)] text-black shadow-[0_10px_30px_rgba(212,175,55,0.2)]'}`}
                            >
                                {success ? (
                                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> SALVO!</span>
                                ) : (
                                    <span className="flex items-center gap-2"><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

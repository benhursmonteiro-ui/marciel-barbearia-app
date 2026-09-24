"use client";

import { useState } from "react";
import { Scissors, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useBarber } from "@/context/BarberContext";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { login: setBarberLogin } = useBarber();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("E-mail e senha são obrigatórios.");
            return;
        }

        setIsLoading(true);

        try {
            const user = await setBarberLogin(email, password);
            if (user) {
                setSuccess(`Acesso permitido. Bem-vindo, ${user.name}!`);
                const destination = user.role === 'admin' ? '/admin' : user.role === 'barber' ? '/barber' : '/client/schedule';
                setTimeout(() => router.push(destination), 1000);
            } else {
                setError("E-mail ou senha incorretos.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Erro ao processar sua solicitação.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-dark-bg)] text-white flex flex-col items-center justify-center p-4 selection:bg-[var(--color-primary-gold)] selection:text-black overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary-gold)]/5 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-primary-gold)]/5 rounded-full blur-[120px] animate-pulse" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                {/* Botão para voltar ao agendamento direto */}
                <div className="mb-6 flex justify-start">
                    <Link
                        href="/client/schedule"
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[var(--color-primary-gold)] transition-colors border border-white/10 bg-white/5 px-4 py-2 rounded-xl"
                    >
                        <ArrowLeft className="w-4 h-4" /> Voltar ao Agendamento Direto
                    </Link>
                </div>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-20 h-20 bg-black border-2 border-[var(--color-primary-gold)] rounded-[2rem] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(212,175,55,0.15)] group hover:scale-105 transition-transform duration-500">
                        <Scissors className="w-10 h-10 text-[var(--color-primary-gold)] transition-transform" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-light tracking-[0.2em] text-white italic uppercase leading-none">Marciel</h1>
                        <p className="text-[var(--color-primary-gold)] tracking-[0.5em] text-[10px] uppercase font-black pl-1">BarberShop • Acesso ADM & Barbeiro</p>
                    </div>
                </div>

                <div className="bg-[var(--color-dark-card)] rounded-[2.5rem] p-8 md:p-10 border border-[var(--color-dark-border)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                    <h2 className="text-sm font-black uppercase tracking-widest text-center text-white mb-6">LOGIN ADMINISTRATIVO / BARBEIRO</h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold py-3 px-4 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> <span>{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold py-3 px-4 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4" /> <span>{success}</span>
                            </div>
                        )}

                        <div className="space-y-5">
                            <Input
                                label="Seu E-mail"
                                type="email"
                                placeholder="marciel_farias@admin.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                            />

                            <div className="relative">
                                <Input
                                    label="Sua Senha"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="w-4 h-4" />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-[2.35rem] text-gray-500 hover:text-[var(--color-primary-gold)] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" isLoading={isLoading} className="w-full h-14 rounded-2xl shadow-2xl mt-4 font-black text-xs tracking-[0.2em]">
                            ENTRAR
                        </Button>
                    </form>
                </div>

                <footer className="mt-8 text-center opacity-40">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] italic">&copy; {new Date().getFullYear()} MARCIEL BARBERSHOP. PREMIUM EXPERIENCE.</p>
                </footer>
            </div>
        </div>
    );
}

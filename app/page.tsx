"use client";

import { useState } from "react";
import { Scissors, Mail, Lock, User, Phone, CheckCircle2, AlertCircle, Eye, EyeOff, MessageSquare, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useRouter } from "next/navigation";
import { useBarber, UserRole } from "@/context/BarberContext";

// Validation helpers
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
  if (pwd.length === 0) return { label: "", color: "", width: "0%" };
  if (pwd.length < 6) return { label: "Muito fraca", color: "bg-red-500", width: "20%" };
  if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { label: "Fraca", color: "bg-orange-500", width: "40%" };
  if (!strongPasswordRegex.test(pwd)) return { label: "Média", color: "bg-yellow-400", width: "65%" };
  return { label: "Forte ✓", color: "bg-emerald-500", width: "100%" };
}

// View modes
type ViewMode = 'login' | 'forgot-email' | 'forgot-newpass' | 'forgot-success';

export default function LoginPage() {
  const router = useRouter();
  const { login: setBarberLogin, register, loginWithGoogle, resetPassword } = useBarber();

  // Auth states
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password states
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const strength = isRegistering ? getPasswordStrength(password) : { label: "", color: "", width: "0%" };
  const newPassStrength = viewMode === 'forgot-newpass' ? getPasswordStrength(newPassword) : { label: "", color: "", width: "0%" };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isRegistering) {
      if (!name || !phone || !email || !password || !confirmPassword) {
        setError("Preencha todos os campos obrigatórios.");
        return;
      }
      if (!emailRegex.test(email)) {
        setError("Por favor, insira um e-mail válido.");
        return;
      }
      if (!strongPasswordRegex.test(password)) {
        setError("A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e caracteres especiais (!, @, #, $, etc).");
        return;
      }
      if (password !== confirmPassword) {
        setError("Confirmação de senha não confere.");
        return;
      }
    } else {
      if (!email || !password) {
        setError("E-mail e senha são obrigatórios.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        const newUser = await register(name, email, password, 'client', phone);
        if (newUser) {
          setSuccess("Conta criada com sucesso!");
          setTimeout(() => router.push("/client"), 1500);
        } else {
          setError("Erro ao criar conta. E-mail já pode estar em uso.");
        }
      } else {
        const user = await setBarberLogin(email, password);
        if (user) {
          setSuccess(`Acesso permitido. Bem-vindo, ${user.name}!`);
          const destination = user.role === 'admin' ? '/admin' : user.role === 'barber' ? '/barber' : '/client';
          setTimeout(() => router.push(destination), 1000);
        } else {
          setError("E-mail ou senha incorretos.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao processar sua solicitação.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 — verify email exists
  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!forgotEmail || !emailRegex.test(forgotEmail)) {
      setForgotError("Insira um e-mail válido.");
      return;
    }
    // Se o e-mail não existir, o resetPassword vai retornar erro na próxima etapa.
    // Aqui apenas avançamos para a tela de nova senha (para não expor quais e-mails existem).
    setViewMode('forgot-newpass');
  };

  // Step 2 — set new password
  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!newPassword) {
      setForgotError("Informe a nova senha.");
      return;
    }
    if (!strongPasswordRegex.test(newPassword)) {
      setForgotError("A senha deve ter no mínimo 8 caracteres, com letras maiúsculas, minúsculas, números e caracteres especiais.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setForgotError("As senhas não conferem.");
      return;
    }

    setForgotLoading(true);
    try {
      const result = await resetPassword(forgotEmail, newPassword);
      if (result.success) {
        setViewMode('forgot-success');
      } else {
        setForgotError(result.message);
      }
    } catch {
      setForgotError("Erro inesperado. Tente novamente.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setForgotEmail("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setForgotError("");
    setShowNewPassword(false);
    setShowNewPasswordConfirm(false);
    setViewMode('login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white flex flex-col items-center justify-center p-4 selection:bg-[var(--color-primary-gold)] selection:text-black overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary-gold)]/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--color-primary-gold)]/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-20 bg-black border-2 border-[var(--color-primary-gold)] rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.15)] group hover:scale-105 transition-transform duration-500">
            <Scissors className="w-10 h-10 text-[var(--color-primary-gold)] transition-transform" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-light tracking-[0.2em] text-white italic uppercase leading-none">Marciel</h1>
            <p className="text-[var(--color-primary-gold)] tracking-[0.5em] text-[10px] uppercase font-black pl-1">BarberShop</p>
          </div>
        </div>

        <div className="bg-[var(--color-dark-card)] rounded-[2.5rem] p-8 md:p-10 border border-[var(--color-dark-border)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">

          {/* ═══════════════════════════════════════════
              VIEW: LOGIN / CADASTRO (padrão)
          ═══════════════════════════════════════════ */}
          {viewMode === 'login' && (
            <>
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-8 overflow-hidden">
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setError(""); }}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isRegistering ? 'bg-[var(--color-primary-gold)] text-black shadow-lg shadow-[var(--color-primary-gold)]/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setError(""); }}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isRegistering ? 'bg-[var(--color-primary-gold)] text-black shadow-lg shadow-[var(--color-primary-gold)]/10' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  CADASTRAR
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold py-3 px-4 rounded-xl flex items-start gap-3"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}</div>}
                {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold py-3 px-4 rounded-xl flex items-center gap-3"><CheckCircle2 className="w-4 h-4" /> {success}</div>}

                <div className="space-y-5">
                  {isRegistering && (
                    <>
                      <Input label="Nome Completo" placeholder="João da Silva" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} />
                      <Input label="WhatsApp" placeholder="+55 11 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} icon={<Phone className="w-4 h-4" />} />
                    </>
                  )}

                  <Input label="Seu E-mail" type="email" placeholder="usuario@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} />

                  {/* Senha com olhinho */}
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

                  {/* Indicador de força apenas no cadastro */}
                  {isRegistering && password.length > 0 && (
                    <div className="space-y-2 -mt-2">
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
                      </div>
                      <p className="text-[10px] font-bold text-gray-500">
                        Força da senha: <span className={strength.label === "Forte ✓" ? "text-emerald-400" : strength.label === "Média" ? "text-yellow-400" : "text-red-400"}>{strength.label}</span>
                      </p>
                      <p className="text-[9px] text-gray-600 leading-relaxed">
                        Mínimo 8 caracteres com letras <span className="text-gray-400">maiúsculas</span>, <span className="text-gray-400">minúsculas</span>, <span className="text-gray-400">números</span> e caracteres especiais <span className="text-gray-400">(!, @, #, $, etc)</span>
                      </p>
                    </div>
                  )}

                  {/* Confirmar senha com olhinho */}
                  {isRegistering && (
                    <div className="relative">
                      <Input
                        label="Confirmar Senha"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repita sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<Lock className="w-4 h-4" />}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-[2.35rem] text-gray-500 hover:text-[var(--color-primary-gold)] transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Esqueceu a senha — link visível só no login */}
                {!isRegistering && (
                  <div className="flex justify-end -mt-2">
                    <button
                      type="button"
                      onClick={() => { setForgotEmail(email); setForgotError(""); setViewMode('forgot-email'); }}
                      className="text-[10px] font-bold text-[var(--color-primary-gold)]/70 hover:text-[var(--color-primary-gold)] transition-colors underline underline-offset-2"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                )}

                <Button type="submit" isLoading={isLoading} className="w-full h-14 rounded-2xl shadow-2xl mt-4 font-black text-xs tracking-[0.2em]">
                  {isRegistering ? 'FINALIZAR CADASTRO' : 'ENTRAR'}
                </Button>
              </form>
            </>
          )}

          {/* ═══════════════════════════════════════════
              VIEW: FORGOT — STEP 1 (e-mail)
          ═══════════════════════════════════════════ */}
          {viewMode === 'forgot-email' && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center gap-3 mb-7">
                <button
                  type="button"
                  onClick={resetForgotFlow}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary-gold)] hover:border-[var(--color-primary-gold)]/30 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Redefinir Senha</h2>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Etapa 1 de 2 — Confirme seu e-mail</p>
                </div>
              </div>

              {/* Ícone decorativo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary-gold)]/10 border border-[var(--color-primary-gold)]/20 flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-[var(--color-primary-gold)]" strokeWidth={1.5} />
                </div>
              </div>

              <p className="text-center text-[11px] text-gray-400 leading-relaxed mb-7">
                Informe o <span className="text-white font-bold">e-mail cadastrado</span> na sua conta. Você poderá definir uma nova senha na próxima etapa.
              </p>

              {forgotError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold py-3 px-4 rounded-xl flex items-start gap-3 mb-5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {forgotError}
                </div>
              )}

              <form onSubmit={handleForgotEmailSubmit} className="space-y-5">
                <Input
                  label="E-mail da conta"
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                />

                <Button type="submit" isLoading={forgotLoading} className="w-full h-14 rounded-2xl shadow-2xl font-black text-xs tracking-[0.2em]">
                  CONTINUAR
                </Button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              VIEW: FORGOT — STEP 2 (nova senha)
          ═══════════════════════════════════════════ */}
          {viewMode === 'forgot-newpass' && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="flex items-center gap-3 mb-7">
                <button
                  type="button"
                  onClick={() => { setForgotError(""); setViewMode('forgot-email'); }}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary-gold)] hover:border-[var(--color-primary-gold)]/30 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Nova Senha</h2>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Etapa 2 de 2 — Crie sua nova senha</p>
                </div>
              </div>

              {/* E-mail confirmado */}
              <div className="flex items-center gap-2 bg-[var(--color-primary-gold)]/5 border border-[var(--color-primary-gold)]/15 rounded-xl px-4 py-3 mb-6">
                <Mail className="w-3.5 h-3.5 text-[var(--color-primary-gold)] shrink-0" />
                <span className="text-[10px] font-bold text-gray-300 truncate">{forgotEmail}</span>
              </div>

              {forgotError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-bold py-3 px-4 rounded-xl flex items-start gap-3 mb-5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {forgotError}
                </div>
              )}

              <form onSubmit={handleNewPasswordSubmit} className="space-y-5">
                {/* Nova senha */}
                <div className="relative">
                  <Input
                    label="Nova Senha"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-[2.35rem] text-gray-500 hover:text-[var(--color-primary-gold)] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Indicador de força */}
                {newPassword.length > 0 && (
                  <div className="space-y-2 -mt-1">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${newPassStrength.color}`} style={{ width: newPassStrength.width }} />
                    </div>
                    <p className="text-[10px] font-bold text-gray-500">
                      Força: <span className={newPassStrength.label === "Forte ✓" ? "text-emerald-400" : newPassStrength.label === "Média" ? "text-yellow-400" : "text-red-400"}>{newPassStrength.label}</span>
                    </p>
                    <p className="text-[9px] text-gray-600 leading-relaxed">
                      Mínimo 8 caracteres com letras <span className="text-gray-400">maiúsculas</span>, <span className="text-gray-400">minúsculas</span>, <span className="text-gray-400">números</span> e <span className="text-gray-400">caracteres especiais</span>
                    </p>
                  </div>
                )}

                {/* Confirmar nova senha */}
                <div className="relative">
                  <Input
                    label="Confirmar Nova Senha"
                    type={showNewPasswordConfirm ? "text" : "password"}
                    placeholder="Repita a nova senha"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                    className="absolute right-4 top-[2.35rem] text-gray-500 hover:text-[var(--color-primary-gold)] transition-colors"
                    tabIndex={-1}
                  >
                    {showNewPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {newPasswordConfirm.length > 0 && (
                  <p className={`text-[10px] font-bold -mt-1 ${newPassword === newPasswordConfirm ? 'text-emerald-400' : 'text-red-400'}`}>
                    {newPassword === newPasswordConfirm ? '✓ Senhas conferem' : '✗ Senhas não conferem'}
                  </p>
                )}

                <Button type="submit" isLoading={forgotLoading} className="w-full h-14 rounded-2xl shadow-2xl font-black text-xs tracking-[0.2em]">
                  SALVAR NOVA SENHA
                </Button>
              </form>
            </div>
          )}

          {/* ═══════════════════════════════════════════
              VIEW: FORGOT — SUCCESS
          ═══════════════════════════════════════════ */}
          {viewMode === 'forgot-success' && (
            <div className="animate-fade-in-up flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <ShieldCheck className="w-9 h-9 text-emerald-400" strokeWidth={1.5} />
              </div>

              <h2 className="text-lg font-black uppercase tracking-widest text-white mb-2">Senha Alterada!</h2>
              <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
                Sua senha foi redefinida com sucesso.
              </p>
              <p className="text-[10px] text-[var(--color-primary-gold)] font-bold mb-8">
                {forgotEmail}
              </p>

              <Button
                type="button"
                onClick={resetForgotFlow}
                className="w-full h-14 rounded-2xl shadow-2xl font-black text-xs tracking-[0.2em]"
              >
                FAZER LOGIN
              </Button>
            </div>
          )}

        </div>

        {/* WhatsApp link — visível apenas na tela de login */}
        {viewMode === 'login' && (
          <div className="flex justify-center mt-6 mb-2">
            <a
              href="https://wa.me/558999850601"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[var(--color-primary-gold)] transition-colors border border-white/5 bg-white/5 px-4 py-2 rounded-full"
            >
              <MessageSquare className="w-3 h-3 text-[#25D366]" /> Dúvidas? Fale Conosco no WhatsApp
            </a>
          </div>
        )}

        <footer className="mt-8 text-center opacity-40">
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] italic">&copy; {new Date().getFullYear()} MARCIEL BARBERSHOP. PREMIUM EXPERIENCE.</p>
        </footer>
      </div>
    </div>
  );
}

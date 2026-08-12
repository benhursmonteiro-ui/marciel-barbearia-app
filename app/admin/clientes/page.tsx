"use client";

import React, { useState } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useBarber, Appointment } from "@/context/BarberContext";

// Exception-free date parser
function parseDateSafely(dateStr: string) {
  if (!dateStr || typeof dateStr !== "string") {
    return { day: "--", month: "---" };
  }

  const cleanStr = dateStr.trim();
  let parts = cleanStr.split("-");
  if (parts.length === 3) {
    const day = parts[2];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthsAbbr = [
      "JAN",
      "FEV",
      "MAR",
      "ABR",
      "MAI",
      "JUN",
      "JUL",
      "AGO",
      "SET",
      "OUT",
      "NOV",
      "DEZ",
    ];
    const month = monthsAbbr[monthIndex] || "---";
    return { day, month };
  }

  parts = cleanStr.split("/");
  if (parts.length === 3) {
    const day = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthsAbbr = [
      "JAN",
      "FEV",
      "MAR",
      "ABR",
      "MAI",
      "JUN",
      "JUL",
      "AGO",
      "SET",
      "OUT",
      "NOV",
      "DEZ",
    ];
    const month = monthsAbbr[monthIndex] || "---";
    return { day, month };
  }

  return { day: "--", month: "---" };
}

export default function AdminClientes() {
  const {
    users,
    updateUser,
    register,
    appointments,
    updateAppointmentPayment,
    addFiadoEntry,
  } = useBarber();
  const [searchTerm, setSearchTerm] = useState("");

  const clients = users.filter((u) => u.role === "client");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // History & Caderninho Modal states
  const [selectedClientForHistory, setSelectedClientForHistory] =
    useState<any>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [selectedClientForFiado, setSelectedClientForFiado] =
    useState<any>(null);
  const [isFiadoModalOpen, setIsFiadoModalOpen] = useState(false);
  const [isGeneralFiadoOpen, setIsGeneralFiadoOpen] = useState(false);

  // Manual Fiado Form state
  const [manualFiadoService, setManualFiadoService] = useState("");
  const [manualFiadoPrice, setManualFiadoPrice] = useState("");

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) {
      alert("Por favor, preencha o nome do cliente.");
      return;
    }

    const emailToUse = newClient.email || `cliente.${Date.now()}@barbearia.com`;

    try {
      await register(newClient.name, emailToUse, "123456", "client", newClient.phone);
      setNewClient({ name: "", email: "", phone: "" });
      setIsModalOpen(false);
      alert(`Cliente ${newClient.name} cadastrado com sucesso!`);
    } catch (err: any) {
      alert(`Erro ao cadastrar cliente: ${err.message}`);
    }
  };

  const handleToggleBlock = async (client: any) => {
    const isBlocked = client.blocked;
    const actionText = isBlocked ? "desbloquear" : "bloquear";

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

  const handleViewFiado = (client: any) => {
    setSelectedClientForFiado(client);
    setIsFiadoModalOpen(true);
  };

  const handleSettleFiado = async (appId: string) => {
    if (confirm("Confirmar baixa e pagamento deste fiado?")) {
      await updateAppointmentPayment(appId, "pago", "dinheiro");
    }
  };

  const handleAddManualFiadoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForFiado || !manualFiadoService || !manualFiadoPrice)
      return;

    await addFiadoEntry(
      selectedClientForFiado.id,
      selectedClientForFiado.name,
      manualFiadoService,
      parseFloat(manualFiadoPrice)
    );

    setManualFiadoService("");
    setManualFiadoPrice("");
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedClients = [...filteredClients].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Calculate global fiado statistics
  const fiadoAppointments = appointments.filter(
    (a) => a.isFiado || a.paymentStatus === "fiado" || a.paymentMethod === "fiado"
  );
  const pendingFiados = fiadoAppointments.filter(
    (a) => !a.fiadoPaid && a.paymentStatus !== "pago"
  );
  const totalFiadoDebtGeral = pendingFiados.reduce(
    (acc, a) => acc + (a.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 p-6 lg:p-10 font-sans animate-fade-in-up">
      {/* Top Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider inline-block mb-2">
            Gestão & Fiado
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Base de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Clientes & Fiado
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Caderninho digital de débitos e histórico completo de atendimentos.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-[#121622]/90 border-white/5 h-11 text-sm rounded-xl text-white"
            />
            <Icon
              name="Search"
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <Button
            onClick={() => setIsGeneralFiadoOpen(true)}
            className="gap-2 h-11 px-5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all"
          >
            <Icon name="BookOpen" className="w-4 h-4" /> Caderninho Geral (R${" "}
            {totalFiadoDebtGeral.toFixed(2)})
          </Button>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
          >
            <Icon name="UserPlus" className="w-4 h-4" /> Novo Cliente
          </Button>
        </div>
      </header>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sortedClients.length > 0 ? (
          sortedClients.map((client) => {
            const clientApps = appointments.filter(
              (a) => a.clientId === client.id
            );
            const completedApps = clientApps.filter(
              (a) => a.status === "concluido"
            );

            // Fiado debt calculation for this client
            const clientFiadoApps = clientApps.filter(
              (a) =>
                a.isFiado ||
                a.paymentStatus === "fiado" ||
                a.paymentMethod === "fiado"
            );
            const clientPendingFiado = clientFiadoApps.filter(
              (a) => !a.fiadoPaid && a.paymentStatus !== "pago"
            );
            const clientFiadoDebt = clientPendingFiado.reduce(
              (acc, a) => acc + (a.price || 0),
              0
            );

            const lastApp = completedApps.sort((a, b) => {
              const dateA =
                a.date && a.time ? `${a.date} ${a.time}` : a.date || "";
              const dateB =
                b.date && b.time ? `${b.date} ${b.time}` : b.date || "";
              return new Date(dateB).getTime() - new Date(dateA).getTime();
            })[0];

            const lastVisitDate =
              lastApp && lastApp.date
                ? lastApp.date.split("-").reverse().join("/")
                : "Nunca";
            const isBlocked = client.blocked;

            return (
              <div
                key={client.id}
                className={`amber-glow-card relative overflow-hidden p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                  clientFiadoDebt > 0 ? "border-amber-500/40" : ""
                }`}
              >
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[80px] pointer-events-none" />

                <div>
                  {/* Top Row Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl bg-slate-900 border flex items-center justify-center text-xl font-extrabold shrink-0 shadow-inner ${
                          isBlocked
                            ? "text-red-400 border-red-500/30"
                            : "text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {client.name?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-white text-sm tracking-tight truncate">
                          {client.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {client.email || client.phone || "Sem e-mail"}
                        </p>
                      </div>
                    </div>

                    {isBlocked && (
                      <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[9px] font-extrabold uppercase shrink-0">
                        Bloqueado
                      </span>
                    )}
                  </div>

                  {/* Fiado Badge Alert */}
                  {clientFiadoDebt > 0 ? (
                    <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                        <Icon name="BookOpen" className="w-3.5 h-3.5" /> FIADO
                        PENDENTE
                      </span>
                      <span className="text-xs font-extrabold text-white bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                        R$ {clientFiadoDebt.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-4 p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Sem débitos em fiado</span>
                      <span className="text-emerald-400 font-bold">EM DIA</span>
                    </div>
                  )}

                  {/* Visit Stats */}
                  <div className="space-y-2 mb-6 text-xs text-slate-400 border-t border-b border-white/5 py-3">
                    <div className="flex justify-between items-center">
                      <span>Última Visita</span>
                      <span className="text-white font-semibold">
                        {lastVisitDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total de Cortes</span>
                      <span className="text-amber-400 font-extrabold">
                        {completedApps.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleViewFiado(client)}
                    className="col-span-1 h-10 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:from-amber-300 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Icon name="BookOpen" className="w-3.5 h-3.5 shrink-0" />
                    <span>FIADO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleViewHistory(client)}
                    className="col-span-1 h-10 px-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-[11px] font-bold uppercase tracking-wider hover:border-amber-500/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Icon name="History" className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>HISTÓRICO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(client)}
                    className={`col-span-1 h-10 px-2 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isBlocked
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950"
                        : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white"
                    }`}
                  >
                    <Icon name={isBlocked ? "CheckCircle" : "Ban"} className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBlocked ? "ATIVAR" : "BLOQUEAR"}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 italic border border-dashed border-slate-800 rounded-2xl">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {/* --- MODAL CADERNINHO DO FIADO (INDIVIDUAL) --- */}
      {isFiadoModalOpen && selectedClientForFiado && (() => {
        const clientApps = appointments.filter(
          (a) => a.clientId === selectedClientForFiado.id
        );
        const fiadoApps = clientApps.filter(
          (a) =>
            a.isFiado ||
            a.paymentStatus === "fiado" ||
            a.paymentMethod === "fiado"
        );
        const pendingApps = fiadoApps.filter(
          (a) => !a.fiadoPaid && a.paymentStatus !== "pago"
        );
        const totalPendingDebt = pendingApps.reduce(
          (acc, a) => acc + (a.price || 0),
          0
        );

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsFiadoModalOpen(false)}
            />
            <div className="relative w-full max-w-2xl bg-[#0d111a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Icon name="BookOpen" className="w-5 h-5 text-amber-400" />{" "}
                    Caderninho do Fiado
                  </h2>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                    Cliente: {selectedClientForFiado.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsFiadoModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Debt Summary Banner */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                    Saldo Devedor Em Fiado
                  </span>
                  <span className="text-2xl font-black text-amber-400">
                    R$ {totalPendingDebt.toFixed(2)}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  {pendingApps.length} corte(s) pendente(s)
                </span>
              </div>

              {/* Form Lançar Novo Fiado Manual */}
              <form
                onSubmit={handleAddManualFiadoSubmit}
                className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  + Lançar Novo Corte / Serviço Fiado
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Serviço (ex: Corte + Barba)"
                    value={manualFiadoService}
                    onChange={(e) => setManualFiadoService(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs h-10 rounded-lg text-white"
                  />
                  <Input
                    type="number"
                    placeholder="Valor R$ (ex: 50.00)"
                    value={manualFiadoPrice}
                    onChange={(e) => setManualFiadoPrice(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-xs h-10 rounded-lg text-white"
                  />
                  <Button
                    type="submit"
                    className="h-10 text-xs font-extrabold uppercase bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400"
                  >
                    Registrar no Fiado
                  </Button>
                </div>
              </form>

              {/* Fiado Entries Table/List */}
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Histórico de Fiados Registrados
                </span>
                {fiadoApps.length > 0 ? (
                  fiadoApps.map((app) => {
                    const isPaid = app.fiadoPaid || app.paymentStatus === "pago";
                    return (
                      <div
                        key={app.id}
                        className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-amber-500/20 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                            <Icon name="Scissors" className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-white text-xs truncate">
                              {app.serviceName}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {app.date.split("-").reverse().join("/")} às{" "}
                              {app.time} • Barbeiro: {app.barberName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                          <span className="text-sm font-black text-amber-400">
                            R$ {app.price.toFixed(2)}
                          </span>
                          {isPaid ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              ✓ PAGO / QUITADO
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSettleFiado(app.id)}
                              className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm transition-all"
                            >
                              Dar Baixa (Quitar)
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl">
                    Nenhum fiado pendente para este cliente.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- MODAL CADERNINHO GERAL DO FIADO (TODOS OS CLIENTES) --- */}
      {isGeneralFiadoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsGeneralFiadoOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-[#0d111a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div>
                <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <Icon name="BookOpen" className="w-5 h-5 text-amber-400" />{" "}
                  Caderninho Geral de Fiados
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lista completa de débitos a receber da barbearia
                </p>
              </div>
              <button
                onClick={() => setIsGeneralFiadoOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-medium">
                  Total Geral a Receber
                </span>
                <span className="text-2xl font-black text-amber-400 block">
                  R$ {totalFiadoDebtGeral.toFixed(2)}
                </span>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                {pendingFiados.length} fiado(s) pendente(s)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
              {pendingFiados.length > 0 ? (
                pendingFiados.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center shrink-0">
                        {app.clientName?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-white text-sm truncate">
                          {app.clientName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {app.serviceName} • {app.date.split("-").reverse().join("/")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-4">
                      <span className="text-base font-black text-amber-400">
                        R$ {app.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleSettleFiado(app.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-sm transition-all"
                      >
                        Quitar Fiado
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl">
                  Nenhum fiado pendente registrado no momento. Todos os clientes estão em dia!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedClientForHistory && (() => {
        const clientApps = appointments
          .filter((a) => a.clientId === selectedClientForHistory.id)
          .sort((a, b) => {
            const dateA =
              a.date && a.time ? `${a.date} ${a.time}` : a.date || "";
            const dateB =
              b.date && b.time ? `${b.date} ${b.time}` : b.date || "";
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          });

        const completedApps = clientApps.filter((a) => a.status === "concluido");
        const totalSpent = completedApps.reduce((acc, app) => acc + app.price, 0);

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsHistoryModalOpen(false)}
            />
            <div className="relative w-full max-w-2xl bg-[#0d111a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up flex flex-col max-h-[85vh]">
              <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Histórico do Cliente
                  </h2>
                  <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mt-0.5">
                    {selectedClientForHistory.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </header>

              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Visitas Concluídas
                  </p>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {completedApps.length}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Total Gasto (R$)
                  </p>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">
                    R$ {totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
                {clientApps.length > 0 ? (
                  clientApps.map((app) => {
                    const { day, month } = parseDateSafely(app.date);
                    return (
                      <div
                        key={app.id}
                        className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center w-11 border-r border-slate-800 pr-3 shrink-0">
                            <p className="text-base font-extrabold text-white">
                              {day}
                            </p>
                            <p className="text-[9px] text-amber-400 font-bold uppercase">
                              {month}
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white">
                              {app.serviceName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Profissional: {app.barberName} • {app.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 flex flex-col items-end gap-1">
                          <span className="text-sm font-black text-amber-400">
                            R$ {app.price.toFixed(2)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              app.status === "concluido"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs italic">
                    Nenhum agendamento registrado.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- MODAL NOVO CLIENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0d111a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Icon name="UserPlus" className="w-5 h-5 text-amber-400" /> Novo Cliente
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Nome Completo do Cliente *
                </label>
                <Input
                  required
                  placeholder="Ex: João da Silva"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Telefone / WhatsApp
                </label>
                <Input
                  placeholder="Ex: (89) 99999-9999"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  E-mail (Opcional)
                </label>
                <Input
                  type="email"
                  placeholder="Ex: joao@gmail.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-slate-800 text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md"
                >
                  Cadastrar Cliente
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

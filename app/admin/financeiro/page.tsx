"use client";

import React, { useState, useMemo } from "react";
import { SafeIcon as Icon } from "@/components/ui/SafeIcon";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Calendar } from "../../../components/ui/Calendar";
import { useBarber } from "@/context/BarberContext";

export default function AdminFinanceiro() {
  const {
    appointments,
    expenses,
    incomes,
    addExpense: ctxAddExpense,
    addIncome: ctxAddIncome,
    updateAppointmentPayment,
  } = useBarber();

  const getLocalDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const [activeTab, setActiveTab] = useState<"overview" | "fiado" | "config">(
    "overview"
  );
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const [expenseName, setExpenseName] = useState("");
  const [expenseValue, setExpenseValue] = useState("");

  const [incomeName, setIncomeName] = useState("");
  const [incomeValue, setIncomeValue] = useState("");

  const [monthlyGoal, setMonthlyGoal] = useState("5000");

  // Filtering daily data connected directly to real appointments
  const dayData = useMemo(() => {
    const dayAppointments = appointments.filter(
      (app) => app.date === selectedDate && app.status === "concluido"
    );

    const dayIncomes = incomes.filter((inc) => inc.date === selectedDate);
    const manualIncome = dayIncomes.reduce((acc, inc) => acc + inc.value, 0);

    const grossAppointmentsIncome = dayAppointments.reduce(
      (acc, app) => acc + (app.price || 0),
      0
    );
    const grossTotalIncome = grossAppointmentsIncome + manualIncome;

    // Separate paid vs fiado
    const paidAppointmentsIncome = dayAppointments
      .filter((app) => !app.isFiado && app.paymentStatus !== "fiado")
      .reduce((acc, app) => acc + (app.price || 0), 0);

    const fiadoAppointmentsIncome = dayAppointments
      .filter((app) => app.isFiado || app.paymentStatus === "fiado")
      .reduce((acc, app) => acc + (app.price || 0), 0);

    const commissions = dayAppointments.reduce(
      (acc, app) => acc + (app.commission || 0),
      0
    );

    const dayExpenses = expenses.filter((exp) => exp.date === selectedDate);
    const totalExp = dayExpenses.reduce((acc, exp) => acc + exp.value, 0);

    return {
      appointments: dayAppointments,
      manualIncomes: dayIncomes,
      grossTotalIncome,
      paidAppointmentsIncome: paidAppointmentsIncome + manualIncome,
      fiadoAppointmentsIncome,
      commissions,
      expenses: dayExpenses,
      totalExp,
      netResult: paidAppointmentsIncome + manualIncome - totalExp - commissions,
    };
  }, [appointments, selectedDate, expenses, incomes]);

  // Filtering monthly data connected directly to real appointments
  const monthData = useMemo(() => {
    const currentMonth = selectedDate.substring(0, 7);

    const monthApps = appointments.filter(
      (app) => app.date.startsWith(currentMonth) && app.status === "concluido"
    );
    const grossAppsIncome = monthApps.reduce(
      (acc, app) => acc + (app.price || 0),
      0
    );

    const paidAppsIncome = monthApps
      .filter((app) => !app.isFiado && app.paymentStatus !== "fiado")
      .reduce((acc, app) => acc + (app.price || 0), 0);

    const fiadoAppsIncome = monthApps
      .filter((app) => app.isFiado || app.paymentStatus === "fiado")
      .reduce((acc, app) => acc + (app.price || 0), 0);

    const commissions = monthApps.reduce(
      (acc, app) => acc + (app.commission || 0),
      0
    );

    const monthIncomes = incomes.filter((inc) =>
      inc.date.startsWith(currentMonth)
    );
    const manualIncome = monthIncomes.reduce((acc, inc) => acc + inc.value, 0);

    const monthExpenses = expenses.filter((exp) =>
      exp.date.startsWith(currentMonth)
    );
    const totalExp = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

    const totalGrossIncome = grossAppsIncome + manualIncome;
    const totalPaidIncome = paidAppsIncome + manualIncome;
    const netResult = totalPaidIncome - totalExp - commissions;

    const goalVal = parseFloat(monthlyGoal) || 0;
    const progress = goalVal > 0 ? (totalGrossIncome / goalVal) * 100 : 0;

    return {
      monthApps,
      monthIncomes,
      monthExpenses,
      totalGrossIncome,
      totalPaidIncome,
      fiadoAppsIncome,
      commissions,
      totalExp,
      netResult,
      yearMonth: currentMonth,
      goalVal,
      progress,
    };
  }, [appointments, expenses, incomes, selectedDate, monthlyGoal]);

  // Filter all pending fiados across the system
  const allPendingFiados = useMemo(() => {
    return appointments.filter(
      (app) =>
        (app.isFiado || app.paymentStatus === "fiado" || app.paymentMethod === "fiado") &&
        !app.fiadoPaid &&
        app.paymentStatus !== "pago"
    );
  }, [appointments]);

  const handleSettleFiado = async (appId: string) => {
    if (confirm("Confirmar recebimento e quitar fiado no caixa?")) {
      await updateAppointmentPayment(appId, "pago", "dinheiro");
    }
  };

  const addExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expenseValue) return;

    await ctxAddExpense({
      label: expenseName,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: selectedDate,
      value: parseFloat(expenseValue),
    });

    setExpenseName("");
    setExpenseValue("");
    setIsExpenseModalOpen(false);
  };

  const addIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeName || !incomeValue) return;

    await ctxAddIncome({
      label: incomeName,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: selectedDate,
      value: parseFloat(incomeValue),
    });

    setIncomeName("");
    setIncomeValue("");
    setIsIncomeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#080a0f] text-slate-100 p-6 lg:p-10 font-sans animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-white/5 pb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider inline-block mb-2">
              Gestão Financeira Conectada
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Financeiro &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Caixa Central
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Fluxo de caixa sincronizado em tempo real com os agendamentos e caderninho de fiados.
            </p>
          </div>

          <div className="flex bg-[#121622] p-1.5 rounded-2xl border border-white/5 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "overview"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Painel Geral
            </button>
            <button
              onClick={() => setActiveTab("fiado")}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "fiado"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Caderninho de Fiados ({allPendingFiados.length})
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                activeTab === "config"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Configurações
            </button>
          </div>
        </header>

        {activeTab === "overview" && (
          <>
            {/* Top 4 Financial Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="amber-glow-card rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Faturamento Bruto
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                    <Icon name="TrendingUp" className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  R$ {dayData.grossTotalIncome.toFixed(2)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mês atual: R$ {monthData.totalGrossIncome.toFixed(2)}
                </p>
              </div>

              <div className="amber-glow-card rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recebido em Caixa
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon name="DollarSign" className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
                  R$ {dayData.paidAppointmentsIncome.toFixed(2)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dinheiro, Pix e Cartão
                </p>
              </div>

              <div className="amber-glow-card rounded-2xl p-5 flex flex-col justify-between border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Fiado A Receber
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Icon name="BookOpen" className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-amber-400 tracking-tight">
                  R$ {dayData.fiadoAppointmentsIncome.toFixed(2)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Acumulado Geral: R${" "}
                  {allPendingFiados
                    .reduce((acc, a) => acc + (a.price || 0), 0)
                    .toFixed(2)}
                </p>
              </div>

              <div className="amber-glow-card rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Resultado Líquido
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                    <Icon name="Zap" className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  R$ {dayData.netResult.toFixed(2)}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Despesas: R$ {dayData.totalExp.toFixed(2)} • Comissões: R${" "}
                  {dayData.commissions.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Middle Row: Monthly Goal & Date Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 4 cols: Monthly Goal */}
              <div className="lg:col-span-4 amber-glow-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Icon name="Target" className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">
                        Meta Mensal de Faturamento
                      </h3>
                      <p className="text-xs text-slate-400">Progresso do mês</p>
                    </div>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black text-white">
                        R$ {monthData.totalGrossIncome.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {Math.round(monthData.progress)}%
                      </span>
                    </div>

                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min(monthData.progress, 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-400 font-semibold">
                      <span>R$ 0,00</span>
                      <span>Alvo: R$ {monthData.goalVal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 8 cols: Date Selector & Actions */}
              <div className="lg:col-span-8 amber-glow-card rounded-2xl p-6 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Movimentações do Dia
                    </h3>
                    <p className="text-xs text-slate-400">
                      Selecione uma data para verificar o caixa
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="bg-slate-900 border-slate-800 text-xs h-10 rounded-xl text-white px-3"
                    />
                    <Button
                      onClick={() => setIsIncomeModalOpen(true)}
                      className="h-10 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold uppercase gap-1.5"
                    >
                      <Icon name="PlusCircle" className="w-4 h-4" /> Entrada
                    </Button>
                    <Button
                      onClick={() => setIsExpenseModalOpen(true)}
                      className="h-10 px-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-slate-950 text-xs font-bold uppercase gap-1.5"
                    >
                      <Icon name="MinusCircle" className="w-4 h-4" /> Despesa
                    </Button>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar pr-1">
                  {[
                    ...dayData.appointments,
                    ...dayData.manualIncomes,
                    ...dayData.expenses,
                  ].length > 0 ? (
                    <>
                      {dayData.appointments.map((app) => (
                        <div
                          key={app.id}
                          className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                app.isFiado || app.paymentStatus === "fiado"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}
                            >
                              <Icon
                                name={
                                  app.isFiado || app.paymentStatus === "fiado"
                                    ? "BookOpen"
                                    : "Check"
                                }
                                className="w-4 h-4"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate">
                                {app.serviceName} • {app.clientName}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {app.time} • Barbeiro: {app.barberName} •{" "}
                                <span className="font-bold uppercase text-amber-400">
                                  {app.paymentMethod ||
                                    (app.isFiado ? "FIADO" : "CAIXA")}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-sm font-black ${
                                app.isFiado || app.paymentStatus === "fiado"
                                  ? "text-amber-400"
                                  : "text-emerald-400"
                              }`}
                            >
                              + R$ {app.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {dayData.manualIncomes.map((inc) => (
                        <div
                          key={inc.id}
                          className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                              <Icon name="Plus" className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs">
                                {inc.label}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                Entrada Avulsa • {inc.time}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-emerald-400">
                            + R$ {inc.value.toFixed(2)}
                          </span>
                        </div>
                      ))}

                      {dayData.expenses.map((exp) => (
                        <div
                          key={exp.id}
                          className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                              <Icon name="Minus" className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xs">
                                {exp.label}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                Despesa • {exp.time}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-black text-red-400">
                            - R$ {exp.value.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="py-12 text-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl">
                      Nenhuma movimentação registrada nesta data.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab Fiado Central */}
        {activeTab === "fiado" && (
          <div className="amber-glow-card rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Icon name="BookOpen" className="w-5 h-5 text-amber-400" />{" "}
                  Caderninho de Fiados Geral
                </h3>
                <p className="text-xs text-slate-400">
                  Gerenciamento de débitos pendentes de todos os clientes da barbearia
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Total Geral em Fiado
                </span>
                <span className="text-xl font-black text-amber-400">
                  R${" "}
                  {allPendingFiados
                    .reduce((acc, a) => acc + (a.price || 0), 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto no-scrollbar pr-1">
              {allPendingFiados.length > 0 ? (
                allPendingFiados.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 border border-amber-500/30 text-amber-400 font-extrabold flex items-center justify-center text-sm shrink-0">
                        {app.clientName?.[0] || "?"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-white text-sm truncate">
                          {app.clientName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {app.serviceName} • {app.date.split("-").reverse().join("/")} às{" "}
                          {app.time}
                        </p>
                        <p className="text-[10px] text-amber-400 font-medium">
                          Barbeiro: {app.barberName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                      <span className="text-base font-black text-amber-400">
                        R$ {app.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleSettleFiado(app.id)}
                        className="h-10 px-4 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold text-xs uppercase tracking-wider"
                      >
                        Quitar Fiado
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs italic border border-dashed border-slate-800 rounded-xl">
                  Parabéns! Não existe nenhum corte ou serviço pendente no fiado no momento.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Configurações */}
        {activeTab === "config" && (
          <div className="amber-glow-card rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-extrabold text-white">
              Configurações de Metas do Caixa
            </h3>
            <div className="space-y-4 max-w-md">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Meta Mensal de Faturamento (R$)
              </label>
              <Input
                type="number"
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                className="bg-slate-900 border-slate-800 text-lg font-bold text-white h-12 rounded-xl"
              />
              <p className="text-xs text-slate-500">
                Esta meta é usada para calcular a porcentagem de atingimento no painel financeiro.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Despesa */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsExpenseModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0d111a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-lg font-extrabold text-red-400 mb-4 uppercase">
              Lançar Despesa / Saída
            </h2>
            <form onSubmit={addExpense} className="space-y-4">
              <Input
                placeholder="Descrição (ex: Aluguel, Luz, Produtos)"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
              />
              <Input
                type="number"
                placeholder="Valor R$"
                value={expenseValue}
                onChange={(e) => setExpenseValue(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-slate-800 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase"
                >
                  Confirmar Saída
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Entrada Avulsa */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsIncomeModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0d111a] border border-white/10 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
            <h2 className="text-lg font-extrabold text-emerald-400 mb-4 uppercase">
              Lançar Entrada Avulsa
            </h2>
            <form onSubmit={addIncome} className="space-y-4">
              <Input
                placeholder="Descrição (ex: Venda de produto, Gorjeta)"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
              />
              <Input
                type="number"
                placeholder="Valor R$"
                value={incomeValue}
                onChange={(e) => setIncomeValue(e.target.value)}
                className="bg-slate-900 border-slate-800 text-xs h-11 rounded-xl text-white"
              />
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  variant="outline"
                  className="flex-1 h-11 rounded-xl border-slate-800 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs uppercase"
                >
                  Confirmar Entrada
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

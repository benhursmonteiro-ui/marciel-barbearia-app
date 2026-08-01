"use client";

import React from "react";
import {
  CalendarCheck,
  User,
  DollarSign,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Scissors,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useBarber } from "@/context/BarberContext";
import {
  StatMetricCard,
  BarChart,
  AreaSplineChart,
} from "@/components/ui/AnalyticsCharts";

export default function BarberDashboard() {
  const { appointments, currentUser, barbers, refreshData } = useBarber();

  React.useEffect(() => {
    refreshData();
  }, []);

  const barberProfile = barbers.find((b) => b.userId === currentUser?.id);

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysApps = appointments.filter(
    (a) => a.barberId === barberProfile?.id && a.date === todayStr
  );
  const completedToday = todaysApps.filter((a) => a.status === "concluido");
  const pendingToday = todaysApps.filter(
    (a) =>
      a.status === "agendado" ||
      a.status === "confirmado" ||
      a.status === "em atendimento"
  );

  const dailyRevenue = completedToday.reduce((acc, curr) => acc + curr.price, 0);
  const monthlyCommissions = appointments
    .filter(
      (a) =>
        a.barberId === barberProfile?.id &&
        a.status === "concluido" &&
        new Date(a.date).getMonth() === new Date().getMonth()
    )
    .reduce((acc, curr) => acc + (curr.commission || 0), 0);

  // Mock bar chart hours data based on todays appointments
  const hourlyData = [
    { label: "08:00", value: 2 },
    { label: "10:00", value: 5 },
    { label: "12:00", value: 8, highlight: true },
    { label: "14:00", value: 6 },
    { label: "16:00", value: 10, highlight: true },
    { label: "18:00", value: 7 },
    { label: "20:00", value: 3 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Header Welcome Bar */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Dashboard Barbeiro
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Olá,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              {currentUser?.name?.split(" ")[0] || "Barbeiro"}!
            </span>{" "}
            👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Você possui{" "}
            <strong className="text-white font-semibold">
              {todaysApps.length} agendamentos
            </strong>{" "}
            programados para hoje.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/barber/horarios">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-xl border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider gap-2"
            >
              <Clock className="w-4 h-4 text-amber-400" /> Meu Horário
            </Button>
          </Link>
          <Link href="/barber/schedule">
            <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all gap-2">
              <Calendar className="w-4 h-4" /> Ver Agenda{" "}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Grid Top Row: Stats (Left 2 cols) + Bar Chart (Right 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Stat Cards 2x2 */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatMetricCard
            title="Atendimentos do Dia"
            value={todaysApps.length.toString().padStart(2, "0")}
            subtitle={`${completedToday.length} concluídos • ${pendingToday.length} pendentes`}
            change="+14.2%"
            icon={<CalendarCheck className="w-5 h-5" />}
            sparklineData={[12, 18, 15, 25, 22, 30, 28, 35]}
          />

          <StatMetricCard
            title="Faturamento Hoje"
            value={`R$ ${dailyRevenue.toFixed(2)}`}
            subtitle="Bruto total arrecadado"
            change="+8.5%"
            icon={<DollarSign className="w-5 h-5" />}
            sparklineData={[100, 250, 180, 400, 320, 500, 480, 620]}
          />

          <StatMetricCard
            title="Comissão Acumulada"
            value={`R$ ${monthlyCommissions.toFixed(2)}`}
            subtitle="Acumulado do mês atual"
            change="+12.0%"
            icon={<TrendingUp className="w-5 h-5" />}
            sparklineData={[400, 600, 550, 800, 750, 1100, 1050, 1400]}
          />

          <StatMetricCard
            title="Avaliação Média"
            value={barberProfile?.rating.toFixed(1) || "5.0"}
            subtitle={`Com base em ${barberProfile?.reviews || 12} avaliações`}
            change="+0.3"
            icon={<Star className="w-5 h-5" />}
            sparklineData={[4.7, 4.8, 4.8, 4.9, 4.9, 5.0, 5.0]}
          />
        </div>

        {/* Right Side: Appointments Bar Chart */}
        <div className="lg:col-span-5">
          <BarChart
            title="Agendamentos por Horário"
            subtitle="Distribuição de clientes ao longo do dia"
            totalValue={todaysApps.length.toString()}
            data={hourlyData}
          />
        </div>
      </div>

      {/* Grid Bottom Row: Line Spline Chart (Left 7 cols) + Next Appointments Table (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Area Spline Chart */}
        <div className="lg:col-span-7">
          <AreaSplineChart
            title="Desempenho de Cortes & Atendimentos"
            subtitle="Evolução contínua de clientes atendidos"
            data={[
              { x: "Seg", value: 12 },
              { x: "Ter", value: 24 },
              { x: "Qua", value: 18 },
              { x: "Qui", value: 35 },
              { x: "Sex", value: 48 },
              { x: "Sáb", value: 55 },
              { x: "Dom", value: 20 },
            ]}
          />
        </div>

        {/* Right Side: Upcoming Appointments Table/List */}
        <div className="lg:col-span-5 amber-glow-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" /> Próximos
                  Atendimentos
                </h3>
                <p className="text-xs text-slate-400">
                  Agenda agendada para hoje
                </p>
              </div>
              <Link
                href="/barber/schedule"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
              >
                Ver Todos
              </Link>
            </div>

            {/* List Rows */}
            <div className="space-y-3.5">
              {(pendingToday.length > 0
                ? pendingToday.slice(0, 4)
                : appointments.slice(0, 4)
              ).map((apt, i) => (
                <div
                  key={i}
                  className="group relative bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/30 rounded-xl p-3.5 transition-all duration-300 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Time Badge */}
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col items-center justify-center shrink-0 shadow-inner">
                      <span className="text-xs font-extrabold text-amber-400 leading-none">
                        {apt.time}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                        HOJE
                      </span>
                    </div>

                    {/* Client & Service info */}
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
                        {apt.clientName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                        <Scissors className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{apt.serviceName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      R$ {apt.price.toFixed(2)}
                    </span>
                    <Link href="/barber/schedule">
                      <span className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors">
                        Gerenciar →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}

              {appointments.length === 0 && (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs italic">
                  Nenhum agendamento encontrado para exibir.
                </div>
              )}
            </div>
          </div>

          {/* Card Footer Summary */}
          <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Total Pendentes</span>
            <span className="font-bold text-white">
              {pendingToday.length} agendamento(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

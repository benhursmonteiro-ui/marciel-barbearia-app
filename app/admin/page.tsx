"use client";

import React from "react";
import {
  Users,
  CalendarCheck,
  DollarSign,
  Scissors,
  TrendingUp,
  ChevronRight,
  Clock,
  Briefcase,
  Calendar,
  Settings,
  PieChart,
  Ticket,
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

// Quick Action Card
const ActionCard = ({ icon, label, description, href }: any) => (
  <Link
    href={href}
    className="group bg-[#121622]/80 hover:bg-[#161c2b] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 transition-all duration-300 shadow-md flex items-center gap-4"
  >
    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-amber-400 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-amber-600 group-hover:text-slate-950 transition-all duration-300 shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors tracking-tight truncate">
        {label}
      </h4>
      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
        {description}
      </p>
    </div>
  </Link>
);

export default function AdminDashboard() {
  const { appointments, users, barbers, services } = useBarber();

  const todayStr = new Date().toISOString().split("T")[0];
  const todaysApps = appointments.filter((a) => a.date === todayStr);
  const totalRevenue = appointments
    .filter((a) => a.status === "concluido")
    .reduce((acc, curr) => acc + curr.price, 0);
  const clientsCount = users.filter((u) => u.role === "client").length;

  return (
    <div className="space-y-8 animate-fade-in-up p-6 md:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Painel Executivo
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Relatório{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Geral
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestão estratégica e métricas de desempenho da Marciel Barber.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 px-5 rounded-xl border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold uppercase tracking-wider gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" /> Extrato Mensal
          </Button>
          <Link href="/admin/agendamentos">
            <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all gap-2">
              Gerenciar <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Metric Cards Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatMetricCard
          title="Clientes Cadastrados"
          value={clientsCount.toString()}
          subtitle="Base total ativa"
          change="+18.4%"
          icon={<Users className="w-5 h-5" />}
          sparklineData={[50, 70, 65, 90, 110, 140, 130, 160]}
        />
        <StatMetricCard
          title="Agendamentos Hoje"
          value={todaysApps.length.toString().padStart(2, "0")}
          subtitle="Horários agendados"
          change="+12.1%"
          icon={<CalendarCheck className="w-5 h-5" />}
          sparklineData={[8, 12, 10, 16, 14, 20, 18, 25]}
        />
        <StatMetricCard
          title="Faturamento Total"
          value={`R$ ${totalRevenue.toFixed(2)}`}
          subtitle="Receita bruta acumulada"
          change="+24.5%"
          icon={<DollarSign className="w-5 h-5" />}
          sparklineData={[1200, 1800, 1500, 2400, 3100, 4200, 3900, 5100]}
        />
        <StatMetricCard
          title="Barbeiros Ativos"
          value={barbers.length.toString()}
          subtitle="Equipe em serviço"
          change="+2"
          icon={<Briefcase className="w-5 h-5" />}
          sparklineData={[2, 3, 3, 4, 4, 5, 5, 6]}
        />
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <AreaSplineChart
            title="Evolução do Faturamento Semanal"
            subtitle="Análise comparativa de ganhos diários"
            data={[
              { x: "Seg", value: 350 },
              { x: "Ter", value: 520 },
              { x: "Qua", value: 480 },
              { x: "Qui", value: 790 },
              { x: "Sex", value: 1100 },
              { x: "Sáb", value: 1450 },
              { x: "Dom", value: 600 },
            ]}
          />
        </div>
        <div className="lg:col-span-5">
          <BarChart
            title="Capacidade de Atendimento"
            subtitle="Agendamentos por período do dia"
            totalValue={appointments.length.toString()}
            data={[
              { label: "08:00", value: 15 },
              { label: "10:00", value: 28 },
              { label: "12:00", value: 45, highlight: true },
              { label: "14:00", value: 32 },
              { label: "16:00", value: 50, highlight: true },
              { label: "18:00", value: 38 },
              { label: "20:00", value: 20 },
            ]}
          />
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Table (7 cols) + Quick Actions (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className="lg:col-span-7 amber-glow-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Atividades
                Recentes
              </h3>
              <p className="text-xs text-slate-400">
                Últimos agendamentos registrados no sistema
              </p>
            </div>
            <Link
              href="/admin/agendamentos"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
            >
              Ver Tudo
            </Link>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-500 font-bold uppercase tracking-wider border-b border-white/5">
                  <th className="pb-3 px-2">Cliente</th>
                  <th className="pb-3 px-2 hidden sm:table-cell">Barbeiro</th>
                  <th className="pb-3 px-2">Horário</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {appointments.slice(0, 5).map((apt, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 shadow-inner">
                          {apt.clientName?.[0] || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white text-xs truncate group-hover:text-amber-400 transition-colors">
                            {apt.clientName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {apt.serviceName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-xs text-slate-400 hidden sm:table-cell">
                      {apt.barberName}
                    </td>
                    <td className="py-3.5 px-2 text-xs font-bold text-white">
                      {apt.time}
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          apt.status === "concluido"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : apt.status === "agendado"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 px-1">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionCard
              icon={<Users className="w-5 h-5" />}
              label="Profissionais"
              description="Gerenciar barbeiros"
              href="/admin/profissionais"
            />
            <ActionCard
              icon={<Calendar className="w-5 h-5" />}
              label="Agendamentos"
              description="Ver agenda geral"
              href="/admin/agendamentos"
            />
            <ActionCard
              icon={<Scissors className="w-5 h-5" />}
              label="Serviços"
              description="Tabela de preços"
              href="/admin/servicos"
            />
            <ActionCard
              icon={<PieChart className="w-5 h-5" />}
              label="Relatórios"
              description="Análise financeira"
              href="/admin/relatorios"
            />
            <ActionCard
              icon={<Ticket className="w-5 h-5" />}
              label="Marketing"
              description="Promoções"
              href="/admin/marketing"
            />
            <ActionCard
              icon={<Settings className="w-5 h-5" />}
              label="Configurações"
              description="Ajustes do sistema"
              href="/admin/configuracoes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

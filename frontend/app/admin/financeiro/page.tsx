"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";
import { Calendar } from "../../../components/ui/Calendar";
import { useBarber, Appointment } from "@/context/BarberContext";

// Safe icon renderer
function Icon({ name, className }: { name: string, className?: string }) {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return <div className={className} style={{ width: '20px', height: '20px', backgroundColor: '#333', borderRadius: '4px' }} />;
    return <LucideIcon className={className} />;
}

export default function AdminFinanceiro() {
    const { appointments, barbers, expenses, incomes, addExpense: ctxAddExpense, addIncome: ctxAddIncome } = useBarber();

    // States
    const [activeTab, setActiveTab] = useState<'overview' | 'config'>('overview');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

    // Form states for expense
    const [expenseName, setExpenseName] = useState("");
    const [expenseValue, setExpenseValue] = useState("");

    // Form states for income
    const [incomeName, setIncomeName] = useState("");
    const [incomeValue, setIncomeValue] = useState("");

    // Config States
    const [monthlyGoal, setMonthlyGoal] = useState("5000");

    // Filtering data for the selected day
    const dayData = useMemo(() => {
        const dayAppointments = appointments.filter(app =>
            app.date === selectedDate && app.status === 'concluido'
        );

        const dayIncomes = incomes.filter(inc => inc.date === selectedDate);
        const manualIncome = dayIncomes.reduce((acc, inc) => acc + inc.value, 0);

        const appointmentsIncome = dayAppointments.reduce((acc, app) => acc + app.price, 0);
        const income = appointmentsIncome + manualIncome;
        const commissions = dayAppointments.reduce((acc, app) => acc + (app.commission || 0), 0);

        const dayExpenses = expenses.filter(exp => exp.date === selectedDate);
        const totalExp = dayExpenses.reduce((acc, exp) => acc + exp.value, 0);

        return {
            appointments: dayAppointments,
            manualIncomes: dayIncomes,
            income,
            commissions,
            expenses: dayExpenses,
            totalExp,
            netResult: income - totalExp - commissions
        };
    }, [appointments, selectedDate, expenses, incomes]);

    // Monthly stats
    // Monthly data and stats
    const monthData = useMemo(() => {
        const currentMonth = selectedDate.substring(0, 7); // "YYYY-MM"
        
        const monthApps = appointments.filter(app =>
            app.date.startsWith(currentMonth) && app.status === 'concluido'
        );
        const appsIncome = monthApps.reduce((acc, app) => acc + app.price, 0);
        const commissions = monthApps.reduce((acc, app) => acc + (app.commission || 0), 0);

        const monthIncomes = incomes.filter(inc => inc.date.startsWith(currentMonth));
        const manualIncome = monthIncomes.reduce((acc, inc) => acc + inc.value, 0);

        const monthExpenses = expenses.filter(exp => exp.date.startsWith(currentMonth));
        const totalExp = monthExpenses.reduce((acc, exp) => acc + exp.value, 0);

        const totalIncome = appsIncome + manualIncome;
        const netResult = totalIncome - totalExp - commissions;

        const goalVal = parseFloat(monthlyGoal) || 0;
        const progress = goalVal > 0 ? (totalIncome / goalVal) * 100 : 0;

        return {
            monthApps,
            monthIncomes,
            monthExpenses,
            totalIncome,
            commissions,
            totalExp,
            netResult,
            yearMonth: currentMonth,
            goalVal,
            progress
        };
    }, [appointments, expenses, incomes, selectedDate, monthlyGoal]);

    const addExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!expenseName || !expenseValue) return;

        await ctxAddExpense({
            label: expenseName,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: selectedDate,
            value: parseFloat(incomeValue),
        });

        setIncomeName("");
        setIncomeValue("");
        setIsIncomeModalOpen(false);
    };

    const handleGeneratePDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const dateFormatted = new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR');

        const html = `
            <html>
            <head>
                <title>Relatório Financeiro - ${dateFormatted}</title>
                <style>
                    body { font-family: sans-serif; color: #333; padding: 40px; }
                    .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { color: #D4AF37; font-weight: 900; font-size: 24px; margin-bottom: 5px; }
                    .title { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; }
                    .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                    .stat-box { border: 1px solid #eee; padding: 15px; border-radius: 8px; }
                    .stat-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 5px; }
                    .stat-value { font-size: 20px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { text-align: left; border-bottom: 1px solid #eee; padding: 10px; font-size: 12px; color: #888; text-transform: uppercase; }
                    td { padding: 12px 10px; border-bottom: 1px dotted #eee; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">MARCIEL BARBERSHOP</div>
                    <div class="title">Relatório Financeiro Diário</div>
                    <div style="font-size: 14px; color: #666; margin-top: 5px;">Data: ${dateFormatted}</div>
                </div>

                <div class="grid">
                    <div class="stat-box">
                        <div class="stat-label">Faturamento Bruto</div>
                        <div class="stat-value">R$ ${dayData.income.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Comissões Pagas</div>
                        <div class="stat-value">R$ ${dayData.commissions.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Despesas</div>
                        <div class="stat-value">R$ ${dayData.totalExp.toFixed(2)}</div>
                    </div>
                    <div class="stat-box" style="border-color: #D4AF37;">
                        <div class="stat-label">Lucro Líquido</div>
                        <div class="stat-value">R$ ${dayData.netResult.toFixed(2)}</div>
                    </div>
                </div>

                <h3>Movimentações do Dia</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dayData.appointments.map(app => `
                            <tr>
                                <td>${app.serviceName} - ${app.clientName}</td>
                                <td>Entrada (Serviço)</td>
                                <td>R$ ${app.price.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        ${dayData.manualIncomes.map(inc => `
                            <tr>
                                <td>${inc.label}</td>
                                <td>Entrada (Avulsa)</td>
                                <td>R$ ${inc.value.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        ${dayData.expenses.map(exp => `
                            <tr>
                                <td>${exp.label}</td>
                                <td>Saída (Despesa)</td>
                                <td style="color: #dc2626">- R$ ${exp.value.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    const handleGenerateMonthlyPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const dateObj = new Date(selectedDate + 'T12:00:00');
        const monthName = dateObj.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        const html = `
            <html>
            <head>
                <title>Relatório Financeiro Mensal - ${monthName}</title>
                <style>
                    body { font-family: sans-serif; color: #333; padding: 40px; }
                    .header { border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { color: #D4AF37; font-weight: 900; font-size: 24px; margin-bottom: 5px; }
                    .title { font-size: 18px; text-transform: uppercase; letter-spacing: 2px; }
                    .grid { display: grid; grid-template-cols: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
                    .stat-box { border: 1px solid #eee; padding: 15px; border-radius: 8px; }
                    .stat-label { font-size: 10px; color: #888; text-transform: uppercase; margin-bottom: 5px; }
                    .stat-value { font-size: 20px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { text-align: left; border-bottom: 1px solid #eee; padding: 10px; font-size: 12px; color: #888; text-transform: uppercase; }
                    td { padding: 12px 10px; border-bottom: 1px dotted #eee; font-size: 13px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">MARCIEL BARBERSHOP</div>
                    <div class="title">Relatório Financeiro Mensal</div>
                    <div style="font-size: 14px; color: #666; margin-top: 5px;">Mês Referência: ${monthName}</div>
                </div>

                <div class="grid">
                    <div class="stat-box">
                        <div class="stat-label">Faturamento Bruto</div>
                        <div class="stat-value">R$ ${monthData.totalIncome.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Comissões</div>
                        <div class="stat-value">R$ ${monthData.commissions.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Despesas</div>
                        <div class="stat-value">R$ ${monthData.totalExp.toFixed(2)}</div>
                    </div>
                    <div class="stat-box" style="border-color: #D4AF37;">
                        <div class="stat-label">Lucro Líquido</div>
                        <div class="stat-value">R$ ${monthData.netResult.toFixed(2)}</div>
                    </div>
                </div>

                <h3>Resumo de Atendimentos (${monthData.monthApps.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Serviço</th>
                            <th>Cliente</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monthData.monthApps.map(app => `
                            <tr>
                                <td>${app.date.split('-').reverse().join('/')}</td>
                                <td>${app.serviceName}</td>
                                <td>${app.clientName}</td>
                                <td>R$ ${app.price.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3 style="margin-top: 40px;">Outras Entradas e Despesas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${monthData.monthIncomes.map(inc => `
                            <tr>
                                <td>${inc.date.split('-').reverse().join('/')}</td>
                                <td>${inc.label}</td>
                                <td>Entrada Avulsa</td>
                                <td>R$ ${inc.value.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        ${monthData.monthExpenses.map(exp => `
                            <tr>
                                <td>${exp.date.split('-').reverse().join('/')}</td>
                                <td>${exp.label}</td>
                                <td>Despesa</td>
                                <td style="color: #dc2626">- R$ ${exp.value.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up">
            <div className="max-w-6xl mx-auto flex flex-col gap-6 md:gap-10">
                {/* Header */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#1f1f1f] pb-6 md:pb-10">
                    <div className="text-center lg:text-left w-full lg:w-auto">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 italic uppercase">FINANCEIRO</h1>
                        <p className="text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em]">Fluxo de Caixa, Relatórios e Metas</p>
                    </div>

                    <div className="flex bg-[#111111] p-1 rounded-xl md:rounded-2xl border border-[#1f1f1f] shadow-inner w-full lg:w-auto overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-100 md:scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            Painel Diário
                        </button>
                        <button
                            onClick={() => setActiveTab('config')}
                            className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'config' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-100 md:scale-105' : 'text-gray-400 hover:text-white'}`}
                        >
                            Configurações
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">

                    {/* Painel Esquerdo: Resumo do Mês e Meta */}
                    <div className="xl:col-span-1 space-y-6 md:space-y-8">
                        <Card className="bg-[#111] border-[#1f1f1f] p-6 md:p-8 rounded-[2rem] md:rounded-[40px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform" />
                            <header className="flex items-center gap-4 mb-6 md:mb-10">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                                    <Icon name="Target" className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base md:text-lg font-black uppercase tracking-tight truncate">Meta Mensal</h2>
                                    <p className="text-[8px] md:text-[9px] text-gray-500 uppercase font-black tracking-widest truncate">Faturamento bruto</p>
                                </div>
                            </header>

                            <div className="space-y-5 md:space-y-6">
                                <div className="flex justify-between items-end">
                                    <div className="text-2xl md:text-3xl font-black">R$ {monthData.totalIncome.toLocaleString('pt-BR')}</div>
                                    <div className="text-[#D4AF37] font-black text-xs md:text-sm">{Math.round(monthData.progress)}%</div>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-[#1a1a1a] rounded-full overflow-hidden p-0.5 md:p-1 border border-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#8B6B1E] to-[#D4AF37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min(monthData.progress, 100)}%` }}
                                    />
                                </div>
                                <div className="text-[8px] md:text-[10px] text-gray-600 font-bold uppercase tracking-widest flex justify-between">
                                    <span>Início</span>
                                    <span>Alvo: R$ {monthData.goalVal.toLocaleString('pt-BR')}</span>
                                </div>
                            </div>
                        </Card>

                        <section className="bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8">
                            <header className="flex flex-col gap-2">
                                <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest text-[#D4AF37]">Selecione a Data</h3>
                                <p className="text-[8px] md:text-[10px] text-gray-600 uppercase font-bold tracking-tight">Visualize o desempenho diário</p>
                            </header>

                            <div className="group transition-all">
                                <Calendar
                                    selectedDate={selectedDate}
                                    onDateSelect={(date) => setSelectedDate(date)}
                                    className="!bg-black/60 !border-[#1f1f1f] !rounded-2xl md:!rounded-3xl hover:border-[#D4AF37]/30 transition-all scale-95 md:scale-100 origin-top"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button
                                    onClick={handleGeneratePDF}
                                    className="w-full h-14 md:h-16 bg-white/5 border border-white/10 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] group"
                                >
                                    <Icon name="FileDown" className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform shrink-0" />
                                    <span className="truncate">Relatório Diário</span>
                                </Button>
                                <Button
                                    onClick={handleGenerateMonthlyPDF}
                                    className="w-full h-14 md:h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] group text-[#D4AF37] hover:text-black"
                                >
                                    <Icon name="Calendar" className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform shrink-0" />
                                    <span className="truncate">Relatório Mensal</span>
                                </Button>
                            </div>
                        </section>
                    </div>

                    {/* Painel Central: Detalhes Diários e Movimentações */}
                    <div className="xl:col-span-2 space-y-6 md:space-y-10">

                        {activeTab === 'overview' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                    {[
                                        { label: "Bruto", val: dayData.income, icon: "TrendingUp", color: "text-emerald-500", bg: "bg-emerald-500/5" },
                                        { label: "Despesas", val: dayData.totalExp, icon: "TrendingDown", color: "text-red-500", bg: "bg-red-500/5" },
                                        { label: "Líquido", val: dayData.netResult, icon: "Zap", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/5" }
                                    ].map((stat, i) => (
                                        <Card key={i} className="bg-[#111] border-[#1f1f1f] p-5 md:p-8 shadow-2xl relative overflow-hidden group">
                                            <div className="flex flex-row md:flex-col items-center md:items-start gap-4 relative z-10">
                                                <div className={`${stat.color} ${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shrink-0`}>
                                                    <Icon name={stat.icon} className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[8px] md:text-[9px] uppercase text-gray-500 font-bold tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
                                                    <h3 className="text-xl md:text-2xl font-black tracking-tighter truncate md:whitespace-normal">R$ {stat.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <div className="bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-6 md:p-10 shadow-2xl">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic">Conciliação Diária</h3>
                                            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Transações de {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                            <Button
                                                onClick={() => setIsIncomeModalOpen(true)}
                                                className="bg-emerald-500 text-white hover:bg-white hover:text-black shadow-xl shadow-emerald-500/20 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] w-full md:w-auto"
                                            >
                                                <Icon name="PlusCircle" className="w-4 h-4 mr-2 shrink-0" />
                                                Lançar Entrada
                                            </Button>
                                            <Button
                                                onClick={() => setIsExpenseModalOpen(true)}
                                                className="bg-red-500 text-white hover:bg-white hover:text-black shadow-xl shadow-red-500/20 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] w-full md:w-auto"
                                            >
                                                <Icon name="MinusCircle" className="w-4 h-4 mr-2 shrink-0" />
                                                Lançar Despesa
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4 md:space-y-6 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-6 custom-scrollbar">
                                        {[...dayData.appointments, ...dayData.manualIncomes, ...dayData.expenses].length > 0 ? (
                                            <>
                                                {dayData.appointments.map((app) => (
                                                    <div key={app.id} className="bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-[#D4AF37]/20 transition-all gap-4">
                                                        <div className="flex items-center gap-4 md:gap-6">
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10 shadow-inner shrink-0">
                                                                <Icon name="ArrowUpRight" className="w-5 h-5 md:w-6 md:h-6" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate">{app.serviceName}</h4>
                                                                <p className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                                    <span className="flex items-center gap-1"><Icon name="User" className="w-2.5 h-2.5" /> {app.clientName}</span>
                                                                    <span className="flex items-center gap-1"><Icon name="Clock" className="w-2.5 h-2.5" /> {app.time}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5">
                                                            <div className="text-emerald-500 font-black text-base md:text-lg">+ R$ {app.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {dayData.manualIncomes.map((inc) => (
                                                    <div key={inc.id} className="bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-[#D4AF37]/20 transition-all gap-4">
                                                        <div className="flex items-center gap-4 md:gap-6">
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10 shadow-inner shrink-0">
                                                                <Icon name="ArrowUpRight" className="w-5 h-5 md:w-6 md:h-6" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate">{inc.label}</h4>
                                                                <p className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-2">
                                                                    Entrada Avulsa • <Icon name="Clock" className="w-2.5 h-2.5" /> {inc.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5">
                                                            <div className="text-emerald-500 font-black text-base md:text-lg">+ R$ {inc.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {dayData.expenses.map((exp) => (
                                                    <div key={exp.id} className="bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-red-500/20 transition-all gap-4">
                                                        <div className="flex items-center gap-4 md:gap-6">
                                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10 shadow-inner shrink-0">
                                                                <Icon name="ArrowDownLeft" className="w-5 h-5 md:w-6 md:h-6" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate">{exp.label}</h4>
                                                                <p className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-2">
                                                                    Saída • <Icon name="Clock" className="w-2.5 h-2.5" /> {exp.time}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5">
                                                            <div className="text-red-500 font-black text-base md:text-lg">- R$ {exp.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="py-24 text-center space-y-4 bg-[#0a0a0a] rounded-[40px] border border-dashed border-[#1f1f1f]">
                                                <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1f1f1f]">
                                                    <Icon name="FileText" className="w-8 h-8 text-gray-800" />
                                                </div>
                                                <h4 className="text-gray-500 font-black uppercase text-xs tracking-widest italic">Silêncio de Caixa</h4>
                                                <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest max-w-[200px] mx-auto">Nenhuma transação registrada nesta data.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <section className="bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-2xl animate-fade-in-up">
                                <header className="flex items-center gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#D4AF37]/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-[#D4AF37]/10">
                                        <Icon name="Settings2" className="text-[#D4AF37] w-6 h-6 md:w-7 md:h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Preferências Financeiras</h3>
                                        <p className="text-[9px] md:text-[10px] text-gray-600 uppercase font-bold tracking-widest">Configure os parâmetros base do seu negócio</p>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">Meta de Faturamento Mensal</label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-xl group-focus-within:scale-125 transition-transform">R$</span>
                                            <Input
                                                value={monthlyGoal}
                                                onChange={(e) => setMonthlyGoal(e.target.value)}
                                                className="pl-20 h-20 bg-[#0a0a0a] border-[#1f1f1f] rounded-3xl text-2xl font-black tracking-tighter focus:border-[#D4AF37] transition-all"
                                            />
                                        </div>
                                        <p className="text-[9px] text-gray-600 italic px-2">Esta meta será usada para calcular o progresso no seu painel principal.</p>
                                    </div>

                                    <div className="p-6 md:p-8 bg-[#0a0a0a] rounded-[2.5rem] md:rounded-[40px] border border-red-500/10 flex flex-col justify-center gap-4">
                                        <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Zona de Risco</h4>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase leading-relaxed">Encerrar o caixa limpa todas as movimentações temporárias e gera o log definitivo.</p>
                                        <Button className="w-full h-14 bg-red-600/5 text-red-500 border border-red-600/20 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] mt-2">
                                            Encerrar Dia Oficialmente
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Despesa */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsExpenseModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-fade-in-up">
                        <header className="flex justify-between items-center mb-8 md:mb-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase italic text-red-500">Nova Despesa</h2>
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">Lançamento de saída de caixa</p>
                            </div>
                            <button onClick={() => setIsExpenseModalOpen(false)} className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors">
                                <Icon name="X" className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={addExpense} className="space-y-6 md:space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Descrição</label>
                                <Input
                                    required
                                    value={expenseName}
                                    onChange={(e) => setExpenseName(e.target.value)}
                                    placeholder="Ex: Aluguel, Luz, Produtos..."
                                    className="h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Valor do Lançamento</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-black">R$</span>
                                    <Input
                                        required
                                        type="number"
                                        value={expenseValue}
                                        onChange={(e) => setExpenseValue(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-12 h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-black text-xl"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-16 md:h-20 bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-600/20 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm mt-4">
                                Confirmar Saída
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Entrada Avulsa */}
            {isIncomeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in" onClick={() => setIsIncomeModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-fade-in-up">
                        <header className="flex justify-between items-center mb-8 md:mb-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black uppercase italic text-emerald-500">Nova Entrada</h2>
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">Lançamento de entrada avulsa no caixa</p>
                            </div>
                            <button onClick={() => setIsIncomeModalOpen(false)} className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-emerald-500 transition-colors">
                                <Icon name="X" className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={addIncome} className="space-y-6 md:space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Descrição</label>
                                <Input
                                    required
                                    value={incomeName}
                                    onChange={(e) => setIncomeName(e.target.value)}
                                    placeholder="Ex: Venda no balcão, Gorjeta..."
                                    className="h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Valor do Lançamento</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">R$</span>
                                    <Input
                                        required
                                        type="number"
                                        value={incomeValue}
                                        onChange={(e) => setIncomeValue(e.target.value)}
                                        placeholder="0.00"
                                        className="pl-12 h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-black text-xl"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-16 md:h-20 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-600/20 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm mt-4">
                                Confirmar Entrada
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
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1) sepia(100%) saturate(1000%) hue-rotate(10deg);
                    cursor: pointer;
                    opacity: 0.5;
                }
                input[type="date"]::-webkit-calendar-picker-indicator:hover {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

module.exports=[21179,a=>{"use strict";var b=a.i(87924),c=a.i(31626),d=a.i(72131),e=a.i(21773),f=a.i(12466),g=a.i(18180),h=a.i(34904),i=a.i(19987),j=a.i(84211);function k({name:a,className:c}){let d=e[a];return d?(0,b.jsx)(d,{className:c}):(0,b.jsx)("div",{className:c,style:{width:"20px",height:"20px",backgroundColor:"#333",borderRadius:"4px"}})}function l(){let{appointments:a,barbers:e,expenses:l,incomes:m,addExpense:n,addIncome:o}=(0,j.useBarber)(),[p,q]=(0,d.useState)("overview"),[r,s]=(0,d.useState)(new Date().toISOString().split("T")[0]),[t,u]=(0,d.useState)(!1),[v,w]=(0,d.useState)(!1),[x,y]=(0,d.useState)(""),[z,A]=(0,d.useState)(""),[B,C]=(0,d.useState)(""),[D,E]=(0,d.useState)(""),[F,G]=(0,d.useState)("5000"),H=(0,d.useMemo)(()=>{let b=a.filter(a=>a.date===r&&"concluido"===a.status),c=m.filter(a=>a.date===r),d=c.reduce((a,b)=>a+b.value,0),e=b.reduce((a,b)=>a+b.price,0)+d,f=b.reduce((a,b)=>a+(b.commission||0),0),g=l.filter(a=>a.date===r),h=g.reduce((a,b)=>a+b.value,0);return{appointments:b,manualIncomes:c,income:e,commissions:f,expenses:g,totalExp:h,netResult:e-h-f}},[a,r,l,m]),I=(0,d.useMemo)(()=>{let b=r.substring(0,7),c=a.filter(a=>a.date.startsWith(b)&&"concluido"===a.status),d=c.reduce((a,b)=>a+b.price,0),e=c.reduce((a,b)=>a+(b.commission||0),0),f=m.filter(a=>a.date.startsWith(b)),g=f.reduce((a,b)=>a+b.value,0),h=l.filter(a=>a.date.startsWith(b)),i=h.reduce((a,b)=>a+b.value,0),j=d+g,k=parseFloat(F)||0;return{monthApps:c,monthIncomes:f,monthExpenses:h,totalIncome:j,commissions:e,totalExp:i,netResult:j-i-e,yearMonth:b,goalVal:k,progress:k>0?j/k*100:0}},[a,l,m,r,F]),J=async a=>{a.preventDefault(),x&&z&&(await n({label:x,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:r,value:parseFloat(z)}),y(""),A(""),u(!1))},K=async a=>{a.preventDefault(),B&&D&&(await o({label:B,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),date:r,value:parseFloat(D)}),C(""),E(""),w(!1))};return(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-h-screen bg-[#0a0a0a] text-white p-4 md:p-6 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-black animate-fade-in-up",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 max-w-6xl mx-auto flex flex-col gap-6 md:gap-10",children:[(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b border-[#1f1f1f] pb-6 md:pb-10",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-center lg:text-left w-full lg:w-auto",children:[(0,b.jsx)("h1",{className:"jsx-64beb1f943e5e354 text-3xl md:text-4xl font-black tracking-tighter mb-2 italic uppercase",children:"FINANCEIRO"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-gray-500 uppercase text-[9px] md:text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em]",children:"Fluxo de Caixa, Relatórios e Metas"})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex bg-[#111111] p-1 rounded-xl md:rounded-2xl border border-[#1f1f1f] shadow-inner w-full lg:w-auto overflow-x-auto no-scrollbar",children:[(0,b.jsx)("button",{onClick:()=>q("overview"),className:`jsx-64beb1f943e5e354 flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${"overview"===p?"bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-100 md:scale-105":"text-gray-400 hover:text-white"}`,children:"Painel Diário"}),(0,b.jsx)("button",{onClick:()=>q("config"),className:`jsx-64beb1f943e5e354 flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${"config"===p?"bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20 scale-100 md:scale-105":"text-gray-400 hover:text-white"}`,children:"Configurações"})]})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 xl:col-span-1 space-y-6 md:space-y-8",children:[(0,b.jsxs)(h.Card,{className:"bg-[#111] border-[#1f1f1f] p-6 md:p-8 rounded-[2rem] md:rounded-[40px] relative overflow-hidden group",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-[80px] pointer-events-none group-hover:scale-110 transition-transform"}),(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex items-center gap-4 mb-6 md:mb-10",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-10 h-10 md:w-12 md:h-12 bg-[#D4AF37]/10 rounded-xl md:rounded-2xl flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20",children:(0,b.jsx)(k,{name:"Target",className:"w-5 h-5 md:w-6 md:h-6"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-w-0",children:[(0,b.jsx)("h2",{className:"jsx-64beb1f943e5e354 text-base md:text-lg font-black uppercase tracking-tight truncate",children:"Meta Mensal"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[9px] text-gray-500 uppercase font-black tracking-widest truncate",children:"Faturamento bruto"})]})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-5 md:space-y-6",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex justify-between items-end",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-2xl md:text-3xl font-black",children:["R$ ",I.totalIncome.toLocaleString("pt-BR")]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-[#D4AF37] font-black text-xs md:text-sm",children:[Math.round(I.progress),"%"]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 h-3 md:h-4 w-full bg-[#1a1a1a] rounded-full overflow-hidden p-0.5 md:p-1 border border-white/5",children:(0,b.jsx)("div",{style:{width:`${Math.min(I.progress,100)}%`},className:"jsx-64beb1f943e5e354 h-full bg-gradient-to-r from-[#8B6B1E] to-[#D4AF37] rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-1000 ease-out"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[10px] text-gray-600 font-bold uppercase tracking-widest flex justify-between",children:[(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354",children:"Início"}),(0,b.jsxs)("span",{className:"jsx-64beb1f943e5e354",children:["Alvo: R$ ",I.goalVal.toLocaleString("pt-BR")]})]})]})]}),(0,b.jsxs)("section",{className:"jsx-64beb1f943e5e354 bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8",children:[(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex flex-col gap-2",children:[(0,b.jsx)("h3",{className:"jsx-64beb1f943e5e354 text-[11px] md:text-sm font-black uppercase tracking-widest text-[#D4AF37]",children:"Selecione a Data"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[10px] text-gray-600 uppercase font-bold tracking-tight",children:"Visualize o desempenho diário"})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 group transition-all",children:(0,b.jsx)(i.Calendar,{selectedDate:r,onDateSelect:a=>s(a),className:"!bg-black/60 !border-[#1f1f1f] !rounded-2xl md:!rounded-3xl hover:border-[#D4AF37]/30 transition-all scale-95 md:scale-100 origin-top"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,b.jsxs)(f.Button,{onClick:()=>{let a=window.open("","_blank");if(!a)return;let b=new Date(r+"T12:00:00").toLocaleDateString("pt-BR"),c=`
            <html>
            <head>
                <title>Relat\xf3rio Financeiro - ${b}</title>
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
                    <div class="title">Relat\xf3rio Financeiro Di\xe1rio</div>
                    <div style="font-size: 14px; color: #666; margin-top: 5px;">Data: ${b}</div>
                </div>

                <div class="grid">
                    <div class="stat-box">
                        <div class="stat-label">Faturamento Bruto</div>
                        <div class="stat-value">R$ ${H.income.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Comiss\xf5es Pagas</div>
                        <div class="stat-value">R$ ${H.commissions.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Despesas</div>
                        <div class="stat-value">R$ ${H.totalExp.toFixed(2)}</div>
                    </div>
                    <div class="stat-box" style="border-color: #D4AF37;">
                        <div class="stat-label">Lucro L\xedquido</div>
                        <div class="stat-value">R$ ${H.netResult.toFixed(2)}</div>
                    </div>
                </div>

                <h3>Movimenta\xe7\xf5es do Dia</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Descri\xe7\xe3o</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${H.appointments.map(a=>`
                            <tr>
                                <td>${a.serviceName} - ${a.clientName}</td>
                                <td>Entrada (Servi\xe7o)</td>
                                <td>R$ ${a.price.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                        ${H.manualIncomes.map(a=>`
                            <tr>
                                <td>${a.label}</td>
                                <td>Entrada (Avulsa)</td>
                                <td>R$ ${a.value.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                        ${H.expenses.map(a=>`
                            <tr>
                                <td>${a.label}</td>
                                <td>Sa\xedda (Despesa)</td>
                                <td style="color: #dc2626">- R$ ${a.value.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
        `;a.document.write(c),a.document.close(),a.print()},className:"w-full h-14 md:h-16 bg-white/5 border border-white/10 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] group",children:[(0,b.jsx)(k,{name:"FileDown",className:"w-4 h-4 mr-2 group-hover:scale-125 transition-transform shrink-0"}),(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354 truncate",children:"Relatório Diário"})]}),(0,b.jsxs)(f.Button,{onClick:()=>{let a=window.open("","_blank");if(!a)return;let b=new Date(r+"T12:00:00").toLocaleDateString("pt-BR",{month:"long",year:"numeric"}),c=`
            <html>
            <head>
                <title>Relat\xf3rio Financeiro Mensal - ${b}</title>
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
                    <div class="title">Relat\xf3rio Financeiro Mensal</div>
                    <div style="font-size: 14px; color: #666; margin-top: 5px;">M\xeas Refer\xeancia: ${b}</div>
                </div>

                <div class="grid">
                    <div class="stat-box">
                        <div class="stat-label">Faturamento Bruto</div>
                        <div class="stat-value">R$ ${I.totalIncome.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Comiss\xf5es</div>
                        <div class="stat-value">R$ ${I.commissions.toFixed(2)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Despesas</div>
                        <div class="stat-value">R$ ${I.totalExp.toFixed(2)}</div>
                    </div>
                    <div class="stat-box" style="border-color: #D4AF37;">
                        <div class="stat-label">Lucro L\xedquido</div>
                        <div class="stat-value">R$ ${I.netResult.toFixed(2)}</div>
                    </div>
                </div>

                <h3>Resumo de Atendimentos (${I.monthApps.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Servi\xe7o</th>
                            <th>Cliente</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${I.monthApps.map(a=>`
                            <tr>
                                <td>${a.date.split("-").reverse().join("/")}</td>
                                <td>${a.serviceName}</td>
                                <td>${a.clientName}</td>
                                <td>R$ ${a.price.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>

                <h3 style="margin-top: 40px;">Outras Entradas e Despesas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descri\xe7\xe3o</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${I.monthIncomes.map(a=>`
                            <tr>
                                <td>${a.date.split("-").reverse().join("/")}</td>
                                <td>${a.label}</td>
                                <td>Entrada Avulsa</td>
                                <td>R$ ${a.value.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                        ${I.monthExpenses.map(a=>`
                            <tr>
                                <td>${a.date.split("-").reverse().join("/")}</td>
                                <td>${a.label}</td>
                                <td>Despesa</td>
                                <td style="color: #dc2626">- R$ ${a.value.toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </body>
            </html>
        `;a.document.write(c),a.document.close(),a.print()},className:"w-full h-14 md:h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all rounded-2xl md:rounded-3xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[9px] group text-[#D4AF37] hover:text-black",children:[(0,b.jsx)(k,{name:"Calendar",className:"w-4 h-4 mr-2 group-hover:scale-125 transition-transform shrink-0"}),(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354 truncate",children:"Relatório Mensal"})]})]})]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 xl:col-span-2 space-y-6 md:space-y-10",children:"overview"===p?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6",children:[{label:"Bruto",val:H.income,icon:"TrendingUp",color:"text-emerald-500",bg:"bg-emerald-500/5"},{label:"Despesas",val:H.totalExp,icon:"TrendingDown",color:"text-red-500",bg:"bg-red-500/5"},{label:"Líquido",val:H.netResult,icon:"Zap",color:"text-[#D4AF37]",bg:"bg-[#D4AF37]/5"}].map((a,c)=>(0,b.jsx)(h.Card,{className:"bg-[#111] border-[#1f1f1f] p-5 md:p-8 shadow-2xl relative overflow-hidden group",children:(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex flex-row md:flex-col items-center md:items-start gap-4 relative z-10",children:[(0,b.jsx)("div",{className:`jsx-64beb1f943e5e354 ${a.color} ${a.bg} w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shrink-0`,children:(0,b.jsx)(k,{name:a.icon,className:"w-5 h-5"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-w-0",children:[(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[9px] uppercase text-gray-500 font-bold tracking-widest mb-0.5 md:mb-1",children:a.label}),(0,b.jsxs)("h3",{className:"jsx-64beb1f943e5e354 text-xl md:text-2xl font-black tracking-tighter truncate md:whitespace-normal",children:["R$ ",a.val.toLocaleString("pt-BR",{minimumFractionDigits:2})]})]})]})},c))}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-6 md:p-10 shadow-2xl",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354",children:[(0,b.jsx)("h3",{className:"jsx-64beb1f943e5e354 text-lg md:text-xl font-black tracking-tight uppercase italic",children:"Conciliação Diária"}),(0,b.jsxs)("p",{className:"jsx-64beb1f943e5e354 text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1",children:["Transações de ",new Date(r+"T12:00:00").toLocaleDateString("pt-BR")]})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex flex-col md:flex-row gap-4 w-full md:w-auto",children:[(0,b.jsxs)(f.Button,{onClick:()=>w(!0),className:"bg-emerald-500 text-white hover:bg-white hover:text-black shadow-xl shadow-emerald-500/20 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] w-full md:w-auto",children:[(0,b.jsx)(k,{name:"PlusCircle",className:"w-4 h-4 mr-2 shrink-0"}),"Lançar Entrada"]}),(0,b.jsxs)(f.Button,{onClick:()=>u(!0),className:"bg-red-500 text-white hover:bg-white hover:text-black shadow-xl shadow-red-500/20 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[9px] md:text-[10px] w-full md:w-auto",children:[(0,b.jsx)(k,{name:"MinusCircle",className:"w-4 h-4 mr-2 shrink-0"}),"Lançar Despesa"]})]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 space-y-4 md:space-y-6 max-h-[500px] md:max-h-[600px] overflow-y-auto pr-1 md:pr-6 custom-scrollbar",children:[...H.appointments,...H.manualIncomes,...H.expenses].length>0?(0,b.jsxs)(b.Fragment,{children:[H.appointments.map(a=>(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-[#D4AF37]/20 transition-all gap-4",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex items-center gap-4 md:gap-6",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10 shadow-inner shrink-0",children:(0,b.jsx)(k,{name:"ArrowUpRight",className:"w-5 h-5 md:w-6 md:h-6"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-w-0",children:[(0,b.jsx)("h4",{className:"jsx-64beb1f943e5e354 font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate",children:a.serviceName}),(0,b.jsxs)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5",children:[(0,b.jsxs)("span",{className:"jsx-64beb1f943e5e354 flex items-center gap-1",children:[(0,b.jsx)(k,{name:"User",className:"w-2.5 h-2.5"})," ",a.clientName]}),(0,b.jsxs)("span",{className:"jsx-64beb1f943e5e354 flex items-center gap-1",children:[(0,b.jsx)(k,{name:"Clock",className:"w-2.5 h-2.5"})," ",a.time]})]})]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5",children:(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-emerald-500 font-black text-base md:text-lg",children:["+ R$ ",a.price.toLocaleString("pt-BR",{minimumFractionDigits:2})]})})]},a.id)),H.manualIncomes.map(a=>(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-[#D4AF37]/20 transition-all gap-4",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex items-center gap-4 md:gap-6",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/10 shadow-inner shrink-0",children:(0,b.jsx)(k,{name:"ArrowUpRight",className:"w-5 h-5 md:w-6 md:h-6"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-w-0",children:[(0,b.jsx)("h4",{className:"jsx-64beb1f943e5e354 font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate",children:a.label}),(0,b.jsxs)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-2",children:["Entrada Avulsa • ",(0,b.jsx)(k,{name:"Clock",className:"w-2.5 h-2.5"})," ",a.time]})]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5",children:(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-emerald-500 font-black text-base md:text-lg",children:["+ R$ ",a.value.toLocaleString("pt-BR",{minimumFractionDigits:2})]})})]},a.id)),H.expenses.map(a=>(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 bg-[#0D0D0D] border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex flex-col xs:flex-row items-start xs:items-center justify-between group hover:border-red-500/20 transition-all gap-4",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 flex items-center gap-4 md:gap-6",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/10 shadow-inner shrink-0",children:(0,b.jsx)(k,{name:"ArrowDownLeft",className:"w-5 h-5 md:w-6 md:h-6"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 min-w-0",children:[(0,b.jsx)("h4",{className:"jsx-64beb1f943e5e354 font-black text-xs md:text-sm text-gray-100 uppercase tracking-tight truncate",children:a.label}),(0,b.jsxs)("p",{className:"jsx-64beb1f943e5e354 text-[8px] md:text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 md:mt-1 flex items-center gap-2",children:["Saída • ",(0,b.jsx)(k,{name:"Clock",className:"w-2.5 h-2.5"})," ",a.time]})]})]}),(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 text-left xs:text-right w-full xs:w-auto pt-3 xs:pt-0 border-t xs:border-t-0 border-white/5",children:(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 text-red-500 font-black text-base md:text-lg",children:["- R$ ",a.value.toLocaleString("pt-BR",{minimumFractionDigits:2})]})})]},a.id))]}):(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 py-24 text-center space-y-4 bg-[#0a0a0a] rounded-[40px] border border-dashed border-[#1f1f1f]",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1f1f1f]",children:(0,b.jsx)(k,{name:"FileText",className:"w-8 h-8 text-gray-800"})}),(0,b.jsx)("h4",{className:"jsx-64beb1f943e5e354 text-gray-500 font-black uppercase text-xs tracking-widest italic",children:"Silêncio de Caixa"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[9px] text-gray-700 font-bold uppercase tracking-widest max-w-[200px] mx-auto",children:"Nenhuma transação registrada nesta data."})]})})]})]}):(0,b.jsxs)("section",{className:"jsx-64beb1f943e5e354 bg-[#111] border border-[#1f1f1f] rounded-[2rem] md:rounded-[40px] p-8 md:p-12 space-y-8 md:space-y-12 shadow-2xl animate-fade-in-up",children:[(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex items-center gap-4",children:[(0,b.jsx)("div",{className:"jsx-64beb1f943e5e354 w-12 h-12 md:w-14 md:h-14 bg-[#D4AF37]/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-[#D4AF37]/10",children:(0,b.jsx)(k,{name:"Settings2",className:"text-[#D4AF37] w-6 h-6 md:w-7 md:h-7"})}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354",children:[(0,b.jsx)("h3",{className:"jsx-64beb1f943e5e354 text-xl md:text-2xl font-black uppercase tracking-tight",children:"Preferências Financeiras"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[9px] md:text-[10px] text-gray-600 uppercase font-bold tracking-widest",children:"Configure os parâmetros base do seu negócio"})]})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-4",children:[(0,b.jsx)("label",{className:"jsx-64beb1f943e5e354 text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1",children:"Meta de Faturamento Mensal"}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 relative group",children:[(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354 absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-xl group-focus-within:scale-125 transition-transform",children:"R$"}),(0,b.jsx)(g.Input,{value:F,onChange:a=>G(a.target.value),className:"pl-20 h-20 bg-[#0a0a0a] border-[#1f1f1f] rounded-3xl text-2xl font-black tracking-tighter focus:border-[#D4AF37] transition-all"})]}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[9px] text-gray-600 italic px-2",children:"Esta meta será usada para calcular o progresso no seu painel principal."})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 p-6 md:p-8 bg-[#0a0a0a] rounded-[2.5rem] md:rounded-[40px] border border-red-500/10 flex flex-col justify-center gap-4",children:[(0,b.jsx)("h4",{className:"jsx-64beb1f943e5e354 text-xs font-black text-red-500 uppercase tracking-widest",children:"Zona de Risco"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[10px] text-gray-600 font-bold uppercase leading-relaxed",children:"Encerrar o caixa limpa todas as movimentações temporárias e gera o log definitivo."}),(0,b.jsx)(f.Button,{className:"w-full h-14 bg-red-600/5 text-red-500 border border-red-600/20 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] mt-2",children:"Encerrar Dia Oficialmente"})]})]})]})})]})]}),t&&(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 fixed inset-0 z-[100] flex items-center justify-center p-4",children:[(0,b.jsx)("div",{onClick:()=>u(!1),className:"jsx-64beb1f943e5e354 absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in"}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 relative w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-fade-in-up",children:[(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex justify-between items-center mb-8 md:mb-10",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354",children:[(0,b.jsx)("h2",{className:"jsx-64beb1f943e5e354 text-xl md:text-2xl font-black uppercase italic text-red-500",children:"Nova Despesa"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1",children:"Lançamento de saída de caixa"})]}),(0,b.jsx)("button",{onClick:()=>u(!1),className:"jsx-64beb1f943e5e354 w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-red-500 transition-colors",children:(0,b.jsx)(k,{name:"X",className:"w-5 h-5"})})]}),(0,b.jsxs)("form",{onSubmit:J,className:"jsx-64beb1f943e5e354 space-y-6 md:space-y-8",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-2",children:[(0,b.jsx)("label",{className:"jsx-64beb1f943e5e354 text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1",children:"Descrição"}),(0,b.jsx)(g.Input,{required:!0,value:x,onChange:a=>y(a.target.value),placeholder:"Ex: Aluguel, Luz, Produtos...",className:"h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-bold"})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-2",children:[(0,b.jsx)("label",{className:"jsx-64beb1f943e5e354 text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1",children:"Valor do Lançamento"}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 relative",children:[(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354 absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-black",children:"R$"}),(0,b.jsx)(g.Input,{required:!0,type:"number",value:z,onChange:a=>A(a.target.value),placeholder:"0.00",className:"pl-12 h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-black text-xl"})]})]}),(0,b.jsx)(f.Button,{type:"submit",className:"w-full h-16 md:h-20 bg-red-600 hover:bg-red-700 shadow-2xl shadow-red-600/20 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm mt-4",children:"Confirmar Saída"})]})]})]}),v&&(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 fixed inset-0 z-[100] flex items-center justify-center p-4",children:[(0,b.jsx)("div",{onClick:()=>w(!1),className:"jsx-64beb1f943e5e354 absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in"}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 relative w-full max-w-md bg-[#111] border border-[#1f1f1f] rounded-[2.5rem] md:rounded-[40px] p-8 md:p-10 shadow-2xl animate-fade-in-up",children:[(0,b.jsxs)("header",{className:"jsx-64beb1f943e5e354 flex justify-between items-center mb-8 md:mb-10",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354",children:[(0,b.jsx)("h2",{className:"jsx-64beb1f943e5e354 text-xl md:text-2xl font-black uppercase italic text-emerald-500",children:"Nova Entrada"}),(0,b.jsx)("p",{className:"jsx-64beb1f943e5e354 text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1",children:"Lançamento de entrada avulsa no caixa"})]}),(0,b.jsx)("button",{onClick:()=>w(!1),className:"jsx-64beb1f943e5e354 w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-emerald-500 transition-colors",children:(0,b.jsx)(k,{name:"X",className:"w-5 h-5"})})]}),(0,b.jsxs)("form",{onSubmit:K,className:"jsx-64beb1f943e5e354 space-y-6 md:space-y-8",children:[(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-2",children:[(0,b.jsx)("label",{className:"jsx-64beb1f943e5e354 text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1",children:"Descrição"}),(0,b.jsx)(g.Input,{required:!0,value:B,onChange:a=>C(a.target.value),placeholder:"Ex: Venda no balcão, Gorjeta...",className:"h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-bold"})]}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 space-y-2",children:[(0,b.jsx)("label",{className:"jsx-64beb1f943e5e354 text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1",children:"Valor do Lançamento"}),(0,b.jsxs)("div",{className:"jsx-64beb1f943e5e354 relative",children:[(0,b.jsx)("span",{className:"jsx-64beb1f943e5e354 absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black",children:"R$"}),(0,b.jsx)(g.Input,{required:!0,type:"number",value:D,onChange:a=>E(a.target.value),placeholder:"0.00",className:"pl-12 h-16 bg-[#0a0a0a] border-[#1f1f1f] rounded-2xl font-black text-xl"})]})]}),(0,b.jsx)(f.Button,{type:"submit",className:"w-full h-16 md:h-20 bg-emerald-600 hover:bg-emerald-700 shadow-2xl shadow-emerald-600/20 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm mt-4",children:"Confirmar Entrada"})]})]})]}),(0,b.jsx)(c.default,{id:"64beb1f943e5e354",children:".custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:0 0}.custom-scrollbar::-webkit-scrollbar-thumb{background:#1f1f1f;border-radius:10px}input[type=date]::-webkit-calendar-picker-indicator{filter:invert()sepia()saturate(1000%)hue-rotate(10deg);cursor:pointer;opacity:.5}input[type=date]::-webkit-calendar-picker-indicator:hover{opacity:1}"})]})}a.s(["default",()=>l])}];

//# sourceMappingURL=app_admin_financeiro_page_tsx_521eb701._.js.map
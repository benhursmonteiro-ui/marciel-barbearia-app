"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

// --- 1. STAT METRIC CARD WITH SPARKLINE ---
interface StatMetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  sparklineData?: number[];
}

export function StatMetricCard({
  title,
  value,
  subtitle,
  change = "+14.2%",
  isPositive = true,
  icon,
  sparklineData = [25, 40, 30, 55, 45, 75, 60, 90],
}: StatMetricCardProps) {
  const maxVal = Math.max(...sparklineData, 1);
  const points = sparklineData
    .map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * 100;
      const y = 35 - (val / maxVal) * 28;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="amber-glow-card relative overflow-hidden rounded-2xl p-6 transition-all duration-300 group">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/10 transition-all duration-500" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Header: Title + Change Tag */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {title}
          </span>
          {change && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isPositive
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              {change}
            </span>
          )}
        </div>

        {/* Middle: Big Value & Icon */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-400 font-medium">{subtitle}</p>
            )}
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner group-hover:border-amber-500/40 group-hover:scale-105 transition-all">
            {icon}
          </div>
        </div>

        {/* Bottom: Mini Sparkline Graph */}
        <div className="pt-2">
          <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 35">
            <defs>
              <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`0,35 ${points} 100,35`}
              fill="url(#sparkline-grad)"
            />
            <polyline
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// --- 2. BAR CHART COMPONENT ---
interface BarChartProps {
  title?: string;
  subtitle?: string;
  totalValue?: string;
  data?: { label: string; value: number; highlight?: boolean }[];
}

export function BarChart({
  title = "Appointments",
  subtitle = "Visitas registradas por horário",
  totalValue = "7509",
  data = [
    { label: "08:00", value: 35 },
    { label: "10:00", value: 55 },
    { label: "12:00", value: 80, highlight: true },
    { label: "14:00", value: 65 },
    { label: "16:00", value: 95, highlight: true },
    { label: "18:00", value: 70 },
    { label: "20:00", value: 40 },
  ],
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="amber-glow-card rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-white tracking-tight">
            {totalValue}
          </span>
          <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
            Total do Dia
          </p>
        </div>
      </div>

      {/* Bar Chart Visual */}
      <div className="relative pt-6 pb-2">
        {/* Horizontal Background Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="border-b border-white w-full"></div>
          <div className="border-b border-white w-full"></div>
          <div className="border-b border-white w-full"></div>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-3 h-44 px-2 relative z-10">
          {data.map((item, idx) => {
            const heightPercent = (item.value / maxValue) * 100;
            const isHovered = hoveredIdx === idx;
            const isHighlighted = item.highlight || isHovered;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on Hover */}
                <div
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 transition-all duration-200 ${
                    isHovered
                      ? "opacity-100 -translate-y-1"
                      : "opacity-0 translate-y-1 pointer-events-none"
                  }`}
                >
                  {item.value}
                </div>

                {/* Column Bar */}
                <div className="w-full bg-slate-900/60 rounded-xl overflow-hidden h-36 flex items-end p-1 border border-slate-800/80">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isHighlighted
                        ? "bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                        : "bg-slate-700/50 hover:bg-amber-500/40"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isHighlighted ? "text-amber-400 font-bold" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- 3. SPLINE AREA CHART COMPONENT ---
interface AreaSplineChartProps {
  title?: string;
  subtitle?: string;
  data?: { x: string; value: number }[];
}

export function AreaSplineChart({
  title = "Evolução de Agendamentos",
  subtitle = "Desempenho contínuo da semana",
  data = [
    { x: "Seg", value: 20 },
    { x: "Ter", value: 45 },
    { x: "Qua", value: 30 },
    { x: "Qui", value: 65 },
    { x: "Sex", value: 85 },
    { x: "Sáb", value: 95 },
    { x: "Dom", value: 50 },
  ],
}: AreaSplineChartProps) {
  const [activePoint, setActivePoint] = useState<number | null>(4); // default active index

  const width = 600;
  const height = 200;
  const padding = 40;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const minVal = 0;

  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.value - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return { x, y, val: d.value, label: d.x };
  });

  // Generate smooth cubic bezier SVG path string
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <div className="amber-glow-card rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">
            {title}
          </h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs font-semibold text-slate-400">
          <button className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold shadow-sm">
            Semana
          </button>
          <button className="px-3 py-1 rounded-lg hover:text-white transition-colors">
            Mês
          </button>
          <button className="px-3 py-1 rounded-lg hover:text-white transition-colors">
            Ano
          </button>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible"
        >
          <defs>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4 4"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.1)"
          />

          {/* Gradient Area Fill */}
          <path d={areaPath} fill="url(#area-gradient)" />

          {/* Glowing Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.5"
            filter="url(#glow)"
            strokeLinecap="round"
          />

          {/* Interactive Data Nodes */}
          {points.map((pt, idx) => {
            const isActive = activePoint === idx;
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(idx)}
              >
                {/* Vertical Cursor Guide */}
                {isActive && (
                  <line
                    x1={pt.x}
                    y1={padding}
                    x2={pt.x}
                    y2={height - padding}
                    stroke="rgba(245, 158, 11, 0.3)"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Outer Glow Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? "10" : "6"}
                  fill="#F59E0B"
                  fillOpacity={isActive ? "0.3" : "0"}
                  className="transition-all duration-300"
                />

                {/* Main Node Point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? "5" : "3.5"}
                  fill={isActive ? "#FFFFFF" : "#F59E0B"}
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* X-Axis Label */}
                <text
                  x={pt.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isActive ? "#F59E0B" : "#64748B"}
                  fontSize="11"
                  fontWeight={isActive ? "bold" : "500"}
                >
                  {pt.label}
                </text>

                {/* Active Tooltip Callout */}
                {isActive && (
                  <g transform={`translate(${pt.x}, ${pt.y - 28})`}>
                    <rect
                      x="-24"
                      y="-14"
                      width="48"
                      height="20"
                      rx="6"
                      fill="#F59E0B"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#090D16"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {pt.val} cortes
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

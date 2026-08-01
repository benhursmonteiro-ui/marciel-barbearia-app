import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="amber-glow-card relative overflow-hidden p-6 rounded-2xl transition-all duration-300 group">
            {/* Background Radial Glow */}
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors duration-500" />

            <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{title}</p>
                    <p className="text-xl font-extrabold text-white tracking-tight truncate">{value}</p>
                    {subtitle && <p className="text-xs text-amber-400/90 font-medium mt-1 truncate">{subtitle}</p>}
                </div>
                <div className="w-11 h-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-500/40 transition-all duration-300 shadow-inner shrink-0">
                    {icon}
                </div>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500 group-hover:w-full" />
        </div>
    );
};

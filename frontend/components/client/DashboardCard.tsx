import React from 'react';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    subtitle?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, subtitle }) => {
    return (
        <div className="group relative overflow-hidden bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] p-6 rounded-2xl hover:border-[var(--color-primary-gold)]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]">
            {/* Background Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--color-primary-gold)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-primary-gold)]/10 transition-colors duration-500" />

            <div className="relative flex flex-col gap-4">
                <div className="w-12 h-12 bg-black border border-[var(--color-dark-border)] rounded-xl flex items-center justify-center text-[var(--color-primary-gold)] group-hover:scale-110 group-hover:border-[var(--color-primary-gold)]/30 transition-all duration-500 shadow-inner">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">{title}</p>
                    <p className="text-xl font-bold text-white tracking-tight">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
            </div>

            {/* Decorator Line */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-primary-gold)] transition-all duration-500 group-hover:w-full" />
        </div>
    );
};

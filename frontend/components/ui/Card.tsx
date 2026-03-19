import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
    return (
        <div
            className={`bg-[var(--color-dark-card)] border border-[var(--color-dark-border)] rounded-xl p-6 relative overflow-hidden group hover:border-[var(--color-primary-gold)]/50 transition-colors ${className}`}
            {...props}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary-gold)]/5 rounded-bl-full pointer-events-none group-hover:bg-[var(--color-primary-gold)]/10 transition-colors" />
            {children}
        </div>
    );
}

export function CardHeader({ className = "", children, ...props }: CardProps) {
    return (
        <div className={`flex flex-col space-y-1.5 pb-4 ${className}`} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ className = "", children, ...props }: CardProps) {
    return (
        <h3 className={`font-semibold leading-none tracking-tight text-lg text-white ${className}`} {...props}>
            {children}
        </h3>
    )
}

export function CardContent({ className = "", children, ...props }: CardProps) {
    return (
        <div className={`p-0 ${className}`} {...props}>
            {children}
        </div>
    )
}

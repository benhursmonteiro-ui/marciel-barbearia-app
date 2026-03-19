import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, icon, ...props }, ref) => {
        return (
            <div className="space-y-2 w-full relative">
                {label && (
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block italic mb-2">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[var(--color-primary-gold)] transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`w-full bg-black/40 border-2 rounded-2xl px-4 py-4 text-white focus:outline-none transition-all placeholder:text-gray-700
                ${icon ? "pl-12" : "px-6"}
                ${error
                                ? "border-red-500/50 focus:border-red-500"
                                : "border-white/5 focus:border-[var(--color-primary-gold)]/50"
                            }
                ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">{error}</p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

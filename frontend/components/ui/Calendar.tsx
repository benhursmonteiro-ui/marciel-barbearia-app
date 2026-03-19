"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./Button";

interface CalendarProps {
    selectedDate?: string;
    onDateSelect: (date: string) => void;
    className?: string;
    disabledDates?: (date: Date) => boolean;
    holidays?: number[];
}

export function Calendar({ selectedDate, onDateSelect, className = "", disabledDates, holidays = [] }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate ? new Date(selectedDate + 'T12:00:00') : new Date());

    const days = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const items = [];
        // empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            items.push(null);
        }
        // days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            items.push(new Date(year, month, day));
        }
        return items;
    }, [currentMonth]);

    const nextMonth = () => {
        const d = new Date(currentMonth);
        d.setMonth(d.getMonth() + 1);
        setCurrentMonth(d);
    };

    const prevMonth = () => {
        const d = new Date(currentMonth);
        d.setMonth(d.getMonth() - 1);
        setCurrentMonth(d);
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        const [y, m, d] = selectedDate.split('-').map(Number);
        const selDate = new Date(y, m - 1, d);
        return date.getFullYear() === selDate.getFullYear() &&
               date.getMonth() === selDate.getMonth() &&
               date.getDate() === selDate.getDate();
    };

    const isToday = (date: Date) => {
        const now = new Date();
        return date.getFullYear() === now.getFullYear() &&
               date.getMonth() === now.getMonth() &&
               date.getDate() === now.getDate();
    };

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
        <div className={`bg-black/40 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 bg-white/[0.02] border-b border-white/5">
                <Button variant="ghost" size="sm" onClick={prevMonth} className="h-10 w-10 p-0 text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-[#D4AF37]/50" />
                    <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-white">
                        {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>
                </div>

                <Button variant="ghost" size="sm" onClick={nextMonth} className="h-10 w-10 p-0 text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            {/* Grid */}
            <div className="p-4 md:p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                    {weekDays.map(day => (
                        <div key={day} className="text-center">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{day}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {days.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

                        // Local-safe date string
                        const y = date.getFullYear();
                        const m = (date.getMonth() + 1).toString().padStart(2, '0');
                        const d = date.getDate().toString().padStart(2, '0');
                        const dateStr = `${y}-${m}-${d}`;
                        
                        const dateTime = date.getTime();
                        const isHoliday = holidays.includes(dateTime);
                        const disabled = disabledDates?.(date);
                        const selected = isSelected(date);
                        const today = isToday(date);

                        return (
                            <button
                                key={dateStr}
                                disabled={disabled}
                                onClick={() => onDateSelect(dateStr)}
                                className={`
                                    aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center transition-all border-2 relative group text-xs md:text-sm
                                    ${selected
                                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-105 z-10 font-black'
                                        : isHoliday
                                            ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                                            : disabled
                                                ? 'bg-transparent border-transparent text-gray-800 cursor-not-allowed'
                                                : 'bg-black/20 border-white/5 text-gray-400 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 hover:text-white'
                                    }
                                `}
                            >
                                <span className="font-bold">{date.getDate()}</span>
                                {isHoliday && <CalendarIcon className="w-3 h-3 mt-1 opacity-50" />}
                                {today && !selected && !isHoliday && (
                                    <span className="absolute bottom-1.5 w-1 h-1 bg-[#D4AF37] rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Scissors } from 'lucide-react';

interface AppointmentCardProps {
    service: string;
    barber: string;
    date: string;
    time: string;
    price: string;
    status: 'upcoming' | 'past';
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ service, barber, date, time, price, status }) => {
    return (
        <div className={`p-4 rounded-xl border border-[var(--color-dark-border)] ${status === 'upcoming' ? 'bg-[var(--color-dark-card)]' : 'bg-[var(--color-dark-bg)]'} `}>
            <div className="flex items-center space-x-3 mb-2">
                <Scissors className="w-5 h-5 text-[var(--color-primary-gold)]" />
                <h3 className="text-lg font-medium text-white">{service}</h3>
            </div>
            <p className="text-sm text-gray-400"><strong>Barbeiro:</strong> {barber}</p>
            <p className="text-sm text-gray-400"><strong>Data:</strong> {date} <strong>Horário:</strong> {time}</p>
            <p className="text-sm text-gray-400"><strong>Preço:</strong> {price}</p>
            {status === 'upcoming' && (
                <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-[var(--color-primary-gold)] text-black rounded hover:bg-[var(--color-primary-gold-hover)] transition-colors">Cancelar</button>
                    <button className="px-3 py-1 bg-[var(--color-dark-card)] text-white border border-[var(--color-primary-gold)] rounded hover:bg-[var(--color-dark-bg)] transition-colors">Reagendar</button>
                </div>
            )}
        </div>
    );
};

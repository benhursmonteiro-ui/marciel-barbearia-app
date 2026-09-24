"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // Redireciona diretamente para o agendamento sem necessidade de login
        router.replace("/client/schedule");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center text-white p-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Carregando Agendamento...</p>
        </div>
    );
}

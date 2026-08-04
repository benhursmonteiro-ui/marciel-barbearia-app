"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, CheckCircle } from "lucide-react";
import { useBarber } from "@/context/BarberContext";
import { supabase } from "@/lib/supabase";

export default function PushNotificationManager() {
  const [isSupported] = useState<boolean>(() => typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window);
  const [permission, setPermission] = useState<NotificationPermission>(() => typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default");
  const { currentUser } = useBarber();

  useEffect(() => {
    if (isSupported) {
      // Register Service Worker
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Service Worker registrado com sucesso:", reg);
      });
    }
  }, [isSupported]);

  // Realtime Notification Logic
  useEffect(() => {
    if (permission !== "granted" || !currentUser) return;

    // Listen for new rows in agendamentos table
    const channel = supabase
      .channel("new_appointments")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agendamentos" },
        (payload) => {
          const newApt = payload.new as any;
          
          // Notify the specific barber or the admin
          if (currentUser.role === 'admin' || currentUser.id === newApt.barbeiro_id) {
            const options: any = {
              body: `${newApt.nome_cliente} agendou: ${newApt.nome_servico} às ${newApt.horario} em ${newApt.data}`,
              icon: "/next.svg",
              vibrate: [200, 100, 200],
              badge: "/next.svg",
              tag: "new-appointment-" + newApt.id
            };
            
            new Notification("📆 NOVO AGENDAMENTO!", options);
            
            // Play a sound if possible
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play().catch(() => {});
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [permission, currentUser]);

  const requestPermission = async () => {
    if (!isSupported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
        new Notification("Marciel BarberShop", {
            body: "Notificações ativadas! Você receberá alertas de agendamento aqui.",
            icon: "/next.svg"
        });
    }
  };

  if (!isSupported || !currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'barber')) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[100] animate-fade-in">
        {permission !== "granted" ? (
            <button 
                onClick={requestPermission}
                className="group flex items-center gap-3 bg-[#111] border border-[#D4AF37]/30 text-[#D4AF37] px-6 py-4 rounded-2xl shadow-2xl hover:bg-[#D4AF37] hover:text-black transition-all duration-500 scale-95 hover:scale-100"
            >
                <div className="relative">
                    <Bell className="w-5 h-5 animate-bounce-slow" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Atenção Barbeiro/Admin</p>
                    <p className="text-[9px] font-bold opacity-70">Clique para ATIVAR os alertas de agendamento</p>
                </div>
            </button>
        ) : (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md opacity-30 hover:opacity-100 transition-opacity">
                <CheckCircle className="w-5 h-5" />
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">Alertas Ativados</p>
                    <p className="text-[9px] font-bold">Você será notificado na barra do celular!</p>
                </div>
            </div>
        )}
    </div>
  );
}

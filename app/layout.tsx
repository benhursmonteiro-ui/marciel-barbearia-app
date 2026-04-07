import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarcielBarberShop",
  description: "Sistema de Gestão e Agendamento Premium para Barbearias",
  manifest: "/manifest.json",
  themeColor: "#0a0a0a",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marciel Barber",
  },
};

import { BarberProvider } from "@/context/BarberContext";
import PushNotificationManager from "@/components/PushNotificationManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <BarberProvider>
          {children}
          <PushNotificationManager />
        </BarberProvider>
      </body>
    </html>
  );
}

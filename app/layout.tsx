import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarcielBarberShop",
  description: "Sistema de Gestão e Agendamento Premium para Barbearias",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marciel Barber",
  },
};

export const viewport = {
  themeColor: "#080a0f",
};

import { BarberProvider } from "@/context/BarberContext";
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
        </BarberProvider>
      </body>
    </html>
  );
}

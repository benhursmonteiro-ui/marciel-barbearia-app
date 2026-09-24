import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marciel BarberShop",
  description: "Sistema de Gestão e Agendamento Premium para Barbearias",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
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

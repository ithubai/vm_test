import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Configuratore Prodotto",
  description: "B2B Product Configurator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}

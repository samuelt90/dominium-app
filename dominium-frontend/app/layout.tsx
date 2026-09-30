import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { DominiumThemeProvider } from "@/components/dominium/theme/DominiumThemeProvider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-dominium",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dominium",
  description: "Control operativo de inventario, stock, escaneo y movimientos.",
  manifest: "/manifest.json",
  icons: {
    icon: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${manrope.variable} font-dominium antialiased`}>
        <DominiumThemeProvider>{children}</DominiumThemeProvider>
      </body>
    </html>
  );
}

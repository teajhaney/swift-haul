import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/shared/toaster";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SwiftHaul — Real-Time Logistics & Delivery Tracking",
  description:
    "SwiftHaul replaces messy WhatsApp dispatching with a unified digital operations hub. Reliable tracking, instant proof of delivery, and analytics all in one place.",
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

import { OfflineProvider } from "@/context/OfflineContext";

export const metadata: Metadata = {
  title: "Assist AI",
  description: "Teacher's Assistant Platform for Indian Government Schools",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Assist AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased selection:bg-primary-500 selection:text-white font-sans`}
      >
        <LanguageProvider>
          <OfflineProvider>
            {children}
          </OfflineProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

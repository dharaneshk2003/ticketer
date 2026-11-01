import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import Header from "../components/Header";
import SyncUserWithConvex from "../components/SyncUserWithConvex";
import { Toaster } from "../components/ui/toaster";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Ticketer",
  description: "Book and sell event tickets",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <Header />
          <SyncUserWithConvex />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "../components/ConvexClientProvider";
import Header from "../components/Header";
import SyncUserWithConvex from "../components/SyncUserWithConvex";
import { Toaster } from "../components/ui/toaster";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ticketer",
  description: "Book and sell event tickets",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConvexClientProvider>
          <ClerkProvider>
            <Header />
            <SyncUserWithConvex />
            {children}
            <Toaster />
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

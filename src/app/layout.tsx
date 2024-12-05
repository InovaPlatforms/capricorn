import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

const inter = Inter({ subsets: ["latin"] });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const metadata: Metadata = {
  title: "Inova",
  description: "Creating cinematic experiences that captivate and inspire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div suppressHydrationWarning>
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Serpaco CRM",
  description: "Customers and jobs, current and past.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-[15px] font-semibold tracking-tight">
              Serpaco <span className="text-accent">CRM</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-muted">
              <Link href="/" className="hover:text-foreground">
                Customers
              </Link>
              <Link href="/jobs" className="hover:text-foreground">
                Jobs
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from '@/components/ui/toaster';
import { AchievementMonitor } from '@/components/dashboard/AchievementMonitor';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dipanshu's Performance Elite",
  description: 'AI-Powered Bank Exam Performance Tracking Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <body className="font-body antialiased bg-background text-foreground overflow-hidden">
        <div className="flex h-screen w-screen bg-background transition-colors duration-300 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <Header />
            <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 md:px-8 lg:px-14 pb-20">
              <div className="max-w-[1600px] mx-auto page-transition w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
        <AchievementMonitor />
        <Toaster />
      </body>
    </html>
  );
}
